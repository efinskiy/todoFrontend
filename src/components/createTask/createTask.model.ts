import { sendCreateTask, Task } from '../../api/tasks.ts';
import { AxiosError } from 'axios';
import { CommonAPIError } from '../../api/responses.ts';
import { State } from '@hookstate/core';

export interface CreateTaskData {
    title: string;
    description: string;
}

const removeTempTask = (tasksState: State<Task[]>) => {
    tasksState.set((prev) => prev.filter((i) => i.id !== 0));
};
const pushToTasksState = (tasksState: State<Task[]>, task: Task) => {
    tasksState.set((prev) => [...prev, task]);
};
const handleApiError =
    (
        setError: (a: boolean) => void,
        setErrorText: (a: string) => void,
        tasksState: State<Task[]>
    ) =>
    (err: AxiosError) => {
        // Выставляем флаг ошибки
        setError(true);
        // Удаляем времменую запись задачи из стейта
        removeTempTask(tasksState);

        // Если ошибка пришла с бэка, в axios будут status и response
        if (err.status && err.response) {
            const response = err.response.data as CommonAPIError;
            // Выводим тело ошибки в консоль
            console.log(response);
            // Для каждого возможной ошибки выводим необходимый текст ошибки
            switch (err.status) {
                case 500:
                    setErrorText(
                        'Произошла серверная ошибка. Попробуйте позже.'
                    );
                    break;
                case 422:
                    setErrorText(
                        'Произошла ошибка при валидации введенных данных.'
                    );
                    break;
            }
        }
    };

export const createTask =
    (
        setError: (a: boolean) => void,
        setErrorText: (a: string) => void,
        tasksState: State<Task[]>,
        taskInfo: CreateTaskData,
        setTaskInfo: (a: CreateTaskData) => void
    ) =>
    () => {
        // Название задачи должно быть > 3
        if (!(taskInfo.title.trim().length >= 3)) {
            setError(true);
            setErrorText('Название задачи должно быть 3 или символа');
            return;
        }
        // Описание задачи должно быть > 3
        if (!(taskInfo.description.trim().length >= 3)) {
            setError(true);
            setErrorText('Описание задачи должно быть 3 или более символа');
            return;
        }
        // Оптимистично добавляем созданную задачу в глобальный стейт
        tasksState.set((p) => [
            ...p,
            {
                id: 0,
                title: taskInfo.title,
                description: taskInfo.description,
                is_done: false,
                // Убираем Z в конце iso строки для соответствия формату данных с бэкэнда
                created_at: new Date().toISOString().replace('Z', ''),
            },
        ]);
        // Отправляем запрос на бэк, на добавление задачи
        sendCreateTask({
            title: taskInfo.title,
            description: taskInfo.description,
        })
            .then((res) => {
                // Если бэк окнул и вернул новую задачу,
                // убираем временную заглушку, и пушим новую запись в стейт
                removeTempTask(tasksState);
                pushToTasksState(tasksState, res.data);
            })
            .catch((err: AxiosError) => {
                // Если пришла ошибка с бэка - отправляем ее в обработчик
                handleApiError(setError, setErrorText, tasksState)(err);
            });

        setTaskInfo({ title: '', description: '' });
    };
