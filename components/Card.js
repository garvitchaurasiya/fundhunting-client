import React, { useRef, useState, useEffect } from 'react'
import { Card, Header, Modal, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import modalstyles from '../styles/VideoModal.module.css'
import styles from '../styles/Card.module.css';
import {Link} from '../routes';
import VisibilitySensor from 'react-visibility-sensor';
import web3 from '../ethereum/web3';
import fundhunting from '../ethereum/fundhunting';

function Card2(props) {

  const [state, setState] = useState({ amount: "", equity: "", comment: "" })
  const [displayLikes, setDisplayLikes] = useState(props.likes);
  const [liked, setLiked] = useState("thumbs up outline");
  const [bookmark, setBookmark] = useState('bookmark outline')
  const [isMuted, setIsMuted] = useState(true);
  const [bids, setBids] = useState([]);
  const [comments, setComments] = useState([]);

  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    isAlreadyLikedOrSaved();

    if (typeof window !== 'undefined') {
      if (isVisible) {
        setIsMuted(false);
        videoRef.current.play();
      } else {
        if (videoRef.current.play) {
          videoRef.current.pause();
        }
      }
    }

  }, [isVisible]);

  const isAlreadyLikedOrSaved = async () => {
    const response = await fetch("http://localhost:5000/api/video/alreadyliked", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ filename: props.filename })
    });
    const json = await response.json();

    if (json.isLiked !== null) {
      setLiked("thumbs up");
    }

    const response2 = await fetch("http://localhost:5000/api/video/alreadysaved", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ filename: props.filename })
    })
    const json2 = await response2.json();
    if (json2.saved) {
      setBookmark("bookmark");
    }
  }

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const toggleLike = async () => {
    setLiked((liked === 'thumbs up outline') ? 'thumbs up' : 'thumbs up outline')

    if (liked === 'thumbs up outline') { // For Like
      const response = await fetch("http://localhost:5000/api/video/like", {
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
      const response = await fetch("http://localhost:5000/api/video/dislike", {
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
    setBookmark((bookmark === 'bookmark outline') ? 'bookmark' : 'bookmark outline')

    if (bookmark === 'bookmark outline') { // For bookmark
      const response = await fetch("http://localhost:5000/api/video/save", {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      const json = await response.json();
      // setDisplayLikes(json.likes.length);
    }
    else {
      const response = await fetch("http://localhost:5000/api/video/unsave", {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      // const json = await response.json();
      // setDisplayLikes(json.likes.length);
    }


  }

  const getAllBids = async (e) => {
    // e.preventDefault();

    const res = await fundhunting.methods.getPlacedBids(props.filename).call();
    setBids(res);

  }

  const addNewComment = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/video/comment", {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ filename: props.filename, comment: state.comment })
    });

    const response = await fetch("http://localhost:5000/api/video/getcomments", {
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
    // e.preventDefault();
    const response = await fetch("http://localhost:5000/api/video/getcomments", {
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

  const renderComments = () => {
    // getAllComments();
    const items = comments.map((ele, index) => {
      return {
        key: index,
        header: ele.comment,
        meta: (
            <Link route={`/profile/${ele.username}?show=posts`}>{ele.username}</Link>
          ),
        fluid: true,
      };
    });



    return <Card.Group items={items} id="commentsContainer" />;
  }

  const placeNewBid = async (e) => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const success = await fundhunting.methods.placeBid(
      props.filename,
      state.amount,
      state.equity,
      localStorage.getItem('username')
    ).send({
      from: accounts[0],
      value: web3.utils.toWei('0.001', 'ether')
    })
    
    if (success) {
      console.log("Placed")
      const res = await fundhunting.methods.getPlacedBids(props.filename).call();
      setBids(res);
      const response = await fetch("http://localhost:5000/api/auth/placedbids", {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ filename: props.filename })
      });
      const json = await response.json();
      console.log(json);
    }

    setTimeout(() => {
      var myDiv = document.getElementById("bidsContainer");
      var myDiv2 = document.getElementById("renderCards");
      myDiv2.scrollTop = myDiv.scrollHeight;
    }, 100);
  }

  const renderCards = () => {
    const items = bids.map((ele, index) => {
      return {
        key: index,
        header: ele.amount,
        meta: ele.equity,
        description: (
            <Link route={`/profile/${ele.bidPlacer}?show=posts`}>{ele.bidPlacer}</Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} id="bidsContainer" />;
  }

  const showCommentsModal = () => {
    return <Modal
      className={modalstyles.container}
      trigger={<div onClick={getAllComments}><Icon size="large" name='comment outline' /> Comment</div>}
    // trigger={<div><Icon size="large" name='comment outline' /> Comment</div>}
    >
      <Modal.Content className={modalstyles.content} image style={{ "padding": "0", 'height': '100%' }}>
        <video className={modalstyles.video} src={`/uploads/${props.filename}`} controls max-width="400px"></video>
        <Modal.Description className={styles.description}>
          <Header>Comment</Header>
          <div className={styles.bidsContainer} id="renderComments">
            {renderComments()}
          </div>
          <Modal.Actions>
            <form className={styles.placeBid} onSubmit={addNewComment}>
              {/* <input type="number" onChange={onChange} name="amount" value={state.amount} placeholder='amount' /> */}
              <input type="text" onChange={onChange} name="comment" value={state.comment} placeholder='Comment' />
              <button type="submit">Comment</button>
            </form>
          </Modal.Actions>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  }



  return (
    <div className={styles.container}>
      <div className={styles.videos}>
        <div className={styles.companyName}>
          <Icon size="big" name="user circle outline" />
          <b>{props.author}</b>
        </div>
        {/* <video muted={isMuted} onClick={() => { setIsMuted(false) }} ref={videoRef} className={styles.video} src={`/uploads/${props.filename}`} width="100%" height="590px" controls > */}
        <video muted onClick={() => { setIsMuted(false) }} ref={videoRef} className={styles.video} src={`/uploads/${props.filename}`} width="100%" height="590px" controls >
          <source src={`/uploads/${props.filename}`} type='video/mp4' />
        </video>
        <div className={styles.actions}>
          <VisibilitySensor onChange={(isVisible) => setIsVisible(isVisible)}>
            <div onClick={toggleLike}>{displayLikes}<Icon size="large" name={`${liked}`} /> Like</div>
          </VisibilitySensor>
          <div>
            {showCommentsModal()}
          </div>

          <div onClick={toggleBookmark}><Icon size="large" name={bookmark} /> Save</div>

          <Modal
            className={modalstyles.container}
            trigger={<div onClick={getAllBids}><Icon size="large" name='rupee' /> Bid</div>}
          >
            <Modal.Content className={modalstyles.content} image style={{ "padding": "0", 'height': '100%' }}>
              <video className={modalstyles.video} src={`/uploads/${props.filename}`} controls max-width="400px"></video>
              <Modal.Description className={styles.description}>
                <Header>Place a Bid</Header>
                <p>{props.author} wish to raise <b>Rs. {props.amount}</b> for <b>{props.equity}</b> of equity.</p>
                <h5>Bid Placed</h5>
                <div className={styles.bidsContainer} style={{ "height": "65%" }} id="renderCards">
                  {renderCards()}
                </div>
                <Modal.Actions>
                  <form className={styles.placeBid} onSubmit={placeNewBid}>
                    <input type="number" onChange={onChange} name="amount" value={state.amount} placeholder='amount' />
                    <input onChange={onChange} name="equity" value={state.equity} placeholder='equity' />
                    <button type="submit">Place Bid</button>
                  </form>
                </Modal.Actions>
              </Modal.Description>
            </Modal.Content>
          </Modal>

        </div>
      </div>

    </div>
  )
}

export default Card2