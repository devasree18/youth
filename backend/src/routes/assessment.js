"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genai_1 = require("@google/genai");
const router = express_1.default.Router();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' }); // Uses environment variable
router.post('/generate', async (req, res) => {
    try {
        const { answers } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ result: "Please provide a valid GEMINI_API_KEY in the backend .env to use the real AI! For now, here is mock advice: Trust yourself and take small steps every day." });
        }
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an empathetic career and mental wellness counselor for young adults. Based on these assessment responses: "${answers}", provide a short, encouraging paragraph with 2 actionable steps they can take today.`,
        });
        res.json({ result: response.text });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate assessment' });
    }
});
exports.default = router;
//# sourceMappingURL=assessment.js.map