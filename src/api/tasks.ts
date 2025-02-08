import axios from 'axios';
import { API } from './routes.ts';
import { getHeaders } from './login.ts';
import { CommonAPIMessage } from './responses.ts';

export interface Task {
    id: number;
    title: string;
    description: string;
    is_done: boolean;
    created_at: string;
}

export interface TaskCreate {
    title: string;
    description: string;
}

export const getMyTasks = async () => {
    return await axios.get<Task[]>(API.tasks_get, {
        headers: getHeaders(),
    });
};

export const sendCreateTask = async ({ title, description }: TaskCreate) => {
    return await axios.post<Task>(
        API.tasks_create,
        {
            title,
            description,
        },
        {
            headers: getHeaders(),
        }
    );
};

export const updateTask = async (id: number, new_status: boolean) => {
    return await axios.patch<Task>(
        API.tasks_update(String(id)),
        {
            is_done: new_status,
        },
        {
            headers: getHeaders(),
        }
    );
};

export const deleteTask = async (id: number) => {
    return await axios.delete<CommonAPIMessage>(API.tasks_delete(String(id)), {
        headers: getHeaders(),
    });
};
