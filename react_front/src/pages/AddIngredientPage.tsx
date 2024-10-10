import { Button } from '@/components/ui/button';
import { saveIngredient } from '@/services/ingredientService';
import { useState } from 'react';
import IngredientForm from '../components/IngredientForm';

const AddIngredientPage = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = {
            name: name,
            quantity: quantity,
            category: category,
        };

        try {
            await saveIngredient(data);
            alert('材料が正常に保存されました！');
            setName('');
            setQuantity('');
            setCategory('');
        } catch (error) {
            alert('材料の保存に失敗しました。');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>新しい材料を追加</h2>
            <form onSubmit={handleSubmit}>
                <IngredientForm label="名前" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <IngredientForm label="量" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <IngredientForm label="カテゴリ" type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                <Button type="submit">材料を保存</Button>
            </form>
        </div>
    );
};

export default AddIngredientPage;
