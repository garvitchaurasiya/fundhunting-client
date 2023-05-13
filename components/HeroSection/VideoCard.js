import React, { useState, useEffect } from 'react'
import styles from '../../styles/Card.module.css';
import VisibilitySensor from 'react-visibility-sensor';
import Modal from './Modal'
import BidModalContent from './ModalContent/BidModalContent';
import { GiTakeMyMoney } from 'react-icons/gi';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import { TfiCommentAlt } from 'react-icons/tfi';
import CommentModalContent from './ModalContent/CommentModalContent';



function VideoCard(props) {

  const [state, setState] = useState({ amount: "", equity: "", comment: "" })
  const [displayLikes, setDisplayLikes] = useState(props.likes);
  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    isAlreadyLikedOrSaved();

    if (typeof window !== 'undefined') {
      let video = document.getElementById(props.filename);
      if (isVisible) {
        video.play();
      } else {
        if (video.play) {
          video.pause();
        }
      }
    }

  }, [isVisible]);

  const isAlreadyLikedOrSaved = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/alreadyliked`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ filename: props.filename })
    });
    const json = await response.json();

    if (json.isLiked !== null) {
      setLiked(true);
    }

    const response2 = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/alreadysaved`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ filename: props.filename })
    })
    const json2 = await response2.json();
    if (json2.saved) {
      setBookmark(true);
    }
  }

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const toggleLike = async () => {
    let check = liked;
    setLiked(!liked);
    if (check === false) { // For Like
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/like`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      const json = await response.json();
      setDisplayLikes(json.likes.length);
    }
    else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/dislike`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      const json = await response.json();
      setDisplayLikes(json.likes.length);
    }
  }

  const toggleBookmark = async () => {
    let check = bookmark;
    setBookmark(!bookmark);
    if (check === false) { // For bookmark
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/save`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      const json = await response.json();
    }
    else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/unsave`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
    }
  }

  return (
    <>
      <div className="mb-12" style={{ 'width': '560px' }}>
        <div className={styles.videos}>
          <div className='p-4 flex items-center'>
            <div className='bg-gray-500 h-10 mr-1 w-10 rounded-full'>
              <img src={`https://api.multiavatar.com/${props.author}.png?apikey=jDLBmJ7USQizoZ`} />
            </div>
            <p className='ml-2 font-semibold'>{props.author}</p>
          </div>
          <VisibilitySensor onChange={(isVisible) => setIsVisible(isVisible)}>
            <div className='h-96 flex items-center bg-black'>
              <video id={props.filename} muted className={styles.video} src={`https://fundhunting-s3-bucket.s3.ap-south-1.amazonaws.commm/${props.filename}`} width="100%" height="590px" controls >
              </video>
            </div>
          </VisibilitySensor>
          <div className={styles.actions}>
            <div onClick={toggleLike} className='cursor-pointer'>{displayLikes}
              {liked ? <AiFillLike className='text-2xl inline' style={{ 'color': '#e0183c' }} /> : <AiOutlineLike className='text-2xl inline' />}
              Like
            </div>
            <div className='cursor-pointer' onClick={() => { setShowCommentModal(true) }}>
              <TfiCommentAlt className='text-2xl inline' /> Comment
            </div>

            <div onClick={toggleBookmark} className='cursor-pointer'>
              {bookmark ? <BsFillBookmarkFill className='text-2xl inline' /> : <BsBookmark className='text-2xl inline' />}
              Save
            </div>

            <div onClick={() => setShowBidModal(true)} className='cursor-pointer' >
              <GiTakeMyMoney className='text-2xl inline' />
              Bid
            </div>

            <Modal
              content={
                <CommentModalContent onClose={() => setShowCommentModal(false)}
                  video_url={`${process.env.NEXT_PUBLIC_S3BUCKET}/${props.filename}`}
                  filename={props.filename}
                  author={props.author}
                  amount={props.amount}
                  equity={props.equity}
                />}
              onClose={() => { setShowCommentModal(false) }}
              show={showCommentModal}
            />

            <Modal
              content={
                <BidModalContent onClose={() => setShowBidModal(false)}
                  video_url={`${process.env.NEXT_PUBLIC_S3BUCKET}/${props.filename}`}
                  filename={props.filename}
                  author={props.author}
                  amount={props.amount}
                  equity={props.equity}
                />}
              onClose={() => { setShowBidModal(false) }}
              show={showBidModal}
            />


          </div>
        </div>

      </div >
    </>
  )
}

export default VideoCard