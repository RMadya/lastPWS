import './ApiDocs.css';

const ApiDocs = () => {
    return (
        <div className="apidocs-container">
            <div className="container">
                <div className="apidocs-header">
                    <h1>API Documentation</h1>
                    <p>Complete guide to integrate BeanByte API into your application</p>
                </div>

                <div className="docs-content">
                    <section className="doc-section">
                        <h2>Getting Started</h2>
                        <p>
                            BeanByte Open API allows you to integrate our coffee ordering system into your applications.
                            To get started, you'll need an API key.
                        </p>

                        <div className="code-block">
                            <h4>Base URL</h4>
                            <code>http://localhost:5000/api</code>
                        </div>
                    </section>

                    <section className="doc-section">
                        <h2>Authentication</h2>
                        <p>Include your API key in the request header:</p>

                        <div className="code-block">
                            <pre>{`X-API-Key: your-api-key-here`}</pre>
                        </div>
                    </section>

                    <section className="doc-section">
                        <h2>Endpoints</h2>

                        <div className="endpoint-card">
                            <div className="endpoint-header">
                                <span className="method get">GET</span>
                                <code>/coffees</code>
                            </div>
                            <p>Get all available coffees</p>
                            <div className="code-block">
                                <h4>Example Request:</h4>
                                <pre>{`curl -X GET http://localhost:5000/api/coffees \\
  -H "X-API-Key: your-api-key"`}</pre>
                            </div>
                        </div>

                        <div className="endpoint-card">
                            <div className="endpoint-header">
                                <span className="method get">GET</span>
                                <code>/coffees/:id</code>
                            </div>
                            <p>Get coffee details by ID</p>
                        </div>

                        <div className="endpoint-card">
                            <div className="endpoint-header">
                                <span className="method post">POST</span>
                                <code>/orders</code>
                            </div>
                            <p>Create a new order</p>
                            <div className="code-block">
                                <h4>Example Request:</h4>
                                <pre>{`curl -X POST http://localhost:5000/api/orders \\
  -H "X-API-Key: your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id_coffee": 1,
    "quantity": 2,
    "ukuran": "large"
  }'`}</pre>
                            </div>
                        </div>

                        <div className="endpoint-card">
                            <div className="endpoint-header">
                                <span className="method get">GET</span>
                                <code>/orders</code>
                            </div>
                            <p>Get your orders</p>
                        </div>

                        <div className="endpoint-card">
                            <div className="endpoint-header">
                                <span className="method get">GET</span>
                                <code>/orders/:id</code>
                            </div>
                            <p>Get order details by ID</p>
                        </div>
                    </section>

                    <section className="doc-section">
                        <h2>Rate Limiting</h2>
                        <div className="rate-limit-grid">
                            <div className="rate-card">
                                <h3>Free Tier</h3>
                                <p className="rate-value">100</p>
                                <p>requests per day</p>
                            </div>
                            <div className="rate-card premium">
                                <h3>Premium Tier</h3>
                                <p className="rate-value">1,000</p>
                                <p>requests per day</p>
                            </div>
                        </div>
                    </section>

                    <section className="doc-section">
                        <h2>Response Format</h2>
                        <p>All responses are in JSON format:</p>
                        <div className="code-block">
                            <pre>{`{
  "success": true,
  "data": { ... },
  "count": 10
}`}</pre>
                        </div>
                    </section>

                    <section className="doc-section">
                        <h2>Error Handling</h2>
                        <p>Error responses include a message:</p>
                        <div className="code-block">
                            <pre>{`{
  "success": false,
  "message": "Error description"
}`}</pre>
                        </div>
                    </section>

                    <div className="swagger-link">
                        <h3>Interactive API Documentation</h3>
                        <p>Try out the API endpoints with our interactive Swagger documentation</p>
                        <a
                            href="http://localhost:5000/api/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Open Swagger Docs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocs;
