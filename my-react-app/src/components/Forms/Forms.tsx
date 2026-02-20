import './styles.scss'
import { Button } from '../Button/Button';

interface FormsProps{
    children: React.ReactNode
    title?: string
    onSubmit?: React.FormEventHandler<HTMLFormElement>
    titleButton?: string
    disableButton?: boolean
    onCancel?: () => void
    isModal?: boolean
}

export function Forms({children, title, onSubmit, titleButton, disableButton, onCancel, isModal = false}: FormsProps ){
    return(
        <div className={`formContainer ${isModal ? 'modal' : 'page'}`}>

            <div className="title">{title}</div>

            <form className="formModel" onSubmit={onSubmit}>

                {children}
                
                <div className="form-buttons">
                    <Button type="submit" disabled={disableButton}>{titleButton}</Button>
                    {onCancel && (
                        <Button type="button" onClick={onCancel} className="cancel-button">Cancelar</Button>
                    )}
                </div>

            </form>
        </div>
    );
}