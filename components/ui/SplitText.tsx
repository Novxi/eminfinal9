import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: { opacity: number; y: number; [key: string]: any };
  to?: { opacity: number; y: number; [key: string]: any };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 0.5,
  ease = 'easeOut',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  onLetterAnimationComplete,
  showCallback = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });
  const [animatedCount, setAnimatedCount] = useState(0);

  const words = text.split(' ');
  // Count actual characters to animate (excluding spaces in 'chars' mode)
  const targetCount = splitType === 'chars' ? words.join('').length : words.length;

  useEffect(() => {
    if (showCallback && animatedCount === targetCount && onLetterAnimationComplete) {
      onLetterAnimationComplete();
    }
  }, [animatedCount, targetCount, onLetterAnimationComplete, showCallback]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {},
  };

  const itemVariants: Variants = {
    hidden: from,
    visible: (i: number) => ({
      ...to,
      transition: {
        delay: i * (delay / 1000),
        duration: duration,
        ease: (ease === 'power3.out' ? [0.22, 1, 0.36, 1] : ease) as any,
      },
    }),
  };

  let currentIndex = 0;

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`inline-block ${className}`}
      style={{ textAlign }}
    >
      {splitType === 'words'
        ? words.map((word, i) => (
            <motion.span
              key={`word-${i}`}
              variants={itemVariants}
              custom={i}
              onAnimationComplete={() => setAnimatedCount((prev) => prev + 1)}
              className="inline-block"
            >
              {word}
              {i < words.length - 1 && '\u00A0'}
            </motion.span>
          ))
        : words.map((word, i) => {
            const wordContent = (
              <span key={`word-container-${i}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split('').map((char, j) => {
                  const idx = currentIndex++;
                  return (
                    <motion.span
                      key={`char-${i}-${j}`}
                      variants={itemVariants}
                      custom={idx}
                      onAnimationComplete={() => setAnimatedCount((prev) => prev + 1)}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
            );

            if (i < words.length - 1) {
              currentIndex++; // Increment index for space to maintain rhythm
              return (
                <React.Fragment key={`fragment-${i}`}>
                  {wordContent}
                  {' '}
                </React.Fragment>
              );
            }
            return wordContent;
          })}
    </motion.div>
  );
};

export default SplitText;
