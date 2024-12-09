import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Contact from '../components/Contact/Contact';
import './pages.css';

const ContactPage = () => {
    return (
        <div className="contact-page">
            
            <main className="main-content">
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
