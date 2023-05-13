import React, { useState, useEffect } from 'react'
import VideoCard from '../HeroSection/VideoCard';
import styles from '../../styles/Saved.module.css'

export default function Saved() {

    const [allVideos, setAllVideos] = useState([]);

    const getSavedVideos = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/saved`, {
            method: "GET",
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }

        });
        const json = await response.json();

        setAllVideos(json.saved.reverse());

    }

    useEffect(() => {
        getSavedVideos();

    }, []);

    return (
        <div>
            <div className={styles.container}>
                {allVideos.map((element, index) => {
                    return <VideoCard key={index} filename={element.filename} author={element.author} amount={element.amount} equity={element.equity} likes={element.likes.length} />
                })}
            </div>
        </div>
    )
}
