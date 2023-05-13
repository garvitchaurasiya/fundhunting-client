import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Videos from '../components/HeroSection/Videos'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import PostModalContent from '../components/HeroSection/ModalContent/PostModalContent'
import PostModal from '../components/HeroSection/PostModal'
export default function Home() {

  const [userName, setUserName] = useState("")
  const [show, setShow] = useState(false)

  useEffect(() => {
    setUserName(localStorage.getItem("username"));
  }, [])


  return (
    <div style={{ "backgroundColor": "#f3f2ef" }}>
      <PostModal content={<PostModalContent onClose={()=>{setShow(false)}}/>} show={show} onClose={()=>{setShow(false)}}/>
      <Navbar />
      <div className='flex justify-evenly pt-24'>
        <div>

          <div className={styles.userinfo}>
            <div className='bg-gray-500 h-14 mx-1 w-14 rounded-full'  onClick={() => { setShowDropdown(!showDropdown) }}>
              <img src={`https://api.multiavatar.com/${userName}.png?apikey=jDLBmJ7USQizoZ`} />
            </div>
            <div className='font-semibold text-lg mt-4'>
              {userName}
            </div>
          </div>

          <div className={styles.optionsContainer}>

            <div className='text-left py-1 px-4 font-semibold text-blue-500 cursor-pointer'>
              <div onClick={()=>{setShow(true)}}>
                Posts
              </div>
            </div>
            <div className='text-left py-1 px-4'>
              <Link href={`/profile/${userName}?show=bids`}>
                <div className='font-semibold text-blue-500 cursor-pointer'>Bid Placed</div>
              </Link>
            </div>
            <div className='text-left py-1 px-4'>
              <Link href={`/profile/${userName}?show=saved`}>
                <div className='font-semibold text-blue-500 cursor-pointer'>Saved</div>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <Videos />
        </div>

      </div>
    </div>
  )
}
