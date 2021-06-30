import React, { useContext, useState } from 'react'
import './BattleBar.css'
import { FaCoins, FaAngleUp, FaHeart } from 'react-icons/fa'
import { GameContext } from '../App'
import defaultImg from '../assets/images/default.png'

function BattleBar() {

     // Global game state 
     const {  player, setPlayer, enemies, setCombatMessage, gameOver } = useContext(GameContext)

     const [weaponsModalOpen, setWeaponsModalOpen] = useState(false)
     const [armorsModalOpen, setArmorsModalOpen] = useState(false)
     const [potionsModalOpen, setPotionsModalOpen] = useState(false)

     function attack(){
          // Reset combat message
          setCombatMessage({hit: 0, finalEnemyHit: 0, special: ''})

          let hit = random(player.damage)

          // Special effects (bow and magic wand)
          const isBowEquiped = player.equipedItems.find(item => item.name === 'Bow')
          if(isBowEquiped){
               // 30% chance of doing double damage
               const specialEffectTriggered = randomTriggerByPercent(30)
               if(specialEffectTriggered) {
                    setCombatMessage(prevState => ({...prevState, special: 'Critical Hit!'}))
                    hit = hit * 2
               }
          }
          const isWandEquiped = player.equipedItems.find(item => item.name === 'Magic wand')
          if(isWandEquiped){
               // 40% chance of heal hero by 10 HP
               const specialEffectTriggered = randomTriggerByPercent(40)
               if(specialEffectTriggered) {
                    setCombatMessage(prevState => ({...prevState, special: '+10 Heal!'}))
                    player.health <= 90 // Don't overheal above 100
                    ? setPlayer(prevPlayer => ({...prevPlayer, health: prevPlayer.health + 10}))
                    : setPlayer(prevPlayer => ({...prevPlayer, health: 100}))
               }
          }

          // Update health and gold and combat Message
          setCombatMessage(prevState => ({...prevState, hit: hit}))
          setPlayer(prevPlayer => ({...prevPlayer, enemyHealth: prevPlayer.enemyHealth - hit}))
          setPlayer(prevPlayer => ({...prevPlayer, gold: prevPlayer.gold + random(10)}))

          // Enemy hits back
          const enemy = enemies[player.currentEnemy]
          enemyAttack(enemy)
     }

     function enemyAttack(currentEnemy){
          let enemyHit = random(currentEnemy.damage)
          // Special effects (sword)
          const isSwordEquiped = player.equipedItems.find(item => item.name === 'Sword')
          if(isSwordEquiped){
               // 20% chance of blocking enemy attack
               const specialEffectTriggered = randomTriggerByPercent(20)
               if(specialEffectTriggered) {
                    setCombatMessage(prevState => ({...prevState, special: 'Blocked!'}))
                    enemyHit = 0
               }
          }
          const blockAmount = random(player.defence)
          const finalEnemyHit = (enemyHit - blockAmount) > 0 ? (enemyHit - blockAmount) : 0
          setCombatMessage(prevState => ({...prevState, finalEnemyHit: finalEnemyHit}))
          // Update hero HP
          player.health - finalEnemyHit >= 0 // Don't overkill below 0 HP
          ? setPlayer(prevPlayer => ({...prevPlayer, health: prevPlayer.health - finalEnemyHit}))
          : setPlayer(prevPlayer => ({...prevPlayer, health: 0}))
     }

     function changeEquipedItem(type){
          setWeaponsModalOpen(prevState => prevState ? false : (type === "weapon" ? true : false))
          setArmorsModalOpen(prevState => prevState ? false : (type === "armor" ? true : false))
          setPotionsModalOpen(prevState => prevState ? false : (type === "potion" ? true : false))
     }

     function switchItem(item){
          // Unequip same type item first
          const updatedEquipment = player.equipedItems.filter(equipedItem => equipedItem.itemType !== item.itemType)
          // Equip item
          setPlayer(prevPlayer => ({...prevPlayer, equipedItems: [...updatedEquipment, item] }))
          // Close modals
          setWeaponsModalOpen(false)
          setArmorsModalOpen(false)
          setPotionsModalOpen(false)
     }

     function drinkPotion(){
          const potion = player.equipedItems.find(item => item.itemType === "potion")
          if (!potion) return
          const heals = potion.heals
          const updatedInventory = player.inventory.filter(item => item.id !== potion.id)
          const updatedEquipedItems = player.equipedItems.filter(item => item.id !== potion.id)
          setPlayer(prevPlayer => ({...prevPlayer, 
               health: prevPlayer.health + heals >= 100 ? 100 : prevPlayer.health + heals, // Don't overheal above 100
               inventory: updatedInventory,
               equipedItems: updatedEquipedItems
          }))
     }

     function random(number){
          return Math.round(Math.random() * number)
     }

     function randomTriggerByPercent(percent){
          const randomPercent = Math.random() * 100
          return randomPercent < percent
     }

     const equipedWeapon = player.equipedItems.find(item => item.itemType === "weapon")
     const equipedArmor = player.equipedItems.find(item => item.itemType === "armor")
     const equipedPotion = player.equipedItems.find(item => item.itemType === "potion")

     const weaponList = player.inventory
          .filter(item => item.itemType === "weapon")
          .map(item => <li onClick={() => switchItem(item)} key={item.id}> <img src={item.image} alt={item.name} /></li>)
     const armorsList = player.inventory
          .filter(item => item.itemType === "armor")
          .map(item => <li onClick={() => switchItem(item)} key={item.id}> <img src={item.image} alt={item.name} /></li>)
     const potionsList = player.inventory
          .filter(item => item.itemType === "potion")
          .map(item => <li onClick={() => switchItem(item)} key={item.id}> <img src={item.image} alt={item.name} /></li>)

     return (
          <div className="battle-bar">
               <ul className="battle-bar__equiped">
                    <li className="battle-bar__equiped-item">
                         <img src={equipedWeapon ? equipedWeapon.image : defaultImg} alt="weapon"/>
                         <button className="btn btn-small" onClick={() => changeEquipedItem("weapon")} disabled={weaponList.length === 0}><FaAngleUp/></button>
                         {weaponsModalOpen && <ul className="battle-bar__equiped-item-switch">{weaponList}</ul>}
                    </li>
                    <li className="battle-bar__equiped-item">
                         <img src={equipedArmor ? equipedArmor.image : defaultImg} alt="armor"/>
                         <button className="btn btn-small" onClick={() => changeEquipedItem("armor")}  disabled={armorsList.length === 0}><FaAngleUp/></button>
                         {armorsModalOpen && <ul className="battle-bar__equiped-item-switch">{armorsList}</ul>}
                    </li>
                    <li className="battle-bar__equiped-item">
                         <img src={equipedPotion ? equipedPotion.image : defaultImg} alt="potion" onClick={drinkPotion}/>
                         <button className="btn btn-small" onClick={() => changeEquipedItem("potion")}  disabled={potionsList.length === 0}><FaAngleUp/></button>
                         {potionsModalOpen && <ul className="battle-bar__equiped-item-switch">{potionsList}</ul>}
                    </li>
               </ul>
               <div className="battle-bar__actions">
                    <button className="btn" onClick={attack} disabled={gameOver}>Attack</button>
               </div>
               <div className="battle-bar__stats">
                    <h4 className="heading-3"><FaCoins/> Gold: {player.gold}</h4>
                    <h4 className="heading-3"><FaHeart/> Health: {player.health}</h4>
               </div>

          </div>
     )
}

export default BattleBar
