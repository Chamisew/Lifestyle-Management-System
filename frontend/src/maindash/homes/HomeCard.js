import React from "react"
import { Link } from "react-router-dom"

const HomeCard = ({ item: { id, cover, name,  desc, link } }) => {
  return (
    <>
    
      <div className='box'>
        <div className='coverImage'>
          <img src={cover} alt='' />
        </div>
        <div className='content flex'>
          <div className='details row'>
            <h1>{name}</h1>
            
            <p>{desc}</p>
          </div>
          <div className='palyButton row'>
          <Link to={link}>
              <button>
                <div className='img'>
                  <img src='./images/play-button.png' alt='' />
                  <img src='./images/play.png' className='change' />
                </div>
               GET START
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeCard
