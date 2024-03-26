import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Navbar = () => {
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate()

  const handleLogout = () => {
    setCookie('access_token', '');
    window.localStorage.removeItem("userid");
    navigate('/login')
  };

  return (
    <div className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">Recipes</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to='/' className="text-white hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to='/create' className="text-white hover:text-gray-300">Create Recipe</Link>
          </li>
          {/* Conditionally render the "Saved Recipe" link */}
          {cookies.access_token && (
            <li>
              <Link to='/saved' className="text-white hover:text-gray-300">Saved Recipe</Link>
            </li>
          )}
          {!cookies.access_token ? (
            <li>
              <Link to='/login' className="text-white hover:text-gray-300">Login</Link>
            </li>
          ) : (
            <li>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
