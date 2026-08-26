import { useState, useRef, useEffect } from 'react';

import storycontent from './assets/sorttest'

import "@fontsource/courier-prime"; // Defaults to weight 400
import "@fontsource/spectral";      // Defaults to weight 400

import logoimg from './assets/HeronLogo1.png';

import './App.css';

//import content pages.
import LandingPage from './components/landing';
import StoryPage from './components/story';
import { useGameController } from './components/usegamecontroller';

function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  //ink functionality to pass to story content component.

  const {
    controllerRef,
    paragraphs,
    answers,
    roomcode,
    roomCapacity,
    createRoom,
    joinRoom,
  } = useGameController(storycontent, {setCurrentPage});

  const renderPage = () => {
    switch(currentPage){
      case "landing":
        return <LandingPage roomcode={roomcode} roomCapacity={roomCapacity} createRoom={createRoom} joinRoom={joinRoom} />;
      case "story":
        return <StoryPage controllerRef={controllerRef} paragraphs={paragraphs} answers={answers}/>;
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
