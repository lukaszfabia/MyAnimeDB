import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/const";
import api from "../scripts/api";
import { Navigate } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";


const AuthContext = createContext({
    isAuth: false,
    auth: () => Promise.resolve(),
});

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        auth().catch((e) => {
            console.log(e);
            setIsAuth(false);
        });
    });

    const refreshToken = async () => {
        try {
            const response = api.post("/api/token/refresh/", {
                refresh: localStorage.getItem(REFRESH_TOKEN),
            });

            if ((await response).status === 200) {
                localStorage.setItem(ACCESS_TOKEN, (await response).data.access);
                setIsAuth(true);
            } else {
                setIsAuth(false);
            }

        } catch (e) {
            setIsAuth(false);
            console.log(e);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuth(false);
            return;
        }
        const decodedToken = jwtDecode(token) as JwtPayload;
        const expireDate = decodedToken.exp as number;
        const now = Date.now() / 1000;
        if (now >= expireDate) {
            await refreshToken();
        } else {
            setIsAuth(true);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuth, auth }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);
