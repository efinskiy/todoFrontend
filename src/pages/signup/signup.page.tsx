import css from './signup.module.css';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { formOnSubmit, LoginFormError, SignupForm } from './signup.model.ts';

export const SignupPage = () => {
    const [signupForm, setSignupForm] = useState<SignupForm>({
        username: '',
        password: '',
        password_confirmation: '',
    });

    const [signupFormError, setSignupFormError] = useState<LoginFormError>({
        username: false,
        password: false,
        confirmation_error: false,
    });
    const [serverResponse, setServerResponse] = useState<string | undefined>(
        undefined
    );

    const navigate = useNavigate();

    const loginOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        if (username) {
            setSignupForm((prevState) => ({ ...prevState, username }));
        }
    };
    const passwordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        if (password) {
            setSignupForm((prevState) => ({ ...prevState, password }));
        }
    };
    const confirmationOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password_confirmation = e.target.value;
        if (password_confirmation) {
            setSignupForm((prevState) => ({
                ...prevState,
                password_confirmation,
            }));
        }
    };

    return (
        <div className={css.login_container}>
            <h3>Регистрация</h3>
            <div className={css.credentials}>
                <div className={css.field}>
                    <label htmlFor="login">Логин</label>
                    <input id={'login'} type="text" onChange={loginOnChange} />
                    {signupFormError.username && (
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
                    {signupFormError.password && (
                        <span>Пароль должен быть более 5х символов.</span>
                    )}
                </div>
                <div className={css.field}>
                    <label htmlFor="password">Подтвердите пароль</label>
                    <input
                        id={'password'}
                        type="password"
                        onChange={confirmationOnChange}
                    />
                    {signupFormError.confirmation_error && (
                        <span>Пароли не совпадают.</span>
                    )}
                </div>
                <div className={css.buttons}>
                    <button
                        onClick={formOnSubmit(
                            signupForm,
                            setSignupFormError,
                            setServerResponse
                        )}
                    >
                        Зарегистрироваться
                    </button>
                </div>
                <div className={css.buttons}>
                    <button onClick={() => navigate('/login')}>Назад</button>
                </div>
                {serverResponse && <span>{serverResponse}</span>}
            </div>
        </div>
    );
};
