import { useAuth } from "../src/Auth/AuthProvider";
import { Outlet } from "react-router";
import { useEffect } from "react";
import App from "./App";
import Navbar from "./components/common/Navbar";
import { GenerateRSAKeys } from "./crypto/CryptoProvider";
import LoginForm from "./components/Forms/Authentication/LoginForm";
import { useLocation } from "react-router";

const RootComponent = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  useEffect(() => {
    async function sendKeyToServer(key: string) {
      try {
        const result = await fetch(
          "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/current-user/keys",
          {
            headers: {
              "content-type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ userId: currentUser?.id, publicKey: key }),
          }
        );
        if (!result.ok) {
          throw Error(`Result code ${result.status}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
    async function SetKeysIfNotExists() {
      if (!currentUser) return;
      if (
        localStorage.getItem(`${currentUser?.username}_privateKey`) ===
          undefined ||
        localStorage.getItem(`${currentUser?.username}_privateKey`) === null
      ) {
        const { privateKey, publicKey } = await GenerateRSAKeys();
        localStorage.setItem(`${currentUser?.username}_privateKey`, privateKey);
        await sendKeyToServer(publicKey);
      }
    }
    SetKeysIfNotExists();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <>
        <Navbar />
        {location.pathname === "/" && <LoginForm />}
        <Outlet />
      </>
    );
  }

  return <App />;
};

export default RootComponent;
