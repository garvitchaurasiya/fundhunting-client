import React, { useState, useEffect } from 'react'
import { Icon } from 'semantic-ui-react'
import Navbar from '../components/Navbar'
import Videos from '../components/Videos'
import styles from '../styles/Home.module.css'
import {Link} from '../routes';

export default function Home() {
  
  const [userName, setUserName] = useState("")
  useEffect(() => {
    setUserName(localStorage.getItem("username"));
  }, [])


  return (
    <div style={{ "backgroundColor": "#f3f2ef" }}>
      <Navbar />
      <div style={{ 'paddingTop': '70px', 'display': 'flex', 'justifyContent': 'space-evenly' }}>
        <div>

          <div className={styles.userinfo}>
            <Icon size="huge" name="user circle" />
            <h4>
              {/* {(typeof window !== 'undefined')?localStorage.getItem('username'):""} */}
              {userName}

            </h4>
          </div>

          <div className={styles.optionsContainer}>

            <div className={styles.options}>
              <Link route={`/profile/${userName}?show=posts`}>
                Posts
              </Link>
            </div>

            <div className={styles.options}>
              <Link route={`/profile/${userName}?show=bids`}>
                Bid Placed
              </Link>
            </div>
            <div className={styles.options}>
              <Link route={`/profile/${userName}?show=saved`}>
                Saved
              </Link>
            </div>
          </div>
        </div>

        <div>
          <Videos />
        </div>

        <div className={styles.userinfo}>

        </div>

      </div>
    </div>
  )
}
