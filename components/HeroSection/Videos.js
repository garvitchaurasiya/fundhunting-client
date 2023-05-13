import React, { useState, useEffect } from 'react'

import VideoCard from "./VideoCard"
import styles from "../../styles/Home.module.css"

export default function Videos(props) {

  const [allVideos, setAllVideos] = useState([]);

  useEffect(() => {
    getAllVideos();
  }, []);

  const getAllVideos = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/getvideos`, {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      }
    });
    const json = await response.json();
    setAllVideos(json.reverse());

  }

  return (
    <div>
      <div className={styles.renderCards}>
        {
          allVideos.map((element, index) => {
            return <VideoCard key={index} className="z-20" filename={element.filename} author={element.author} amount={element.amount} equity={element.equity} likes={element.likes.length} />
          })
        }
      </div>

    </div>
  )
}
