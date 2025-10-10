import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'

import Login from './pages/Login/index.tsx'
import Header from './components/Header/index.tsx'
import Footer from './components/Footer/index.tsx'


function App(){
    return(
        <Router>
            <div className="App">
                <Header/>
                <main>
                    <Routes>
                        <Route path="/" element={<Login />} />
                    </Routes>
                </main>
                <Footer/>
            </div>
        </Router>
    );
}

export default App