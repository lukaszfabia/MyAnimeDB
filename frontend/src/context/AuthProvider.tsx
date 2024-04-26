import React, { createContext, useState, useContext, ReactNode } from "react";

// Tworzymy kontekst autoryzacji
const defaultValue = {
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
};


const AuthContext = createContext(defaultValue);

// Dostawca autoryzacji
const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Stan autoryzacji
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Funkcja do logowania
    const login = () => {
        // Logika do logowania, np. wysłanie żądania do serwera
        setIsAuthenticated(true);
    };

    // Funkcja do wylogowywania
    const logout = () => {
        // Logika do wylogowywania, np. wysłanie żądania do serwera
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Własny hook do użycia kontekstu autoryzacji
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
