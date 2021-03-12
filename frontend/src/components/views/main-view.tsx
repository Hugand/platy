import { useState, useEffect } from 'react'
import "../../styles/views/main.scss"
import { NavBar, HomeView } from '..'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function MainView({ contentComponent }: any) {
    return <main>
        <NavBar />
        <section className="content">
            { contentComponent }
        </section>
    </main>
}

export default MainView