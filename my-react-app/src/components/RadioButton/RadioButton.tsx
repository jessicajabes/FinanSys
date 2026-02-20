import './styles.scss'

interface RadioButtonProps {
    name: string
    options: Array<{ value: string | number; label: string }>
    value: string | number
    onChange: (value: string | number) => void
    disabled?: boolean
}

export function RadioButton({ name, options, value, onChange, disabled }: RadioButtonProps) {
    return (
        <div className="radio-group">
            {options.map(option => (
                <label key={option.value} className="radio-label">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                    />
                    <span className="radio-custom"></span>
                    {option.label}
                </label>
            ))}
        </div>
    )
}
