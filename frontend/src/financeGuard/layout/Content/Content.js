import "./Content.css";
import '../../Allcard.css'
import MainBanner from "../MainBanner";
import WelcomeSection from '../WelcomeSection';
import About from '../About';
import Rooms from '../Rooms';
import StatisticsChart from "../../components/StatisticsChart/StatisticsChart";
import Services from "../Services";
import Newsletter from"../Newsletter";
import Goalset from "../goalset";
import Nav from "../../../components/Nav/Nav";
import Footer from "../../../components/Footer/Footer";
const Content = () => {
  return (
    <div className='inimain-content'>
      <Nav/>
      <MainBanner/>
      <WelcomeSection/>
      <Rooms/>
      <About/>
      <Newsletter/>
      <StatisticsChart/>
      <Goalset/>
      <Services/>   
      <Footer/>
    </div>
  )
}

export default Content
