import React, { useState } from 'react'
import styles from '../styles/Login.module.css'
import Link from 'next/link';
import Router from 'next/router'
import signup_image from "../public/images/login_image.png"
import Image from 'next/image';

export default function Login() {

    console.log(process.env.NEXT_PUBLIC_HOST);

    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/login`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })

        });
        console.log(credentials.email, credentials.password);
        const json = await response.json();
        if (json.success) {
            // Save the auth Token and redirect
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('username', json.username);
            // navigate('/');
            Router.push({ pathname: '/' })
        }
        else {
            alert('Please enter the valid credentials');
        }
        console.log(json);
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value }); // This took 2 hours. Don't put [] over e.target.value.
    }

    return (
        <>
            <div>
                <div id={styles.login2_login} >
                    <div id={styles.login_form}  >
                        <div>
                            <h1 className={styles.login2_heading}>
                                Sign in
                            </h1>
                            <form onSubmit={handleLogin}>
                                <input type="text" name="email" className={styles.login2_input} value={credentials.email} onChange={onChange} placeholder="Email" />
                                <input type="password" name="password" className={styles.login2_input} value={credentials.password} onChange={onChange} placeholder='Password' />
                                <button className={styles.login2_button} >SIGN IN</button>
                                <p className={styles.login2_tell}>
                                    {/* <Link href=''>Forget Password</Link> */}
                                </p>
                                <p className={styles.login2_tell}>
                                    <Link href='/signup'>
                                        New to Fund Hunting? Create Account
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                    <div id={styles.details_login}>
                        <div>
                            <h1 className='login2_heading'>Welcome Back !</h1>
                            <p className="login2_para">
                                To keep connected with us please login with your personal info
                            </p>
                            <Image src={signup_image} />
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
}
