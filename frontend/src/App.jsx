import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderPage from './pages/OrderPage';
import Orders from './pages/Orders';
import ApiKeys from './pages/ApiKeys';
import ApiDocs from './pages/ApiDocs';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<LoginRedirect />} />
                            <Route path="/register" element={<RegisterRedirect />} />
                            <Route path="/api-docs" element={<ApiDocs />} />

                            {/* Protected Routes */}
                            <Route
                                path="/order/:id"
                                element={
                                    <PrivateRoute>
                                        <OrderPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <PrivateRoute>
                                        <Orders />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/api-keys"
                                element={
                                    <PrivateRoute>
                                        <ApiKeys />
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute adminOnly>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin/*"
                                element={
                                    <PrivateRoute adminOnly>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />

                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

// Redirect if already logged in
function LoginRedirect() {
    const { user } = useAuth();
    return user ? <Navigate to="/" replace /> : <Login />;
}

function RegisterRedirect() {
    const { user } = useAuth();
    return user ? <Navigate to="/" replace /> : <Register />;
}

function NotFound() {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn btn-primary">Go Home</a>
        </div>
    );
}

export default App;
