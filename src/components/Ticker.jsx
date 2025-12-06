import { motion } from 'framer-motion';

const Ticker = () => {
  return (
    <div className="w-full bg-black border-y border-gray-800 overflow-hidden py-2">
      <motion.div 
        className="whitespace-nowrap flex gap-8 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-8 text-xs font-mono text-[#ff2e00]">
            <span>/// SYSTEM STATUS: ONLINE</span>
            <span>/// INCOMING DATA STREAMS DETECTED</span>
            <span>/// DECRYPTING SECURE FILES</span>
            <span>/// NEW TITLES ADDED TO DATABASE</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ticker;