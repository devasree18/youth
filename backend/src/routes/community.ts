import express from 'express';
import { z } from 'zod';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Report } from '../models/Report';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { sendSuccess, sendError } from '../utils/response';

const router = express.Router();

const createPostSchema = z.object({
  content: z.string().min(5, 'Post must be at least 5 characters').max(2000),
  category: z.string().optional(),
  pseudonym: z.string().max(50).optional()
});

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  pseudonym: z.string().max(50).optional()
});

const reportSchema = z.object({
  targetType: z.enum(['POST', 'COMMENT']),
  targetId: z.string(),
  reason: z.enum(['HARASSMENT', 'SELF_HARM', 'SPAM', 'INAPPROPRIATE', 'OTHER']),
  details: z.string().max(500).optional()
});

// Helper for generating pseudonyms
function getPseudonym(provided?: string): string {
  if (provided && provided.trim()) return provided.trim();
  const adjectives = ['Kind', 'Mindful', 'Resilient', 'Calm', 'Hopeful', 'Brave', 'Thoughtful'];
  const nouns = ['Student', 'Peer', 'Learner', 'Friend', 'Seeker', 'Explorer'];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun} #${randomNum}`;
}

router.get('/posts', async (req, res, next) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return sendSuccess(res, [], 'Posts retrieved (offline mode)', 200, { page: 1, limit: 20, total: 0 });
    }

    const page = Math.max(parseInt(req.query.page as string || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit as string || '20', 10), 50);
    const category = req.query.category as string;

    const query: any = { status: 'active' };
    if (category) query.category = category;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-userId');

    const total = await Post.countDocuments(query);

    return sendSuccess(res, posts, 'Posts retrieved successfully', 200, { page, limit, total });
  } catch (error) {
    next(error);
  }
});

router.post('/posts', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = createPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid post parameters', parseResult.error.flatten().fieldErrors);
    }

    const { content, category, pseudonym } = parseResult.data;

    const post = new Post({
      userId: req.user!.userId,
      tenantId: req.user!.tenantId,
      pseudonym: getPseudonym(pseudonym),
      category: category || 'General',
      content,
      status: 'active'
    });

    await post.save();

    return sendSuccess(res, post, 'Community post created', 201);
  } catch (error) {
    next(error);
  }
});

router.post('/posts/:id/like', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    if (!post) return sendError(res, 404, 'NOT_FOUND', 'Post not found');

    return sendSuccess(res, { likesCount: post.likesCount }, 'Post liked');
  } catch (error) {
    next(error);
  }
});

router.get('/posts/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.id, status: 'active' })
      .sort({ createdAt: 1 })
      .select('-userId');

    return sendSuccess(res, comments, 'Comments retrieved');
  } catch (error) {
    next(error);
  }
});

router.post('/posts/:id/comments', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = createCommentSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid comment parameters', parseResult.error.flatten().fieldErrors);
    }

    const post = await Post.findById(req.params.id);
    if (!post) return sendError(res, 404, 'NOT_FOUND', 'Post not found');

    const comment = new Comment({
      postId: post._id,
      userId: req.user!.userId,
      pseudonym: getPseudonym(parseResult.data.pseudonym),
      content: parseResult.data.content,
      status: 'active'
    });

    await comment.save();
    await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });

    return sendSuccess(res, comment, 'Comment added successfully', 201);
  } catch (error) {
    next(error);
  }
});

router.post('/report', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const parseResult = reportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid report parameters', parseResult.error.flatten().fieldErrors);
    }

    const { targetType, targetId, reason, details } = parseResult.data;

    const report = new Report({
      targetType,
      targetId,
      reportedBy: req.user!.userId,
      reason,
      details,
      status: 'PENDING'
    });

    await report.save();

    if (targetType === 'POST') {
      const updatedPost = await Post.findByIdAndUpdate(
        targetId,
        { $inc: { reportsCount: 1 } },
        { new: true }
      );
      if (updatedPost && updatedPost.reportsCount >= 3) {
        updatedPost.status = 'under_review';
        await updatedPost.save();
      }
    } else {
      const updatedComment = await Comment.findByIdAndUpdate(
        targetId,
        { $inc: { reportsCount: 1 } },
        { new: true }
      );
      if (updatedComment && updatedComment.reportsCount >= 3) {
        updatedComment.status = 'hidden';
        await updatedComment.save();
      }
    }

    return sendSuccess(res, null, 'Report submitted successfully. Thank you for keeping our community safe.');
  } catch (error) {
    next(error);
  }
});

// Moderation Queue (Requires community.moderate permission)
router.get('/moderation/queue', authenticateToken, requirePermission('community.moderate'), async (_req, res, next) => {
  try {
    const reports = await Report.find({ status: 'PENDING' }).sort({ createdAt: -1 });
    return sendSuccess(res, reports, 'Moderation queue retrieved');
  } catch (error) {
    next(error);
  }
});

export default router;
