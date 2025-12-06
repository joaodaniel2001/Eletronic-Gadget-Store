import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

// Ícones
import { HiUser, HiMail, HiLockClosed, HiPhone } from 'react-icons/hi';

// URL base do seu backend
const API_URL = 'http://localhost:3000/api/cadastro/usuario';

function RegisterPage() {
    // Estados para os campos do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    // Estados para feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { isLoggedIn } = useAuth();
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
        setLoading(true);

        // 1. Validação de Senhas
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        // 2. Monta os dados para o backend
        const registrationData = {
            name,
            email,
            password,
            phone,
            user_type: 'customer', // Define o tipo de usuário padrão para o e-commerce
        };

        try {
            const response = await axios.post(API_URL, registrationData);

            if (response.status === 201) {
                // Cadastro bem-sucedido: Redireciona para o login ou efetua o login automaticamente
                alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
                navigate('/login');
            }
        } catch (err) {
            let message = 'Erro desconhecido ao cadastrar. Tente novamente.';

            if (err.response) {
                // Erro retornado pelo seu backend (ex: email duplicado)
                message = err.response.data?.message || `Erro no servidor (Status: ${err.response.status}).`;
            } else if (err.request) {
                message = 'Não foi possível conectar ao servidor. Verifique o backend.';
            }

            console.error("Erro no Cadastro:", err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Estilo Dark Mode Tech do e-commerce
        <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white p-10 text-center rounded-xl shadow-2xl">

                    {/* Exibição de Erro */}
                    {error && (
                        <div className="bg-red-100 rounded p-3 mb-4 text-left border border-red-300">
                            <b className='text-red-800'>Erro no Cadastro:</b>
                            <p className='text-red-700'>{error}</p>
                        </div>
                    )}

                    {/* Título */}
                    <div>
                        <h1 className='text-gray-800 font-extrabold text-4xl mb-1'>Crie sua Conta</h1>
                        <p className='text-gray-500 mb-6'>Junte-se à Tech<span className='text-blue-600'>Shop</span> e comece a comprar.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-5'>

                            {/* Nome Completo */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50 col-span-1 md:col-span-2'>
                                <HiUser className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="text"
                                    placeholder="Nome Completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* E-mail */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiMail className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Telefone */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiPhone className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="tel"
                                    placeholder="Telefone (opcional)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Senha */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiLockClosed className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Confirmar Senha */}
                            <div className='flex items-center border border-gray-300 rounded-md p-3 w-full bg-gray-50'>
                                <HiLockClosed className="w-6 h-6 text-blue-600 mr-3" />
                                <input
                                    className='grow outline-none border-none focus:ring-0 placeholder-gray-500 bg-transparent'
                                    type="password"
                                    placeholder="Confirme a Senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 mt-6'>
                            <button
                                type="submit"
                                className='h-12 w-full bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
                                disabled={loading}
                            >
                                {loading ? 'Cadastrando...' : 'Criar Conta'}
                            </button>

                            <div className="text-sm">
                                <Link
                                    to="/login"
                                    className='text-gray-500 hover:text-gray-600 transition'
                                >
                                    Já tem uma conta? <span className='text-blue-600 font-medium hover:text-blue-800'>Fazer Login</span>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;