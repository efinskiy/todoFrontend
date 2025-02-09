import { sendLogin } from '../../api/login.ts';
import { authUser } from '../../stores/auth.ts';
import { AxiosError } from 'axios';
import { CommonAPIError } from '../../api/responses.ts';

export interface LoginForm {
    username: string;
    password: string;
}

export interface LoginFormError {
    username: boolean;
    password: boolean;
}

export const formOnSubmit =
    (
        loginForm: LoginForm,
        setLoginFormError: (a: LoginFormError) => void,
        setServerResponse: (a: string | undefined) => void
    ) =>
    () => {
        const invalidUsername = loginForm.username.trim().length < 3;
        const invalidPassword = loginForm.password.trim().length < 5;

        setLoginFormError({
            password: invalidPassword,
            username: invalidUsername,
        });

        if (!invalidUsername && !invalidPassword) {
            sendLogin(loginForm)
                .then((d) => {
                    authUser(d.data);
                })
                .then(() => (window.location.href = '/'))
                .catch((err: AxiosError) => {
                    if (err.status && err.response) {
                        const response = err.response.data as CommonAPIError;
                        setServerResponse(response.detail);
                    }
                });
        }
    };
