import { useState, useEffect } from 'react'
import '../../styles/views/login.scss'
import laptopImg from '../../assets/img/laptop.png'

function LoginView() {
    return (
        <main className="">
            <section className="container">
                <div className="form-container">
                    <h1>Webchat</h1>
                    <button className="btn">Sign in with Google</button>
                    <button className="btn">Sign in with Facebook</button>

                    <hr/>

                    <button className="btn btn-secondary">Sign in with Facebook</button>
                </div>
            </section>
            <section className="banner">
                <div className="content">
                    <img src={laptopImg} />
                    <p className="slogan"><b>Webchat</b>, a simple and easy to use videochat app</p>
                </div>
            </section>
        </main>
    )
}

export default LoginView;