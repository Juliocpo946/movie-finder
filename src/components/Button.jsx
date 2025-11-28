import { motion } from 'framer-motion';
import { classNames } from '../utils';

const Button = ({ children, onClick, variant = 'primary', className, disabled, type = 'button' }) => {
  const baseStyles = "px-6 py-3 font-bold text-sm tracking-widest border border-white transition-colors duration-0 focus:outline-none uppercase font-mono";
  
  const variants = {
    primary: "bg-white text-black hover:bg-[#ff2e00] hover:text-white hover:border-[#ff2e00]",
    secondary: "bg-transparent text-white hover:bg-white hover:text-black",
    danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-black"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(baseStyles, variants[variant], className, disabled && "opacity-50 cursor-not-allowed")}
      whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px rgba(255, 255, 255, 0.5)" }}
      whileTap={{ x: 0, y: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
      transition={{ type: "tween", duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;