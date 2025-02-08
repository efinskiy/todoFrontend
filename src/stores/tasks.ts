import { hookstate, useHookstate } from '@hookstate/core';
import { Task } from '../api/tasks.ts';
import { TaskFilters } from '../components/taskFilters/taskFilters.component.tsx';

const tasksState = hookstate<Task[]>([]);

export const useTasksState = () => {
    return useHookstate(tasksState);
};

const filtersState = hookstate<TaskFilters>({
    status_filter: 'Не выбран',
    created_sort: 'Не выбран',
});

export const useFiltersState = () => {
    return useHookstate(filtersState);
};
