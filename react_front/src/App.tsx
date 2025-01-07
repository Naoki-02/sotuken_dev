// App.js
import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import AboutPage from './pages/AboutPage';
import AuthForm from './pages/authForm';
import CameraApp from './pages/camera';
import FoodListPage from './pages/FoodListPage';
import CookingHistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import Logout from './pages/LogoutPage';
import MultiIngredientForm from './pages/multi-ingredient-form';
import SurveyPage from './pages/SurveyPage';
import { AuthProvider } from './services/AuthContext';
import ProtectedRoute from './services/protectedRoute';
import RecipePage from './services/recipe-get';

function App() {
  return (
    <AuthProvider>  {/* AuthProviderを追加 */}
      <Routes>
        <Route path="/" element={<Layout children={<Outlet />} />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthForm />} />
          <Route path="about" element={<AboutPage />} />
          {/* 保護されたルート */}
          <Route element={<ProtectedRoute />} >
            <Route path="multi-ingredient-form" element={<MultiIngredientForm />} />
            <Route path="food-list" element={<FoodListPage />} />
            <Route path="survey" element={<SurveyPage />} />
            <Route path="logout" element={<Logout />} />
            <Route path="camera" element={<CameraApp />} />
            <Route path='recipe' element={<RecipePage />} />
            <Route path="history" element={<CookingHistoryPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

