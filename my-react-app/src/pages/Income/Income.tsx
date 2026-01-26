import './styles.scss'
import { useEffect } from 'react'
import { useTransaction } from '../../contexts/useTransaction'

export default function Income() {
    const { transactions, loading, loadTransactions } = useTransaction()

    // Carrega ao entrar na tela
    useEffect(() => {
        loadTransactions()
    }, [loadTransactions])

    return (
        <div className="income-list">
            {loading && <p>Carregando transações...</p>}
            {!loading && transactions.length === 0 && <p>Nenhuma transação encontrada.</p>}
            <table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Banco</th>
                        <th>Cartão</th>
                        <th>Categoria</th>
                        <th>Data</th>
                        <th>Fixo/Variável</th>
                        <th>Data Final</th>
                        <th>Metodo de Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) => (
                        <tr key={item.id} className="income-item">
                            <td>{item.description}</td>
                            <td>R$ {parseFloat(item.amount).toFixed(2)}</td>
                            <td>({item.transaction_type})</td>
                            <td>{item.bank_id}</td>
                            <td>{item.card_id}</td>
                            <td>{item.category_id}</td>
                            <td>{item.start_date ? new Date(item.start_date).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{(item.fixed_variable == 'F') ? "Fixo" : "Variável"}</td>
                            <td>{item.end_date ? new Date(item.end_date).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{item.payment_method}</td>
                        </tr>
                    ))}
                </tbody>
            </table> 
        </div>
    )
}