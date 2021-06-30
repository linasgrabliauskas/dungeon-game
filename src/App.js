import "./App.css"
import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

// Images
import imgGoblin from "./assets/images/goblinpng.png"
import imgTroll from "./assets/images/troll3.png"
import imgWitch from "./assets/images/witch.png"

// Pages
import Game from "./pages/Game"
import Shop from "./pages/Shop"
import Inventory from "./pages/Inventory"
import Arena from "./pages/Arena"
import LeadersBoard from "./pages/LeadersBoard"
import LeadersDetails from "./pages/LeadersDetails"
import Register from "./pages/Register"
import Login from "./pages/Login"
import PageNotFound from "./pages/PageNotFound"
import ProtectedRoute from "./pages/ProtectedRoute"

// Enemies
const enemies = [
  {
    name: "Goblin",
    image: imgGoblin,
    damage: 8,
    health: 100,
  },
  {
    name: "Troll",
    image: imgTroll,
    damage: 10,
    health: 120,
  },
  {
    name: "Witch",
    image: imgWitch,
    damage: 15,
    health: 150,
  },
]

// Items
const items = [
  {
    name: "Sword",
    damage: 8,
    price: 40,
    sellPrice: 5,
    image: "./assets/images/sword.png",
    itemType: "weapon",
    description: "Has 20% chance to block enemy attack",
  },
  {
    name: "Bow",
    damage: 6,
    price: 300,
    sellPrice: 80,
    image: "./assets/images/bow.png",
    itemType: "weapon",
    description: "Has 30% chance to do double damage",
  },
  {
    name: "Magic wand",
    damage: 5,
    price: 1000,
    sellPrice: 400,
    image: "./assets/images/wand.png",
    itemType: "weapon",
    description: "Has 40% chance to heal hero on enemy attack by 10 hit points",
  },
  {
    name: "Leather armor",
    defence: 3,
    price: 50,
    sellPrice: 10,
    image: "./assets/images/armor1.png",
    itemType: "armor",
    description: "",
  },
  {
    name: "Hard leather armor",
    defence: 7,
    price: 250,
    sellPrice: 100,
    image: "./assets/images/armor2.png",
    itemType: "armor",
    description: "",
  },
  {
    name: "Steel armor",
    defence: 10,
    price: 800,
    sellPrice: 300,
    image: "./assets/images/armor3.png",
    itemType: "armor",
    description: "",
  },
  {
    name: "Small potion",
    heals: 20,
    price: 10,
    sellPrice: 5,
    image: "./assets/images/potion-small.png",
    itemType: "potion",
    description: "Restore HP by 20",
  },
  {
    name: "Medium potion",
    heals: 35,
    price: 30,
    sellPrice: 10,
    image: "./assets/images/potion-medium2.png",
    itemType: "potion",
    description: "Restore HP by 35",
  },
  {
    name: "Large potion",
    heals: 50,
    price: 60,
    sellPrice: 20,
    image: "./assets/images/potion-big2.png",
    itemType: "potion",
    description: "Restore HP by 50",
  },
]

export const GameContext = React.createContext()

