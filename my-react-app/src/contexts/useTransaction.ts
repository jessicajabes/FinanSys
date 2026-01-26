import { useContext } from "react";
import TransactionContext from './TransactionContext'

export function useTransaction() {
    const context = useContext(TransactionContext)

    if (context === null) {
        throw new Error('useTransaction deve ser usado dentro de um TransactionProvider')
    }

    return context
}
