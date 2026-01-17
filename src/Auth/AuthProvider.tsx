import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
} from "react";
import LoadingComponent from "../components/common/LoadingComponent";

interface User {
  id: string;
  username: string;
  email: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContext {
  currentUser?: User | null;
  setCurrentUser: (user: User | null) => void;
  handleLogin: (LoginCredentials: LoginCredentials) => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  async function fetchUser() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/current-user",
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Error during fetching the user");
      }
      const user = await response.json();
      setCurrentUser(user);
    } catch (err) {
      setCurrentUser(null);
      console.log(err);
    }
  }

  async function handleLogin({ username, password }: LoginCredentials) {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/account/login",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed during login!");
      }
      await fetchUser();
      return true;
    } catch {
      setCurrentUser(null);
      return false;
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/account/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed during logout!");
      }
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  }

  const authProviderValue = {
    setCurrentUser,
    currentUser,
    handleLogin,
    handleLogout,
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside of a AuthProvider");
  }

  return context;
}

export default AuthProvider;
