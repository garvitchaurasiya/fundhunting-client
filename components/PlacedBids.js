import React, {useState, useEffect} from 'react'
import Card2 from './Card';
import styles from '../styles/Saved.module.css'

export default function PlacedBids() {
    
    let allBids = [];
    const [allVideos, setAllVideos] = useState([]);

    const func = async ()=>{

        const response = await fetch("http://localhost:5000/api/auth/getplacedbids", {
                method: "POST",
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();

        allBids = json.placedBids;
        allBids.reverse();

        allBids.map( async(e, index) => {
            const response = await fetch("http://localhost:5000/api/video/getpostbyname", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ filename: e })
            });
            const json = await response.json();
            setAllVideos(oldArray => [...oldArray, json]);
        })
    }
    
    useEffect(() => {
        func();
    }, [])

  return (
        <div className={styles.container}>
            {allVideos.map((element, index) => {
                return <Card2 key={index} filename={element.filename} author={element.author} amount={element.amount} equity={element.equity} likes={element.likes.length} />
            })}
        </div>
  )
}