import { useState } from 'react';
import {useGameSocket} from './js/room';

import "@fontsource/courier-prime"; // Defaults to weight 400
import "@fontsource/spectral";      // Defaults to weight 400

import logoimg from './assets/HeronLogo1.png';

import './App.css';

//import content pages.
import LandingPage from './components/landing'

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const {roomcode, roomCapacity, createRoom, joinRoom, sendVar} = useGameSocket();

  const renderPage = () => {
    switch(currentPage){
      case "landing":
        return <LandingPage roomcode={roomcode} roomCapacity={roomCapacity} createRoom={createRoom} joinRoom={joinRoom} />;
    }
  };

  return (
    <>
      <section id="header">
        <img src={logoimg} alt="mini logo" id="minilogo"/>
      </section>
      <section id="content">
        {renderPage()}
      </section>
    </>
  )
}

export default App
