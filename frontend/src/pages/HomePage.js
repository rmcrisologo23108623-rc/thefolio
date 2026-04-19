import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {/* Hero Section */}
            <div className="hero">
                <h2>The Art of the Game</h2>
                <p>Explore the passion, physics, and teamwork behind every winning point.</p>
                <div style={{ marginTop: '30px' }}>
                    <img 
                        src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="A player spiking a volleyball over a net"
                        style={{
                            width: '100%',
                            maxWidth: '800px',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            border: '3px solid var(--accent)'
                        }}
                    />
                </div>
            </div>

            <div className="container">
                {/* Why Volleyball Matters Section */}
                <section>
                    <h3>Why Volleyball Matters</h3>
                    <p>Volleyball is more than just a sport; it is a game of communication and split-second decision-making. Whether on the beach or the hardcourt, the energy of the game is unmatched.</p>
                    <ul style={{ 
                        marginTop: 'var(--spacing-lg)', 
                        paddingLeft: 'var(--spacing-xl)',
                        lineHeight: '1.8'
                    }}>
                        <li><strong>Teamwork:</strong> No one can hit the ball twice in a row.</li>
                        <li><strong>Agility:</strong> Constant movement and diving.</li>
                        <li><strong>Strategy:</strong> Identifying gaps in the opponent's defense.</li>
                    </ul>
                </section>

                {/* Featured Cards Section */}
                <div className="grid-preview">
                    <div className="card">
                        <h4>The Journey</h4>
                        <p>Learn how I went from a beginner to a varsity setter.</p>
                        <Link to="/about">Read More →</Link>
                    </div>
                    <div className="card">
                        <h4>Resources</h4>
                        <p>Find the best gear and training guides for your next match.</p>
                        <Link to="/contact">View Gear →</Link>
                    </div>
                </div>

                {/* Explore Blog Section */}
                <section>
                    <h3 style={{ marginTop: 'var(--spacing-xl)' }}>Explore the Blog</h3>
                    <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--gray-600)' }}>
                        Discover stories, tips, and experiences from volleyball enthusiasts
                    </p>
                    
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            Loading posts...
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="post-card" style={{ textAlign: 'center', padding: '40px' }}>
                            <p>No posts yet. Be the first to share your volleyball story!</p>
                            <Link to="/create-post">
                                <button className="btn-primary" style={{ marginTop: '20px' }}>Write a Post</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="posts-grid">
                            {posts.map(post => (
                                <div key={post._id} className="post-card">
                                    {post.image && (
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${post.image}`} 
                                            alt={post.title} 
                                            className="post-card-image"
                                        />
                                    )}
                                    <div className="post-card-content">
                                        <h3><Link to={`/posts/${post._id}`}>{post.title}</Link></h3>
                                        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--spacing-md)' }}>
                                            {post.body.substring(0, 120)}...
                                        </p>
                                        <div className="post-card-meta">
                                            <span>By {post.author?.name || 'Anonymous'}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default HomePage;