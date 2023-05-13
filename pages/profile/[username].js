import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import styles from '../../styles/Profile.module.css';
import Saved from '../../components/Profile/Saved';
import UserPosts from '../../components/Profile/UserPosts';
import PlacedBids from '../../components/Profile/PlacedBids';

function Profile(props) {
  const [show, setShow] = useState('posts');
  const [authorised, setAuthorised] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('username')) {
      setAuthorised(localStorage.getItem('username') !== props.username);
    }
    setShow(props.query.show);
  }, []);

  const handleShowChange = (value) => {
    setShow(value);
  };

  return (
    <div style={{ backgroundColor: '#f3f2ef' }}>
      <Navbar />
      <div className={styles.hero_section}>
        <div className='bg-gray-500 h-16 w-16 mr-1 rounded-full'>
          <img src={`https://api.multiavatar.com/${props.username}.png?apikey=jDLBmJ7USQizoZ`} />
        </div>
        <h2 className='font-semibold'>{props.username}</h2>
        <hr />
      </div>
      <div className={styles.options}>
        <div
          onClick={() => {
            handleShowChange('posts');
          }}
          style={{ borderBottom: show === 'posts' ? '3px solid black' : 'none' }}
        >
          POSTS
        </div>

        <div
          hidden={authorised}
          onClick={() => {
            handleShowChange('bids');
          }}
          style={{ borderBottom: show === 'bids' ? '3px solid black' : 'none' }}
        >
          BIDS
        </div>

        <div
          hidden={authorised}
          onClick={() => {
            handleShowChange('saved');
          }}
          style={{ borderBottom: show === 'saved' ? '3px solid black' : 'none' }}
        >
          SAVED
        </div>
      </div>

      <div hidden={show === 'posts' ? false : true}>
        <UserPosts username={props.username} />
      </div>

      <div hidden={show === 'bids' ? false : true}>
        <PlacedBids />
      </div>

      <div hidden={show === 'saved' ? false : true}>
        <Saved />
      </div>
    </div>
  );
}

export async function getServerSideProps(props) {
  const username = props.query.username;

  const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/getuser`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },

    body: JSON.stringify({ username }),
  });
  const json = await response.json();

  return {
    props: {
      username: json.user.username,
      email: json.user.email,
      mobileNumber: json.user.mobileNumber,
      query: props.query,
    },
  };
}

export default Profile;