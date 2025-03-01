import { useState, useEffect } from "react";
import io from "socket.io-client";
import type { Socket as ClientSocket } from "socket.io-client";


interface Message {
  id: string;
  from: string;
  message: string;
}

const socket: typeof ClientSocket = io("http://localhost:3000");



export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on("private message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.off("private message");
    };
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("set username", username);
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (input.trim() && recipient.trim()) {
      const newMessage: Message = { id: Date.now().toString(), from: username, message: input };
      socket.emit("private message", { from: username, to: recipient, message: input });
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!isLoggedIn ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Enter username"
            className="border p-2 rounded w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Join Chat
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Send message to (username)"
            className="border p-2 rounded w-full mb-2"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <div className="h-64 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-2 my-1 rounded ${msg.from === username ? "bg-blue-200" : "bg-gray-200"}`}>
                <strong>{msg.from}: </strong> {msg.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message"
            className="border p-2 rounded w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      )}
    </div>
  );
}
