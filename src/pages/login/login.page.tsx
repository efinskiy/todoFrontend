import css from './login.module.css';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { LoginForm, LoginFormError } from './login.model.ts';
import { sendLogin } from '../../api/login.ts';
import { authUser } from '../../stores/auth.ts';
import { AxiosError } from 'axios';
import { CommonAPIError } from '../../api/responses.ts';

export const LoginPage = () => {
    const [loginForm, setLoginForm] = useState<LoginForm>({
        username: '',
        password: '',
    });
    const [loginFormError, setLoginFormError] = useState<LoginFormError>({
        username: false,
        password: false,
    });
    const [serverResponse, setServerResponse] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (loginForm.username.trim().length < 3) {
            setLoginFormError((prev) => ({ ...prev, username: true }));
        } else {
            setLoginFormError((prev) => ({ ...prev, username: false }));
        }

        if (loginForm.password.trim().length < 5) {
            setLoginFormError((prev) => ({ ...prev, password: true }));
        } else {
            setLoginFormError((prev) => ({ ...prev, password: false }));
        }
    }, [loginForm, loginFormError.password, loginFormError.username]);

    const loginOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        if (username) {
            setLoginForm((prevState) => ({ ...prevState, username }));
        }
    };
    const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        if (password) {
            setLoginForm((prevState) => ({ ...prevState, password }));
        }
    };
    const formOnSubmit = () => {
        const validUsername = loginForm.username.trim().length < 3;
        const validPassword = loginForm.password.trim().length < 5;

        setLoginFormError({ password: validPassword, username: validUsername });

        if (!validUsername && !validPassword) {
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
    return (
        <div className={css.login_container}>
            <h3>Авторизация</h3>
            <div className={css.credentials}>
                <div className={css.field}>
                    <label htmlFor="login">Логин</label>
                    <input id={'login'} type="text" onChange={loginOnChange} />
                    {loginFormError.username && (
                        <span>Логин должен быть более 3х символов.</span>
                    )}
                </div>
                <div className={css.field}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        id={'password'}
                        type="password"
                        onChange={passwordOnChange}
                    />
                    {loginFormError.password && (
                        <span>Пароль должен быть более 5х символов.</span>
                    )}
                </div>
                <div className={css.buttons}>
                    <button onClick={formOnSubmit}>Войти</button>
                    <Link to={'/signup'}>
                        <button>Зарегистрироваться</button>
                    </Link>
                </div>
                {serverResponse && <span>{serverResponse}</span>}
            </div>
        </div>
    );
};
