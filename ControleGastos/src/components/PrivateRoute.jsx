import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;