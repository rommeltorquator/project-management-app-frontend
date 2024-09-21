import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Layout = lazy(() => import('../pages/Layout'));
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Projects = lazy(() => import('../pages/Projects'));
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const ProjectForm = lazy(() => import('../pages/ProjectForm'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public Routes
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      // Protected Routes
      {
        element: <ProtectedRoute><></></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'projects',
            element: <Projects />,
          },
          {
            path: 'projects/new',
            element: <ProjectForm />, // Route for creating a new project
          },
          {
            path: 'projects/:id',
            element: <ProjectDetail />,
          },
          {
            path: 'projects/:id/edit',
            element: <ProjectForm />, // Route for editing a project
          },
        ],
      },
      // Not Found Route
      {
        path: '*',
        element: <NotFound />,
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
