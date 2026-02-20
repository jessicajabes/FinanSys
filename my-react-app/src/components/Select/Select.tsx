import { useState } from 'react'
import './styles.scss'

interface SelectOption {
    id: number | string
    label: string
}

interface SelectProps {
    name: string
    placeholder?: string
    value: string | number
    onChange: (value: string | number) => void
    options: SelectOption[]
    disabled?: boolean
    isLoading?: boolean
}

export function Select({
    name,
    placeholder,
    value,
    onChange,
    options,
    disabled,
    isLoading
}: SelectProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedOption = options.find(opt => opt.id === value)

    return (
        <div className="select-container">
            <div className="select-input" onClick={() => !disabled && setIsOpen(!isOpen)}>
                <input
                    type="text"
                    placeholder={placeholder || 'Selecione...'}
                    value={isOpen ? searchTerm : selectedOption?.label || ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled || isLoading}
                    onFocus={() => setIsOpen(true)}
                />
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="select-options">
                    {isLoading ? (
                        <div className="option loading">Carregando...</div>
                    ) : filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <div
                                key={option.id}
                                className={`option ${value === option.id ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(option.id)
                                    setIsOpen(false)
                                    setSearchTerm('')
                                }}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="option empty">Nenhuma opção encontrada</div>
                    )}
                </div>
            )}
            <input type="hidden" name={name} value={value} />
        </div>
    )
}
