import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Giả sử role được lưu ở localStorage khi login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute; 