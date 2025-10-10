import './styles.scss'

interface ButtonProps {
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
}

export function Button({children, type = "button", disabled = false, onClick}: ButtonProps){
    return(
        <button
            type={type}
            className="button"
            disabled={disabled}
            onClick={onClick} 
        >
            {children}
        </button>
    )
}