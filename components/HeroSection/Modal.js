import React from 'react'

const Modal = (props) => {
  if (!props.show) {
    return null;
  }
  return (
    <div onClick={props.onClose} className="h-screen w-screen fixed inset-0 flex justify-center items-center z-10" style={{ 'backgroundColor': 'rgb(0,0,0,0.5)' }}>
        <div className='h-3/4 w-3/4 rounded-md bg-white relative z-10' onClick={(event) => {event.stopPropagation()}}>
            {props.content}
        </div>
    </div>
  )
}
export default Modal
