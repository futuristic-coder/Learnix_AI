import React from 'react'

const Button = ({
    children, onClick, className, type = "button", disabled = false, variant="primary", size="md"
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-600/30 focus:ring-blue-200",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-200",
        outline: "bg-transparent border border-slate-300 text-slate-800 hover:bg-slate-50 focus:ring-slate-200",
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return(
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={[baseStyles, variantStyles[variant], sizeStyles[size], className].join(" ")} >
            {children}
            </button>
    )
}

export default Button
