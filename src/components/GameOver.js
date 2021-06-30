import React, { useContext } from 'react'
import './GameOver.css'
import { useHistory  } from 'react-router-dom'
import { GameContext } from '../App'

function GameOver() {

     // Global game state 
     const { setPlayer, setGameOver, setCombatMessage } = useContext(GameContext)

     // Other variables
     const history = useHistory()

     function playAgain(){
          console.log('Play again');
          // Reset player
          setPlayer(prevPlayer => ({...prevPlayer, 
               gold: 100,
               health: 100,
               damage: 0,
               defence: 0,
               currentEnemy: 0,
               enemyHealth: 100,
               inventory: [],
               equipedItems: []
          }))
          setGameOver(false)
          setCombatMessage({hit: 0, finalEnemyHit: 0, special: ''})
     }

     function logout(){
          localStorage.removeItem('dungeon-secretKey')
          history.push('/login')
     }

     return (
          <div className="game-over">
               <div className="game-over__content">
                    <h2 className="heading-2">Game Over</h2>
                    <div className="game-over__controls">
                         <button className="btn btn-primary" onClick={playAgain}>PLAY AGAIN</button>
                         <button className="btn btn-primary" onClick={logout}>LOG OUT</button>
                    </div>
               </div>  
          </div>
     )
}

export default GameOver
