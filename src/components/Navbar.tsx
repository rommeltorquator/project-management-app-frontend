import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setAuthData } = useContext(AuthContext);

  const handleLogout = () => {
    setAuthData({ token: null });
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        {!token && (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Register
              </NavLink>
            </li>
          </>
        )}
        {token && (
          <>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/projects"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Projects
              </NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar