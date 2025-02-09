import css from './login.module.css';
import { Link } from 'react-router';
import { useState } from 'react';
import { formOnSubmit, LoginForm, LoginFormError } from './login.model.ts';

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
                    <button
                        onClick={formOnSubmit(
                            loginForm,
                            setLoginFormError,
                            setServerResponse
                        )}
                    >
                        Войти
                    </button>
                    <Link to={'/signup'}>
                        <button>Зарегистрироваться</button>
                    </Link>
                </div>
                {serverResponse && <span>{serverResponse}</span>}
            </div>
        </div>
    );
};
