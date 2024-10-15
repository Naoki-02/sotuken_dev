import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// 認証コンテキストの型
interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// 初期値としてnullを許容する
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProviderの型定義
interface AuthProviderProps {
    children: ReactNode;
}

// 認証状態を提供するプロバイダー
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // ページリロード時にlocalStorageのトークンを確認
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        // console.log('login token:', token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 認証状態を取得するためのフック
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
