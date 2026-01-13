import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, ordersRes, coffeesRes] = await Promise.all([
                api.get('/orders/stats'),
                api.get('/orders'),
                api.get('/coffees')
            ]);

            setStats(statsRes.data.data);
            setOrders(ordersRes.data.data.slice(0, 5)); // Latest 5 orders
            setCoffees(coffeesRes.data.data.slice(0, 5)); // Latest 5 coffees
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            fetchData();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your BeanByte coffee shop</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats?.total_orders || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p className="stat-number warning">{stats?.pending || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Processing</h3>
                        <p className="stat-number info">{stats?.processing || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p className="stat-number success">{stats?.completed || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Revenue</h3>
                        <p className="stat-number">Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <Link to="/admin/coffees" className="btn btn-primary">
                            Manage Coffees
                        </Link>
                        <Link to="/admin/orders" className="btn btn-primary">
                            Manage Orders
                        </Link>
                        <Link to="/admin/users" className="btn btn-primary">
                            Manage Users
                        </Link>
                        <Link to="/admin/api-keys" className="btn btn-primary">
                            View All API Keys
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <Link to="/admin/orders" className="btn btn-secondary btn-sm">View All</Link>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Coffee</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id_order}>
                                        <td>#{order.id_order}</td>
                                        <td>{order.user_name}</td>
                                        <td>{order.nama_coffee}</td>
                                        <td>{order.quantity}x</td>
                                        <td>Rp {order.total_price.toLocaleString('id-ID')}</td>
                                        <td>
                                            <span className={`badge badge-${order.status === 'selesai' ? 'success' :
                                                    order.status === 'diproses' ? 'info' :
                                                        order.status === 'dibatalkan' ? 'error' : 'warning'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id_order, e.target.value)}
                                            >
                                                <option value="menunggu">Menunggu</option>
                                                <option value="diproses">Diproses</option>
                                                <option value="selesai">Selesai</option>
                                                <option value="dibatalkan">Dibatalkan</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Coffee Inventory */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2>Coffee Inventory</h2>
                        <Link to="/admin/coffees" className="btn btn-secondary btn-sm">Manage All</Link>
                    </div>

                    <div className="coffee-inventory-grid">
                        {coffees.map((coffee) => (
                            <div key={coffee.id_coffee} className="inventory-card">
                                <img src={coffee.gambar_url} alt={coffee.nama_coffee} />
                                <div className="inventory-info">
                                    <h4>{coffee.nama_coffee}</h4>
                                    <p className="inventory-price">Rp {coffee.harga.toLocaleString('id-ID')}</p>
                                    <p className="inventory-stock">Stock: {coffee.stok}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
