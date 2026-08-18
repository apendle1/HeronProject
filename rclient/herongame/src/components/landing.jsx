import { useState } from 'react'
import logoimg from '../assets/HeronLogo1.png'



function LandingPage({roomcode, roomCapacity, createRoom, joinRoom}){
    const [roomState, setCurrentRoomState] = useState("cjroom");
    const [inputValue, setInputValue] = useState("");

    const inputChange = (event) => {
        setInputValue(event.target.value);
    };

    //function for room button presses, create and join

    const jrbutton = () => {
        setCurrentRoomState("joinroom");
    }

    const backbutton = () => {
        setCurrentRoomState("cjroom");
    }

    const crbutton = () => {
        createRoom();
        setCurrentRoomState("inroom")
    }

    const ctjbutton = () => {
        joinRoom(inputValue);
        setCurrentRoomState("inroom")
    }

    const renderState = () => {
        switch(roomState){
            case "cjroom":
                return (<>
                        <button class="roomButton" onClick={crbutton}>Create a Room</button>
                        <button class="roomButton" onClick={jrbutton}>Join a Room</button>
                    </>);
            case "inroom":
                return (<>
                    <h1 class="rltext">CODE: {roomcode}</h1>
                    <p>Copy and give it to a friend!</p>
                    <p class="softtext">{roomCapacity}/2 players in room.</p>
                    <button class="roomButton" onClick={backbutton}>Go Back</button>
                </>);
            case "joinroom":
                return (<>
                    <input type="text" value={inputValue} onChange={inputChange} placeholder="XXXXXX"></input>
                    <button class="roomButton" onClick={ctjbutton}>Join Room with Code</button>
                    <button class="roomButton" onClick={backbutton}>Go Back</button>
                </>);
        }
    };
    return (
        <>
            <div id="landingcontainer">
                <div id="about">
                    <img src={logoimg} id="mainlogo" alt="Heron Game Logo"/>
                    <p class="softtext">An interactive fiction by Austin Pendley.</p>
                    <p>Grab a friend and try out a multiplayer text adventure. You'll play as two seperate points of view following the same story. Both you and your friend will make choices that will determine the path the story travels. The project is powered by ink and webhooks, feel free to check out the github page below if you're interested!</p>
                </div>
                <div id="rooms">
                    {renderState()}
                </div>
            </div>
        </>
    )
}

export default LandingPage;