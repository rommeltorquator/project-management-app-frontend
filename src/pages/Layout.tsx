import { ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      {children || <Outlet />}
      <p>Footer</p>
    </Suspense>
  );
};

export default Layout;