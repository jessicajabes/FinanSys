import './styles.scss'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button/Button.tsx'
import { TransactionProvider } from '../../contexts/TransactionContext.tsx'

export default function Dashboard() {
    const navigate = useNavigate()
    const goIncome = () => navigate('income')
    const goExpenses = () => navigate('expenses')

    return (
        <TransactionProvider>
            <div className='buttons'>
                <Button onClick={goIncome}>Receitas</Button>
                <Button onClick={goExpenses}>Despesas</Button>
            </div>
            <Outlet />
        </TransactionProvider>
    )
}