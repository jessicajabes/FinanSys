import './styles.scss'
import {Routes, Route } from 'react-router-dom'
import { Button } from '../../components/Button/Button.tsx'
import Expenses from '../../pages/Expenses/Expenses.tsx'
import Income from '../../pages/Income/Income.tsx'


export default function Dashboard(){
    return( 
        <>
        <Routes>
            <Route path="/expenses" element={<Expenses/>}/>
            <Route path="/income" element={<Income/>}/>
        </Routes>
        <div className='buttons'>
            <Button>Receitas</Button>
            <Button>Despesas</Button>
        </div>
    </>        

    )
}