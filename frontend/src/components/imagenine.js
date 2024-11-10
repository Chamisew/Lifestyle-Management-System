import { Parallax } from 'react-parallax';
import two from '../images/last.jpg'
import './ImageOne.css';
const imagenine = () => (
    <Parallax className='image' blur={0} bgImage={two} strength={800} bgImageStyle={{minHeight:"100vh"}}>
        
    </Parallax>
);

export default imagenine