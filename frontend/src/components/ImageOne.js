import { Parallax } from 'react-parallax';
import two from '../images/four.jpg'
import './ImageOne.css';
const ImageOne = () => (
    <Parallax className='image' blur={0} bgImage={two} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Auto Assist</span>
        </div>
    </Parallax>
);

export default ImageOne