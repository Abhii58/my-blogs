import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ adminOnly }) => {
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
