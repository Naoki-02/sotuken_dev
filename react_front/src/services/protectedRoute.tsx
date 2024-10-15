import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // AuthContextをインポート

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // 認証されていない場合はログインページにリダイレクト
        return <Navigate to="/auth" />;
    }

    // 認証されている場合は指定されたルート（/home）にアクセス可能
    return <Outlet />;
};

export default ProtectedRoute;
