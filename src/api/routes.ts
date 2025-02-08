import { _BASE_URL } from '../config.ts';

export const API = {
    login: `${_BASE_URL}/v1/auth/login`,
    signup: `${_BASE_URL}/v1/auth/register`,

    tasks_get: `${_BASE_URL}/v1/task`,
    tasks_create: `${_BASE_URL}/v1/task`,
    tasks_update: (id: string) => `${_BASE_URL}/v1/task/${id}`,
    tasks_delete: (id: string) => `${_BASE_URL}/v1/task/${id}`,
};
