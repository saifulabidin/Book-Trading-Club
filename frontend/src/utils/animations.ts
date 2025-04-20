import { Variants } from 'framer-motion';

/**
 * Basic fade-in animation variant
 * Suitable for elements that should appear with a simple opacity transition
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

/**
 * Slide up animation variant
 * Useful for elements that should appear by sliding up from their position
 */
export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

/**
 * Slide in from right animation variant
 * Good for side panels, drawers, and elements that should appear from the right edge
 */
export const slideInFromRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
};

/**
 * Stagger children animation configuration
 * Apply to a parent container to make children animate in sequence
 */
export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Modal animation variant
 * Creates a subtle scale and fade effect for modal dialogs
 */
export const modalVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
};

/**
 * Common spring transition configuration
 * Provides a natural, slightly bouncy feel for animations
 */
export const springTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20
};

/**
 * Attention-grabbing animation for call-to-action elements
 */
export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

/**
 * List item hover animation
 * Subtle effect for list items when hovered
 */
export const listItemHover: Variants = {
  initial: { x: 0 },
  hover: { x: 5, transition: { duration: 0.2 } }
};