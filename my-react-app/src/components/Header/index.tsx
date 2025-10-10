import { useEffect } from 'react'
import { Sun } from 'lucide-react'
import { LogOut } from 'lucide-react'
//import { Moon } from 'lucide-react'

import './styles.scss'

import Logo from '../Logo/Logo'

export default function Header(){
    useEffect(() => {
        document.title = 'FinanSys'
    }, [])

    return(
        <header className="app-header">
            <div className='logo'><Logo/></div>

            <div className="buttons">
                <button className="light-dark"><Sun/></button>
                <button className="logout"><LogOut/></button>
            </div>
        </header>
    )
}