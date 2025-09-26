// Centralized animation configurations for consistent, smooth transitions

export const animations = {
  // Spring configurations for natural movement
  spring: {
    gentle: { type: "spring", stiffness: 300, damping: 30 },
    bouncy: { type: "spring", stiffness: 400, damping: 25 },
    smooth: { type: "spring", stiffness: 200, damping: 20 },
    snappy: { type: "spring", stiffness: 500, damping: 35 },
  },

  // Easing configurations
  easing: {
    smooth: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    smoothSlow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    smoothFast: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    bounce: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] },
    elastic: { duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] },
  },

  // Common animation variants
  variants: {
    // Fade animations
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },

    // Scale animations
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    scaleInUp: {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.8, y: 20 },
    },

    // Slide animations
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
    },
    slideDown: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    },

    // Stagger animations for lists
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    staggerItem: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
  },

  // Hover animations
  hover: {
    lift: {
      scale: 1.03,
      y: -3,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      },
    },
    liftStrong: {
      scale: 1.08,
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        mass: 0.6
      },
    },
    liftSubtle: {
      scale: 1.01,
      y: -1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        mass: 0.5
      },
    },
    scale: {
      scale: 1.12,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.7
      },
    },
    // Removed glow animation
    bounce: {
      scale: 1.05,
      y: -4,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
        mass: 0.6
      },
    },
    float: {
      y: -6,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        mass: 0.8
      },
    },
    tilt: {
      rotate: 2,
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        mass: 0.7
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { 
        duration: 0.6,
        ease: "easeInOut"
      },
    },
  },

  // Tap animations
  tap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] },
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },

  // Modal animations
  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    content: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  },

  // Loading animations
  loading: {
    spin: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: "linear" },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
    bounce: {
      y: [0, -10, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

// Helper functions for common animation patterns
export const createStaggerAnimation = (delay: number = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

export const createSlideAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
  };
};

export const createHoverAnimation = (type: 'lift' | 'scale' | 'glow' = 'lift') => {
  return animations.hover[type];
};
