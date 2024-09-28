import { lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PublicRoute from '../components/PublicRoute';

const Layout = lazy(() => import('../pages/Layout'));
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Projects = lazy(() => import('../pages/Projects'));
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const ProjectForm = lazy(() => import('../pages/ProjectForm'));
const TaskForm = lazy(() => import('../pages/TaskForm'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PublicRoute />
          </Suspense>
        ),
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            ),
          },
          {
            path: 'register',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            ),
          },
        ],
      },
      // Protected Routes
      {
        element: <ProtectedRoute><></></ProtectedRoute>,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: 'projects',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <Projects />
              </Suspense>
            )
          },
          {
            path: 'projects/new',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectForm />
              </Suspense>
            )
          },
          {
            path: 'projects/:id',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectDetail />
              </Suspense>
            )
          },
          {
            path: 'projects/:id/edit',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectForm />
              </Suspense>
            ),
          },
          {
            path: 'projects/:id/tasks/new',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <TaskForm />
              </Suspense>
            ),
          },
          {
            path: 'projects/:id/tasks/:taskId/edit',
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <TaskForm />
              </Suspense>
            ),
          },
        ],
      },
      // Not Found Route
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
