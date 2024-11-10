import React, { useState } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

function SearchBox(props) {
    const { setSelectPosition } = props;
    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState([]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                    <OutlinedInput
                        style={{ width: "100%", marginLeft: "10px" }}
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                        }}
                        placeholder="Search Location..."
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center", padding: "0px 20px" }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#0d3b66",
                            color: "#ffffff",
                            border: "2px solid #0d3b66",
                            "&:hover": {
                                backgroundColor: "#ffffff",
                                color: "#0d3b66",
                                borderColor: "#0d3b66",
                            },
                        }}
                        onClick={() => {
                            // Search
                            const params = {
                                q: searchText,
                                format: 'json',
                                addressdetails: 1,
                                polygon_geojson: 0
                            };
                            const queryString = new URLSearchParams(params).toString();
                            const requestOptions = {
                                method: "GET",
                                redirect: "follow"
                            };
                            fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                                .then((response) => response.text())
                                .then((result) => {
                                    console.log(JSON.parse(result));
                                    setListPlace(JSON.parse(result)); // Update the list of places
                                })
                                .catch((err) => console.log("err:", err));
                        }}
                    >
                        Search
                    </Button>
                </div>
            </div>

            {/* Conditionally Render the Scrollable Results after Search */}
            {listPlace.length > 0 && (
                <div
                    style={{
                        maxHeight: "400px", // Set the maximum height for the scrollable area
                        overflowY: "auto",  // Enable vertical scrolling when content exceeds the height
                        marginTop: "10px",
                        padding: "10px",
                        border: "1px solid #ccc",  // Optional: Add border for styling
                        borderRadius: "5px",       // Optional: Rounded corners for styling
                    }}
                >
                    <List component="nav" aria-label="search results">
                        {listPlace.map((item) => (
                            <div key={item?.place_id}>
                                <ListItem button onClick={() => setSelectPosition(item)}>
                                    <ListItemIcon>
                                        <img
                                            src="./placeholder.png"
                                            alt="Placeholder"
                                            style={{ width: 35, height: 35 }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={item?.display_name} />
                                </ListItem>
                                <Divider />
                            </div>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
}

export default SearchBox;
