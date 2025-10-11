import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'

import Header from './components/Header/index.tsx'
import Footer from './components/Footer/index.tsx'

import Login from './pages/Login/index.tsx'
import SignUp from './pages/SignUp/SignUp.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import Expenses from './pages/Expenses/Expenses.tsx'
import Income from './pages/Income/Income.tsx'



function App(){
    return(
        <Router>
            <div className="App">
                <Header/>
                <main>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/SignUp" element={<SignUp/>}/>
                        <Route path="/Dashboard" element={<Dashboard/>}/>
                        <Route path="/Expenses" element={<Expenses/>}/>
                        <Route path="/Income" element={<Income/>}/> 
                     </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App