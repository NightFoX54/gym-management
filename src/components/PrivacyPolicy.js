import React from 'react';
import Navbar from './Navbar';
import '../styles/Legal.css';

function PrivacyPolicy({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="legal-page">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to GymFlex's Privacy Policy. At GymFlex, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy will inform you about how we look after your personal data when you visit our website and use our services, 
              regardless of where you visit it from, and tell you about your privacy rights and how the law protects you.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>2. The Data We Collect About You</h2>
            <p>
              Personal data means any information about an individual from which that person can be identified. 
              We may collect, use, store and transfer different kinds of personal data about you, which we have grouped as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, date of birth and gender.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data</strong> includes payment card details.</li>
              <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
              <li><strong>Health Data</strong> includes fitness information, workout statistics, and other health-related information you provide to us.</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>
            <p>
              Generally we do not rely on consent as a legal basis for processing your personal data other than in relation to sending direct marketing communications to you via email or text message. You have the right to withdraw consent to marketing at any time by contacting us.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
            </p>
            <p>
              We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul>
              <li><strong>Request access</strong> to your personal data.</li>
              <li><strong>Request correction</strong> of your personal data.</li>
              <li><strong>Request erasure</strong> of your personal data.</li>
              <li><strong>Object to processing</strong> of your personal data.</li>
              <li><strong>Request restriction of processing</strong> your personal data.</li>
              <li><strong>Request transfer</strong> of your personal data.</li>
              <li><strong>Right to withdraw consent</strong>.</li>
            </ul>
            <p>
              You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@gymflex.com<br />
              <strong>Phone:</strong> +90 (0212) 527 00 27<br />
              <strong>Address:</strong> Barbaros Mahallesi, Begonya Sokak No:15, Ataşehir, İstanbul, Türkiye
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy; 