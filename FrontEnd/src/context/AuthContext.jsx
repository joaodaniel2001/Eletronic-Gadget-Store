import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import axios from 'axios'

const STORAGE_KEY = '@MyApp:user'

const AuthContext = createContext(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem(STORAGE_KEY)
        try {
            return storedUser ? JSON.parse(storedUser) : null
        } catch (error) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const login = useCallback(async (email, password) => {
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:3000/api/autenticacao/login', {
                email: email,
                senha: password,
            })

            const { email: userData, token } = response.data
            const userPayload = { ...userData, token }

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userPayload))

            setUser(userPayload)
            setIsAuthChecked(true)

            return { success: true }

        } catch (error) {
            let message = 'Falha de conexão ou credenciais inválidas.';

            if (error.response) {
                message = error.response.data?.message || `Erro no servidor (Status: ${error.response.status}). Verifique o console do backend.`;
            } else if (error.request) {
                message = 'O servidor de autenticação está inacessível. Verifique se o backend está rodando.';
            }

            console.error("Erro no Login:", error);

            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, [])