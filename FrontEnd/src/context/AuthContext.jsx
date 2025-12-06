import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const STORAGE_KEY = '@MyApp:user';

const AuthContext = createContext(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem(STORAGE_KEY);
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            sessionStorage.removeItem(STORAGE_KEY);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    // ✅ ALTERAÇÃO APLICADA: Mudando 'nomeUsuario' para 'email' e 'senha' para 'password'
    const login = useCallback(async (email, password) => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/autenticacao/login', {
                // ✅ Campos de requisição ajustados para 'email' e 'password'
                email: email,
                password: password,
            });

            const { user: userData, token } = response.data;
            const userPayload = { ...userData, token };

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userPayload));

            setUser(userPayload);
            setIsAuthChecked(true);

            return { success: true };

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
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const fetchUserInfo = useCallback(async () => {
        const localUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

        if (!localUser || !localUser.token) {
            setUser(null);
            setLoading(false);
            setIsAuthChecked(true);
            return null;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    'Authorization': `Bearer ${localUser.token}`,
                },
            };

            // Esta rota '/api/usuario/perfil' está correta e retorna os dados do usuário + endereços
            const response = await axios.get('http://localhost:3000/api/usuario/perfil', config);

            // O backend retorna todos os dados do perfil (incluindo 'addresses')
            const updatedUserData = response.data;
            const newUserPayload = { ...updatedUserData, token: localUser.token };

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUserPayload));
            setUser(newUserPayload);

            return newUserPayload;

        } catch (error) {
            console.error("Erro ao buscar informações do usuário:", error);
            logout();
            return null;
        } finally {
            setLoading(false);
            setIsAuthChecked(true);
        }
    }, [logout]);

    useEffect(() => {
        if (isAuthChecked) {
            return;
        }

        const storedUser = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

        if (storedUser && storedUser.token) {
            fetchUserInfo();
        } else {
            setUser(null);
            setLoading(false);
            setIsAuthChecked(true);
        }
    }, [fetchUserInfo, isAuthChecked]);

    const isLoggedIn = !!user;

    const authContextValue = {
        user,
        isLoggedIn,
        login,
        logout,
        loading,
        fetchUserInfo,
        isAuthChecked,
    };

    if (!isAuthChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="ml-3 text-indigo-700">A verificar sessão...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};