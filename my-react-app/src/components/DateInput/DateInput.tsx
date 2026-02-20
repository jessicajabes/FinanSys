import './styles.scss'

interface DateInputProps {
    name: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
}

export function DateInput({ name, value, onChange, placeholder, disabled }: DateInputProps) {
    return (
        <div className="date-input-container">
            <input
                type="date"
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="date-input"
            />
            <span className="date-icon">📅</span>
        </div>
    )
}
