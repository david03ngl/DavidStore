import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/home';
import ProductCategoriesPage from './pages/productCategories';
import ProductCategoryDetails from './pages/productCategories/components/ProductCategoryDetails';
import ProductsPage from './pages/products';
import ProductDetails from './pages/products/components/ProductIDetails';
import ShopsPage from './pages/shop';
import ShopDetails from './pages/shop/components/ShopDetails';
import CategoriesPage from './pages/categories';
import CategoryDetails from './pages/categories/components/CategoryDetails';
import Login from './pages/sign/login';
import Register from './pages/sign/register';
import CartPage from './pages/cart';
import ProfilePage from './pages/profile';
import SearchPage from './pages/shop/search';
import AuthGuardedRoute from './pages/AuthGuardedRoute';

import './App.css';

const App = () => (
    <Routes>
        <Route element={<Layout />}>
            <Route path='/' element={<Login />} />
            <Route path='productCategories'>
                <Route index element={<ProductCategoriesPage />} />
                <Route path=':id' element={<ProductCategoryDetails />} /> 
            </Route>
            <Route path='products'>
                <Route index element={<ProductsPage />} />
                <Route path=':id' element={<ProductDetails />} />
            </Route>
            <Route path='shops'>
                <Route index element={<ShopsPage />} />
                <Route path=':id' element={<ShopDetails />} />
                <Route path='categories'>
                    <Route index element={<CategoriesPage />} />
                    <Route path=':category' element={<CategoryDetails />} />
                </Route>
                <Route path='search' element={<SearchPage />} />
            </Route>
            <Route path='cart' element={<CartPage />} />

            <Route element={<AuthGuardedRoute />}>
                <Route path='profile' element={<ProfilePage />} />
            </Route>
        </Route>

        <Route path='home' element={<HomePage />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<Navigate to='/' />} />
    </Routes>
);

export default App;
