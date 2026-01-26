import api from '../services/api';
import { toast } from '../utils/toast';
import { useState, createContext, type ReactNode, useEffect } from 'react';

// Mantém o shape real retornado pela API (lista de categorias)
interface Categorie {
    id: number;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
    created_by: number | null;
    updated_by: number | null;
}

interface CategorieContextData {
    categories: Categorie[];
}

const CategorieContext = createContext<CategorieContextData | null>(null);

interface CategorieProviderProps {
    children: ReactNode;
}

export function CategorieProvider({ children }: CategorieProviderProps) {
    const [categories, setCategories] = useState<Categorie[]>([]);

    useEffect(() => {
        async function loadCategorieData() {
            try {
                const response = await api.get('/auth/categorie');
                const list = response?.data?.categorie ?? [];
                setCategories(Array.isArray(list) ? list : []);
            } catch (error: unknown) {
                const err = error as { response?: { data?: Record<string, unknown> } };
                const serverData = err?.response?.data as Record<string, unknown> | undefined;
                const serverMessage = serverData?.['error'] || serverData?.['message'];
                if (serverMessage) {
                    toast.error(String(serverMessage));
                } else {
                    toast.error('Erro ao buscar categorias. Tente novamente.');
                }
                console.error('Erro ao buscar categorias:', error);
            }
        }
        loadCategorieData();
    }, []);

    const contextValue: CategorieContextData = {
        categories,
    };

    return (
        <CategorieContext.Provider value={contextValue}>
            {children}
        </CategorieContext.Provider>
    );
}

export default CategorieContext;