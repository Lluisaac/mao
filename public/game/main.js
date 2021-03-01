function init()
{
    new GameState().init(this, id);
    
    States.startsWith("game");
}

function update()
{
   	States.getCurrentState().update();
}


const socket = io();
const id = prompt("Entrez votre pseudonyme:");
socket.emit("login", id);

socket.on("init", (session) => {
	Game.newGame("Mao", init.bind(session), update);
});

socket.on("connexionRefused", (refused) => {
	alert("Connexion refusée: mauvais pseudo ou trop de joueurs.");
});