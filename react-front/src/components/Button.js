// components/Button.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Button.css'; // ボタンのスタイルを適用する場合

const Button = ({ to, children }) => {
    return (
        <Link to={to} className="button-link">
            {children}
        </Link>
    );
};

export default Button;
