import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>BeanByte</h3>
                        <p>Premium Coffee Shop Open API Platform</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/api-docs">API Documentation</a></li>
                            <li><a href="/api-keys">Get API Key</a></li>
                            <li><a href="/">Browse Menu</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Developer</h4>
                        <p>Muhammad Bagas Prasetyo Rinaldi</p>
                        <p>20230140143 | Class C</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 BeanByte. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
