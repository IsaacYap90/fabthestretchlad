export default function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  const base = 'px-5 py-2.5 font-semibold rounded-xl transition-all text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-900/50',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled} {...props}>{children}</button>
}
