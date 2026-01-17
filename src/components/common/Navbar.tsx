import { Link } from "react-router";
import { useAuth } from "../../Auth/AuthProvider";
import NavPanel from "../NavPanel";
import logo_image from "../../Images/Logo_Image.png";

function Navbar() {
  const { currentUser } = useAuth();
  return (
    <nav className="w-full border-b m-0  ">
      {/* {If user is logged in} */}
      {currentUser && <NavPanel />}

      {/* {If user is logged out} */}
      {!currentUser && (
        <div>
          <div className="relative z-10 flex justify-center bg-gradient-to-r from-[#14151a] from-10% via-[#293147] via-30% to-[#3c4352] to-90% gap-4 p-3 m-0 top-0">
            <img src={logo_image} className="h-10 w-10" />

            <Link to="/login">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-brown-500 to-yellow-500 group-hover:from-orange-500 group-hover:to-yellow-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Logowanie
                </span>
              </button>
            </Link>
            <Link to="/signin">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-brown-500 to-yellow-500 group-hover:from-orange-500 group-hover:to-yellow-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Rejestracja
                </span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
