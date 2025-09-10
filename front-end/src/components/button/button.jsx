import './index.css'

export const Button = ({onClick, type, style, children, className, title,disabled, ...rest}) =>{
    return(
        <button
        disabled={disabled}
        title={title}
         onClick={onClick}
         style={style}
         type={type}
         className={className}
        >
            {children}
        </button>
    )
}