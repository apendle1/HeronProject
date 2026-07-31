Heron Project *Work in Progress*

An engine to run multiplayer text adventures, where two (or more, at some point) players go through a story from different points of view and their individual choices can affect how the adventure continues.

How it works:

- Two players connect to the server via websockets

- Players are connected to a shared "room"

- A 'GameEngine' Object is created to handle how the story plays out, and drives which 'frames' are sent to each player. Frames hold text, questions, choices that are sent to each player.

- When both players answer a question or satisfy the requirements of the frame the story moves on.

The project makes use of TypeScript, Node.js, and WebSockets to handle communication.

Note: As of right now, the while the project is being built, a test.html file and a scenes.json file exist for prototyping, these contain basic story content that works as an example of what the engine is capable of.

UPCOMING WORK (TODO): Refactor for Ink integration! Client html has been added that runs the default ink.js serverless template. I've stripped parts from server that originally would have sent my own json 'frame' content, but refactoring to use ink just makes more sense. room creation logic has been kept, variables need to now be repeated as they are set by a user. Client needs to send and Server needs to accept variable definition messages.