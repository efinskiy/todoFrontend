import { sendSignup } from '../../api/login.ts';
import { AxiosError } from 'axios';
import { CommonAPIError } from '../../api/responses.ts';

export interface SignupForm {
    username: string;
    password: string;
    password_confirmation: string;
}

export interface LoginFormError {
    username: boolean;
    password: boolean;
    confirmation_error: boolean;
}

export const formOnSubmit =
    (
        signupForm: SignupForm,
        setSignupFormError: (a: LoginFormError) => void,
        setServerResponse: (a: string) => void
    ) =>
    () => {
        const invalidUsername = signupForm.username.trim().length < 3;
        const invalidPassword = signupForm.password.trim().length < 5;
        const invalidConfirmation =
            signupForm.password.trim() !==
            signupForm.password_confirmation.trim();

        setSignupFormError({
            password: invalidPassword,
            username: invalidUsername,
            confirmation_error: invalidConfirmation,
        });

        if (!invalidUsername && !invalidPassword && !invalidConfirmation) {
            sendSignup(signupForm)
                .then((d) => {
                    setServerResponse(d.data.msg);
                })
                .catch((err: AxiosError) => {
                    if (err.status && err.response) {
                        const response = err.response.data as CommonAPIError;
                        setServerResponse(response.detail);
                    }
                });
        }
    };
