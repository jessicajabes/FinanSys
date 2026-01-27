import api from '../services/api';
import { toast } from '../utils/toast';
import { useState, createContext, type ReactNode, useCallback } from 'react';
import { useAuth } from './useAuth'

interface Transaction {
    id: number;
    category_id: number;
    category_description: string | null;
    bank_id: number;
    bank_description: string;
    card_id: number | null;
    card_description: string | null;
    description: string;
    amount: string;
    fixed_variable: string;
    payment_method: string;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
    created_by: number | null;
    updated_at: string;
    updated_by: number | null;
}

interface TransactionContextData {
    transactions: Transaction[];
    loadTransactions: () => Promise<void>;
    loading: boolean;
}

const TransactionContext = createContext<TransactionContextData | null>(null);

interface TransactionProviderProps {
    children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth()

    const loadTransactions = useCallback(async () => {
        console.log('loadTransactions chamado, user:', user);
        setLoading(true);
        try {
            if (user) {
                //console.log('Chamando API para usuário:', user.id);
                const response = await api.get(`/auth/transaction_income/${user.id}`);
                //console.log('Resposta da API:', response.data);
                const transaction = response?.data?.transaction;
                //console.log('Transação extraída:', transaction);
                if (transaction) {
                    const transArray = Array.isArray(transaction) ? transaction : [transaction];
                    setTransactions(transArray);
                } else {
                    setTransactions([]);
                }
            } else {
                console.log('Usuário não autenticado');
                toast.error('Usuário não autenticado.');
                return;
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: Record<string, unknown> } };
            const serverData = err?.response?.data as Record<string, unknown> | undefined;
            const serverMessage = serverData?.['error'] || serverData?.['message'];
            if (serverMessage) {
                toast.error(String(serverMessage));
            } else {
                toast.error('Erro ao buscar transações. Tente novamente.');
            }
            console.error('Erro ao buscar transações:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const contextValue: TransactionContextData = {
        transactions,
        loadTransactions,
        loading,
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
}

export default TransactionContext;
