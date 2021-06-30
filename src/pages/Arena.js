import React, { useContext } from 'react'
import './Arena.css'
import { Link } from 'react-router-dom'
import { GameContext } from '../App'
import Spinner from '../components/Spinner'
import { FaAngleDoubleLeft } from 'react-icons/fa'

// Components
import Enemy from '../components/Enemy'
import Player from '../components/Player'
import BattleBar from '../components/BattleBar'
import GameOver from '../components/GameOver'

function Arena() {

     // Global game state 
     const { isLoading, gameOver } = useContext(GameContext)

     return (
          <main className="arena dungeon-bg">
               <h1 className="heading-1">Arena</h1>

               { isLoading && <Spinner/> }
               {!isLoading && 
               <div className="arena__content">
                    <Player/>
                    <Enemy/>
                    <BattleBar/>
               </div>}

               {gameOver && <GameOver/>}
               
               <div className="menu"><Link to="/" className="btn btn-accent"><FaAngleDoubleLeft/>BACK</Link></div>
          </main>
     )
}

export default Arena
