import React from 'react';

const AboutPage = () => {
    return (
        <div className="container">
            <div className="form-container" style={{ maxWidth: '900px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>My Journey with the Game</h2>
                
                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: 'var(--spacing-lg)' }}>
                        I started playing volleyball in middle school, and it quickly became the center of my world. 
                        The sound of a clean "ace" and the thrill of a successful block are feelings that are hard to replicate elsewhere.
                    </p>
                    
                    <blockquote style={{
                        fontStyle: 'italic',
                        fontSize: '1.2rem',
                        borderLeft: `4px solid var(--accent)`,
                        padding: 'var(--spacing-lg) var(--spacing-xl)',
                        margin: 'var(--spacing-xl) 0',
                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--primary)',
                        fontWeight: '500'
                    }}>
                        "Volleyball is one of the few sports where you're actually taught to communicate with every single play."
                    </blockquote>
                </div>

                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>My Growth Timeline</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr><th>Year</th><th>Achievement</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>2020</td><td>Joined the local recreational league</td></tr>
                                <tr><td>2021</td><td>Learned the fundamentals of the overhand serve</td></tr>
                                <tr><td>2023</td><td>Made the High School Junior Varsity team</td></tr>
                                <tr><td>2025</td><td>Appointed Team Captain</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Why I Love Volleyball</h3>
                    <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                        <div className="post-card">
                            <div className="post-card-content">
                                <h4>🏐 Teamwork</h4>
                                <p>Volleyball taught me that success comes from trusting and communicating with your teammates.</p>
                            </div>
                        </div>
                        <div className="post-card">
                            <div className="post-card-content">
                                <h4>💪 Resilience</h4>
                                <p>Every point is a new opportunity. Learn from mistakes and come back stronger.</p>
                            </div>
                        </div>
                        <div className="post-card">
                            <div className="post-card-content">
                                <h4>⚡ Energy</h4>
                                <p>The fast-paced nature of the game keeps you alert, active, and fully engaged.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;