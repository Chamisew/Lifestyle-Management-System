import { Parallax } from 'react-parallax';
import three from '../images/ten.jpg'
const imageSeven = () => (
    <Parallax className='image' blur={0} bgImage={three} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        <div className='content'>
            <span className="img-txt">Finance Guard</span>
        </div>
    </Parallax>
);
export default imageSeven;