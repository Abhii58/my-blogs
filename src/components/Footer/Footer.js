import React from 'react';
import '../layout.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; 2024 My Blog. All rights reserved.</p>
            
                
             <h1>Social Media</h1>
            <div className="Social-media">
        <div class="icons">
          <a href="https://in.linkedin.com/in/abhishek-bijalwan-6125432a2" class="linkedin">
            <div class="layer">
              <span></span><span></span><span></span><span class="linkedin"></span>
            </div>
          </a>

          <a href="https://instagram.com/in/abhishekbijalwan58" class="instagram">
            <div class="layer">
              <span></span><span></span><span></span><span class="fab fa-instagram"></span>
            </div>
          </a>
          <a href="https://github.com/Abhii58/" class="Github">
            <div class="layer">
              <span></span><span></span><span></span><span class="Github"></span>
            </div>
          </a>
        </div>
        </div>
        
        </footer>
    );
};

export default Footer;
