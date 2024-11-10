// IncomeMainContainer.js
import React, { useState } from "react";
import {FaDollarSign } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Nav from "../../../components/Nav/Nav";
import Footer from "../../../components/Footer/Footer";

const IncomeMainContainer = () => {
    const navigate = useNavigate(); // Create a navigate function from useNavigate
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Correctly destructured useState

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const categories = [
     
        { 
            name: 'START', 
            icon: <FaDollarSign />, 
            link: '/allincome', 
            description: 'Keep track of social gatherings, parties, and community events.' 
        },
       
    ];

    const mainImageUrl = "https://images.unsplash.com/photo-1639189702833-8de5ecf2ca8f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Replace with a direct image URL

    return (
        <div style={styles.container}>
            <Nav/>
            <div style={styles.mainWindow}>
               

                {/* Fullscreen Main Image with Overlay */}
                <div style={styles.mainImage}>
                    <img src={mainImageUrl} alt="Main Visual" style={styles.image} />
                    <div style={styles.overlay}>
                        <div style={styles.mainContent}>
                            <h1 style={styles.header}>Welcome to FinanceGuard!</h1>
                            <p style={styles.welcomeText}>
                            One-page dashboard that offers a holistic view of your finances, total balance, daily/monthly income breakdown, income chart, and a history of expenses versus income. Effortlessly monitor your financial health and make informed decisions with our intuitive interface. Whether you're  tracking income, or planning for the future, our design simplifies your financial journey. Take control of your finances today and achieve your financial goals with confidence.
                            </p>
                                            <div style={styles.buttonGrid}>
                                    {categories.map((category, index) => (
                                        <a 
                                            key={index} 
                                            href={category.link} 
                                            style={category.special ? styles.mapButton : styles.button} 
                                            title={category.description}
                                        >
                                            <div style={styles.icon}>{category.icon}</div>
                                            <span style={styles.buttonText}>{category.name}</span>
                                        </a>
                                    ))}
                                </div>
                                            <div style={styles.backButtonContainer}>
                                <button onClick={() => navigate(-1)} style={styles.backButton}>
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
          <Footer/>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
    },
    mainWindow: {
        position: 'relative',
    },
    mainImage: {
        position: 'relative',
        height: 'calc(100vh - 60px)', // Adjust height to account for nav
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: 'brightness(0.5)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        textAlign: 'center',
    },
    mainContent: {
        padding: '20px',
    },
    header: {
        fontSize: '2.5em',
        color: '#ffffff',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
    },
    welcomeText: {
        marginTop: '10px',
        color: '#ffffff',
        fontSize: '1.2em',
        maxWidth: '800px',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    buttonGrid: {
        display: 'flex', // Change to flexbox
        justifyContent: 'center', // Center horizontally
        flexWrap: 'wrap', // Allow wrapping if necessary
        gap: '20px', // Space between buttons
        padding: '20px',
    },
    backButtonContainer: {
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        marginTop: '20px',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#1f7a8c',
        color: '#cfd3e7',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginBottom: '30px',
    },

    button: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '120px',
        backgroundColor: '#022b3a',
        color: '#cfd3e7',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    mapButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '120px',
        backgroundColor: '#cfd3e7',
        color: '#363b63',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    icon: {
        fontSize: '30px',
    },
    buttonText: {
        marginTop: '10px',
        fontSize: '16px',
        fontWeight: 500,
    },
};

export default IncomeMainContainer;
