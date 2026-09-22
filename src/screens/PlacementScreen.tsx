import { motion } from 'framer-motion'
import PlacementTest from '../components/PlacementTest'

interface PlacementScreenProps {
  onDone: () => void
  onSkip: () => void
}

/**
 * Placement-test screen wrapper. On completion the callback lands the user in
 * a fresh session (wrong answers lead the queue, familiar cards drop out).
 */
export default function PlacementScreen({ onDone, onSkip }: PlacementScreenProps) {
  return (
    <motion.div
      key="placement"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PlacementTest onDone={onDone} onSkip={onSkip} />
    </motion.div>
  )
}
