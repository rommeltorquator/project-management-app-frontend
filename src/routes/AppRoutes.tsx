import { lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProjectDetail from '../pages/ProjectDetail';

const Layout = lazy(() => import('../pages/Layout'));
const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Projects = lazy(() => import('../pages/Projects'));
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },      
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'not-found',
        element: <NotFound />
      },
      {
        path: 'projects',
        element: (
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        )
      },
      {
        path: 'projects/:id',
        element: (
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        ),
      }
    ]
  }
])

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
