import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Ícones
import { HiMail, HiLockClosed } from 'react-icons/hi'; // Trocando HiUser por HiMail

function LoginPage() {
    // Campos do Backend: email e password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const { login, isLoggedIn, loading: authLoading } = useAuth(); // Adicionei authLoading para desabilitar o botão
    const navigate = useNavigate();

    // Redireciona se já estiver logado
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/home', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            navigate('/home');
        } else {
            setError(result.message);
        }
    };

    return (
        // 🚩 ALTERAÇÃO: Fundo escuro (Dark Mode Tech)
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 🚩 ALTERAÇÃO: Card com fundo branco ou cinza claro */}
                <div className="bg-white p-10 text-center rounded-xl shadow-2xl">

                    {/* Exibição de Erro */}
                    {error && (
                        <div className="bg-red-100 rounded p-3 mb-4 text-left border border-red-300">
                            <b className='text-red-800'>Erro de Autenticação:</b>
                            <p className='text-red-700'>{error}</p>
                        </div>
                    )}

                    {/* Título e Logo */}
                    <div>
                        {/* 🚩 ALTERAÇÃO: Novo Título e Subtítulo */}
                        <h1 className='text-gray-800 font-extrabold text-4xl mb-1'>Tech<span className='text-blue-600'>Shop</span></h1>
                        <p className='text-gray-500 mb-6'>Acesse sua conta para continuar comprando.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* 🚩 ALTERAÇÃO: Layout de Inputs ajustado para 1 coluna em tela pequena */}
                        <div className='flex flex-col gap-4 my-5'>

                            {/* E-mail (substitui Nome de Usuário) */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiMail className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="email"
                                    placeholder="Seu e-mail" // 🚩 ALTERAÇÃO: Placeholder para e-mail
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Senha */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiLockClosed className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 mt-6'>
                            <button
                                type="submit"
                                className='h-12 w-full bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
                                disabled={authLoading} // Desabilita durante o login
                            >
                                {authLoading ? 'Entrando...' : 'Entrar na Conta'}
                            </button>

                            {/* Links Adicionais */}
                            <div className="flex justify-between items-center text-sm">
                                <Link
                                    to="/user/register" // Link para a página de Cadastro
                                    className='text-blue-600 font-medium hover:text-blue-800 transition'
                                >
                                    Não tem conta? Cadastre-se
                                </Link>
                                <p
                                    className='text-gray-500 underline hover:text-gray-600 transition cursor-pointer'
                                    onClick={() => alert(`Funcionalidade de recuperação de senha em desenvolvimento.`)}
                                >
                                    Esqueceu a senha?
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;