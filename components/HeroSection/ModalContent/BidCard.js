import React from 'react'

const BidCard = (props) => {
  
  return (
      <div className='rounded-lg p-2 my-2' style={{'border': '1px solid lightgray'}}>
          <div className='font-semibold text-xl'>{props.amount}/-</div>
          <div className='font-semibold text-sm text-gray-500'>{props.equity}</div>
          <div className='font-semibold text-sm text-blue-500'>{props.bidPlacer}</div>
      </div>
  )
}

export default BidCard
