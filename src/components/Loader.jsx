import { motion } from 'framer-motion';

const Loader = ({ text = "LOADING_DATA" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-64 h-2 bg-gray-900 border border-gray-700">
        <motion.div
          className="h-full bg-[#ff2e00]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p 
        className="text-xs tracking-widest text-gray-500 uppercase font-mono"
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "linear",
          times: [0, 0.5, 1]
        }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default Loader;