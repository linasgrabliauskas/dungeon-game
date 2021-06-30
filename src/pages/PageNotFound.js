import React from 'react'
import { Link } from 'react-router-dom'
import { FaAngleDoubleLeft } from 'react-icons/fa'

function PageNotFound() {
     return (
          <main className="inventory dungeon-bg">
               <h1 className="heading-1">Page not found</h1>
               <h2 className="heading-2">Oops.. something went wrong</h2>
               <div className="menu"><Link to="/" className="btn btn-accent"><FaAngleDoubleLeft/>BACK</Link></div>
          </main>
     )
}

export default PageNotFound
