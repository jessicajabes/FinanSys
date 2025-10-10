import './styles.scss'
import { Input } from '../../components/Input/Input.tsx';
import { Forms } from '../../components/Forms/Forms.tsx';


export default function Login(){
    return (
        <Forms title="Login" titleButton="Entrar">
                        <Input type="email" name="email" placeholder="Digite seu email"/>
                        <Input type="password" name="password" placeholder="Digite sua senha"/>
        </Forms>
    );
}

