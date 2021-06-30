import React from 'react'
import './Spinner.css'

function Spinner() {

     // Smooth spinner from pure css (not my design)
     return (
          <div className="spinner">
               <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
     ) 
}

export default Spinner
