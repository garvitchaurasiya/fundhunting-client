import React, { useState, useEffect } from 'react'
import styles from '../styles/Navbar.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome } from "react-icons/fa";
import { AiFillPlusSquare } from "react-icons/ai";
import { BsFillBookmarkFill } from "react-icons/bs";
import PostModal from './HeroSection/PostModal';
import PostModalContent from './HeroSection/ModalContent/PostModalContent';


export default function Navbar() {
  const [userName, setuserName] = useState("")
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false)
  const [show, setShow] = useState(false)
  let searchTerm = "";
  const Router = useRouter();
  useEffect(() => {

    if (!localStorage.getItem('token')) {
      Router.push('/login')
    } else {
      setuserName(localStorage.getItem('username'));
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    Router.push("/login")
  }

  const filterContent = (users, searchTerm) => {
    const result = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    result.splice(10);
    setSearchedUsers(result);
  }

  const changeSearchTerm = async (e) => {
    searchTerm = e.target.value;
    if (searchTerm === "") {
      document.getElementById("searchResults").style.display = "none";
    } else {
      document.getElementById("searchResults").style.display = "block";
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/allusers`, {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      },
    })
    const json = await response.json();
    filterContent(json.users, searchTerm);
  }
  function onFocus() {
    document.getElementById("searchBar").focus();
  }

  if (typeof window !== "undefined") {
    document.body.addEventListener('click', () => {
      if (document.getElementById("searchResults")) {
        document.getElementById("searchResults").style.display = "none";
      }
    });
  }

  return (
    <div className={styles.container}>
      <PostModal content={<PostModalContent onClose={()=>{setShow(false)}}/>} show={show} onClose={()=>{setShow(false)}}/>
      <Link href="/" style={{ "color": "black" }}>
        <div className={styles.fundhunting}>
          Fund Hunting
        </div>
      </Link>
      <div className={styles.search}>

        <input id="searchBar" onClick={onFocus} className={styles.searchBar} autoComplete="off" placeholder='Search' onChange={changeSearchTerm} />

        <div id="searchResults" className={styles.searchResults}>
          {searchedUsers.map((ele, index) => {
            return <Link key={index} href={`/profile/${ele.username}/?show=posts`}>
              <div>{ele.username}</div>
            </Link>
          })}
        </div>

      </div>
      <div>
        <ul className={styles.list}>
          <li>
            <Link href="/">
              <FaHome className="text-3xl mx-1" />
            </Link>
          </li>
          <li>
            <Link href="/">
              <AiFillPlusSquare  onClick={()=>{setShow(true)}} className="text-3xl mx-1" />
            </Link>
          </li>
          <li>
            <Link href={`/profile/${userName}?show=saved`}>
              <BsFillBookmarkFill className="text-3xl mx-1" />
            </Link>
          </li>

          <li>
            <div className='bg-gray-500 h-10 mx-1 w-10 rounded-full'  onClick={() => { setShowDropdown(!showDropdown) }}>
              <img src={`https://api.multiavatar.com/${userName}.png?apikey=jDLBmJ7USQizoZ`} />
            </div>
            {
              showDropdown &&
              <div className="absolute">
                <div
                  className='bg-white px-4 py-2 hover:bg-gray-200'
                  onClick={() => { Router.push(`/profile/${userName}?show=posts`) }}>
                  Your Profile
                </div>
                <div
                  className='bg-white px-4 py-2 hover:bg-gray-200'
                  onClick={() => { Router.push(`/profile/${userName}?show=bids`) }}>
                  Bid Placed
                </div>
                <div
                  className='bg-white px-4 py-2 hover:bg-gray-200'
                  onClick={() => { Router.push(`/profile/${userName}?show=saved`) }}>
                  Saved
                </div>
                <div
                  className='bg-white px-4 py-2 hover:bg-gray-200 border-t'
                  onClick={handleLogout} text='Logout' >
                  Logout
                </div>

              </div>
            }
          </li>
        </ul>
      </div >
    </div >
  )
}
