import React, { useState, useEffect, useRef, useContext } from "react"
import "./LeadersDetails.css"
import { Link, useParams } from "react-router-dom"
import Spinner from "../components/Spinner"
import { GameContext } from "../App"

function LeadersDetails() {
  // Global game state
  const { player, setPlayer } = useContext(GameContext)

  // State
  const [leader, setLeader] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")
  const [nameEditing, setNameEditing] = useState(false)

  // Refs
  const nameInputRef = useRef(null)

  // Other variables
  const { id } = useParams()

  useEffect(() => {
    async function getLeaderInfo() {
      try {
        const secretKey = localStorage.getItem("dungeon-secretKey")
        const response = await fetch(
          `https://dungeon-rpg.herokuapp.com/api/v1/user/leaders/${id}`,
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
          setLeader(...data.data)
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
    getLeaderInfo()
  }, [id])

  function validateInputLength(input, min, max) {
    return input.length >= min && input.length <= max
  }

  async function handleSubmitNameChange(e) {
    e.preventDefault()
    // Validate username
    if (!validateInputLength(name, 4, 20)) {
      nameInputRef.current.focus()
      setMessage("Your username must be 4-20 characters long")
      // Validation success
    } else {
      try {
        // Updating name / check existing names
        const userData = { username: name }
        const secretKey = localStorage.getItem("dungeon-secretKey")
        const response = await fetch(
          "https://dungeon-rpg.herokuapp.com/api/v1/user/updateName",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              secretKey: secretKey,
            },
            body: JSON.stringify(userData),
          }
        )
        if (response.status === 404)
          throw new Error("Connection error. Please try again later")
        if (response.status !== 200) {
          const data = await response.json()
          const errors = data.errors
          throw errors.msg
        } else {
          setLeader((prevLeader) => ({ ...prevLeader, username: name }))
          setPlayer((prevPlayer) => ({ ...prevPlayer, username: name }))
          setNameEditing(false)
          setName("")
          setMessage("Name changed")
        }
      } catch (err) {
        typeof err === "string"
          ? setMessage(err)
          : setMessage("Unexpected error")
        err.message && setMessage(err.message)
      }
    }
  }

  function handleChangeImage(url) {
    setLeader((prevLeader) => ({ ...prevLeader, image: url }))
    setPlayer((prevPlayer) => ({ ...prevPlayer, image: url }))
  }

  const inventoryItemsList =
    leader.inventory &&
    leader.inventory.map((item) => (
      <li key={item.id}>
        <img src={"." + item.image} alt='item' />
      </li>
    ))
  const equipedItemsList =
    leader.equiped &&
    leader.equiped.map((item) => (
      <li key={item.id}>
        <img src={"." + item.image} alt='item' />
      </li>
    ))

  const isCurrentUser = player.name === leader.username

  return (
    <main className='leader dungeon-bg'>
      <h1 className='heading-1'>Leader details</h1>

      {isLoading && <Spinner />}
      {!isLoading && (
        <div className='leader__info'>
          <div className='leader__img'>
            <img src={"." + leader.image} alt={leader.username} />
            {isCurrentUser && (
              <div>
                <button
                  className='btn btn-small'
                  onClick={() =>
                    handleChangeImage("./assets/images/player.png")
                  }
                >
                  Warrior
                </button>
                <button
                  className='btn btn-small'
                  onClick={() => handleChangeImage("./assets/images/mage.png")}
                >
                  Mage
                </button>
                <button
                  className='btn btn-small'
                  onClick={() =>
                    handleChangeImage("./assets/images/hunter3.png")
                  }
                >
                  Hunter
                </button>
              </div>
            )}
          </div>
          <ul className='leader__info-content'>
            <li>
              <h4 className='heading-3'>Username</h4>
              {nameEditing ? (
                <form onSubmit={handleSubmitNameChange}>
                  <input
                    type='text'
                    placeholder='Username'
                    aria-label='username'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    ref={nameInputRef}
                    maxLength='20'
                    autoFocus
                  />
                  <button className='btn btn-small'>Confirm</button>
                  <button
                    type='button'
                    className='btn btn-small'
                    onClick={() => setNameEditing(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <p>
                  {leader.username}
                  {isCurrentUser && (
                    <button
                      className='btn btn-small'
                      onClick={() => setNameEditing(true)}
                    >
                      Change name
                    </button>
                  )}
                </p>
              )}
            </li>
            <li>
              <h4 className='heading-3'>Gold</h4>
              <p>{leader.gold}</p>
            </li>
            <li>
              <h4 className='heading-3'>Health</h4>
              <p>{leader.health}</p>
            </li>
            <li>
              <h4 className='heading-3'>Damage</h4>
              <p>{leader.damage}</p>
            </li>
            <li>
              <h4 className='heading-3'>Defence</h4>
              <p>{leader.defence}</p>
            </li>
            <li>
              <h4 className='heading-3'>Inventory</h4>
              <ul className='leader__inventory'>{inventoryItemsList}</ul>
            </li>
            <li>
              <h4 className='heading-3'>Equiped</h4>
              <ul className='leader__inventory'>{equipedItemsList}</ul>
            </li>
          </ul>
        </div>
      )}

      {message && <div className='message'>{message}</div>}
      <div className='menu'>
        <Link to='/' className='btn btn-accent'>
          Back to main
        </Link>
      </div>
    </main>
  )
}

export default LeadersDetails
