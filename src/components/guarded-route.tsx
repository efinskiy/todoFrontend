import { Navigate } from 'react-router';
import { ReactNode } from 'react';

interface GuardedRouteProps {
    component: ReactNode;
    auth: boolean;
}

export const GuardedRoute = ({ component, auth }: GuardedRouteProps) => {
    return auth ? component : <Navigate to={'/login'} />;
};
