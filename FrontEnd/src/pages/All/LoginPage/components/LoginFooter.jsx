import React from 'react'
import { Link } from 'react-router-dom'

const LoginFooter = () => {

    const footerList = [
        { label: 'Privacidade', to: '' },
        { label: 'Condições', to: '' },
    ]

    return (
        <div className='flex justify-between p-5 bg-gray-100 font-light text-sm bottom-0 fixed w-full'>
            <div className='flex gap-1'>
                <Link
                    to=""
                    className='hover:underline hover:text-blue-500 text-blue-400'
                >
                    Como cuidamos da sua privacidade
                </Link>
                <p>- Copyright © 1999-2025 Datasystem InfoCell LTDA.</p>
            </div>
            <div className='flex gap-4'>
                {footerList.map((item, i) => (
                    <Link
                        key={i}
                        to={item.to}
                        className='hover:underline'
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default LoginFooter