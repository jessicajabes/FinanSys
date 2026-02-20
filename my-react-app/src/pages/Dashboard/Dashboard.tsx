import './styles.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../../components/Button/Button.tsx'
import { TransactionProvider } from '../../contexts/TransactionContext.tsx'

export default function Dashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const goIncome = () => navigate('/dashboard/income')
    const goExpenses = () => navigate('/dashboard/expenses')
    const isDashboardRoot = location.pathname === '/Dashboard'

    return (
        <TransactionProvider>
            {isDashboardRoot && (
                <div className='buttons'>
                    <Button onClick={goIncome}>Receitas</Button>
                    <Button onClick={goExpenses}>Despesas</Button>
                </div>
            )}
            <Outlet />
        </TransactionProvider>
    )
}