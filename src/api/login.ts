import { LoginForm } from '../pages/login/login.model.ts';
import axios from 'axios';
import { API } from './routes.ts';
import { SignupForm } from '../pages/signup/signup.model.ts';
import { CommonAPIMessage } from './responses.ts';
import Cookies from 'js-cookie';

export interface LoginResponse {
    access_token: string;
    expires: number;
}

export const getHeaders = () => {
    return { Authorization: `Bearer ${Cookies.get('access_token')}` };
};

export const sendLogin = async ({ username, password }: LoginForm) => {
    return await axios.post<LoginResponse>(API.login, {
        username,
        password,
    });
};

export const sendSignup = async ({ username, password }: SignupForm) => {
    return await axios.post<CommonAPIMessage>(API.signup, {
        username,
        password,
    });
};
