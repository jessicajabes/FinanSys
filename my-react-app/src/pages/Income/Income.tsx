import './styles.scss'
import { useEffect, useState } from 'react'
import { useTransaction } from '../../contexts/useTransaction'
import { Button } from '../../components/Button/Button'
import { Forms } from '../../components/Forms/Forms'
import { Input } from '../../components/Input/Input'
import { Select } from '../../components/Select/Select'
import { RadioButton } from '../../components/RadioButton/RadioButton'
import { DateInput } from '../../components/DateInput/DateInput'
import { useAuth } from '../../contexts/useAuth'
import api from '../../services/api'
import { toast } from '../../utils/toast'

interface SelectOption {
    id: number | string
    label: string
}

interface Category {
    id: number | string
    name: string
}

interface Bank {
    id: number | string
    description?: string
}

interface Card {
    id: number | string
    description?: string
}

interface TransactionItem {
    id: number
    category_id?: number | string | null
    bank_id?: number | string | null
    card_id?: number | string | null
    description?: string
    amount?: string
    fixed_variable?: string
    payment_method?: string
    start_date?: string | null
    end_date?: string | null
}

interface FormData {
    category_id: string | number
    bank_id: string | number
    card_id: string | number
    description: string
    amount: string
    fixed_variable: string
    payment_method: string
    start_date: string
    end_date: string
}

