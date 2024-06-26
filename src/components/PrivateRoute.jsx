// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';

const PrivateRoute = ({ children }) => {
  const [user] = useAuthState(auth);

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
