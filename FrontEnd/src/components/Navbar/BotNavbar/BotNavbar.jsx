// FrontEnd/src/components/BotNavbar.jsx

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useTranslation } from 'react-i18next'

/* Icons */
import {
    ShoppingCart, Heart, ChevronDown, Search,
    User, Package, Settings, LogOut
} from 'lucide-react';

/* Flags */
import ReactCountryFlag from 'react-country-flag';

// Mapeamento dos idiomas
const languageOptions = [
    { label: 'English', code: 'en', flag: 'US' },
    { label: 'Portuguese', code: 'pt', flag: 'BR' },
    { label: 'Spanish', code: 'es', flag: 'ES' },
];

const BotNavbar = () => {

    // Importa a função de tradução (t) e a instância do i18next (i18n)
    const { t, i18n } = useTranslation();

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    // Lógica para nome do usuário
    const partsName = user.name ? user.name.split(' ') : [''];
    const firstName = partsName[0];
    const fistLetterName = user.name ? user.name[0] : '';
    const secondName = partsName.length > 1 ? partsName[1] : '';
    const secondLetterName = secondName ? secondName[0].toUpperCase() : '';

    // Estados para controlar os dropdowns 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Itens do menu do usuário
    const userMenuItems = [
        { label: t('navbar-menu.my_profile'), icon: 'User', to: '/profile' },
        { label: t('navbar-menu.my_orders'), icon: 'Package', to: '/orders' },
        { label: t('navbar-menu.settings'), icon: 'Settings', to: '/settings' },
        { label: t('navbar-menu.logout'), icon: 'LogOut', to: '/logout', action: handleLogout },
    ];

    // Função para alterar o idioma usando i18n.changeLanguage
    const handleLanguageChange = (item) => {
        i18n.changeLanguage(item.code);
        setIsDropdownOpen(false);
    };

    // Encontra o idioma e a bandeira ATUAL com base no i18n.language
    const currentLanguage = languageOptions.find(opt => opt.code === i18n.language)
        || languageOptions.find(opt => opt.code.includes(i18n.language))
        || languageOptions[0]; // Fallback
    const currentFlagCode = currentLanguage.flag;
    const currentLanguageLabel = currentLanguage.label;


    // Componente de Bandeira (mantido)
    const FlagComponent = ({ code }) => {
        if (!code) return null;
        return (
            <ReactCountryFlag
                countryCode={code}
                svg
                style={{ width: '2em', height: '2em', marginRight: '8px' }}
                title={code.toLowerCase()}
            />
        );
    };

    // Função para obter o componente do ícone (mantida)
    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'User': return User;
            case 'Package': return Package;
            case 'Settings': return Settings;
            case 'LogOut': return LogOut;
            default: return null;
        }
    };

    return (
        <div className='bg-white flex justify-between items-center px-3 md:px-10 py-3 shadow-sm'>
            <div className='flex justify-center items-center gap-10'>
                {/* Logo */}
                <Link to={'/home'}>
                    <p className='font-semibold text-xl w-full flex'>
                        Data
                        <span className='text-green-700 mr-1'>system</span>
                        InfoCell
                    </p>
                </Link>
                {/* Search */}
                <div className='relative w-full justify-center-safe hidden md:block'>
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    />
                    <input
                        className='border border-gray-300 px-3 rounded-md lg:w-200 md:w-50 pl-10 h-10'
                        type="text"
                        placeholder={t('search.placeholder')}
                    />
                </div>
            </div>

            {/* Icons / Language / User */}
            <div className='flex items-center gap-x-4'>
                {/* Icons */}
                <ShoppingCart className='cursor-pointer text-gray-400 hover:text-black transition' />
                <Heart className='cursor-pointer text-gray-400 hover:text-black transition rounded-full' />

                {/* Language Dropdown */}
                <div className="relative hidden md:block">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className='bg-white text-gray-700 text-base px-4 py-2 rounded-lg flex transition
                        items-center justify-between min-w-min cursor-pointer hover:bg-gray-200'
                    >
                        {/* Bandeira e Label do Idioma ATUAL */}
                        <FlagComponent code={currentFlagCode} />
                        <span className="truncate">{currentLanguageLabel}</span>
                        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>

                    {isDropdownOpen && (
                        <div
                            className='absolute top-full right-0 rounded-lg py-2 mt-2 shadow-xl border border-gray-200 bg-white w-full z-10 min-w-max'
                        >
                            {languageOptions.map((item, i) => (
                                <button
                                    key={i}
                                    className={`w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 transition ease-in-out cursor-pointer
                                        ${item.code === i18n.language ? 'font-semibold bg-gray-50' : ''}`}
                                    onClick={() => handleLanguageChange(item)}
                                >
                                    <FlagComponent code={item.flag} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className='hidden md:block border border-gray-300 h-10'></div>

                {/* User Dropdown */}
                <div className='relative'>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className='flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 rounded-lg p-2'
                    >
                        <div className='bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center font-bold'>{fistLetterName}{secondLetterName}</div>
                        <div className='hidden md:block text-left'>
                            <p className='text-gray-500 text-sm'>{t('user_menu.welcome_back')}</p>
                            <h1 className='font-bold'>{firstName} {secondName}</h1>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {isUserMenuOpen && (
                        <div
                            className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-40'
                        >
                            {userMenuItems.map((item, index) => {
                                const IconComponent = getIconComponent(item.icon);

                                return (
                                    <Link
                                        key={index}
                                        to={item.to}
                                        onClick={() => { item.action ? item.action() : setIsUserMenuOpen(false) }}
                                        className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                                    >
                                        {IconComponent && <IconComponent className='w-4 h-4' />}
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default BotNavbar