import './styles.scss'
import { Input } from '../../components/Input/Input.tsx';
import { Forms } from '../../components/Forms/Forms.tsx';
import { useNavigate } from 'react-router-dom'


export default function Login(){
    const navigate = useNavigate()

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        // aqui você poderia validar ou chamar uma API antes de navegar
        navigate('/Dashboard')
    }

    return (
        <div className="login-page">
            <Forms title="Login" titleButton="Entrar" onSubmit={handleSubmit}>
                <Input type="email" name="email" placeholder="Digite seu email"/>
                <Input type="password" name="password" placeholder="Digite sua senha"/>
            </Forms>

            <a className='link' href="/SignUp">Não tem conta? Cadastre-se</a>
        </div>
    );
}




