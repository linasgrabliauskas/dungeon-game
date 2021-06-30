import React, { useState, useEffect, useMemo } from "react"
import "./LeadersBoard.css"
import { Link } from "react-router-dom"
import Spinner from "../components/Spinner"
import { FaAngleDoubleLeft } from "react-icons/fa"

function LeadersBoard() {
  // State
  const [leaders, setLeaders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function getAllLeaders() {
      try {
        const secretKey = localStorage.getItem("dungeon-secretKey")
        const response = await fetch(
          "https://dungeon-rpg.herokuapp.com/api/v1/user/leaders",
          {
            headers: { secretKey: secretKey },
          }
        )
        if (response.status === 404)
          throw new Error("Connection error. Please try again later")
        if (response.status !== 200) {
          const data = await response.json()
          const errors = data.errors
          throw errors.msg
        } else {
          const data = await response.json()
          setLeaders(data.data)
          setIsLoading(false)
          setMessage("")
        }
      } catch (err) {
        typeof err === "string"
          ? setMessage(err)
          : setMessage("Unexpected error")
        err.message && setMessage(err.message)
      }
    }
    getAllLeaders()
  }, [])

  const leadersList = useMemo(
    () =>
      leaders.map((leader) => (
        <li key={leader._id}>
          <h4>{leader.username}</h4>
          <h4>{leader.gold}</h4>
          <h4>{leader.health}</h4>
          <h4>
            <Link to={`/leaders/${leader._id}`}>See profile</Link>
          </h4>
        </li>
      )),
    [leaders]
  )

  return (
    <main className='leaders dungeon-bg'>
      <h1 className='heading-1'>Leaders Board</h1>

      {isLoading && <Spinner />}
      {!isLoading && (
        <ul className='leaders__list'>
          <li>
            <h4 className='heading-3'>User</h4>
            <h4 className='heading-3'>Gold</h4>
            <h4 className='heading-3'>Health</h4>
            <h4 className='heading-3'>Profile</h4>
          </li>
          {leadersList}
        </ul>
      )}

      {message && <div className='message'>{message}</div>}
      <div className='menu'>
        <Link to='/' className='btn btn-accent'>
          <FaAngleDoubleLeft />
          BACK
        </Link>
      </div>
    </main>
  )
}

export default LeadersBoard
