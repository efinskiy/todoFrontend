import css from './taskFilters.module.css';
import { useFiltersState } from '../../stores/tasks.ts';

export interface TaskFilters {
    status_filter: string;
    created_sort: string;
}

export const TaskFiltersComponent = () => {
    const filtersState = useFiltersState();
    // Обработчики изменения фильтров
    const handleCreatedFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        filtersState.set((prev) => ({ ...prev, created_sort: e.target.value }));
    };

    const handleStatusFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        filtersState.set((prev) => ({
            ...prev,
            status_filter: e.target.value,
        }));
    };

    // Функция сброса фильтров (отменяем фильтрацию и возвращаем исходный список)
    const resetFilters = () => {
        filtersState.set((prev) => ({ ...prev, status_filter: 'Не выбран' }));
        filtersState.set((prev) => ({ ...prev, created_sort: 'Не выбран' }));
    };
    return (
        <div className={css.component}>
            <h3>Фильтры</h3>
            <div className={css.filters_list}>
                <div className={css.filter}>
                    <label htmlFor="created_filter">Создано</label>
                    <select
                        id="created_filter"
                        value={filtersState.created_sort.get()}
                        onChange={handleCreatedFilterChange}
                    >
                        <option>Не выбран</option>
                        <option>Сначала старые</option>
                        <option>Сначала новые</option>
                    </select>
                </div>
                <div className={css.filter}>
                    <label htmlFor="status_filter">Статус</label>
                    <select
                        id="status_filter"
                        value={filtersState.status_filter.get()}
                        onChange={handleStatusFilterChange}
                    >
                        <option>Не выбран</option>
                        <option>Выполнено</option>
                        <option>Не выполнено</option>
                    </select>
                </div>
            </div>
            <button onClick={resetFilters} className={css.reset_button}>
                Сбросить фильтры
            </button>
        </div>
    );
};
