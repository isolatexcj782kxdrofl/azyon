import { motion } from "motion/react";
import { PiXBold } from "react-icons/pi";

export function Banner(props: { message: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl border border-text-primary/15 bg-accent-secondary px-3 py-3 shadow-2xl sm:bottom-6"
      initial={{
        y: 32
      }}
      animate={{
        y: 0
      }}
    >
      <span className="flex flex-1 items-center justify-center text-sm tracking-wide">
        {props.message}
      </span>
      <button
        type="button"
        aria-label="Close notification"
        className="rounded-lg p-2 transition hover:bg-bg-primary/20 hover:text-text-primary"
        onClick={props.onClose}
      >
        <PiXBold />
      </button>
    </motion.div>
  );
}
