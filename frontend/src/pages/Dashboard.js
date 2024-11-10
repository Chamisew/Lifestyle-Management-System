import React from 'react';
import VideoSection from '../components/VideoSection';
import ImageOne from '../components/ImageOne';
import ImageTwo from '../components/ImageTwo';
import ImageThree from '../components/ImageThree';
import ImageFoure from '../components/imageFoure';
import ImageFive from '../components/imageFive';
import ImageSix from '../components/imageSix';
import ImageSeven from '../components/imageSeven';
import ImageEight from '../components/imageEight';
import ImageNine from '../components/imagenine'
import WelcomeWed from './welcomeweb';
import Welcomeauto from './welcomauto';
import WelcomeEvent from './welcomeEvent';
import Welcomehelth from './welcomehelth';
import Welcomemeet from './welcomemeet';
import Welcomeoccasion from './welcomeoccasion';
import Welcometrack from './welcometrack';
import Welcomeshop from './welcomeshop';
import Welcomeincome from './welcomincome';

import Footer from '../components/Footer/Footer';

const Dashboard = () => {
  
  return (
    
  
    <div>
      <VideoSection/>
    <WelcomeWed/>
   
       <ImageOne />
       <Welcomeauto/>

       <ImageTwo />
       <Welcomeoccasion/>
      
      <ImageThree />
      <WelcomeEvent/>


     <ImageFoure />
     <Welcomehelth/>

     <ImageFive />
     <Welcomemeet/>

     <ImageSix />
     <Welcomeshop/>

     <ImageSeven />
     <Welcomeincome/>

     <ImageEight />
     <Welcometrack/>

     <ImageNine />
     <Footer/>
    </div>
  );
};

export default Dashboard;
