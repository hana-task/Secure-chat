import { useState, useRef, useEffect } from "react";
import { useMessages } from "../../hooks/useMessages";
import { apiClient } from "../../api/apiClient";
import { MessageBubble } from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import "./ChatWindow.scss";
import { encryptMessage } from "../../utils/encryption";
import { FiSend } from "react-icons/fi";
 

export const ChatWindow = () => {
  const { user, logout } = useAuth();
  const { messages, reloadRecent } = useMessages();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {
    if (!text.trim() || !user) return;

    try {
      const encryptedText = encryptMessage(text);

      await apiClient.post("/messages/send", {
        text: encryptedText,
        senderId: user.userId,
      });

      await reloadRecent();
      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-wrapper">
      <div className="chat-card shadow-sm">

        {/* HEADER */}
        <div className="chat-header d-flex justify-content-between align-items-center px-4 py-3">
          <h5 className="m-0 fw-semibold">Secure Chat</h5>
          <button className="btn btn-outline-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>

        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-chat">No messages yet…</div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            className="form-control"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button className="send-icon-btn" onClick={sendMessage}>
            <FiSend />
          </button>
        </div>

      </div>
    </div>
  );
};
