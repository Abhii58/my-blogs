import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            return token ? jwtDecode(token) : null;
        } catch (error) {
            localStorage.removeItem('token');
            return null;
        }
    });

    const value = {
        user,
        login: (token) => {
            localStorage.setItem('token', token);
            setUser(jwtDecode(token));
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
