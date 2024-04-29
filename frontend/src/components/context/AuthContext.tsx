import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants/const';
import api from '../../scripts/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (accessToken: string | null, refreshToken: string | null) => void;
    login: (e: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem(ACCESS_TOKEN));
    const [refreshToken, setRefreshToken] = useState<string | null>(Cookies.get(REFRESH_TOKEN) || null);
    const navigate = useNavigate();

    const setTokens = (accessToken: string | null, refreshToken: string | null) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken || '');
        Cookies.set(REFRESH_TOKEN, refreshToken || '');
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    };

    const login = async (e: any) => {
        e.preventDefault();
        const response = await api.post('/api/token/', {
            username: e.target.username.value,
            password: e.target.password.value,
        });

        if (response.status !== 200) {
            alert('Invalid credentials');
            return;
        } else {
            setTokens(response.data.access, response.data.refresh);
            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('username', e.target.username.value);
            navigate(`/profile/${e.target.username.value}`)
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, setTokens, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};