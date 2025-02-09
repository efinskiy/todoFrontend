import { Task } from '../../api/tasks.ts';
import css from './task.module.css';
import { useTasksState } from '../../stores/tasks.ts';
import { onTaskDelete, onTaskStatusChange } from './task.model.ts';

interface TaskProps {
    task: Task;
}

export const TaskComponent = ({ task }: TaskProps) => {
    const tasksState = useTasksState();

    return (
        <div className={css.component}>
            <div className={css.task_header}>
                <h3>{task.title}</h3>
                <div className={css.task_status}>
                    <p>{task.is_done ? 'Выполнено' : 'Не выполнено'}</p>
                    <button onClick={onTaskStatusChange(tasksState, task)}>
                        {task.is_done ? 'Вернуть' : 'Завершить'}
                    </button>
                    <button onClick={onTaskDelete(tasksState, task)}>
                        Удалить
                    </button>
                </div>
            </div>
            <p className={css.task_description}>{task.description}</p>
            <p>Создано: {new Date(task.created_at + 'Z').toLocaleString()}</p>
        </div>
    );
};
