import api from '../services/api';
import { toast } from '../utils/toast';
import { useState, createContext, type ReactNode, useCallback } from 'react';

interface Transaction {
    id: number;
    user_id: number | null;
    category_id: number;
    bank_id: number;
    card_id: number | null;
    description: string;
    amount: string;
    transaction_type: string;
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

    const loadTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/transaction');
            const list = response?.data?.transaction ?? [];
            setTransactions(Array.isArray(list) ? list : []);
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
    }, []);

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
