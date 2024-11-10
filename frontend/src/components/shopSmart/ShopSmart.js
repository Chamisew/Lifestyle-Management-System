import React, { useState } from "react";
import { FaCalendarAlt, FaUsers, FaHeartbeat, FaShoppingCart, FaClipboardList, FaCar, FaMapMarkedAlt } from "react-icons/fa"; 
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

const ShopSmart = () => {
    const [setIsSidebarOpen] = useState(false);
     const [hoveredIndex, setHoveredIndex] = useState(null); // New state for hover

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const categories = [
        { 
            name: 'Occasions', 
            icon: <FaCalendarAlt />, 
            link: '/occationsmart', 
            description: 'Manage reminders for birthdays, anniversaries, and other special events.' 
        },
        { 
            name: 'Events', 
            icon: <FaUsers />, 
            link: '/eventsmart', 
            description: 'Keep track of social gatherings, parties, and community events.' 
        },
        { 
            name: 'Medical', 
            icon: <FaHeartbeat />, 
            link: '/medicalsmart', 
            description: 'Reminders for medical appointments, medication schedules, and health check-ups.' 
        },
        { 
            name: 'Day-to-Day Life', 
            icon: <FaShoppingCart />, 
            link: '/todosmart', 
            description: 'Manage daily tasks, shopping lists, and routine activities.' 
        },
        { 
            name: 'Meetings', 
            icon: <FaClipboardList />, 
            link: '/meetingssmart', 
            description: 'Schedule and remind users of work meetings and appointments.' 
        },
        { 
            name: 'Vehicle', 
            icon: <FaCar />, 
            link: '/vehiclesmart', 
            description: 'Keep track of vehicle maintenance, inspections, and related activities.' 
        },
        { 
            name: 'Map', 
            icon: <FaMapMarkedAlt />, 
            link: '/Ms', 
            description: 'Navigate to your map for location tracking and directions.', 
            special: true // Mark this button as special
        }
    ];

    const mainImageUrl = "https://wallpaperaccess.com/full/1496231.jpg"; // Image URL

    return (
        <div style={styles.container}>
         <Nav/>
            <div style={styles.mainWindow}>
                <div className="sidebar-toggle" onClick={toggleSidebar}>
                    <span className="material-icons"></span>
                </div>

                {/* Fullscreen Main Image with Overlay */}
                <div style={styles.mainImage}>
                    <img src={mainImageUrl} alt="Main Visual" style={styles.image} />
                    <div style={styles.overlay}>
                        <div style={styles.mainContent}>
                            <h1 style={styles.header}>Welcome to ShopSmart!</h1>
                            <p style={styles.welcomeText}>
                                ShopSmart is your all-in-one solution for managing important dates and tasks in your life. 
                                Easily navigate through various categories to stay organized and never miss an important event or appointment.
                            </p>
                             {/* Updated buttonGrid to display buttons horizontally */}
                <div style={styles.buttonGrid}>
                    {categories.map((category, index) => (
                        <a 
                            key={index} 
                            href={category.link} 
                            style={{
                                ...(category.special ? styles.mapButton : styles.button),
                                ...(hoveredIndex === index ? styles.buttonHover : {})
                            }} 
                            title={category.description}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={styles.icon}>{category.icon}</div>
                            <span style={styles.buttonText}>{category.name}</span>
                        </a>
                    ))}
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
        textAlign: 'center', // Center text
        lineHeight: '1.5',
        display: 'flex', // Added
        justifyContent: 'center', // Added to center horizontally
        alignItems: 'center', // Added for vertical centering in flex context
        margin: '0 auto', // Centering block element within its parent
    },
    
    buttonGrid: {
        display: 'flex', // Change to flexbox
        justifyContent: 'center', // Center horizontally
        flexWrap: 'wrap', // Allow wrapping if necessary
        gap: '20px', // Space between buttons
        padding: '20px',
    },

    button: {
        marginTop:'10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px', // Increased width
        height: '100px', // Increased height
        backgroundColor: '#0A354C',
        color: '#cfd3e7',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '2px', // Optional: Add border radius for a smoother look
    },

   buttonHover: {
        backgroundColor: '#0A354C', // Change this to your desired hover color
        transform: 'scale(1.05)', // Slightly enlarge the button
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)', // Darker shadow for depth
    },

    mapButton: {
        marginTop:'10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px', // Increased width
        height: '100px', // Increased height
        backgroundColor: '#0A354C',
        color: '#cfd3e7',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '2px', // Optional: Add border radius for a smoother look
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

export default ShopSmart;
