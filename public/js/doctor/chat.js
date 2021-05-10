const socket = io();
const chatWrapper = document.querySelector(".chat-wrapper");
const chatList = document.querySelector(".chat-list");
const chatBox = document.querySelector(".chat-box");
var input = document.querySelector("#input");
const ID = document.getElementById("ID").value;
const selfID = document.getElementById("selfID").value;
const treatmentNo = document.getElementById("treatmentNo").value;
const otherName = document.getElementById("otherName").value;
console.log(`ID-${ID}`);
console.log(`selfID-${selfID}`);
//mobile viewport height
var vh = window.innerHeight;
var chatWrapperHeight = vh - 68;
var chatBoxHeight = vh - 164;
chatWrapper.style.height = `${chatWrapperHeight}px`;
chatBox.style.height = `${chatBoxHeight}px`;
window.addEventListener("resize", () => {
    vh = window.innerHeight;
    var chatWrapperHeight = vh - 68;
    var chatBoxHeight = vh - 164;
    chatWrapper.style.height = `${chatWrapperHeight}px`;
    chatBox.style.height = `${chatBoxHeight}px`;
});

//socket join room
socket.emit("joinroom", { ID, treatmentNo, selfID: selfID, role: "doctor" });

//listening to "botMessage" event
socket.on("botMessage", (data) => {
    botRender(data);
});

//listening to "chat" event
socket.on("chat", (data) => {
    renderMessage(data);
});

//send btn
const sendMessage = () => {
    text = input.value;
    if (text.length > 0) {
        socket.emit("chat", text);
        input.value = "";
        input.focus();
    } else {
        alert("type a message to send");
    }
};
// or enter key
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

function botRender(data) {
    var list = document.createElement("li");
    list.classList.add("chat-bot", "chat-text");
    list.innerHTML = `
    <p>${data.text}</p>
    `;
    chatList.appendChild(list);
    chatBox.scrollTop = chatBox.scrollHeight;
}

const renderMessage = (data) => {
    var list = document.createElement("li");
    if (data.ID === selfID) {
        list.classList.add("chat-self", "chat-text");
        list.innerHTML = `
        <div class="chat-mess">
            <div class="chat-detail">
                <span class="bold">You</span>
                <span>${data.time}</span>
            </div>
            <p>${data.text}</p>
        </div>
        `;
    } else {
        list.classList.add("chat-other", "chat-text");
        list.innerHTML = `
        <div class="chat-mess">
            <div class="chat-detail">
                <span class="bold">${otherName}</span>
                <span>${data.time}</span>
            </div>
            <p>${data.text}</p>
        </div>
        `;
    }

    chatList.appendChild(list);
    chatBox.scrollTop = chatBox.scrollHeight;
};
