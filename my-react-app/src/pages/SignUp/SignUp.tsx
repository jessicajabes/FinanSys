import './styles.scss'
import { Input } from '../../components/Input/Input.tsx'
import { Forms } from '../../components/Forms/Forms.tsx'



export default function SignUp(){
    return(
        <div className='sign'>
            <Forms title="Cadastra-se" titleButton='Cadastrar'>
                <Input type='name' name='name' placeholder='Digite seu nome' />
                <Input type="email" name="email" placeholder="Digite seu email"/>
                <Input type='password' name='password' placeholder='Digite sua senha'/>
            </Forms>
            <a className='link' href="/">Já possui conta? Efetuar o Login</a>
        </div>
    )
}