import React from 'react'

import SupNavbar from './SupNavbar/supNavbar';
import BotNavbar from './BotNavbar/BotNavbar'
import useIsAtTop from './SupNavbar/useIsAtTop';

const Navbar = () => {
    const isAtTop = useIsAtTop();

    const navbarPositionClass = isAtTop ? 'translate-y-0' : '-translate-y-10';

    return (
        <div
            className={`fixed w-full border-b border-gray-200 z-30 transition-transform duration-300 ${navbarPositionClass}`}
        >
            <SupNavbar />

            <div className='bg-white shadow-sm'>
                <BotNavbar />
            </div>
        </div>
    )
}

export default Navbar