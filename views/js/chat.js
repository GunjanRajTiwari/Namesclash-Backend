// Make socket connection
const socket = io.connect("http://localhost:8000/");
// const socket = io.connect("https://namesclash.herokuapp.com/");

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
        id: user.id,
        name: user.name,
        photo: user.photo,
        gang: user.gang,
        message: message.value,
    });

    message.value = "";
}

// Event handlers
btn.addEventListener("click", fireMessage);
message.addEventListener("keyup", (e) => {
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
socket.on("chat", (data) => {
    const div = document.createElement("div");
    div.classList.add("chat");
    if (data.id === user.id) {
        div.classList.add("mine");
    }
    div.innerHTML = `
        <small>${data.name}</small>
        <p>${data.message}</p>
    `;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    feedback.innerHTML = "";
});

socket.on("typing", function (data) {
    feedback.innerHTML = `<small>${data}</small>`;
});
