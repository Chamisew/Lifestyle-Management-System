import { Parallax } from 'react-parallax';
import three from '../images/seven.jpg'
const imageFive = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Meet Assist</span>
        </div>
    </Parallax>
);
export default imageFive;