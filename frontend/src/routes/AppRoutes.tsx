import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home';
import ProductListing from '../pages/ProductListing';
import ProductDetail from '../pages/ProductDetail';
import Checkout from '../pages/Checkout';
import DashboardLayout from '../pages/Dashboard/DashboardLayout';
import Profile from '../pages/Dashboard/Profile';
import Addresses from '../pages/Dashboard/Addresses';
import Wishlist from '../pages/Dashboard/Wishlist';
import Orders from '../pages/Dashboard/Orders';
import PaymentMethods from '../pages/Dashboard/PaymentMethods';
import CartPage from '../pages/Cart';
import Auth from '../pages/Auth';
import AdminLayout from '../pages/Admin/AdminLayout';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminProducts from '../pages/Admin/Products';
import AdminOrders from '../pages/Admin/AdminOrders';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'products',
        element: <ProductListing />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Profile />, 
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'addresses',
            element: <Addresses />,
          },
          {
            path: 'wishlist',
            element: <Wishlist />,
          },
          {
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'payments',
            element: <PaymentMethods />,
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: 'products',
            element: <AdminProducts />,
          },
          {
            path: 'orders',
            element: <AdminOrders />,
          },
        ],
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
