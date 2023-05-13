import React from 'react'
import Link from 'next/link'

const CommentCard = (props) => {
  return (
    <div>
      <div className='rounded-lg my-6' style={{}}>

        <Link href={`/profile/${props.username}?show=posts`} >
          <div className='flex'>
            <div className='bg-gray-500 h-10 mx-4 w-10 rounded-full inline-block' onClick={() => { setShowDropdown(!showDropdown) }}>
              <img src={`https://api.multiavatar.com/${props.username}.png?apikey=jDLBmJ7USQizoZ`} />
            </div>
            <div className='font-semibold text-sm  cursor-pointer'>{props.username}</div>
            <div className='text-sm ml-2'>{props.comment} </div>
          </div>
        </Link>
        <div>
        <hr className='w-24 m-auto'/>
        </div>
      </div>
    </div>
  )
}

export default CommentCard