import React, { useContext, useEffect, useState } from 'react'
import './Game.css'
import { Link } from 'react-router-dom'
import { GameContext } from '../App'
import { FaCoins, FaHeart } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { useHistory  } from 'react-router-dom'

// Images
import imgShop from '../assets/images/shop2.png'
import imgInventory from '../assets/images/inventory4.png'
import imgArena from '../assets/images/Dungeon3.png'
import imgLeaders from '../assets/images/leaderboard2.png'

function Game() {

     // Global game state 
     const { player, getUserStats, isLoading, message } = useContext(GameContext)

     // State
     const [modalLogoutOpen, setModalLogoutOpen] = useState(false)

     // Other variables
     const history = useHistory()

     useEffect(() => {
          getUserStats() 
     }, []) // eslint-disable-line react-hooks/exhaustive-deps
     
     function logout(){
          localStorage.removeItem('dungeon-secretKey')
          history.push('/login')
     }

     return (
          <main className="game dungeon-bg">
               <h1 className="heading-1">Dungeon</h1>


               <ul className="game__nav">
                    <li>
                         <p className="heading-2">Shop</p>
                         <Link to="/shop"><img src={imgShop} alt="shop" /></Link>
                    </li>
                    <li>
                         <p className="heading-2">Inventory</p>
                         <Link to="/inventory"><img src={imgInventory} alt="inventory" /></Link>
                    </li>
                    <li>
                         <p className="heading-2">Arena</p>
                         <Link to="/arena"><img src={imgArena} alt="arena" /></Link>
                    </li>
                    <li>
                         <p className="heading-2">Leaders</p>
                         <Link to="/leaders"><img src={imgLeaders} alt="leaders board" /></Link>
                    </li>
               </ul>

               { isLoading && <Spinner/> }
               {!isLoading &&
               <div className="game__stats">
                    <h4 className="heading-3"><FaCoins/> Gold: {player.gold}</h4>
                    <h4 className="heading-3"><FaHeart/> Health: {player.health}</h4>
               </div>}
               
               {message && <div className="message">{message}</div>}
               <div className="menu menu-bottom">
                    <button className="btn btn-light" onClick={() => setModalLogoutOpen(true)}>Logout</button>
               </div>  
               {modalLogoutOpen && <Modal confirm={logout} cancel={() => setModalLogoutOpen(false)} question="Are you sure you want to log out?"/>}
          </main>
     )
}

export default Game
