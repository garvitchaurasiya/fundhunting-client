import React, { useEffect, useState } from 'react'
import CommentCard from './CommentCard'

export default function BidModalContent(props) {
    const [state, setState] = useState({ comment: "" })
    const [comments, setComments] = useState([]);
    useEffect(() => {
        getAllComments();
    }, [])

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const addNewComment = async (e) => {
        e.preventDefault();

        await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/comment`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ filename: props.filename, comment: state.comment })
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/getcomments`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ filename: props.filename })
        });
        const json = await response.json();

        setComments(json.comments.reverse());

        setTimeout(() => {
            var myDiv = document.getElementById("commentsContainer");
            var myDiv2 = document.getElementById("renderComments");
            myDiv2.scrollTop = myDiv.scrollHeight;
        }, 100);

    }

    async function getAllComments(e) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/getcomments`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ filename: props.filename })
        });
        const json = await response.json();
        json.comments.reverse();
        setComments(json.comments);

    }

    return (
        <div className='flex h-full w-full'>
            <div className='bg-black flex items-center w-1/2'>
                <video src={props.video_url} controls width="100%"></video>
            </div>
            <div className='w-1/2 p-4 flex justify-between flex-col'>
                <div id='renderComments' className='h-4/5 overflow-y-scroll'>
                    <div id='commentsContainer'>
                        {
                            comments.map((ele, index) => {
                                return (
                                    <CommentCard key={index} username={ele.username} comment={ele.comment}/>
                                )
                            })
                        }
                    </div>
                </div>

                <form onSubmit={addNewComment}>
                    <div className='flex justify-between'>
                        <div className='border-2 rounded-lg flex items-center pl-2 w-3/4 h-8'>
                            <input type="text" onChange={onChange} name="comment" value={state.comment} placeholder='Write a comment!'
                                className='outline-none w-full'
                            />
                        </div>
                        <div className='border-2 border-blue-500 text-blue-500 rounded-lg px-2 flex items-center py-1 h-8'>
                            <button type="submit">Comment</button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    )
}
