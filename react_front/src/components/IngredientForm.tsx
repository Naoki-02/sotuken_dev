import React from 'react';

const IngredientForm = ({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="ingredient-form-group">
            <label>{label}:</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
};

export default IngredientForm;
