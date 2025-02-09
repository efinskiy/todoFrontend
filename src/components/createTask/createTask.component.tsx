import { useTasksState } from '../../stores/tasks.ts';
import css from './createTask.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { createTask, CreateTaskData } from './createTask.model.ts';

export const CreateTaskComponent = () => {
    const tasksState = useTasksState();

    const [taskInfo, setTaskInfo] = useState<CreateTaskData>({
        description: '',
        title: '',
    });
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');

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
            <button
                onClick={createTask(
                    setError,
                    setErrorText,
                    tasksState,
                    taskInfo,
                    setTaskInfo
                )}
            >
                Создать
            </button>
        </div>
    );
};
