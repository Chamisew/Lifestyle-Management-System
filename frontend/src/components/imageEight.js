import { Parallax } from 'react-parallax';
import three from '../images/nine.jpg'
const imageEight = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Pay Track</span>
        </div>
    </Parallax>
);
export default imageEight;