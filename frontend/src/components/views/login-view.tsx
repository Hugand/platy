import { useState, useEffect } from 'react'
import '../../styles/views/login.scss'
import laptopImg from '../../assets/img/laptop.png'
import { useHistory } from "react-router-dom";

function LoginView() {
    const history = useHistory();
    const [ authToken, setAuthToken ] = useState("")

    useEffect(() => {
        searchGetParameters();

        if(authToken !== "") {
            onGoogleLoginClick()
        }
    }, [authToken]);

    const searchGetParameters = () => {
        let urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        let authTokenParam: string | null = urlParams.get('auth_token');
        if(authTokenParam === null || authTokenParam === "") {
            authTokenParam = localStorage.getItem('authToken')
        }
        
        if(authTokenParam !== null  && authTokenParam !== "") {
            localStorage.setItem('authToken', authTokenParam)
            setAuthToken(authTokenParam)
        }

        return authTokenParam
    }

    const onGoogleLoginClick = async () => {
        // window.location.href = "http://localhost:8080/restricted"

        console.log("LS", localStorage.getItem('authToken'))
        console.log("AT", authToken)

        fetch("http://localhost:8080/getAuthUser", {
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })
            .then(res => res.json())
            .then(res => {
                history.push("/home");
            })
            .catch(err => {
                window.location.href = "http://localhost:8080/getAuthUser"
            })
    }

    return (
        <main className="">
            <section className="container">
                <div className="form-container">
                    <h1>Webchat</h1>
                    <button className="btn" onClick={onGoogleLoginClick}>Sign in with Google</button>
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