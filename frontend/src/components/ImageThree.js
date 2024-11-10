import { Parallax } from 'react-parallax';
import four from '../images/five.jpg'
import './ImageOne.css';
const ImageThree = () => (
    <Parallax className='image' blur={0} bgImage={four} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Event Planner</span>
        </div>
    </Parallax>
);

export default ImageThree