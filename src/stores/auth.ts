import Cookies from 'js-cookie';
import { hookstate, useHookstate } from '@hookstate/core';
import { LoginResponse } from '../api/login.ts';

export const validate_session = () => {
    const expires = Number(Cookies.get('expires'));

    if (isNaN(expires)) {
        return false;
    }
    return expires - Math.round(Date.now() / 1000) > 0;
};

interface AuthData {
    isLoggedIn: boolean;
    expires: number;
    accessToken: string | undefined;
}

const initialState = () => {
    return {
        isLoggedIn: validate_session(),
        expires: Number(Cookies.get('expires')),
        accessToken: Cookies.get('access_token'),
    };
};

const authState = hookstate<AuthData>(initialState());

export const authUser = (authData: LoginResponse) => {
    authState.set({
        isLoggedIn: true,
        expires: authData.expires,
        accessToken: authData.access_token,
    });
    Cookies.set('access_token', authData.access_token);
    Cookies.set('expires', String(authData.expires));
};

export const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('expires');
    authState.set(initialState());
};

export const useAuthState = () => {
    return useHookstate(authState);
};
