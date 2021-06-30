import React, { useContext } from 'react'
import './Player.css'
import { GameContext } from '../App'

function Player() {

     // Global game state 
     const { player, combatMessage } = useContext(GameContext)

     return (
          <div className="player">
               <div className="player__content">
                    
                    <h2>{player.name}</h2>

                    <div className="player__photo dungeon-inner">
                         <img src={process.env.PUBLIC_URL + player.image} alt="player"/>
                         <p className="combat-message">
                              {combatMessage.finalEnemyHit ? `-${combatMessage.finalEnemyHit}` : 0}&nbsp; 
                              {combatMessage.special === 'Critical Hit!' ? '' : combatMessage.special}
                         </p>
                    </div>

                    <div className="progress">
                         <div className="progress-value" style={{width : `${player.health}%`}}></div>
                         <div className="progress-text">{player.health} / 100</div>
                    </div>
               </div>
          </div>
     )
}

export default Player
