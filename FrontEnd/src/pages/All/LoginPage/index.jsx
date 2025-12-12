import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Ícones
import { HiMail, HiLockClosed } from 'react-icons/hi';

import LoginHeader from './components/LoginHeader';
import LoginFooter from './components/LoginFooter';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const { login, isLoggedIn, loading: authLoading } = useAuth();
    const navigate = useNavigate();

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
        <div className="">
            <LoginHeader />
            <div className='grid grid-cols-2'>
                <div>

                </div>
                <div className="px-10 md:px-80 pt-30">

                    {/* Exibição de Erro */}
                    {error && (
                        <div className="">
                            <b className=''>Erro de Autenticação:</b>
                            <p className=''>{error}</p>
                        </div>
                    )}

                    <div className='border border-gray-300 rounded-xl shadow-xl p-10'>
                        <form onSubmit={handleSubmit}>
                            <div className=''>

                                {/* E-mail */}
                                <label className=''>
                                    <h1>E-mail</h1>
                                    <input
                                        className='border border-gray-400 p-3 rounded-xl'
                                        type="email"
                                        placeholder="Seu e-mail"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </label>

                                {/* Senha */}
                                <div className=''>
                                    <HiLockClosed className="" />
                                    <input
                                        className=''
                                        type="password"
                                        placeholder="Sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className=''>
                                <button
                                    type="submit"
                                    className=''
                                    disabled={authLoading}
                                >
                                    {authLoading ? 'Entrando...' : 'Entrar na Conta'}
                                </button>

                                {/* Links Adicionais */}
                                <div className="">
                                    <Link
                                        to="/user/register"
                                        className=''
                                    >
                                        Não tem conta? Cadastre-se
                                    </Link>
                                    <p
                                        className=''
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
            <LoginFooter />
        </div>
    );
}

export default LoginPage;