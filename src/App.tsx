import { Outlet } from "react-router";
import Navbar from "./components/common/Navbar";
// import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Outlet />
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default App;
