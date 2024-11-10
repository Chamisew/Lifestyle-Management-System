import React, { useState } from "react"
import "./header.css"

const Header = () => {
  const [Mobile, setMobile] = useState(false)
  return (
    <>
    <div className="maindashHeader">
      <header>
        <div className='container flexSB'>
          <nav className='flexSB'>
           
            <ul className={Mobile ? "navMenu-list" : "flexSB"} onClick={() => setMobile(false)}>
              <li>
                <a href='/autoAssist'>AutoAssist</a>
              </li>
              <li>
                <a href='/'>HealthMate</a>
              </li>
              <li>
                <a href='/meet-assist'>MeetAssist</a>
              </li>
              <li>
                <a href='/mainhome'>EventPlanner</a>
              </li>
              <li>
                <a href='/'>EventMinder</a>
              </li>
              <li>
                <a href='/shopsmart'>ShopSmart</a>
              </li>
              <li>
                <a href='/paymenthome'>PayTrack</a>
              </li>
              <li>
                <a href='/incomemainconteiner'>FinanceGuard</a>
              </li>
            </ul>
            <button className='toggle' onClick={() => setMobile(!Mobile)}>
              {Mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
          <div className='account flexSB'>
           
            <button>LogOut</button>
          </div>
        </div>
      </header>
      </div>
    </>
    
  )
}

export default Header
