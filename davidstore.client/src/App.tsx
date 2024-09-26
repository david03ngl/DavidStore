import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/home';
import ProductCategoriesPage from './pages/productCategories';
import ProductCategoryDetails from './pages/productCategories/components/ProductCategoryDetails';
import ProductsPage from './pages/products';
import ProductDetails from './pages/products/components/ProductDetails';
import ProductAdds from './pages/products/components/ProductAdd';
import ShopsPage from './pages/shop';
import ShopDetails from './pages/shop/components/ShopDetails';
import Login from './pages/sign/login';
import Register from './pages/sign/register';
import CartPage from './pages/cart';
import SearchPage from './pages/shop/search';
import ProtectedRoute from './protectedRoute';

import './App.css';

const App = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path='/' element={<Login />} />
            <Route path='productCategories'>
                <Route index element={<ProtectedRoute role="Admin"><ProductCategoriesPage /></ProtectedRoute>} />
                <Route path=':id' element={<ProtectedRoute role="Admin"><ProductCategoryDetails /></ProtectedRoute>} /> 
            </Route>
            <Route path='products'>
                <Route index element={<ProtectedRoute role="Admin"><ProductsPage /></ProtectedRoute>} />
                <Route path='add' element={<ProtectedRoute role="Admin"><ProductAdds /></ProtectedRoute>} />
                <Route path=':id' element={<ProtectedRoute role="Admin"><ProductDetails /></ProtectedRoute>} />
            </Route>
            <Route path='shops'>
                <Route index element={<ProtectedRoute role="Customer"><ShopsPage /></ProtectedRoute>} />
                <Route path=':id' element={<ProtectedRoute role="Customer"><ShopDetails /></ProtectedRoute>} />
                <Route path='search' element={<SearchPage />} />
            </Route>
            <Route path='cart' element={<CartPage />} />
        </Route>

        <Route path='home' element={<HomePage />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<Navigate to='/' />} />
    </Routes>
);

export default App;
