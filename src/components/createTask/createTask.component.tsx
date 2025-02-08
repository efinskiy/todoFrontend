import { useTasksState } from '../../stores/tasks.ts';
import css from './createTask.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { sendCreateTask, Task } from '../../api/tasks.ts';
import { AxiosError } from 'axios';
import { CommonAPIError } from '../../api/responses.ts';

interface CreateTaskData {
    title: string;
    description: string;
}

export const CreateTaskComponent = () => {
    const tasksState = useTasksState();

    const [taskInfo, setTaskInfo] = useState<CreateTaskData>({
        description: '',
        title: '',
    });
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');

    const formOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        switch (e.target.id) {
            case 'title':
                setTaskInfo((prev) => ({ ...prev, title: e.target.value }));
                break;
            case 'description':
                setTaskInfo((prev) => ({
                    ...prev,
                    description: e.target.value,
                }));
                break;
        }
    };

    useEffect(() => {
        // Если был выставлен флаг error, ждем 5 секунд, и убираем его
        if (error) {
            const timer = setTimeout(() => {
                setError(false);
            }, 5000);

            // Очистка таймера при размонтировании или изменении error
            return () => clearTimeout(timer);
        }
    }, [error]);

    const removeTempTask = () => {
        tasksState.set((prev) => prev.filter((i) => i.id !== 0));
    };
    const pushToTasksState = (task: Task) => {
        tasksState.set((prev) => [...prev, task]);
    };
    const handleApiError = (err: AxiosError) => {
        // Выставляем флаг ошибки
        setError(true);
        // Удаляем времменую запись задачи из стейта
        removeTempTask();

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

    const createTask = () => {
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
                removeTempTask();
                pushToTasksState(res.data);
            })
            .catch((err: AxiosError) => {
                // Если пришла ошибка с бэка - отправляем ее в обработчик
                handleApiError(err);
            });

        setTaskInfo({ title: '', description: '' });
    };

    return (
        <div className={css.component}>
            {error && <span>{errorText}</span>}
            <div className={css.input_container}>
                <label htmlFor="">Название</label>
                <input
                    id={'title'}
                    type={'text'}
                    value={taskInfo.title}
                    onChange={formOnChange}
                />
            </div>
            <div className={css.input_container}>
                <label htmlFor="">Описание</label>
                <input
                    id={'description'}
                    type={'text'}
                    value={taskInfo.description}
                    onChange={formOnChange}
                />
            </div>
            <button onClick={createTask}>Создать</button>
        </div>
    );
};
