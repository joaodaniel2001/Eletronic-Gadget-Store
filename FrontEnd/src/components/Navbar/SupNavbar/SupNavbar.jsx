import React from 'react';
import useIsAtTop from './useIsAtTop';
import { useTranslation } from 'react-i18next'

/* Icons */
import { MapPin } from 'lucide-react'

const SupNavbar = () => {

    const { t } = useTranslation();

    const isAtTop = useIsAtTop();

    const visibilityClass =
        isAtTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : '';

    return (
        <div
            className={`bg-green-700 justify-center md:justify-between items-center 
                        flex py-3 px-10 text-white md:font-semibold transition-all duration-300 ${visibilityClass}`}
        >
            <div className='flex gap-3'>
                <MapPin className='w-5 h-5' />
                <p className='flex text-sm'>
                    {t('supbar-street.part_01')}
                    <span className='hidden md:block mx-1'>{t('supbar-street.part_02')} </span>
                    {t('supbar-street.part_03')}
                </p>
            </div>
            <p className='hidden md:block text-sm'>{t('supbar-guarantee')}</p>
        </div>
    );
}

export default SupNavbar;