import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { token, setAuthData } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthData({ token: null });
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static"> {/* Positions the AppBar at the top */}
        <Toolbar>
          {/* App Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>

          {/* Navigation Links */}
          {!token ? (
            <>
              <NavLink to="/login" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    Login
                  </Button>
                )}
              </NavLink>
              <NavLink to="/register" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    Register
                  </Button>
                )}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" end style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    Home
                  </Button>
                )}
              </NavLink>
              <NavLink to="/projects" style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    color="inherit"
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                    }}
                  >
                    Projects
                  </Button>
                )}
              </NavLink>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;