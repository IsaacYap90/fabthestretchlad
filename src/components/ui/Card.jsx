export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-[#171717] border border-[#262626] rounded-2xl p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}
