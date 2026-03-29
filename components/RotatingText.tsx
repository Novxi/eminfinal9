import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  staggerFrom?: "first" | "last" | "center" | number;
  initial?: any;
  animate?: any;
  exit?: any;
  staggerDuration?: number;
  splitLevelClassName?: string;
  transition?: Transition;
  rotationInterval?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  mainClassName = "",
  staggerFrom = "first",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  staggerDuration = 0.025,
  splitLevelClassName = "",
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const getStaggerDelay = useCallback(
    (charIndex: number, totalChars: number) => {
      if (typeof staggerFrom === "number") {
        return Math.abs(charIndex - staggerFrom) * staggerDuration;
      }
      switch (staggerFrom) {
        case "first":
          return charIndex * staggerDuration;
        case "last":
          return (totalChars - 1 - charIndex) * staggerDuration;
        case "center":
          return Math.abs(charIndex - (totalChars - 1) / 2) * staggerDuration;
        default:
          return charIndex * staggerDuration;
      }
    },
    [staggerFrom, staggerDuration]
  );

  return (
    <motion.span
      layout
      transition={transition}
      className={`inline-flex relative items-center justify-center overflow-hidden ${mainClassName}`}
      style={{ 
        display: "inline-flex", 
        verticalAlign: "middle",
        position: "relative"
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          layout
          className={`flex items-center justify-center whitespace-nowrap ${splitLevelClassName}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          style={{ width: "auto" }}
        >
          {texts[index].split("").map((char, i) => (
            <motion.span
              key={`char-${index}-${i}`}
              style={{ display: "inline-block", whiteSpace: "pre" }}
              variants={{
                hidden: { ...initial, opacity: 0 },
                visible: {
                  ...animate,
                  opacity: 1,
                  transition: {
                    ...transition,
                    delay: getStaggerDelay(i, texts[index].length),
                  },
                },
                exit: {
                  ...exit,
                  opacity: 0,
                  transition: {
                    ...transition,
                    delay: getStaggerDelay(i, texts[index].length),
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
};

export default RotatingText;
