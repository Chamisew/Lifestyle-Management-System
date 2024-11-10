import { Parallax } from 'react-parallax';
import three from '../images/eight.jpg'
const imageSix = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Shops mart</span>
        </div>
    </Parallax>
);
export default imageSix;