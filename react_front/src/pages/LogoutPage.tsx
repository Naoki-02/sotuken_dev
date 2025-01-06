import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Logout: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const logoutPage = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // console.log('Token found:', token);
                try {
                    // ログアウトAPIへのリクエスト
                    await axios.post('http://localhost:80/api/auth/logout/', null, {
                        headers: {
                            Authorization: `${token}`,
                            // CSRFトークンが必要な場合に追加
                            // 'X-CSRFToken': csrftoken,
                        },
                        withCredentials: true,  // CSRF保護を考慮
                    });
                    // 認証情報をクリア
                    logout();
                    // ログアウト後にリダイレクト
                    navigate('/auth');
                } catch (error) {
                    console.error('Logout failed:', (error as any).response?.data);
                    // ログアウト失敗時にユーザーをログインページへリダイレクト
                }
            } else {
                // トークンがない場合にもリダイレクト
                console.log('No token found');
            }
        };

        logoutPage();
    }, [logout, navigate]);

    return <div>ログアウトしています...</div>;
};

export default Logout;
