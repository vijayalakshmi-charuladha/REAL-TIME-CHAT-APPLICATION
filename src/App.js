// client/src/App.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './App.css';

const socket = io("http://localhost:3001");

function App() {
const [message, setMessage] = useState("");
const [chat, setChat] = useState([]);

const sendMessage = () => {
if (message.trim() === "") return;

socket.emit("send_message", { text: message });  
setChat([...chat, { text: message, fromMe: true }]);  
setMessage("");

};

useEffect(() => {
  const handleReceive = (data) => {
    setChat((prev) => [...prev, { text: data.text, fromMe: false }]);
  };

  socket.on("receive_message", handleReceive);

  return () => {
    socket.off("receive_message", handleReceive); // 🧹 Cleans up old listeners
  };
}, []);

return (
<div className="chat-container">
<h2>💬 Real-Time Chat</h2>
<div className="chat-box">
{chat.map((msg, i) => (
<div key={i} className={msg.fromMe ? "msg me" : "msg"}>
{msg.text}
</div>
))}
</div>
<div className="input-area">
<input
type="text"
value={message}
placeholder="Type your message..."
onChange={(e) => setMessage(e.target.value)}
onKeyPress={(e) => e.key === "Enter" && sendMessage()}
/>
<button onClick={sendMessage}>Send</button>
</div>
</div>
);
}

export default App;