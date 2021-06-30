import React, { useState, useRef } from "react"
import "./Register.css"
import { Link, useHistory } from "react-router-dom"

function Register() {
  // State
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [message, setMessage] = useState("")

  // Refs
  const usernameInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  const passwordConfirmInputRef = useRef(null)

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
  function validatePasswords(password, confirmPassword) {
    return password === confirmPassword
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validate username
    if (!validateInputLength(username, 4, 20)) {
      usernameInputRef.current.focus()
      setMessage("Your username must be 4-20 characters long")
      // Validate passwords
    } else if (!validateInputLength(password, 4, 20)) {
      passwordInputRef.current.focus()
      setMessage("Your password must be 4-20 characters long")
    } else if (!validateRegex(password)) {
      passwordInputRef.current.focus()
      setMessage("Your password must contain at least one digit")
    } else if (!validatePasswords(password, passwordConfirm)) {
      passwordConfirmInputRef.current.focus()
      setMessage("Passwords should match")
      // Validation success
    } else {
      try {
        const formData = {
          username: username,
          password: password,
          passwordConfirm: passwordConfirm,
        }
        const response = await fetch(
          "https://dungeon-rpg.herokuapp.com/api/v1/user/register",
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
          // Registration successfull
          // Reset inputs
          setUsername("")
          setPassword("")
          setPasswordConfirm("")
          setMessage("")
          history.push("/login")
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
    <main className='register dungeon-inner'>
      <h1 className='heading-1'>Dungeon</h1>

      <form className='register__form' onSubmit={handleSubmit} noValidate>
        <h2 className='heading-2'>Create account</h2>
        <input
          type='text'
          placeholder='Username'
          aria-label='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          ref={usernameInputRef}
          maxLength='20'
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
        <input
          type='password'
          placeholder='Confirm password'
          aria-label='Confirm password'
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          ref={passwordConfirmInputRef}
          maxLength='20'
        />
        <button className='btn'>Create account</button>
        <Link to='/login'>Already have account</Link>
        <p className='info-message'>{message}</p>
      </form>
    </main>
  )
}

export default Register
