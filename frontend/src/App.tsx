import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import AddLaundry from './pages/AddLaundry';
import Clients from './pages/Clients';
import AddClient from './pages/AddClient';
import AddDeliveryPerson from './pages/AddDeliveryPerson';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import SubscriptionPlans from './pages/SubscriptionPlans';
import PaymentManagement from './pages/PaymentManagement';
import Delivery from './pages/Deliveries';
import Reports from './pages/admin/Reports';
import Analytics from './pages/admin/Analytics';
import ItemType from './pages/admin/ItemsType';
import BusinessType from './pages/admin/BusinessType';
import AddBusinessType from './pages/admin/AddBusinessType';
import AddItemType from './pages/admin/AddItemType';
import PlanManagement from './pages/admin/PlanTypeManagement';
import AddPlanManagement from './pages/admin/AddPlanTypeManagement';
import SubscriptionHistory from './pages/SubscriptionHistory';
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import { ToastContainer } from 'react-toastify'; // ✅ import
import 'react-toastify/dist/ReactToastify.css'; // ✅ import CSS
const stripePromise = loadStripe('pk_test_51IQRDWCAdjkjmQbBkMG0xa5XDn4BGpFduMKzfk25bhTc5JG5l4Xbu00ZRsk3qgukyuOlxBOBE72Na32ao4usjOR100n0h8flRd'); // Replace with your real key
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
              <Route 
                path="/admin/plans" 
                element={
                  <ProtectedRoute>
                    <PlanManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/plans/add" 
                element={
                  <ProtectedRoute>
                    <AddPlanManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
              path="/admin/items-type" 
              element={
                <ProtectedRoute>
                  <ItemType />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/items-type/add" 
              element={
                <ProtectedRoute>
                  <AddItemType />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/business-type" 
              element={
                <ProtectedRoute>
                  <BusinessType />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/business-type/add" 
              element={
                <ProtectedRoute>
                  <AddBusinessType />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/add" 
              element={
                <ProtectedRoute>
                  <AddLaundry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clients/add" 
              element={
                <ProtectedRoute>
                  <AddClient />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/delivery-person/add" 
              element={
                <ProtectedRoute>
                  <AddDeliveryPerson />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delivery-person/" 
              element={
                <ProtectedRoute>
                  <Delivery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription-history/" 
              element={
                <ProtectedRoute>
                  <SubscriptionHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/support" 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faq" 
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              } 
            />

            <Route 
                path="/subscription-plans" 
                element={
                  <ProtectedRoute>
                    <SubscriptionPlans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payments" 
                element={
                  <ProtectedRoute>
                    <Elements stripe={stripePromise}>
                      <PaymentManagement/>
                    </Elements>
                  </ProtectedRoute>
                } 
              />
            <Route path="*" element={<NotFound />} />
          </Routes>
           <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;