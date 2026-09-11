import type { Variants, Transition } from 'framer-motion';

export const transitionFast: Transition = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionNormal: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

export const transitionSmooth: Transition = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionNormal },
  exit: { opacity: 0, transition: transitionFast },
};

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitionNormal },
  exit: { opacity: 0, y: -4, transition: transitionFast },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const scaleEntranceVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: transitionFast },
  exit: { opacity: 0, scale: 0.98, transition: transitionFast },
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
