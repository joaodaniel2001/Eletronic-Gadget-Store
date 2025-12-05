import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

/* Icons */
import {
    ShoppingCart, Heart, ChevronDown, Search,
    User, Package, Settings, LogOut
} from 'lucide-react';

/* Flags */
import ReactCountryFlag from 'react-country-flag';

const languageOptions = [
    { label: 'English', code: 'US' },
    { label: 'Portuguese', code: 'BR' },
    { label: 'Spanish', code: 'ES' },
];

const BotNavbar = () => {

    const getStorage = (key, defaultValue) => {
        return localStorage.getItem(key) || defaultValue;
    };

    const [language, setLanguage] = useState(getStorage("Site Language:", 'English'));
    const [flagCode, setFlagCode] = useState(getStorage("Flag Code:", 'US'));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // 1. Defina os ícones como strings
    const userMenuItems = [
        { label: 'Meu Perfil', icon: 'User', to: '/profile' },
        { label: 'Meus Pedidos', icon: 'Package', to: '/orders' },
        { label: 'Configurações', icon: 'Settings', to: '/settings' },
        { label: 'Sair', icon: 'LogOut', to: '/logout' },
    ];

    useEffect(() => {
        localStorage.setItem("Site Language:", language);
        localStorage.setItem("Flag Code:", flagCode);
    }, [language, flagCode]);


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

    const handleLanguageChange = (item) => {
        setLanguage(item.label);
        setFlagCode(item.code);
        setIsDropdownOpen(false);
    };

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
                <Link to={'/'}>
                    <p className='font-semibold text-xl w-full flex'>Data<span className='text-green-700 mr-1'>sytem</span> Infocell</p>
                </Link>
                {/* Search */}
                <div className='relative w-full justify-center-safe hidden md:block'>
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    />
                    <input
                        className='border border-gray-300 px-3 rounded-md lg:w-200 md:w-50 pl-10 h-10'
                        type="text"
                        placeholder='What are you looking for?'
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
                        <FlagComponent code={flagCode} />
                        <span className="truncate">{language}</span>
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
                                        ${item.label === language ? 'font-semibold bg-gray-50' : ''}`}
                                    onClick={() => handleLanguageChange(item)}
                                >
                                    <FlagComponent code={item.code} />
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
                        <div className='bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center font-bold'>JD</div>
                        <div className='hidden md:block text-left'>
                            <p className='text-gray-500 text-sm'>Welcome Back!</p>
                            <h1 className='font-bold'>João Daniel</h1>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {isUserMenuOpen && (
                        <div
                            className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-40'
                        >
                            {userMenuItems.map((item, index) => {
                                // 3. Pega o componente do ícone
                                const IconComponent = getIconComponent(item.icon);

                                return (
                                    <Link
                                        key={index}
                                        to={item.to}
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className='flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition'
                                    >
                                        {IconComponent && <IconComponent className='w-4 h-4' />} {/* Renderiza o ícone */}
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