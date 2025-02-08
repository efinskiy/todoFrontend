import { deleteTask, Task, updateTask } from '../../api/tasks.ts';
import css from './task.module.css';
import { useTasksState } from '../../stores/tasks.ts';
import { AxiosError } from 'axios';

interface TaskProps {
    task: Task;
}

export const TaskComponent = ({ task }: TaskProps) => {
    const tasksState = useTasksState();

    const handleRequestError = (err: AxiosError) => {
        if (err.status && err.response) {
            switch (err.status) {
                case 500:
                    alert('Произошла серверная ошибка при выполнении запроса.');
                    break;
                case 422:
                    alert('Произошла ошибка при валидации данных на сервере.');
                    break;
            }
        }
    };

    const onTaskDelete = () => {
        // Сохраним текущую версию задачи для возможного отката
        const previousTask = tasksState.value.find((t) => t.id === task.id);
        // Перестаховка для линтера, в практике такой случай очень маловероятен.
        if (!previousTask) return;

        // Фикс для ошибки, когда при оптимистичном выполнении запроса
        // затирается значение task.id
        const task_id = task.id;

        // Оптимистично удаляем задачу
        tasksState.set((prev) => prev.filter((v) => v.id !== task.id));

        deleteTask(task_id).catch((err: AxiosError) => {
            // Откатываем изменения
            tasksState.set((prev) => [...prev, previousTask]);
            handleRequestError(err);
        });
    };

    const onTaskStatusChange = () => {
        // Сохраним текущую версию задачи для возможного отката
        const previousTask = tasksState.value.find((t) => t.id === task.id);
        // Перестаховка для линтера, в практике такой случай очень маловероятен.
        if (!previousTask) return;

        // Отправляем запрос на бэк
        updateTask(task.id, !task.is_done)
            .then((res) => {
                // Обновляем задачу данными, полученными с бэка
                tasksState.set((prev) =>
                    prev.map((t) => (t.id === task.id ? res.data : t))
                );
            })
            .catch((err: AxiosError) => {
                // При ошибке возвращаем предыдущие данные
                tasksState.set((prev) =>
                    prev.map((t) => (t.id === task.id ? previousTask : t))
                );
                handleRequestError(err);
            });

        // Оптимистично обновляем статус задачи
        tasksState.set((prev) =>
            prev.map((t) =>
                t.id === task.id ? { ...t, is_done: !t.is_done } : t
            )
        );
    };

    return (
        <div className={css.component}>
            <div className={css.task_header}>
                <h3>{task.title}</h3>
                <div className={css.task_status}>
                    <p>{task.is_done ? 'Выполнено' : 'Не выполнено'}</p>
                    <button onClick={onTaskStatusChange}>
                        {task.is_done ? 'Вернуть' : 'Завершить'}
                    </button>
                    <button onClick={onTaskDelete}>Удалить</button>
                </div>
            </div>
            <p className={css.task_description}>{task.description}</p>
            <p>Создано: {new Date(task.created_at + 'Z').toLocaleString()}</p>
        </div>
    );
};
