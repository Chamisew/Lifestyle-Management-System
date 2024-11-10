import React from "react";
import "./GiftOptions.css"; // Assuming you have CSS for styling
import Nav from '../../Nav/Nav';
import Footer from '../../Footer/Footer';


const GiftOptions = () => {
  return (
    <div>
      <Nav/>

    <div className="gift-options-page">
      <div className="gift-options-content">
        <h1>Select a Gift Option</h1>
        
        <div className="gift-buttons">
          {/* Gift options with external links */}
          <a
            href="https://www.kapruka.com/?srsltid=AfmBOoq7icw2cCv64ReWcKA1Dab_a-zhuno5GKzf-wNCOYcJPfmvSPIP"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="gift-button kapruka">------------</button>
          </a>

          <a
            href="https://lassana.com/?srsltid=AfmBOorp8-i5_lGcGa3B2BHiGdJRDeeVSKEfaDFLch-E1k9UTNrG5AJw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="gift-button lassana-flora">-------------</button>
          </a>

          <a
            href="https://visions.today/product/plant-gifts/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="gift-button cactus-by-dee">Cactus by Dee</button>


            <a
            href="http://localhost:3000/Ms"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="gift-button map">find Location</button>
          </a>

          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default GiftOptions;
