import React, { useContext } from 'react'
import './Shop.css'
import { GameContext } from '../App'
import Item from '../components/Item'
import { Link } from 'react-router-dom'
import { FaCoins, FaHeart, FaAngleDoubleLeft } from 'react-icons/fa'

function Shop() {

     // Global game state 
     const { items, player, message } = useContext(GameContext)

     return (
          <main className="shop dungeon-bg">
               <h1 className="heading-1">Shop</h1>

               <h2 className="heading-2">Weapons</h2>
               <ul>
                    <li><Item item={items[0]}/></li>
                    <li><Item item={items[1]}/></li>
                    <li><Item item={items[2]}/></li>
               </ul>

               <h2 className="heading-2">Armors</h2>
               <ul >
                    <li><Item item={items[3]}/></li>
                    <li><Item item={items[4]}/></li>
                    <li><Item item={items[5]}/></li>
               </ul>

               <h2 className="heading-2">Potions</h2>
               <ul>
                    <li><Item item={items[6]}/></li>
                    <li><Item item={items[7]}/></li>
                    <li><Item item={items[8]}/></li>
               </ul>
              
               <div className="game__stats">
                    <h4 className="heading-3"><FaCoins/> Gold: {player.gold}</h4>
                    <h4 className="heading-3"><FaHeart/> Health: {player.health}</h4>
               </div> 

               <div className="menu"><Link to="/" className="btn btn-accent"><FaAngleDoubleLeft/>BACK</Link></div>
               {message && <div className="message">{message}</div>}
          </main>
     )
}

export default Shop


