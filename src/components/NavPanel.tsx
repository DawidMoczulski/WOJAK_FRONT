import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../Auth/AuthProvider";
import logo_image from "../Images/Logo_Image.png";
import login_background from "../Images/login_background.jpeg";
import { useLocation } from "react-router";
import { useState } from "react";
import NavButton from "./NavButton";

function NavPanel() {
  const { handleLogout } = useAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  async function logoutAsync() {
    await handleLogout();
    navigate("/login");
  }

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full shadow-md z-50 py-0.5 bg-gradient-to-r from-[#14151a] from-10% via-[#293147] via-30% to-[#3c4352] to-90% z-60">
        <div className="container mx-auto flex items-center justify-between px-4 py-0.5 md:py-0.5">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          {/* Logo */}
          {!isOpen && (
            <Link to="/">
              <img src={logo_image} className="h-10 w-10 cursor-pointer" />
            </Link>
          )}

          <div
            className={`md:flex ${
              isOpen ? "block" : "hidden"
            } w-full md:w-auto`}
          >
            <div className="flex flex-col md:flex-row md:space-x-4 font-semibold">
              <NavButton
                route="userdetails"
                content="Konto"
                onClick={closeMobileMenu}
              />
              <NavButton
                route="read-qr"
                content="Skanuj QR"
                onClick={closeMobileMenu}
              />
              <NavButton
                route="/chats"
                content="Drużyny"
                onClick={closeMobileMenu}
              />
              <NavButton
                route="/friends"
                content="Znajomi"
                onClick={closeMobileMenu}
              />
            </div>
          </div>

          <div className="order-2 md:order-3">
            <button
              onClick={logoutAsync}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#6b8f4e] to-[#7b9f5f] group-hover:from-[#8fbf6d] group-hover:to-[#9fcd7d] hover:text-white dark:text-white focus:ring-4 
              focus:outline-none focus:ring-[#6b8f4e] shadow-md transition-all duration-300 transform hover:from-[#89bf75] hover:to-[#71a35f] hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 rounded-md bg-transparent">
                Wyloguj się
              </span>
            </button>
          </div>
        </div>
      </nav>
      {location.pathname === "/" && (
        <div
          className="min-h-screen flex items-center justify-center bg-cover bg-center pt-16"
          style={{ backgroundImage: `url(${login_background})` }}
        >
          <h1 className="text-white/70 text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]">
            Witaj {currentUser?.username}!
          </h1>
        </div>
      )}
    </div>
  );
}

export default NavPanel;
