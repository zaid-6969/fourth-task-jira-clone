import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Asidebar from "../components/Asidebar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="main-container">
        <Asidebar />
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
