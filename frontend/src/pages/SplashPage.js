import { Link } from 'react-router-dom';

const SplashPage = () => {
    return (
        <>
            <div className="hero">
                <h2>Welcome to TheFolio</h2>
                <p>Your premier destination for volleyball blogging and community engagement</p>
                <div className="cta-buttons">
                    <Link to="/register">
                        <button className="btn-primary">Get Started</button>
                    </Link>
                    <Link to="/home">
                        <button className="btn-secondary">Explore Blog</button>
                    </Link>
                </div>
            </div>
            
            <div className="container">
                <div className="posts-grid">
                    <div className="post-card">
                        <div className="post-card-content">
                            <h3>🏐 Share Your Story</h3>
                            <p>Create beautiful blog posts about your volleyball experiences, match reports, and training journeys.</p>
                        </div>
                    </div>
                    <div className="post-card">
                        <div className="post-card-content">
                            <h3>💬 Engage & Connect</h3>
                            <p>Join conversations with fellow players, coaches, and enthusiasts from around the world.</p>
                        </div>
                    </div>
                    <div className="post-card">
                        <div className="post-card-content">
                            <h3>🛡️ Safe Community</h3>
                            <p>Our admin-moderated platform ensures a respectful and positive environment for everyone.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SplashPage;