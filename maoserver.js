const io = require("socket.io");
const GameSession = require("./mao/GameSession");
const session = new GameSession();
const clients = {};
var step = 0;

function updateClients() {
	checkForDisconnected.bind(this)();
	
	this.emit("isAlive");
	
	setTimeout(updateClients.bind(this), 2500);
	
	step++;
	
	if (step == 1000) {
		resetSteps();
	}
}

exports.launch = function(app) {
	let socket = io(app);
	
	socket.on("connection", (client) => {
		client.on("login", (id) => {
			if (id != null && id != "" && session.nbPlayers < GameSession.MAX_PLAYERS)
			{
				if (!(id in clients))
				{
					clients[id] = client;
				}
				
				session.addPlayer(id);
				
				console.log(id + " is connected");
				
				client.emit("init", session.getCopy());
				socket.emit("playerJoin", id);
				
				clients[id].step = step;
				
				client.on("change", (playerChanges) => {
					session.updateWith(playerChanges);
				});
			}
			else
			{
				client.emit("connexionRefused");
			}
		});
	
		client.on("stillAlive", (id) => {
			if (id in clients) 
			{
				if (clients[id].step == -100) 
				{
					socket.emit("playerJoin", id);
					console.log(id + " is connected");
				}
				
				clients[id].step = step;
			}
		});
	
		client.on("cursorMove", (info) => {
			if (info.id in clients)
			{
				socket.emit("cursorMove", info);
			}
		});
	});
	
	session.addSocket(socket, clients);
	
	setTimeout(updateClients.bind(socket), 1000);
}

function checkForDisconnected()
{
	for (let id in clients)
	{
		if (clients[id].step + 2 <= step && clients[id].step != -100)
		{			
			this.emit("playerLeft", id);
			clients[id].step = -100;
			
			session.markDisconnected(id);
			
			console.log(id + " is disconnected");
		}
	}
}

function resetSteps()
{
	for (let id in clients)
	{
		if (clients[id].step >= 0) 
		{
			clients[id].step = 0;
		}
	}
	
	step = 0;
}