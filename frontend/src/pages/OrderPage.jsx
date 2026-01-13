import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './OrderPage.css';

const OrderPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const coffee = location.state?.coffee;

    const [quantity, setQuantity] = useState(1);
    const [ukuran, setUkuran] = useState('reguler');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!coffee) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <p>Coffee not found</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Back to Home
                </button>
            </div>
        );
    }

    const calculateTotal = () => {
        let total = coffee.harga * quantity;
        if (ukuran === 'large') {
            total += 5000 * quantity;
        }
        return total;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await api.post('/orders', {
                id_coffee: coffee.id_coffee,
                quantity,
                ukuran
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/orders');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-container">
            <div className="container">
                <div className="order-content">
                    <div className="order-image-section">
                        <img src={coffee.gambar_url} alt={coffee.nama_coffee} />
                    </div>

                    <div className="order-form-section">
                        <h1>{coffee.nama_coffee}</h1>
                        <p className="coffee-category">{coffee.kategori}</p>
                        <p className="coffee-desc">{coffee.deskripsi}</p>

                        <div className="price-info">
                            <span className="base-price">Base Price: Rp {coffee.harga.toLocaleString('id-ID')}</span>
                            <span className="stock-info">Available: {coffee.stok} items</span>
                        </div>

                        {success && (
                            <div className="alert alert-success">
                                Order placed successfully! Redirecting...
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="order-form">
                            <div className="form-group">
                                <label className="form-label">Size</label>
                                <div className="size-options">
                                    <label className={`size-option ${ukuran === 'reguler' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ukuran"
                                            value="reguler"
                                            checked={ukuran === 'reguler'}
                                            onChange={(e) => setUkuran(e.target.value)}
                                        />
                                        <span>Regular</span>
                                    </label>
                                    <label className={`size-option ${ukuran === 'large' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ukuran"
                                            value="large"
                                            checked={ukuran === 'large'}
                                            onChange={(e) => setUkuran(e.target.value)}
                                        />
                                        <span>Large (+Rp 5,000)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="1"
                                    max={coffee.stok}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="order-total">
                                <span>Total Price:</span>
                                <span className="total-amount">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                                disabled={loading || success}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
