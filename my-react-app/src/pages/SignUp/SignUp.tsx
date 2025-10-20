import './styles.scss'
import { Input } from '../../components/Input/Input.tsx'
import { Forms } from '../../components/Forms/Forms.tsx'
import { useAuth } from '../../contexts/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from '../../utils/toast.ts'


export default function SignUp(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const email    = formData.get("email") as string;

        if(username === "" || password === "" || email === ""){
            toast.error("Por favor, preencha todos os campos obrigatórios.")
            setLoading(false);
            return;
        }

        try{
            const userData = {
                username: username.trim(),
                password,
                email: email.trim(),
            };           

            const success = await signUp(userData);

            if (success) {
                navigate("/dashboard")
            }
        }catch (error) {
            console.error('Erro no cadastro', error);
        } finally {
            setLoading(false);
        }
    }


    return(
        <div className='sign'>
            <Forms title="Cadastra-se" onSubmit={handleSubmit} disableButton={loading} titleButton={loading ? 'Cadastrando...' : 'Cadastar'}>
                <Input type='text' disabled={loading} name='username' placeholder='Digite seu username' />
                <Input type="email" name="email" disabled={loading} placeholder="Digite seu email"/>
                <Input type='password' name='password' disabled={loading} placeholder='Digite sua senha'/>
            </Forms>
            <a className='link' href="/">Já possui conta? Efetuar o Login</a>
        </div>
    )
}