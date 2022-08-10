import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react';
import Navbar from '../components/Navbar';
import 'semantic-ui-css/semantic.min.css';
import styles from '../styles/Profile.module.css'
// import Videos from '../components/Videos';
import Saved from '../components/Saved';
import UserPosts from '../components/UserPosts';
import PlacedBids from '../components/PlacedBids';


export class Profile extends Component {

    state = {
        show: "posts",
        authorised: false
    }

    static async getInitialProps(props) {

        const username = props.query.username;

        const response = await fetch("http://localhost:5000/api/auth/getuser", {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },

            body: JSON.stringify({ username })

        });
        const json = await response.json();

        return {
            username: json.user.username,
            email: json.user.email,
            mobileNumber: json.user.mobileNumber,
            show: props.query.show
        }
    }

    componentDidMount(){
        if(localStorage.getItem("username")){
            this.setState({authorised: (localStorage.getItem("username")!==this.props.username)});
        }
        this.setState({show: this.props.show}); 
    }

    render() {
        return (
            <div style={{ "backgroundColor": "#f3f2ef" }}>
                <Navbar />
                <div className={styles.hero_section}>
                    <div>
                        <Icon name="user circle" size="massive" />
                    </div>
                    <h2>{this.props.username}</h2>
                    <hr />
                </div>
                <div className={styles.options}>
                    
                    <div
                        onClick={()=>{this.setState({show: "posts"})}}
                        style={{"borderBottom":this.state.show==="posts"?"3px solid black":"none"}}>
                            POSTS
                    </div>

                    <div
                        hidden={this.state.authorised}
                        onClick={()=>{this.setState({show: "bids"})}} 
                        style={{"borderBottom":this.state.show==="bids"?"3px solid black":"none"}}>
                            BIDS
                    </div>

                    <div
                        hidden={this.state.authorised}
                        onClick={()=>{this.setState({show: "saved"})}} 
                        style={{"borderBottom":this.state.show==="saved"?"3px solid black":"none"}}>
                            SAVED
                    </div>
                </div>
                
                <div hidden={(this.state.show==="posts")?false:true} >
                    <UserPosts username={this.props.username}/>
                </div>

                <div hidden={(this.state.show==="bids"?false:true)} >
                    <PlacedBids/>
                </div>

                <div hidden={(this.state.show==="saved"?false:true)} >
                    <Saved/>
                </div>

            </div>

        )
    }
}

export default Profile