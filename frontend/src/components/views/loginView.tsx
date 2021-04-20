import { useState, useEffect } from 'react'
import '@styles/views/login.scss'
import laptopImg from '@assets/img/laptop.png'
import { useHistory } from 'react-router-dom';
import { clearSession, login } from '@helpers/api'
import { useScreenType } from '@hooks/useScreenType';

export const LoginView: React.FC = () => {
    const history = useHistory();
    const screenType = useScreenType();
    const [ authToken, setAuthToken ] = useState('')

    useEffect(() => {
        searchGetParameters();

        if(authToken !== '') {
            onGoogleLoginClick()
        }
    }, [authToken]);

    const searchGetParameters = (): void => {
        let urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        let authTokenParam: string = urlParams.get('auth_token') || ''

        if(authTokenParam !== '') {
            localStorage.setItem('authToken', authTokenParam)
            setAuthToken(authTokenParam)
        }
    }

    const onGoogleLoginClick = async (): Promise<void> => {
        try {
            await login(authToken)
            history.push("/");
        } catch (e) {
            clearSession()
        }
    }

    if (screenType === 'mobile')
        return (
            <main className="login-main login-mobile">
                <section className="container">
                    <div className="form-container">
                        <h1>Webchat</h1>
                        <img src={laptopImg} />
                        <p className="slogan"><b>Webchat</b>, a simple and easy to use videochat app</p>
                        <button className="btn btn-secondary-white" onClick={onGoogleLoginClick}>Sign in with Google</button>
                    </div>
                </section>
            </main>
        )
    else
        return (
            <main className="login-main">
                <section className="container">
                    <div className="form-container">
                        <h1>Webchat</h1>
                        <button className="btn" onClick={onGoogleLoginClick}>Sign in with Google</button>
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