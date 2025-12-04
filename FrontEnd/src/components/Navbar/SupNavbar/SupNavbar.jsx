import React from 'react';
import useIsAtTop from './useIsAtTop';

/* Icons */
import { MapPin } from 'lucide-react'

const SupNavbar = () => {
    const isAtTop = useIsAtTop();

    const visibilityClass =
        isAtTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-full pointer-events-none';

    return (
        <div
            className={`bg-green-700 justify-center md:justify-between items-center 
                        flex py-3 px-10 text-white md:font-semibold transition-all duration-300 ${visibilityClass}`}
        >
            <div className='flex gap-3'>
                <MapPin className='w-5 h-5' />
                <p className='flex text-sm'>
                    Rua André Voltolini, <span className='hidden md:block mx-1'> n-555 sala 01 </span> Nereu Ramos
                </p>
            </div>
            <p className='hidden md:block text-sm'>Garantia de Satisfação ou seu Dinheiro de Volta em 30 dias.</p>
        </div>
    );
}

export default SupNavbar;