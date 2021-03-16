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

document.getElementById("loginPress").onclick = sendId;

var id;

document.addEventListener('keypress', keyPressed);

document.getElementById("loginInput").focus();
document.getElementById("loginInput").select();

function keyPressed(event)
{    
	if (event.key === 'Enter') {
		sendId();
		document.removeEventListener('keypress', keyPressed);
    }
}

function sendId()
{
	id = document.getElementById("loginInput").value;
	
	socket.emit("login", id);
	
	document.getElementById("loginError").classList.remove("error");

	document.getElementById("loginInput").focus();
	document.getElementById("loginInput").select();
}

socket.on("init", (session) => {
	document.getElementById("login").remove();

	Game.newGame("Mao", init.bind(session), update);
});

socket.on("connexionRefused", (refused) => {
	let error = document.getElementById("loginError");
	error.textContent = "Connexion refusée: mauvais pseudo ou trop de joueurs";
	
	error.classList.remove("error");
	console.log("Test");
	error.classList.add("error");
});
