import { Parallax } from 'react-parallax';
import three from '../images/two.png'
import './ImageOne.css';
const ImageTwo = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Event Minder</span>
        </div>
    </Parallax>
);

export default ImageTwo