export default function Income() {
    const { transactions, loading, loadTransactions } = useTransaction()
    const { user } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loadingForm, setLoadingForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<number | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null)

    // Estados dos selects
    const [categories, setCategories] = useState<SelectOption[]>([])
    const [banks, setBanks] = useState<SelectOption[]>([])
    const [cards, setCards] = useState<SelectOption[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [loadingBanks, setLoadingBanks] = useState(false)
    const [loadingCards, setLoadingCards] = useState(false)

    // Estado do formulário
    const [formData, setFormData] = useState<FormData>({
        category_id: '',
        bank_id: '',
        card_id: '',
        description: '',
        amount: '',
        fixed_variable: 'V',
        payment_method: 'pix',
        start_date: '',
        end_date: ''
    })

    // Carrega ao entrar na tela
    useEffect(() => {
        loadTransactions()
    }, [loadTransactions])

    // Carrega categorias
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true)
            try {
                const response = await api.get<{ categorie: Category[] }>('/auth/categorie')
                const options = response.data.categorie.map((cat: Category) => ({
                    id: cat.id,
                    label: cat.name ?? 'Sem nome'
                }))
                setCategories(options)
            } catch (error) {
                console.error('Erro ao buscar categorias:', error)
                toast.error('Erro ao carregar categorias')
            } finally {
                setLoadingCategories(false)
            }
        }
        fetchCategories()
    }, [])

    // Carrega bancos
    useEffect(() => {
        const fetchBanks = async () => {
            setLoadingBanks(true)
            try {
                const response = await api.get<{ bank: Bank[] }>('/auth/bank')
                const options = response.data.bank.map((bank: Bank) => ({
                    id: bank.id,
                    label: bank.description ?? 'Sem nome'
                }))
                setBanks(options)
            } catch (error) {
                console.error('Erro ao buscar bancos:', error)
                toast.error('Erro ao carregar bancos')
            } finally {
                setLoadingBanks(false)
            }
        }
        fetchBanks()
    }, [])

    // Carrega cartões quando banco é selecionado
    useEffect(() => {
        if (!formData.bank_id) {
            setCards([])
            return
        }

        const fetchCards = async () => {
            setLoadingCards(true)
            try {
                const response = await api.get< Card[] >(`/auth/cards`)
                const options = response.data.map((card: Card) => ({
                    id: card.id,
                    label: card.description ?? 'Sem nome'
                }))
                setCards(options)
            } catch (error) {
                console.error('Erro ao buscar cartões:', error)
            } finally {
                setLoadingCards(false)
            }
        }
        fetchCards()
    }, [formData.bank_id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user) {
            toast.error('Usuário não autenticado')
            return
        }

        if (!formData.description || !formData.amount || !formData.category_id || !formData.bank_id) {
            toast.error('Preencha todos os campos obrigatórios')
            return
        }

        setLoadingForm(true)
        try {
            const payload = {
                user_id: user.id,
                category_id: parseInt(String(formData.category_id)),
                bank_id: parseInt(String(formData.bank_id)),
                card_id: formData.card_id ? parseInt(String(formData.card_id)) : null,
                description: formData.description,
                amount: formData.amount,
                transaction_type: 'D',
                fixed_variable: formData.fixed_variable,
                payment_method: formData.payment_method,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null
            }

            if (editingTransaction) {
                await api.put(`/auth/transactions/${editingTransaction}`, payload)
                toast.success('Transação atualizada com sucesso!')
            } else {
                await api.post('/auth/transactions', payload)
                toast.success('Transação criada com sucesso!')
            }

            setFormData({
                category_id: '',
                bank_id: '',
                card_id: '',
                description: '',
                amount: '',
                fixed_variable: 'V',
                payment_method: 'pix',
                start_date: '',
                end_date: ''
            })
            setIsModalOpen(false)
            setEditingTransaction(null)
            loadTransactions()
        } catch (error: unknown) {
            console.error('Erro ao salvar transação:', error)
            const errorMessage =
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                typeof (error as { response?: { data?: { message?: string } } }).response === 'object'
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
                      'Erro ao salvar transação'
                    : 'Erro ao salvar transação'
            toast.error(errorMessage)
        } finally {
            setLoadingForm(false)
        }
    }

    const handleEdit = (transaction: TransactionItem) => {
        setFormData({
            category_id: transaction.category_id || '',
            bank_id: transaction.bank_id || '',
            card_id: transaction.card_id || '',
            description: transaction.description || '',
            amount: transaction.amount || '',
            fixed_variable: transaction.fixed_variable || 'V',
            payment_method: transaction.payment_method || 'pix',
            start_date: transaction.start_date ? transaction.start_date.split('T')[0] : '',
            end_date: transaction.end_date ? transaction.end_date.split('T')[0] : ''
        })
        setEditingTransaction(transaction.id)
        setIsModalOpen(true)
    }

    const handleDeleteClick = (id: number) => {
        setTransactionToDelete(id)
        setDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!transactionToDelete) return

        setLoadingForm(true)
        try {
            await api.delete(`/auth/transactions/${transactionToDelete}`)
            toast.success('Transação deletada com sucesso!')
            setDeleteModalOpen(false)
            setTransactionToDelete(null)
            loadTransactions()
        } catch (error) {
            console.error('Erro ao deletar transação:', error)
            toast.error('Erro ao deletar transação')
        } finally {
            setLoadingForm(false)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingTransaction(null)
        setFormData({
            category_id: '',
            bank_id: '',
            card_id: '',
            description: '',
            amount: '',
            fixed_variable: 'V',
            payment_method: 'pix',
            start_date: '',
            end_date: ''
        })
    }

    return (
        <>
        {deleteModalOpen && (
            <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
                <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                    <h2>Confirmar Exclusão</h2>
                    <p>Tem certeza que deseja deletar esta transação?</p>
                    <div className="modal-actions">
                        <button 
                            onClick={() => setDeleteModalOpen(false)} 
                            className="btn-cancel"
                            disabled={loadingForm}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleDeleteConfirm} 
                            className="btn-confirm"
                            disabled={loadingForm}
                        >
                            {loadingForm ? 'Deletando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        <div>
            {isModalOpen && (
                <Forms 
                    title={editingTransaction ? "Editar Receita" : "Adicionar Receita"} 
                    titleButton={editingTransaction ? "Atualizar" : "Adicionar Receita"} 
                    onSubmit={handleSubmit} 
                    disableButton={loadingForm} 
                    onCancel={handleCloseModal} 
                    isModal={true}
                >
                    <Input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        disabled={loadingForm}
                    />

                    <Input
                        type="number"
                        name="amount"
                        placeholder="Valor"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        disabled={loadingForm}
                    />

                    <Select
                        name="category_id"
                        placeholder="Selecione uma categoria"
                        value={formData.category_id}
                        onChange={(value) => setFormData({ ...formData, category_id: value })}
                        options={categories}
                        disabled={loadingForm}
                        isLoading={loadingCategories}
                    />

                    <Select
                        name="bank_id"
                        placeholder="Selecione um banco"
                        value={formData.bank_id}
                        onChange={(value) => setFormData({ ...formData, bank_id: value })}
                        options={banks}
                        disabled={loadingForm}
                        isLoading={loadingBanks}
                    />

                    <Select
                        name="card_id"
                        placeholder="Selecione um cartão (opcional)"
                        value={formData.card_id}
                        onChange={(value) => setFormData({ ...formData, card_id: value })}
                        options={cards}
                        disabled={loadingForm || !formData.bank_id}
                        isLoading={loadingCards}
                    />

                    <RadioButton
                        name="fixed_variable"
                        options={[
                            { value: 'F', label: 'Fixo' },
                            { value: 'V', label: 'Variável' }
                        ]}
                        value={formData.fixed_variable}
                        onChange={(value) => setFormData({ ...formData, fixed_variable: String(value) })}
                        disabled={loadingForm}
                    />

                    <Select
                        name="payment_method"
                        placeholder="Método de pagamento"
                        value={formData.payment_method}
                        onChange={(value) => setFormData({ ...formData, payment_method: String(value) })}
                        options={[
                            { id: 'pix', label: 'PIX' },
                            { id: 'boleto', label: 'Boleto' },
                            { id: 'credito', label: 'Crédito' },
                            { id: 'debito', label: 'Débito' },
                            { id: 'dinheiro', label: 'Dinheiro' }
                        ]}
                        disabled={loadingForm}
                    />

                    <DateInput
                        name="start_date"
                        placeholder="Data de início"
                        value={formData.start_date}
                        onChange={(value) => setFormData({ ...formData, start_date: value })}
                        disabled={loadingForm}
                    />

                    <DateInput
                        name="end_date"
                        placeholder="Data final"
                        value={formData.end_date}
                        onChange={(value) => setFormData({ ...formData, end_date: value })}
                        disabled={loadingForm}
                    />
                </Forms>
            )}
            {!isModalOpen && (
                <div className='buttonNovo'><Button onClick={() => setIsModalOpen(true)}>
                    + Novo
                </Button></div>
            )}
        </div>        
        <div className="income-list">
            {loading && <p>Carregando transações...</p>}
            {!loading && transactions.length === 0 && <p>Nenhuma transação encontrada.</p>}
            {!loading && transactions.length > 0 && (
            <table className='table'>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>Ações</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Banco</th>
                        <th>Cartão</th>
                        <th>Categoria</th>
                        <th>Fixo/Variável</th>                        
                        <th>Data 1ª parcela</th>
                        <th>Data Final</th>
                        <th>Metodo de Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((item) => (
                        <tr key={item.id} className="income-item">
                            <td style={{ textAlign: 'center' }}>
                                <button 
                                    onClick={() => handleEdit(item)} 
                                    className="action-btn edit-btn"
                                    title="Editar"
                                >
                                    ✏️
                                </button>
                                <button 
                                    onClick={() => handleDeleteClick(item.id)} 
                                    className="action-btn delete-btn"
                                    title="Deletar"
                                >
                                    🗑️
                                </button>
                            </td>
                            <td>{item.description}</td>
                            <td>R$ {parseFloat(item.amount).toFixed(2)}</td>
                            <td>{item.bank_description}</td>
                            <td>{item.card_description}</td>
                            <td>{item.category_description}</td>
                            <td>{(item.fixed_variable == 'F') ? "Fixo" : "Variável"}</td>
                            <td>{item.start_date ? new Date(item.start_date).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{item.end_date ? new Date(item.end_date).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{item.payment_method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>

        <style>{`
            .action-btn {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0.3rem 0.5rem;
                margin: 0 0.2rem;
                transition: transform 0.2s;
            }

            .action-btn:hover {
                transform: scale(1.2);
            }

            .action-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .delete-modal {
                background: var(--gray-900);
                padding: 2rem;
                border-radius: 8px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .delete-modal h2 {
                color: var(--text-default);
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }

            .delete-modal p {
                color: var(--gray-400);
                margin-bottom: 1.5rem;
            }

            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }

            .btn-cancel, .btn-confirm {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
            }

            .btn-cancel {
                background: var(--gray-700);
                color: var(--text-default);
            }

            .btn-cancel:hover {
                background: var(--gray-600);
            }

            .btn-confirm {
                background: #e74c3c;
                color: white;
            }

            .btn-confirm:hover {
                background: #c0392b;
            }

            .btn-cancel:disabled, .btn-confirm:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `}</style>

        </>
    )
}