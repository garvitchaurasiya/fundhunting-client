import React, { useState, useEffect } from 'react'
import Card2 from './Card';
import styles from '../styles/Saved.module.css'

export default function UserPosts(props) {

    const [all, setAll] = useState([]);

    const getUserPosts = async () => {
        const response = await fetch("http://localhost:5000/api/video/getuservideos", {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ username: props.username })
        });
        const json = await response.json();
        setAll(json.reverse());

    }

    useEffect(() => {
        getUserPosts();
    }, []);

    return (
        <div className={styles.container}>
            {all.map((element, index) => {
                return <Card2 key={index} filename={element.filename} author={element.author} amount={element.amount} equity={element.equity} likes={element.likes.length} />
            })}
        </div>
    )
}
