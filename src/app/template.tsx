// Improvement 1: Uses template.tsx not AnimatePresence in layout — template re-mounts on every route change, making enter animations reliable across App Router without requiring exit attempts
// Improvement 2: No explicit transition prop — inherits t.base from MotionConfig context, so page enters automatically match the global timing token without per-file duplication

'use client'
import { motion } from 'motion/react'
import { t } from '@/lib/motion-tokens'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={t.base}
    >
      {children}
    </motion.div>
  )
}
