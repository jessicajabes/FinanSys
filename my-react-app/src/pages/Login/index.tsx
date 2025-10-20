import './styles.scss'
import { Input } from '../../components/Input/Input.tsx';
import { Forms } from '../../components/Forms/Forms.tsx';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth.ts';
import { useState } from 'react';
import { toast } from '../../utils/toast.ts'


export default function Login(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState (false);
    const { signIn } = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const login =  formData.get("login") as string;
        const password = formData.get("password") as string;

        if(login === "" || password === ""){
            toast.error("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }
        try {
            const success = await signIn(login.trim(), password);
            if (success) {
                navigate('/Dashboard');
            }
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <Forms title="Login" titleButton= {loading ? 'Entrando...' : 'Acessar'} onSubmit={handleSubmit} disableButton={loading}>
                <Input type="text" name="login" disabled={loading} placeholder="Digite seu email / username"/>
                <Input type="password" name="password" disabled={loading} placeholder="Digite sua senha"/>
            </Forms>

            <a className='link' href="/SignUp">Não tem conta? Cadastre-se</a>
        </div>
    );
}




