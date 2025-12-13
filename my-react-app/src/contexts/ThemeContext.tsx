import { createContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'sun' | 'moon'

interface ThemeContextData {
    theme: Theme
    toggleTheme: () => void
}

interface ThemeProviderProps {
    children: ReactNode
}

const ThemeContext = createContext<ThemeContextData | null>(null)

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const stored = localStorage.getItem('theme') as Theme | null
            return stored ?? 'moon'
        } catch {
            return 'moon'
        }
    })


    useEffect(() => {
        const root = document.documentElement
        root.setAttribute('data-theme', theme)
        try {
            localStorage.setItem('theme', theme)
        } catch {
            // ignore
        }
    }, [theme])

    const toggleTheme = () => setTheme((t) => (t === 'sun' ? 'moon' : 'sun'))

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext