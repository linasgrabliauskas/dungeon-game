import React, { useState, useRef } from "react"
import "./Login.css"
import { Link, useHistory } from "react-router-dom"

function Login() {
  // State
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  // Refs
  const usernameInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  // Other
  const history = useHistory()

  function validateInputLength(input, min, max) {
    return input.length >= min && input.length <= max
  }
  function validateRegex(input) {
    // (?=.*?[0-9]) => should contain at least one digit
    const regex = /(?=.*?[0-9])/
    return regex.test(input)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Validate username
    if (!validateInputLength(username, 4, 20)) {
      usernameInputRef.current.focus()
      setMessage("Username is incorrect")
      // Validate password
    } else if (!validateInputLength(password, 4, 20)) {
      passwordInputRef.current.focus()
      setMessage("Password is incorrect")
    } else if (!validateRegex(password)) {
      passwordInputRef.current.focus()
      setMessage("Your password must contain at least one digit")
      // Validation success
    } else {
      try {
        const formData = {
          username: username,
          password: password,
        }
        const response = await fetch(
          "https://dungeon-rpg.herokuapp.com/api/v1/user/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        )
        if (response.status === 404)
          throw new Error("Connection error. Please try again later")
        if (response.status !== 200) {
          const data = await response.json()
          const errors = data.errors
          throw errors.msg
        } else {
          // Login successfull
          const data = await response.json()
          const secretKey = data.data
          localStorage.setItem("dungeon-secretKey", secretKey)
          // Reset inputs
          setUsername("")
          setPassword("")
          setMessage("")
          history.push("/")
        }
      } catch (err) {
        typeof err === "string"
          ? setMessage(err)
          : setMessage("Unexpected error")
        err.message && setMessage(err.message)
      }
    }
  }

  return (
    <main className='login dungeon-inner'>
      <h1 className='heading-1'>Dungeon</h1>

      <form className='login__form' onSubmit={handleSubmit} noValidate>
        <input
          type='text'
          placeholder='Username'
          aria-label='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameInputRef}
          maxLength='20'
          autoFocus
        />
        <input
          type='password'
          placeholder='Password'
          aria-label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          maxLength='20'
        />
        <button className='btn'>Log In</button>
        <Link to='/register'>Create new account</Link>
        <p className='info-message'>{message}</p>
      </form>
    </main>
  )
}

export default Login
