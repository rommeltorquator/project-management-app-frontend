import { ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Box } from '@mui/material';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
    }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          {children || <Outlet />}
        </Box>
        <Footer />
      </Suspense>
    </Box>
  );
};

export default Layout;