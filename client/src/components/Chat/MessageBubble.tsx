import "./MessageBubble.scss";
import { useAuth } from "../../context/AuthContext";
import { decryptMessage } from "../../utils/encryption";

interface Message {
  id: string;
  senderId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const isMine = message.senderId === user?.userId;

  const displayText = decryptMessage(message.text);
  
  return (
    <div className={`bubble-row ${isMine ? "me" : "other"}`}>
      <div className="bubble">
        <div className="meta">
          <span className="username">{message.username}</span>
        </div>
        <div className="text">{displayText}</div>
        <div className="time">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};