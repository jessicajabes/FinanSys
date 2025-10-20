import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.scss'

import Header from './components/Header/index.tsx'
import Footer from './components/Footer/index.tsx'

import Login from './pages/Login/index.tsx'
import SignUp from './pages/SignUp/SignUp.tsx'
import Dashboard from './pages/Dashboard/Dashboard.tsx'
import { ProtectedRoute } from './components/ProtectedRoute/index.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext.tsx'



function App(){
    return(
        <AuthProvider>
            <Toaster position="bottom-right" richColors />
            <Router>
                <div className="App">
                    <Header/>
                    <main>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/signUp" element={<SignUp/>}/>
                            <Route path="/dashboard/*" element={
                                <ProtectedRoute>
                                    <Dashboard/>
                                </ProtectedRoute>
                            }/>
                        </Routes>
                    </main>
                    <Footer/>
                </div>
            </Router>
        </AuthProvider>    
    );
}

export default App