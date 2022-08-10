import React, { useState, useEffect } from 'react'
import styles from '../styles/Navbar.module.css'
import { Router, Link } from '../routes';
import { Icon, Input, Dropdown } from "semantic-ui-react";

export default function Navbar() {
  const [userName, setuserName] = useState("")
  const [searchedUsers, setSearchedUsers] = useState([]);
  let searchTerm = "";
  useEffect(() => {

    if (!localStorage.getItem('token')) {
      Router.push({ pathname: '/login' })
    } else {
      setuserName(localStorage.getItem('username'));
    }
    // changeSearchTerm();

  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    Router.pushRoute("/login")
  }

  const filterContent = (users, searchTerm) => {
    const result = users.filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log(result);
    setSearchedUsers(result);
  }

  const changeSearchTerm = async (e) => {
    // setSearchTerm({...searchTerm, [e.target.name]:e.target.value});
    searchTerm = e.target.value;
    if (searchTerm === "") {
      document.getElementById("searchResults").style.display = "none";
    } else {
      document.getElementById("searchResults").style.display = "block";
    }
    const response = await fetch("http://localhost:5000/api/auth/allusers", {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      },
    })
    const json = await response.json();
    console.log(json);
    filterContent(json.users, searchTerm);
  }
  function onFocus() {
    document.getElementById("searchBar").focus();
  }

  if (typeof window !== "undefined") {
    document.body.addEventListener('click', () => {
      if(document.getElementById("searchResults")){
        document.getElementById("searchResults").style.display = "none";
      }
    });
  }

  return (
    <div className={styles.container}>
      <Link route="/" style={{ "color": "black" }}>
        <div className={styles.fundhunting}>
          Fund Hunting
        </div>
      </Link>
      <div className={styles.search}>

        <input id="searchBar" onClick={onFocus} className={styles.searchBar} autoComplete="off" placeholder='Search' onChange={changeSearchTerm} />
        {/* <Input className={styles.searchBar} icon="search" placeholder='Search' onChange={changeSearchTerm} /> */}

        <div id="searchResults" className={styles.searchResults}>
          {searchedUsers.map((ele, index) => {
            return <Link key={index} route={`/profile/${ele.username}/?show=posts`}>
              <div>{ele.username}</div>
            </Link>
          })}
        </div>

      </div>
      <div>
        <ul className={styles.list}>
          <li>
            <Link route="/">
              <Icon size="large" name="home" />
            </Link>
          </li>
          <li>
            <Link route="/video/post">
              <Icon size="large" name="add square" />
            </Link>
          </li>
          <li>
            <Link route={`/profile/${userName}?show=saved`}>
              <Icon size="large" name="bookmark" />
            </Link>
          </li>

          <li>
            <Dropdown className={styles.dropdown} icon={{ name: 'user circle', size: 'large' }}  >
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { Router.pushRoute(`/profile/${userName}?show=posts`) }}>
                  Your Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { Router.pushRoute(`/profile/${userName}?show=bids`) }} >
                  Bid Placed
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { Router.pushRoute(`/profile/${userName}?show=saved`) }}>
                  Saved
                </Dropdown.Item>

                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} text='Logout' />
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </div>
  )
}
