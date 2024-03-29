import React, { useState } from 'react'
import Router from 'next/router';
import styles from '../../../styles/post.module.css'
import fundhunting from '../../../ethereum/fundhunting';
import web3 from '../../../ethereum/web3';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


export default function PostModalContent(props) {

    const [file, setFile] = useState("");
    const [state, setState] = useState({
        amount: '',
        equity: ''
    })

    const onChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const onChangeFile = (e) => {
        let file = e.target.files[0];
        let blobURL = URL.createObjectURL(file);
        document.querySelector("#videoContainer").style.display = 'block';
        document.querySelector("video").src = blobURL;
        document.querySelector("#uploadFileLabel").style.display = 'none';
        setFile(e.target.files[0]);
    }

    const handleOnSubmit = async (e) => {

        e.preventDefault();
        console.log(file.size);
        if(file.size > 20971520){
            alert('Please upload video of size less than 20 MB');
            return;
        }

        const accounts = await web3.eth.getAccounts();

        const success = await fundhunting.methods.payVideoUploadingFee().send({
            from: accounts[0],
            value: web3.utils.toWei('0.001', 'ether')
        })

        if (success) {
            const Filename = `${Date.now()}-${file.name}`;
            console.log(Filename, process.env.NEXT_PUBLIC_ACCESS_KEY, process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY);
            const client = new S3Client({
                credentials: {
                    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
                    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
                },
                region: 'ap-south-1'
            });
            const command = new PutObjectCommand({
                Bucket: 'fundhunting-s3-bucket',
                Key: Filename,
                Body: file,
                ContentType: 'video/mp4'
            });
            const upload = await client.send(command);
            if(upload.$metadata.httpStatusCode == '200'){
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/video/upload`, {
                    method: "POST",
                    headers:{
                        'Content-type':'application/json'
                    },
                    body: JSON.stringify({
                        filename: Filename,
                        username: localStorage.getItem('username'),
                        amount: state.amount,
                        equity: state.equity
                    })
                });
                const json = await response.json();
                if (json.success) {
                    Router.reload();
                }
            }
            
        }
    }

    return (
        <div className="w-full h-full">
            <div className=' w-full h-full'>
                <form onSubmit={handleOnSubmit} encType="multipart/form-data" className='w-full h-full'>

                    <div className='h-full w-full flex flex-col justify-around items-between'>

                        <div id='videoContainer' className="flex justify-center items-center h-1/2" style={{ "display": "none" }}>
                                <video className='h-full m-auto' controls autoPlay>
                                    Your browser does not support the video tag.
                                </video>
                        </div>
                        <div id='uploadFileLabel' className="flex justify-center items-center h-1/2">
                            <label className={styles.uploadFileLogo} htmlFor="uploadFile">
                                Select a video to upload
                            </label>
                            <input id="uploadFile" hidden type="file" filename="file" onChange={onChangeFile} />
                            <i className="fa-solid fa-plus" style={{ "fontSize": "20px" }}></i>
                        </div>

                        <div className='flex justify-around'>
                            <div className='flex flex-col justify-around'>
                                <div className='mb-2 border-2 rounded-lg pl-2'>
                                    <label htmlFor="ask">Ask</label>
                                    <input id="ask" type="text" name="amount" onChange={onChange} value={state.amount} placeholder='1.25 Lakh'
                                        className='p-2 outline-none text-right'
                                    />
                                </div>

                                <div className='mb-2 border-2 rounded-lg pl-2'>
                                    <label htmlFor="for">For</label>
                                    <input id="for" type="text" name="equity" onChange={onChange} value={state.equity} placeholder='7%'
                                        className='p-2 outline-none text-right'
                                    />
                                </div>
                            </div>

                            <div className=''>
                                <div><button type='submit' className='mb-2 text-white bg-blue-600 border-2 border-blue-600 py-2 w-24 rounded-lg fond-bold'>Done</button></div>
                                <div><button onClick={props.onClose} className='mb-2 text-blue-600 border-2 border-blue-600 py-2 w-24 rounded-lg'>Cancel</button></div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>


        </div>
    )
}
