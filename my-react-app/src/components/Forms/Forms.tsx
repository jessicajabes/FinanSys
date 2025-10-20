import './styles.scss'
import { Button } from '../Button/Button';

interface FormsProps{
    children: React.ReactNode
    title?: string
    onSubmit?: React.FormEventHandler<HTMLFormElement>
    titleButton?: string
    disableButton?: boolean
}

export function Forms({children, title, onSubmit, titleButton, disableButton}: FormsProps ){
    return(
        <div className='formContainer'>

            <div className="title">{title}</div>

            <form className="formModel" onSubmit={onSubmit}>

                {children}
                
                <Button type="submit" disabled={disableButton}>{titleButton}</Button>

            </form>
        </div>
    );
}