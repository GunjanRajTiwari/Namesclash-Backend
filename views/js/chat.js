// Make socket connection
// const socket = io.connect("http://localhost:8000/");
const socket = io.connect("https://namesclash.herokuapp.com/");

// DOM Query
const message = document.getElementById("message");
const btn = document.getElementById("send");
const output = document.getElementById("chat-area");
const feedback = document.getElementById("typing");

// Emit events
function fireMessage() {
	if (!message.value) {
		return;
	}

	socket.emit("chat", {
		id: user.googleId,
		name: user.name,
		photo: user.photoUrl,
		gang: user.gang,
		message: message.value,
	});

	message.value = "";
}

// Adding messages to UI util
const addMessages = data => {
	const div = document.createElement("div");
	div.classList.add("chat");
	if (data.id === user.googleId) {
		div.classList.add("mine");
	}
	div.innerHTML = `
        <div class="head">
        <img class="avatar" src="${data.photo}">
        <small>${data.name}</small>
        <div>
        <p class="message-text">${data.message}</p>
    `;
	output.appendChild(div);
	output.scrollTop = output.scrollHeight;
	feedback.innerHTML = "";
};

// Load Messages
var oldMsg = localStorage.getItem("ncMsg");
if (oldMsg) {
	oldMsg = JSON.parse(oldMsg);
	oldMsg.map(data => {
		addMessages(data);
	});
}

// Event handlers
btn.addEventListener("click", fireMessage);
message.addEventListener("keyup", e => {
	if (e.key === "Enter") {
		e.preventDefault();
		fireMessage();
	}
});

message.addEventListener("keypress", function () {
	socket.emit("typing", {
		gang: user.gang,
		value: "Someone is typing ...",
	});
});

socket.emit("joinRoom", user);

// Listen for events
socket.on("chat", data => {
	addMessages(data);
	var msgStore = localStorage.getItem("ncMsg");
	if (msgStore) {
		msgStore = JSON.parse(msgStore);
	} else {
		msgStore = [];
	}
	msgStore.push(data);
	if (msgStore.length > 20) {
		msgStore.shift();
	}
	localStorage.setItem("ncMsg", JSON.stringify(msgStore));
});

socket.on("typing", function (data) {
	feedback.innerHTML = `<small>${data}</small>`;
});
