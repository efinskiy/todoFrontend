export const _BASE_URL = (() =>
    import.meta.env.PROD
        ? 'https://todo.efinskiy.ru/api'
        : 'http://localhost:8000/api')();
