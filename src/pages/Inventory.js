import React, { useContext } from 'react'
import './Inventory.css'
import { GameContext } from '../App'
import Item from '../components/Item'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { FaCoins, FaHeart, FaShieldAlt, FaAngleDoubleLeft } from 'react-icons/fa'
import { GiCrossedSwords } from "react-icons/gi"

function Inventory() {

     // Global game state 
     const { player, message, isLoading } = useContext(GameContext)

     const inventoryItemsList = !isLoading && player.inventory.map(item => <li key={item.id}>
          <Item 
               item={item} 
               inInventory={true} 
               equiped={player.equipedItems.find(({ id }) => id === item.id)}
          />
     </li>)

     return (
          <main className="inventory dungeon-bg">
               <h1 className="heading-1">Inventory</h1>

               { isLoading && <Spinner/> }

               <ul>{inventoryItemsList}</ul>

               {!isLoading && <div className="inventory__stats">
                    <h4 className="heading-3"><FaCoins/> Gold: {player.gold}</h4>
                    <h4 className="heading-3"><FaHeart/> Health: {player.health}</h4>
                    <h4 className="heading-3"><GiCrossedSwords/> Damage: {player.damage}</h4>
                    <h4 className="heading-3"><FaShieldAlt/> Defence: {player.defence}</h4>
               </div>} 

               {message && <div className="message">{message}</div>}
               <div className="menu"><Link to="/" className="btn btn-accent"><FaAngleDoubleLeft/>BACK</Link></div>
          </main>
     )
}

export default Inventory
