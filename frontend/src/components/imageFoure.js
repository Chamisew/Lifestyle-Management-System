import { Parallax } from 'react-parallax';
import three from '../images/six.jpg'
const imageFoure = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Health Mate</span>
        </div>
    </Parallax>
);
export default imageFoure;