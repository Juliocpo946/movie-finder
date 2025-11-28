import { forwardRef } from 'react';
import { classNames } from '../utils';

const Input = forwardRef(({ placeholder, value, onChange, type = "text", className, ...props }, ref) => {
  return (
    <div className="relative w-full group">
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(
          "w-full bg-transparent border-b-2 border-gray-700 py-3 text-xl font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e00] transition-colors duration-300 rounded-none",
          className
        )}
        {...props}
      />
      <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2 pointer-events-none text-[#ff2e00] opacity-0 group-focus-within:opacity-100 animate-pulse">
        █
      </div>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;