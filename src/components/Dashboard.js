import React from 'react';
import './Dashboard.css';
const stat = '/assets/🦆 icon _graph_.png';
const Dashboard = () => {
  return (
    
    <div class="container">
        <div class="row">


        <div class="item">
            <div className='statimage'>
              <h1 className='totalemployees'>Total Employees</h1>
              <img id='stat' src={stat} alt='statimage'/>
            </div>

            <div>
              <h1 className='totalno'>345</h1>
              <p>Employees</p>
            </div>
        </div>
        <div class="item">Item 2</div>
        </div>


  </div>
  
    
  )
}

export default Dashboard
