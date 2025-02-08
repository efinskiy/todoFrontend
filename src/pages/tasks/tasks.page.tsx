import { useEffect, useMemo } from 'react';
import { getMyTasks, Task } from '../../api/tasks.ts';
import css from './tasks.module.css';
import { useFiltersState, useTasksState } from '../../stores/tasks.ts';
import { CreateTaskComponent } from '../../components/createTask/createTask.component.tsx';
import { TaskComponent } from '../../components/task/task.component.tsx';
import { Link } from 'react-router';
import classNames from 'classnames';
import { TaskFiltersComponent } from '../../components/taskFilters/taskFilters.component.tsx';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export const TasksPage = () => {
    const tasksState = useTasksState();
    const filtersState = useFiltersState();

    useEffect(() => {
        getMyTasks().then((res) => tasksState.set(res.data));
    }, []);

    const filteredTasks = useMemo(() => {
        let filtered = tasksState.get();

        // Фильтрация по статусу
        if (filtersState.status_filter.get() !== 'Не выбран') {
            filtered = filtered.filter((task: Task) => {
                if (filtersState.status_filter.get() === 'Выполнено') {
                    return task.is_done;
                } else if (
                    filtersState.status_filter.get() === 'Не выполнено'
                ) {
                    return !task.is_done;
                }
                // ловим случай если фильтр еще не реализован,
                // возвращаем все значения
                return true;
            });
        }

        // Сортировка по дате создания
        if (filtersState.created_sort.get() !== 'Не выбран') {
            filtered = [...filtered].sort((a: Task, b: Task) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                if (filtersState.created_sort.get() === 'Сначала старые') {
                    return dateA - dateB;
                } else if (
                    filtersState.created_sort.get() === 'Сначала новые'
                ) {
                    return dateB - dateA;
                }
                // ловим случай если фильтр еще не реализован,
                // возвращаем все значения без изменения порядка
                return 0;
            });
        }

        return filtered;
    }, [tasksState, filtersState.status_filter, filtersState.created_sort]);

    return (
        <div className={css.container}>
            <div className={classNames(css.header, css.content_container)}>
                <h2>Мои задачи</h2>
                <Link to={'/logout'}>
                    <span>Выход</span>
                </Link>
            </div>

            <div className={classNames(css.content_container)}>
                <CreateTaskComponent />
            </div>

            <div className={css.content_container}>
                <TaskFiltersComponent />
            </div>

            <div className={classNames(css.content_container)}>
                <TransitionGroup className={css.tasks_container}>
                    {filteredTasks.map((task: Task) => (
                        <CSSTransition
                            key={task.id}
                            timeout={300}
                            classNames={{
                                enter: css.taskAppear,
                                enterActive: css.taskAppearActive,
                                exit: css.taskExit,
                                exitActive: css.taskExitActive,
                            }}
                        >
                            <TaskComponent task={task} key={task.id} />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>
        </div>
    );
};
