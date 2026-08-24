import { useState, useRef } from 'react';
import {useGameSocket} from './js/room';

import "@fontsource/courier-prime"; // Defaults to weight 400
import "@fontsource/spectral";      // Defaults to weight 400

import logoimg from './assets/HeronLogo1.png';

import './App.css';

//import content pages.
import LandingPage from './components/landing'
import StoryPage from './components/story'

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const {roomcode, roomCapacity, createRoom, joinRoom, sendVar, onIncomingVar} = useGameSocket({setCurrentPage});

  //ink functionality to pass to story content component.
  


  const renderPage = () => {
    switch(currentPage){
      case "landing":
        return <LandingPage roomcode={roomcode} roomCapacity={roomCapacity} createRoom={createRoom} joinRoom={joinRoom} />;
      case "story":
        return <StoryPage sendVar={sendVar} onIncomingVar={onIncomingVar}/>;
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
