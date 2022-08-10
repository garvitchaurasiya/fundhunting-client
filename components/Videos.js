import React, { useState, useEffect } from 'react'

import Card2 from "./Card"
import styles from "../styles/Home.module.css"

export default function Videos(props) {

  const [allVideos, setAllVideos] = useState([]);
  const [allBids, setAllBids] = useState([]);

  useEffect(() => {

    // // (props.getUserPosts)?getUserPosts():getAllVideos();

    // if(props.getUserPosts){
    //   console.log("posts");
    //   getUserPosts();
    // }
    // // else if(props.getPlacedBids){
    // //   console.log("bids")
    // //   getPlacedBids();
    // // }
    // else{
    //   console.log("all videos");
      getAllVideos();
    // }

  }, []);

  const getAllVideos = async () => {
    const response = await fetch("http://localhost:5000/api/video/getvideos", {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      }

    });
    const json = await response.json();
    setAllVideos(json.reverse());

  }

  // const getUserPosts = async() =>{
  //   const response = await fetch("http://localhost:5000/api/video/getuservideos",{
  //     method: "POST",
  //     headers: {
  //       'Content-type':'application/json'
  //     },
  //     body: JSON.stringify({ username: props.username })
  //   });
  //   const json = await response.json();
  //   setAllVideos(json);

  // }

  // const getPlacedBids = async() =>{
  //   const response = await fetch("http://localhost:5000/api/auth/getplacedbids",{
  //     method: "POST",
  //     headers: {
  //       'Content-type':'application/json',
  //       'auth-token': localStorage.getItem('token')
  //     },
  //   });
  //   const json = await response.json();
  //   setAllBids(json.placedBids);
  //   console.log("allbids", allBids);

  //   allBids.map((e, index) => {
  //     console.log("e", e);
  //   })
  //   // allBids.map(async(e, index) => {
  //   //   const response = await fetch("http://localhost:5000/api/video/getpostbyname",{
  //   //     method: "POST",
  //   //     headers: {
  //   //       'Content-type':'application/json',
  //   //     },
  //   //     body: JSON.stringify({filename: e})
  //   //   });
  //   //   const json = await response.json();
  //   //   setAllVideos(json.placedBids);
  //   //   console.log(json);
  //   // })


  // }

  return (
    <div>
      <div className={styles.renderCards}>
        {
          allVideos.map((element, index) => {
            return <Card2 key={index} filename={element.filename} author={element.author} amount={element.amount} equity={element.equity} likes={element.likes.length}/>
          })
        }
      </div>

    </div>
  )
}
