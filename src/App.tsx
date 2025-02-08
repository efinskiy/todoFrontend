import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { useAuthState } from './stores/auth.ts';
import { GuardedRoute } from './components/guarded-route.tsx';
import { LoginPage } from './pages/login/login.page.tsx';
import { SignupPage } from './pages/signup/signup.page.tsx';
import { TasksPage } from './pages/tasks/tasks.page.tsx';
import { LogoutPage } from './pages/logout/logout.page.tsx';

function App() {
    const authState = useAuthState();

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <GuardedRoute
                    component={<TasksPage />}
                    auth={authState.isLoggedIn.get()}
                />
            ),
        },
        {
            path: '/login',
            element: <LoginPage />,
        },
        {
            path: '/signup',
            element: <SignupPage />,
        },
        {
            path: '/logout',
            element: <LogoutPage />,
        },
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
