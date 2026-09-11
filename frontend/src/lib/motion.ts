import type { Variants, Transition } from 'framer-motion';

export const transitionFast: Transition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionNormal: Transition = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionSmooth: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionNormal },
  exit: { opacity: 0, transition: transitionFast },
};

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: transitionNormal },
  exit: { opacity: 0, y: -8, transition: transitionFast },
};
export const fadeUp = fadeUpVariants;

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};
export const staggerChildren = staggerContainerVariants;

export const scaleEntranceVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: transitionFast },
  exit: { opacity: 0, scale: 0.96, transition: transitionFast },
};

export const slideRightVariants: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: transitionNormal },
  exit: { x: '100%', transition: transitionFast },
};

export const slideLeftVariants: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: transitionNormal },
  exit: { x: '-100%', transition: transitionFast },
};

export const drawerBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const drawerPanelVariants: Variants = {
  initial: { x: '100%', opacity: 0.8 },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 32,
      mass: 0.8,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15 },
  },
};

export const tooltipVariants: Variants = {
  initial: { opacity: 0, y: 4, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    y: 2,
    scale: 0.96,
    transition: { duration: 0.1 },
  },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: transitionSmooth },
  exit: { opacity: 0, y: -6, transition: transitionFast },
};
export const pageTransition = transitionSmooth;

export const cardHover = {
  y: -3,
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};
export const hoverLift = cardHover;

export const tapPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};
export const buttonPress = tapPress;
