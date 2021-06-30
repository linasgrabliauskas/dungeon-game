import React from 'react'
import './Modal.css'

function Modal({ confirm, cancel, question}) {

     return (
          <div className="modal">
               <div className="modal__content">
                    <h4>{question}</h4>
                    <div className="modal__controls">
                         <button onClick={confirm}  className="btn" aria-label="confirm" >Confirm</button>
                         <button onClick={cancel} className="btn cancel" aria-label="cancel">Cancel</button>
                    </div>
               </div>
          </div>
     )

}

export default Modal