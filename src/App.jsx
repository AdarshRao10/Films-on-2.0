import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
//import supabase from './supabaseClient';
import CartSuccess from './components/CartSuccess';
// Customer imports
import CustomerLayout from './layouts/CustomerLayout1';
import Home from './components/Home';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Sidebar from './components/Sidebar';
// import CartDrawer from './components/CartDrawer';
import Account from './components/Account';
import RegularMovies from './components/RegularMovies';
import RegularMovieDetail from './components/RegularMovieDetail';
import AdultMovies    from './components/AdultMovies';
import AdultMovieDetail  from './components/AdultMoviesDetail';
import NewArrivals    from './components/NewArrivals';
import StaffPicks     from './components/StaffPicks';
import ComingSoon     from './components/ComingSoon';
import OtherServices  from './components/OtherServices';
import Orders from './components/Orders';
// import SearchResults  from './components/SearchResults';
import Contact        from './components/Contact';
import About          from './components/About';
import Login          from './components/Login';
import Register       from './components/Register';
import RequireAuth    from './components/RequireAuth';
import CartPage from './components/CartPage';
import ServiceRequest from "./components/ServiceRequest";

//import ForgotPassword from './components/ForgotPassword';

// Admin imports
import RequireAdmin      from './components/RequireAdmin';
import AdminLayout       from './admin/AdminLayout';
import ItemList          from './admin/ItemList';
import AdultItemList     from './admin/AdultItemList';
import NewItemForm       from './admin/NewItemForm';
import EditItemForm      from './admin/EditItemForm';



function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCartOpen, setCartOpen]       = useState(false);
  

  return (
    
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer portal */}
            <Route
              element={
                <CustomerLayout
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={() => setSidebarOpen(v => !v)}
                  isCartOpen={isCartOpen}
                  toggleCart={() => setCartOpen(v => !v)}
                />
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="account" element={<Account />} />
              <Route path="orders" element={<Orders />} />
              <Route path="movies" element={<RegularMovies />} />
              <Route path="movies/:regSerialNo" element={<RegularMovieDetail />} />
              <Route path="adult-movies" element={<AdultMovies />} />
              <Route path="adult-movies/:adultSerialNo" element={<AdultMovieDetail />} />
              <Route path="new-arrivals" element={<NewArrivals />} />
              <Route path="staff-picks" element={<StaffPicks />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="other-services" element={<OtherServices />} />
              {/* <Route path="search" element={<SearchResults />} /> */}
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              <Route path="/cart-success" element={<CartSuccess />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/movies/:id" element={<RegularMovieDetail />} />
              <Route path="/adult-movies/:id" element={<AdultMovieDetail />} />
              <Route path="/service-request" element={<ServiceRequest />} />
              {/* Public auth routes */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Protected customer-only */}
              <Route
                path="account"
                element={
                  <RequireAuth>
                    {/* <Account /> */}
                  </RequireAuth>
                }
              />
              <Route
                path="orders"
                element={
                  <RequireAuth>
                    {/* <Orders /> */}
                  </RequireAuth>
                }
              />
            </Route>

            {/* Admin portal */}
            <Route
              path="admin/*"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              
              {/* Regular titles */}
              <Route index                           element={<ItemList />} />
              <Route path="items"                    element={<ItemList />} />
              <Route path="items/new"                element={<NewItemForm />} />
              <Route path="items/:RegSerialNo/edit"  element={<EditItemForm />} />

              {/* Adult titles */}
              <Route path="adult/items"                    element={<AdultItemList />} />
              <Route path="adult/items/new"                element={<NewItemForm />} />
              <Route path="adult/items/:AdultSerialNo/edit" element={<EditItemForm />} />




              {/* <Route index element={<ItemList />} />
              <Route path="admin/items" element={<ItemList />} />
              <Route path="adult/items" element={<AdultItemList />} />
              <Route path="adult/items/new" element={<NewItemForm />} />
              <Route path="/admin/adult/items/new" element={<NewItemForm />} />
              <Route path="items/:serialno/edit" element={<EditItemForm />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>    
  );
}

export default App;
