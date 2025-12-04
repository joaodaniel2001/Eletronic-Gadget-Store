import { useState, useEffect } from 'react';

const useIsAtTop = () => {
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.pageYOffset === 0);
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll(); 

        return () => window.removeEventListener('scroll', handleScroll);
    }, []); 

    return isAtTop;
};

export default useIsAtTop;