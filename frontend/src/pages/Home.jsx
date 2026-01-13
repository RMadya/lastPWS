import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

const Home = () => {
    const [coffees, setCoffees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoffees();
    }, [filter, search]);

    const fetchCoffees = async () => {
        try {
            const params = {};
            if (filter) params.kategori = filter;
            if (search) params.search = search;

            const response = await api.get('/coffees', { params });
            setCoffees(response.data.data);
        } catch (error) {
            console.error('Error fetching coffees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrder = (coffee) => {
        navigate(`/order/${coffee.id_coffee}`, { state: { coffee } });
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="container">
                {/* Hero Section */}
                <div className="hero-section">
                    <h1>Premium Coffee, Delivered Fresh</h1>
                    <p className="hero-subtitle">
                        Explore our curated selection of artisanal coffee. Order through our app or integrate with our Open API.
                    </p>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search coffee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`btn ${!filter ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('')}
                        >
                            All
                        </button>
                        <button
                            className={`btn ${filter === 'Espresso' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('Espresso')}
                        >
                            Espresso
                        </button>
                        <button
                            className={`btn ${filter === 'Manual Brew' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('Manual Brew')}
                        >
                            Manual Brew
                        </button>
                        <button
                            className={`btn ${filter === 'Cold Brew' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('Cold Brew')}
                        >
                            Cold Brew
                        </button>
                    </div>
                </div>

                {/* Coffee Grid */}
                <div className="coffee-grid">
                    {coffees.map((coffee) => (
                        <div key={coffee.id_coffee} className="coffee-card">
                            <div className="coffee-image">
                                <img src={coffee.gambar_url} alt={coffee.nama_coffee} />
                                <div className="coffee-badge">{coffee.kategori}</div>
                            </div>

                            <div className="coffee-content">
                                <h3>{coffee.nama_coffee}</h3>
                                <p className="coffee-description">{coffee.deskripsi}</p>

                                <div className="coffee-footer">
                                    <div className="coffee-price">
                                        Rp {coffee.harga.toLocaleString('id-ID')}
                                    </div>
                                    <div className="coffee-stock">
                                        Stock: {coffee.stok}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={() => handleOrder(coffee)}
                                    disabled={coffee.stok === 0}
                                >
                                    {coffee.stok > 0 ? 'Order Now' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {coffees.length === 0 && (
                    <div className="empty-state">
                        <p>No coffees found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
