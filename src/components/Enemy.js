import React, { useContext, useState, useEffect, useRef } from 'react'
import './Enemy.css'
import { GameContext } from '../App'


function Enemy() {

     // Global game state 
     const {enemies, player, combatMessage} = useContext(GameContext)

     // State
     const [shake, setShake] = useState(0)

     // Refs
     const isFirstRun = useRef(true)

     // Effects
     useEffect(() => {
          // Update stats in DB
          if (isFirstRun.current) {
               isFirstRun.current = false
               return
          }
          combatMessage.hit ? setShake(1) :  setShake(0)
     }, [combatMessage])

     // Other variables
     const enemy = enemies[player.currentEnemy]
     const healthPercent = `${player.enemyHealth/enemy.health * 100}%`

     return (
          <div className="enemy">
               <div className="enemy__content">
                    <h2>{enemy.name}</h2>
                    
                    <div className="enemy__photo dungeon-inner">
                         <img 
                              src={enemy.image} 
                              alt={enemy.name} 
                              shake={shake}
                              onAnimationEnd={() => setShake(0)}
                         />
                         <p className="combat-message">
                              {combatMessage.hit ? `-${combatMessage.hit}` : 0}&nbsp;
                              {combatMessage.special === 'Critical Hit!' && combatMessage.special}
                         </p>
                    </div>

                    <div className="progress">
                         <div className="progress-value" style={{width : healthPercent}}></div>
                         <div className="progress-text">{player.enemyHealth} / {enemy.health}</div>
                    </div>
               </div>
          </div>
     )
}

export default Enemy