function App() {
  // State
  const [player, setPlayer] = useState({})
  const [message, setMessage] = useState("")
  const [combatMessage, setCombatMessage] = useState({
    hit: 0,
    finalEnemyHit: 0,
    special: "",
  })
  const [gameOver, setGameOver] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Refs
  const isFirstRun = useRef(true)

  // Effects
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("dungeon-secretKey")
    if (isLoggedIn) {
      getUserStats()
    }
  }, [])

  useEffect(() => {
    // Enemy killed
    if (player.enemyHealth <= 0) {
      const randomEnemyIndex = Math.floor(Math.random() * enemies.length)
      const randomEnemy = enemies[randomEnemyIndex]
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        enemyHealth: randomEnemy.health,
        currentEnemy: randomEnemyIndex,
      }))
    }
  }, [player.enemyHealth])

  useEffect(() => {
    // We died
    if (player.health <= 0) {
      console.log("We died, Game Over")
      setGameOver(true)
    }
  }, [player.health])

  useEffect(() => {
    if (!player.equipedItems) return
    // Update combat stats on Items change
    const weaponEquiped = player.equipedItems.find(
      (item) => item.itemType === "weapon"
    )
    const armorEquiped = player.equipedItems.find(
      (item) => item.itemType === "armor"
    )
    const damage = weaponEquiped ? weaponEquiped.damage : 0
    const defence = armorEquiped ? armorEquiped.defence : 0
    // Initial damage without any weapon
    const initialDamage = 1
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      damage: initialDamage + damage,
      defence: defence,
    }))
  }, [player.equipedItems])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    // Update stats in DB
    updateUserStats()
  }, [player]) // eslint-disable-line react-hooks/exhaustive-deps

  async function getUserStats() {
    try {
      const secretKey = localStorage.getItem("dungeon-secretKey")
      const response = await fetch(
        "https://dungeon-rpg.herokuapp.com/api/v1/user/getStats",
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
        setPlayer({
          name: data.data.username,
          image: data.data.image,
          gold: data.data.gold,
          health: data.data.health,
          damage: data.data.damage,
          defence: data.data.defence,
          enemyHealth: data.data.enemyHealth,
          currentEnemy: data.data.currentEnemy,
          inventory: data.data.inventory,
          equipedItems: data.data.equiped,
        })
        setGameOver(false)
        setIsLoading(false)
        setMessage("")
      }
    } catch (err) {
      typeof err === "string" ? setMessage(err) : setMessage("Unexpected error")
      err.message && setMessage(err.message)
    }
  }

  async function updateUserStats() {
    try {
      // Prevent unexpected(initial) player sending
      if (!player.name) return
      // Updating user stats
      const userData = {
        gold: player.gold,
        health: player.health,
        currentEnemy: player.currentEnemy,
        enemyHealth: player.enemyHealth,
        damage: player.damage,
        defence: player.defence,
        inventory: player.inventory,
        equiped: player.equipedItems,
        image: player.image,
      }
      const secretKey = localStorage.getItem("dungeon-secretKey")
      const response = await fetch(
        "https://dungeon-rpg.herokuapp.com/api/v1/user/updateStats",
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
        // const data = await response.json()
        // console.log('Updated in DB', data.data)
      }
    } catch (err) {
      typeof err === "string" ? setMessage(err) : setMessage("Unexpected error")
      err.message && setMessage(err.message)
    }
  }

  // GameProvider
  const providerValue = {
    player,
    setPlayer,
    message,
    setMessage,
    combatMessage,
    setCombatMessage,
    isLoading,
    setIsLoading,
    gameOver,
    setGameOver,
    items,
    enemies,
    getUserStats,
  }

  return (
    <div className='App'>
      <div className='container'>
        <GameContext.Provider value={{ ...providerValue }}>
          <Router>
            <Switch>
              <ProtectedRoute path='/' exact>
                <Game />
              </ProtectedRoute>
              <ProtectedRoute path='/arena'>
                {" "}
                <Arena />{" "}
              </ProtectedRoute>
              <ProtectedRoute path='/inventory'>
                {" "}
                <Inventory />{" "}
              </ProtectedRoute>
              <ProtectedRoute path='/shop'>
                {" "}
                <Shop />{" "}
              </ProtectedRoute>
              <ProtectedRoute path='/leaders' exact>
                {" "}
                <LeadersBoard />{" "}
              </ProtectedRoute>
              <ProtectedRoute path='/leaders/:id'>
                {" "}
                <LeadersDetails />{" "}
              </ProtectedRoute>
              <Route path='/register'>
                {" "}
                <Register />{" "}
              </Route>
              <Route path='/login'>
                {" "}
                <Login />{" "}
              </Route>
              <Route>
                {" "}
                <PageNotFound />{" "}
              </Route>
            </Switch>
          </Router>
        </GameContext.Provider>
      </div>
    </div>
  )
}

export default App
