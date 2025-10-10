import './styles.scss'

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function Input({type, name, placeholder, ...rest}:PropsInput){
    return(
            <input type={type} required name={name} placeholder={placeholder} {...rest} className='input'/>
        
    )
}