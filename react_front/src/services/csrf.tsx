// CSRFトークンをCookieから取得するヘルパー関数
export const getCsrfToken = () => {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : null;
};
