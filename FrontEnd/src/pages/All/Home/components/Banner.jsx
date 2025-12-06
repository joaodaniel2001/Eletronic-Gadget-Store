import React from 'react'
import { useTranslation } from 'react-i18next'

const Banner = () => {
    const { t } = useTranslation()

    return (
        <div className='w-full h-70 bg-green-300 p-10'>
            <h1>{t('home-banner.text-h1')}</h1>
            <div className='p-2 bg-linear-to-r from-green-600 via-blue-500 to-green-400 
            max-w-50 rounded-sm cursor-pointer'>
                <div className='bg-green-300 rounded-sm flex justify-center items-center'>
                    {t('home-banner.button')}
                </div>
            </div>
        </div>
    )
}

export default Banner
