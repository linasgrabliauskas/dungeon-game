import React, { useState, useContext } from 'react'
import './Item.css'
import { GameContext } from '../App'
import uuid from 'react-uuid'

function Item({ item, inInventory, equiped }) {

     // Global game state 
     const { player, setPlayer, setMessage } = useContext(GameContext)
     
     // State
     const [showDescription, setShowDescription] = useState(false)

     function equipItem(){   
          // Unequip same type item first
          const updatedEquipment = player.equipedItems.filter(equipedItem => equipedItem.itemType !== item.itemType)
          // Toggle Equip/ Unequip item
          equiped 
          ? setPlayer(prevPlayer => ({...prevPlayer, equipedItems: [...updatedEquipment] })) // Unequip item
          : setPlayer(prevPlayer => ({...prevPlayer, equipedItems: [...updatedEquipment, item] })) // Equip item
     }

     function buyItem(){
          // Validate
          if(item.price > player.gold) return setMessage('Not enough gold')
          if(player.inventory.length >= 12) return setMessage('Inventory is full')
          // Update gold and inventory
          const boughtItem = {...item, id: uuid()}
          setPlayer(prevPlayer => ({...prevPlayer, 
               inventory: [...prevPlayer.inventory, boughtItem],
               gold: prevPlayer.gold - item.price
          }))
          setMessage(`${item.name} added to inventory`)
     }

     function sellItem(){
          // Update equiped items
          if (equiped){
               const updatedEquipment = player.equipedItems.filter(equipedItem => equipedItem.id !== item.id)
               setPlayer(prevPlayer => ({...prevPlayer, equipedItems: updatedEquipment }))
          }
          // Update inventory
          const updatedInventory = [...player.inventory].filter(inventoryItem => inventoryItem.id !== item.id)
          setPlayer(prevPlayer => ({...prevPlayer,  inventory: updatedInventory }))
          // Update gold
          setPlayer(prevPlayer => ({...prevPlayer, gold: prevPlayer.gold + item.sellPrice}))
          // Update notification
          setMessage(`${item.sellPrice} gold added to inventory`)
     }

     return (
          <div className={`item ${equiped && 'equiped'}`}>
               <h4 className="item__title">{item.name}</h4>

               <div className="item__img"><img src={process.env.PUBLIC_URL + item.image} alt={item.name}/></div>

               {item.itemType === 'weapon' && <p className="item__ability">Damage: {item.damage}</p>}
               {item.itemType === 'armor' && <p className="item__ability">Defence: {item.defence}</p>}
               {item.itemType === 'potion' && <p className="item__ability">Heals: {item.heals}</p>}

               {inInventory && <button className="btn" onClick={equipItem}>{equiped ? 'Unequip' : 'Equip'}</button>}
               {inInventory
               ? <button className="btn" onClick={sellItem}>Sell: {item.sellPrice}</button>
               : <button className="btn" onClick={buyItem}>Buy: {item.price}</button>}

               {item.description &&    
               <p className="item__description" onClick={() => setShowDescription(prevState => !prevState)}>?
               {showDescription && <span className="item__description-text">{item.description}</span>}
               </p>}
          </div>
     )
}

export default Item
