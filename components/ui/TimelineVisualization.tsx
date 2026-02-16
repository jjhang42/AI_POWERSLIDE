"use client";

import { motion } from "framer-motion";

interface TimelineStep {
  time: string;
  event: string;
  cost: string;
}

interface TimelineVisualizationProps {
  title: string;
  scenario: string;
  steps: TimelineStep[];
  solution: string;
  showBefore?: boolean;
  showAfter?: boolean;
}

export function TimelineVisualization({
  title,
  scenario,
  steps,
  solution,
  showBefore = true,
  showAfter = true,
}: TimelineVisualizationProps) {
  return (
    <div className="w-full">
      {/* BEFORE: Without BlackVox */}
      {showBefore && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 max-w-full overflow-hidden px-4"
      >
        {/* Before Label */}
        <div className="text-center mb-8 overflow-hidden">
          <span className="text-xl font-bold text-destructive uppercase tracking-[0.15em]">
            Without BlackVox
          </span>
        </div>

        {/* Timeline - Pentagram style: massive numbers */}
        <div className="flex items-start justify-center gap-4 w-full max-w-full px-4 overflow-hidden">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="flex-1 min-w-0 max-w-[30%] overflow-hidden"
            >
              {/* Time */}
              <div className="text-center mb-3">
                <span className="text-base font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  {step.time}
                </span>
              </div>

              {/* Cost - MASSIVE number with background */}
              <div className="text-center mb-5 w-full overflow-hidden">
                <div className="block px-2 py-2 bg-destructive/10 rounded-3xl w-full max-w-full overflow-hidden">
                  <div className="text-[5rem] font-black font-mono tracking-tighter leading-none text-destructive antialiased-strong tabular-nums truncate w-full overflow-hidden">
                    {step.cost}
                  </div>
                </div>
              </div>

              {/* Event - Minimal text */}
              <div className="text-center px-2">
                <p className="text-base text-foreground/60 leading-relaxed break-words">
                  {step.event}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}

      {/* Divider */}
      {showBefore && showAfter && (
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="h-1 bg-gradient-to-r from-transparent via-border to-transparent mb-20"
      />
      )}

      {/* AFTER: With BlackVox */}
      {showAfter && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center max-w-full overflow-hidden px-4"
      >
        {/* After Label */}
        <div className="mb-8 overflow-hidden">
          <span className="text-xl font-bold text-success uppercase tracking-[0.15em]">
            With BlackVox
          </span>
        </div>

        {/* Solution: 30초 + 0원 */}
        <div className="block px-6 py-6 bg-success/10 rounded-3xl max-w-lg mx-auto overflow-hidden">
          <div className="mb-3 overflow-hidden">
            <div className="text-5xl font-black font-mono tracking-tighter leading-none text-success antialiased-strong truncate w-full">
              30초
            </div>
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter leading-none text-success antialiased-strong tabular-nums truncate w-full overflow-hidden">
            0원
          </div>
        </div>

        {/* Solution description */}
        <div className="mt-6 max-w-xl mx-auto px-8 overflow-hidden">
          <p className="text-lg text-foreground/70 font-light leading-relaxed break-words">
            음성 기록 검색 → 문제 즉시 해결
          </p>
        </div>
      </motion.div>
      )}
    </div>
  );
}
