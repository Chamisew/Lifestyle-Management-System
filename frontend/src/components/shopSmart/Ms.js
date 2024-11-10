import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SearchBox from "./SearchBox";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import Maps from "./Map";


function Ms(props) {
    const [selectPosition, setSelectPosition] = useState(null);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const handleBackButtonClick = () => {
        navigate(-1); // Navigate to /shopsmart when back button is clicked
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Nav/>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    flex: 1,
                    width: "100%",
                    padding: "20px",
                    boxSizing: "border-box",
                    gap: "20px", // Adds space between the map and search box
                }}
            >
                {/* Map Component */}
                <div
                    style={{
                        flex: 1,
                        position: "relative",
                        borderRadius: "15px", // Rounded corners for the map
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Adds a shadow for depth
                        overflow: "hidden", // Ensures map content stays within the container
                        transition: "transform 0.3s ease", // Smooth transition on hover
                        marginTop: "20px", // Gap at the top
                        marginBottom: "20px", // Gap at the bottom
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.03)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <Maps selectPosition={selectPosition} />
                </div>

                {/* SearchBox Component */}
                <div
                    style={{
                        width: "40%",
                        padding: "20px",
                        backgroundColor: "#f9f9f9", // Light background for the search box
                        borderRadius: "15px", // Matches the rounded corners
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Shadow effect for the search box
                    }}
                >
                    <SearchBox
                        selectPosition={selectPosition}
                        setSelectPosition={setSelectPosition}
                    />
                    {/* Back Button */}
                    <button
                        onClick={handleBackButtonClick}
                        style={{
                            marginTop: "20px",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "2px solid #0d3b66", // Border color
                            backgroundColor: "#0d3b66", // Default button color
                            color: "#fff", // Default font color
                            cursor: "pointer",
                            fontSize: "16px", // Larger font for better visibility
                            width: "100%", // Full-width button
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Adds shadow for the button
                            transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease", // Smooth transitions for all properties
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff"; // Background color on hover
                            e.currentTarget.style.color = "#0d3b66"; // Font color on hover
                            e.currentTarget.style.borderColor = "#0d3b66"; // Border color on hover
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#0d3b66"; // Revert background color
                            e.currentTarget.style.color = "#fff"; // Revert font color
                            e.currentTarget.style.borderColor = "#0d3b66"; // Revert border color
                        }}
                    >
                        Back
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Ms;
