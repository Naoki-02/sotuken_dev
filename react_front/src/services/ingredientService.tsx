import apiClient from './apiClient';
import { getCsrfToken } from './csrf';

// Ingredientsを保存するAPIリクエスト
export const saveIngredient = async (data: any) => {  // dataの型を指定
    const csrfToken = getCsrfToken();  // CSRFトークンを取得

    const response = await apiClient.post('ingredients/', data, {
        headers: {
            'X-CSRFToken': csrfToken,  // CSRFトークンをリクエストヘッダーに含める
        },
    });

    return response.data;
};
