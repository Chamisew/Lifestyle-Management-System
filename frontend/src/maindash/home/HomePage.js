import React, { useState } from "react"
import Homes from "../homes/Homes"
import Trending from "../trending/Trending"
import Upcomming from "../upcoming/Upcomming"
import { latest, recommended, upcome } from "../dummyData"
import './styles.css';
import Header from "../header/Header"
import Footer from "../../components/Footer/Footer"
const HomePage = () => {
  const [items, setItems] = useState(upcome)
  const [item, setItem] = useState(latest)
  const [rec, setRec] = useState(recommended)
  return (
   <div>
   
    <div className="maindashboard">
    <>
    <Header/>
      <Homes />
      <Upcomming items={items} title='More than reminders' />
      <Upcomming items={item} title='Plan, organize, and collaborate' />
      <Trending />
      <Upcomming items={rec} title='Still have questions?' />
    </>
    
    </div>
    <Footer/>
    </div>
   
  )
}

export default HomePage
