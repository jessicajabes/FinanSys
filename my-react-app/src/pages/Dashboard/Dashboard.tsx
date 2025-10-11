import './styles.scss'
import { Button } from '../../components/Button/Button.tsx'

export default function Dashboard(){
    return( 
        <div className='buttons'>
            <Button>Receitas</Button>
            <Button>Despesas</Button>
        </div>
    )
}