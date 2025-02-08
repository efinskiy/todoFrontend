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
