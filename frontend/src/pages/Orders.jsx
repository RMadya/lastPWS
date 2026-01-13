import { useState, useEffect } from 'react';
import api from '../services/api';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const params = filter ? { status: filter } : {};
            const response = await api.get('/orders', { params });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            menunggu: 'badge-warning',
            diproses: 'badge-info',
            selesai: 'badge-success',
            dibatalkan: 'badge-error'
        };
        return badges[status] || 'badge-info';
    };

    const getStatusText = (status) => {
        const texts = {
            menunggu: 'Pending',
            diproses: 'Processing',
            selesai: 'Completed',
            dibatalkan: 'Cancelled'
        };
        return texts[status] || status;
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track your coffee orders</p>
                </div>

                <div className="orders-filters">
                    <button
                        className={`btn ${!filter ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('')}
                    >
                        All
                    </button>
                    <button
                        className={`btn ${filter === 'menunggu' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('menunggu')}
                    >
                        Pending
                    </button>
                    <button
                        className={`btn ${filter === 'diproses' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('diproses')}
                    >
                        Processing
                    </button>
                    <button
                        className={`btn ${filter === 'selesai' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('selesai')}
                    >
                        Completed
                    </button>
                </div>

                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id_order} className="order-card">
                            <div className="order-image">
                                <img src={order.coffee_image} alt={order.nama_coffee} />
                            </div>

                            <div className="order-details">
                                <div className="order-header-info">
                                    <h3>{order.nama_coffee}</h3>
                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <div className="order-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Order ID:</span>
                                        <span className="info-value">#{order.id_order}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Quantity:</span>
                                        <span className="info-value">{order.quantity}x</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Size:</span>
                                        <span className="info-value">{order.ukuran}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Date:</span>
                                        <span className="info-value">
                                            {new Date(order.order_date).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                <div className="order-total">
                                    <span>Total:</span>
                                    <span className="total-price">
                                        Rp {order.total_price.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="empty-state">
                        <p>No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
