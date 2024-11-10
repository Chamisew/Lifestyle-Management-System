import React, {useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import"leaflet/dist/leaflet.css";
import L from "leaflet"


const icon = L.icon({
    iconUrl:"./location.png",
    iconSize: [38,38]
})
const position = [6.9271, 79.8612]; // Coordinates for Colombo, Sri Lanka

function ResetCenterView(props){
    const{ selectPosition } = props;
    const map = useMap();

    useEffect(() => {
        
    if (selectPosition) {
        map.setView(
            L.latLng(selectPosition?.lat, selectPosition?.lon),
            map.getZoom(),
            {
                animate: true 
            }
        )
    }
    }, [selectPosition]);

    return null;
}

function Map(props) {
    const {selectPosition}=props;
    const locationSelection=[selectPosition?.lat, selectPosition?.lon];

  return (
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=Jn9j9KiM8t9QNAumvM1B"
        />
        { selectPosition && (
        <Marker position={locationSelection} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        )}
        <ResetCenterView selectPosition={selectPosition} />
      </MapContainer>
  );
}

export default Map;
