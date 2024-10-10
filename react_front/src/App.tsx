// App.js
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import AboutPage from './pages/AboutPage';
import AddIngredientPage from './pages/AddIngredientPage';
import AuthForm from './pages/authForm';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import MultiIngredientForm from './pages/multi-ingredient-form';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout children={<Outlet />} />}>
        <Route index element={<HomePage />} />
        <Route path="auth" element={<AuthForm />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="add-ingredient" element={<AddIngredientPage />} />
        <Route path="multi-ingredient-form" element={<MultiIngredientForm />} />
      </Route>
    </Routes>
  );
}

export default App;

