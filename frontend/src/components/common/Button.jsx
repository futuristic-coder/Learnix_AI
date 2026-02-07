import React from 'react'

const Button = ({
    children, onClick, className, type = "button", disabled = false, variant="primary", size="md"
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none disabled:opacity-60 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-600/30 focus:ring-indigo-200",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-slate-200 dark:focus:ring-slate-700",
        outline: "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-200 dark:focus:ring-slate-700",
        danger: "bg-gradient-to-r from-rose-600 to-red-600 text-white hover:shadow-rose-600/30 focus:ring-rose-200",
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
