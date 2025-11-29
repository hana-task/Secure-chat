import { useAuth } from "./context/AuthContext";
import { LoginView } from "./views/LoginView";
import { ChatView } from "./views/ChatView";

export const App = () => {
  const { user } = useAuth();

  return user ? <ChatView /> : <LoginView />;
};
