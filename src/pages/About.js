import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/GlobalStyles.css'; // Global styles
import '../styles/variables.css'; // CSS Variables

const About = () => {
    return (
        <div className="about-page">
            
            <main className="main-content">
                <h1>About Us</h1>
                <p>Welcome to My Blog! We share insights, stories, and articles on various topics. Stay tuned for more updates.</p>
            </main>
            <Footer />
        </div>
    );
};

export default About;
