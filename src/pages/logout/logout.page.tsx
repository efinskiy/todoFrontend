import { useEffect } from 'react';
import { logout } from '../../stores/auth.ts';
import { Navigate } from 'react-router';

export const LogoutPage = () => {
    useEffect(() => {
        logout();
    }, []);

    return <Navigate to={'/login'} />;
};
