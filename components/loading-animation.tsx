"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingAnimationProps {
  messages: string[];
}

export function LoadingAnimation({ messages }: LoadingAnimationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= messages[currentMessageIndex].length) {
        setDisplayedText(messages[currentMessageIndex].slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 1000); // Wait for 1 second before starting the next message
      }
    }, 50); // Adjust the speed of typing here

    return () => clearInterval(interval);
  }, [currentMessageIndex, messages]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-purple-950 to-black z-50">
      <div className="text-center">
        <motion.div
          className="w-32 h-32 bg-white rounded-full mx-auto mb-8"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.p className="text-2xl font-bold text-white h-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
          {displayedText}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut" }}>
            |
          </motion.span>
        </motion.p>
        <motion.div className="mt-4 space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
          {[0, 1, 2].map(index => (
            <motion.span
              key={index}
              className="inline-block w-3 h-3 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
