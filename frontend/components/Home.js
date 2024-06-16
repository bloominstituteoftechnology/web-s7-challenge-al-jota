import React from 'react'
import pizza from './images/pizza.jpg'
// import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}

      <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} />
    </div>
  )
}

export default Home
