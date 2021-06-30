import React from 'react'
import { Route } from 'react-router-dom'
import Login from './Login'

function ProtectedRoute({children, ...rest}) {

  const isAuthenticated = localStorage.getItem('dungeon-secretKey')

  return (
    <Route {...rest} render={() => {
      if (isAuthenticated) {
        return children
      } else {
        return <Login />
      }
    }}/>
  )
}

export default ProtectedRoute

