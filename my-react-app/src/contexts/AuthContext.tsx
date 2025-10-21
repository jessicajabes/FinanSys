import api from '../services/api';
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from '../utils/toast';

interface User {
  id: number;
  username: string;
  nome?: string;
  telefone?: string;
  email: string;
  data_nascimento?: string;
  created_at: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signed: boolean;
  signIn: (login: string, password: string) => Promise<boolean>;
  signUp: (userData: SignUpData) => Promise<boolean>;
  signOut: () => void;
}

interface SignUpData {
  username: string;
  nome?: string;
  telefone?: string;
  email: string;
  data_nascimento?: string;
}


const AuthContext = createContext<AuthContextData | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  //  const [theme, setTheme] = useState<string>('moon');

    useEffect(() => {
        async function loadStorageData(){
            try{
                const storedToken = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');


                if(storedToken && storedUser){
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    try {
                        await api.get('/auth/profile');
                    } catch (err) {
                        console.warn('Token inválido, fazendo logout', err);
                        signOut();
                    }
                }
            } catch (error) {
            const err = error as { response?: { data?: Record<string, unknown> } };
            const serverData = err?.response?.data as Record<string, unknown> | undefined;
            const serverMessage = serverData?.['error'] || serverData?.['message'];
            if (serverMessage) {
                toast.error(String(serverMessage));
            } else {
                toast.error('Erro ao carregar dados de autenticação. Tente novamente.');
            }
            console.error('Erro ao carregar dados de autenticação:', error);
                signOut();
            } finally{
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);


    async function signIn(login: string, password: string): Promise<boolean>{
        try{

            const response = await api.post('/auth/login', { login, password });

            if (response.data.token && response.data.user) {
                const { token: receivedToken, user: userData } = response.data;

                setToken(receivedToken);
                setUser(userData);
                localStorage.setItem('token', receivedToken);
                localStorage.setItem('user', JSON.stringify(userData));

                toast.success(response.data.message || 'Login realizado com sucesso!');
                return true;
            }

            return false;
        } catch(error: unknown) {
            const err = error as { response?: { data?: Record<string, unknown> } };
            const serverData = err?.response?.data as Record<string, unknown> | undefined;
            const serverMessage = serverData?.['error'] || serverData?.['message'];
            if (serverMessage) {
                toast.error(String(serverMessage));
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
            console.error('Erro ao fazer login:', error);
            return false;
        }
    }

    async function signOut(){
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        toast.info('Logout realizado com sucesso!');
    }

    async function signUp(userData: SignUpData): Promise<boolean>{
        try{
            const response = await api.post('/auth/register', userData);

            if(response.data.token && response.data.user){
                const { token: receivedToken, user: newUser} = response.data;
                
                setToken(receivedToken);
                setUser(newUser);
                localStorage.setItem('token', receivedToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                
                toast.success(response.data.message || 'Usuário cadastrado com sucesso');
                return true;
            }
            return false;
        } catch (error: unknown) {
            const err = error as { response?: { data?: Record<string, unknown> } };
            const serverData = err?.response?.data as Record<string, unknown> | undefined;
            const serverMessage = serverData?.['error'] || serverData?.['message'];
            if (serverMessage) {
                toast.error(String(serverMessage));
            } else {
                toast.error('Erro no cadastro. Tente novamente.');
            }
            console.error('Erro no cadastro:', error);
            return false;
        }
    }


    const contextValue: AuthContextData = {
        user,
        token,
        loading,
        signed: !!user && !!token,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}


export default AuthContext;

