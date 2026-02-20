import { useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/useTheme'
//import { Moon } from 'lucide-react'

import './styles.scss'

import Logo from '../Logo/Logo'

export default function Header(){
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const goDash = () => navigate('Dashboard')

    useEffect(() => {
        document.title = 'FinanSys'
    }, [])

    async function clickButton(){
         await signOut();
         navigate('/');
    }

    const { theme, toggleTheme } = useTheme()

    return(
        <header className="app-header">
            <button onClick={goDash} className='logo'><Logo/></button>

            <div className="buttons">
                <button onClick={toggleTheme} className="light-dark">{theme === 'sun' ? <Moon/> : <Sun/>}</button>
                <button onClick={clickButton} className="logout"><LogOut/></button>
            </div>
        </header>
    )
}