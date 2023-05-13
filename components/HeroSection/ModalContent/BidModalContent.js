import React, { useEffect, useState } from 'react'
import fundhunting from '../../../ethereum/fundhunting';
import web3 from '../../../ethereum/web3';
import BidCard from './BidCard';

export default function BidModalContent(props) {
    const [state, setState] = useState({ amount: "", equity: "", comment: "" })
    const [bids, setBids] = useState([]);
    useEffect(() => {
        const getAllBids = async (e) => {
            const res = await fundhunting.methods.getPlacedBids(props.filename).call();
            setBids(res);
        }
        getAllBids();
    }, [])

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
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
            const res = await fundhunting.methods.getPlacedBids(props.filename).call();
            setBids(res);
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/placedbids`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ filename: props.filename })
            });
            const json = await response.json();
        }
        setTimeout(() => {
            var myDiv = document.getElementById("bidsContainer");
            var myDiv2 = document.getElementById("renderCards");
            myDiv2.scrollTop = myDiv.scrollHeight;
        }, 100);
    }

    return (
        <div className='flex h-full w-full'>
            <div className='bg-black flex items-center w-1/2'>
                <video src={props.video_url} controls width="100%"></video>
            </div>
            <div className='w-1/2 p-4 flex justify-between flex-col'>
                <div>
                    <p className='text-xl font-semibold'>Place a Bid</p>
                    <p>{props.author} wish to raise <b>Rs. {props.amount}</b> for <b>{props.equity}</b> of equity.</p>
                    <h5>Bid Placed</h5>
                </div>
                <div id='renderCards' className='h-4/5 overflow-y-scroll'>
                    <div id='bidsContainer'>
                        {
                            bids.map((ele, index) => {
                                return (
                                    <BidCard key={index} amount={ele.amount} equity={ele.equity} bidPlacer={ele.bidPlacer} />
                                )
                            })
                        }
                    </div>
                </div>

                <form onSubmit={placeNewBid}>
                    <div className='flex justify-between'>
                        <div className='border-2 rounded-lg flex items-center pl-2 w-2/5 h-8'>
                            <div htmlFor="for" className=''>Amount: </div>
                            <input type="number" onChange={onChange} name="amount" value={state.amount}
                                className='outline-none text-right w-3/4'
                            />
                        </div>
                        <div className='border-2 rounded-lg flex items-center pl-2 w-2/5 h-8'>
                            <div htmlFor="for">Equity: </div>
                            <input onChange={onChange} name="equity" value={state.equity}
                                className='outline-none text-right w-3/4'
                            />
                        </div>
                        <div className='border-2 border-blue-500 text-blue-500 rounded-lg px-2 flex items-center py-1 h-8'>
                            <button type="submit">Place Bid</button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    )
}
