import React from 'react';
import Navbar from './Navbar';
import '../styles/Legal.css';

function TermsOfService({ isDarkMode, setIsDarkMode }) {
  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="legal-page">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to GymFlex. These Terms of Service govern your use of our website and services
              operated by GymFlex. By accessing our website and using our services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
            <p>
              Please read these Terms of Service carefully before using our website and services.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>2. Membership & Subscription</h2>
            <p>
              GymFlex offers various membership plans. By subscribing to our services, you agree to the following:
            </p>
            <ul>
              <li>You are at least 18 years of age or have the consent of a parent or guardian.</li>
              <li>You will provide accurate, current, and complete information during the registration process.</li>
              <li>You are responsible for maintaining the confidentiality of your account information, including your password.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <p>
              Membership fees are charged in advance on a monthly, quarterly, semi-annual, or annual basis, depending on the plan you select. By providing your payment information, you authorize us to charge the applicable fees to your payment method.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>3. Facility Rules & Conduct</h2>
            <p>
              When using our facilities, you agree to:
            </p>
            <ul>
              <li>Comply with all posted rules and regulations.</li>
              <li>Use the equipment in the manner for which it is intended.</li>
              <li>Respect the rights and dignity of other members and staff.</li>
              <li>Not engage in any behavior that may be considered disruptive, threatening, or harassing.</li>
              <li>Not use any illegal substances or alcohol on the premises.</li>
              <li>Not engage in any activity that may damage the equipment or facilities.</li>
            </ul>
            <p>
              GymFlex reserves the right to refuse or terminate service to anyone for any reason at any time.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>4. Health & Safety</h2>
            <p>
              You understand and acknowledge that:
            </p>
            <ul>
              <li>Engaging in physical exercise involves certain risks, including injury and death.</li>
              <li>You are voluntarily participating in these activities and assuming all risks of injury to yourself.</li>
              <li>It is your responsibility to consult with a physician before participating in any exercise program.</li>
              <li>You should discontinue exercise and seek medical attention if you experience symptoms such as dizziness, shortness of breath, or chest pain.</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>5. Cancellation & Refunds</h2>
            <p>
              Cancellation policies vary depending on your membership plan:
            </p>
            <ul>
              <li>Monthly memberships may be cancelled with 30 days' written notice.</li>
              <li>Long-term memberships (quarterly, semi-annual, annual) may have different cancellation policies as outlined in your membership agreement.</li>
              <li>Refunds are issued at the discretion of GymFlex management.</li>
              <li>Membership freezes may be available in certain circumstances, such as medical emergencies or temporary relocations.</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, GymFlex shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your use or inability to use our facilities, services, or content.</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein.</li>
              <li>Any interruption or cessation of transmission to or from our services.</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our services by any third party.</li>
            </ul>
          </section>
          
          <section className="legal-section">
            <h2>7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. If we make material changes to these Terms, we will provide notice through our website or by other means. Your continued use of our services after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>
          
          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@gymflex.com<br />
              <strong>Phone:</strong> +90 (0212) 527 00 27<br />
              <strong>Address:</strong> Barbaros Mahallesi, Begonya Sokak No:15, Ataşehir, İstanbul, Türkiye
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService; 