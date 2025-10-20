import './styles.scss'

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  disabled?: boolean;
}

export function Input({type, name, placeholder, disabled=false, ...rest}:PropsInput){
    return(
            <input type={type} required name={name} placeholder={placeholder} disabled={disabled} {...rest} className='input'/>
        
    )
}