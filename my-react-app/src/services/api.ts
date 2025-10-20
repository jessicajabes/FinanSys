import axios, { type AxiosResponse } from 'axios'
import { config }  from '../config'


const api = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json'
    }
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config    
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401){
            localStorage.removeItem('token')
            localStorage.removeItem('user')

            const currentPath = window.location.pathname
            const publicPaths = ['/', '/login', '/signup']

            if(!publicPaths.includes(currentPath)) {
                window.location.href = '/login'
            }
        }

        if (error.response?.status === 403) {
            console.warn('Acesso negado - permissões insuficientes')
        }    
    // Se receber erro 500, mostrar mensagem genérica
        if (error.response?.status >= 500) {
            console.error('Erro interno do servidor')
        }

        return Promise.reject(error)
    }
)

export default api