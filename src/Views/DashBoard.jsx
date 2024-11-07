import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { BlogIcon, LogoutIcon, UserIcon } from "../assets/Icons/Icons";

const Dashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("My Blogs");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sideBarOptions = [
    { name: "My Blogs", path: "/dashboard/blogs", icon: <BlogIcon /> },
    { name: "Profile", path: "/dashboard/profile", icon: <UserIcon /> },
    { name: "Logout", path: "/login", icon: <LogoutIcon /> },
  ];

  const handleNavigation = (option) => {
    if (option.name === "Logout") {
      localStorage.clear();
    }
    setActive(option.name);
    navigate(option.path);
    setSidebarOpen(false);
  };

  useEffect(() => {
    navigate("/dashboard/blogs");
  }, []);

  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 bg-blue-100 p-4 transition-all transform ease-in-out duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:col-span-3 md:block`}
      >
        <div
          onClick={() => navigate("/")}
          className="flex gap-2 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
            <path d="M3.5 19A1.5 1.5 0 015 20.5 1.5 1.5 0 013.5 22 1.5 1.5 0 012 20.5 1.5 1.5 0 013.5 19m5-3a2.5 2.5 0 012.5 2.5A2.5 2.5 0 018.5 21 2.5 2.5 0 016 18.5 2.5 2.5 0 018.5 16m6-1c-1.19 0-2.27-.5-3-1.35-.73.85-1.81 1.35-3 1.35-1.96 0-3.59-1.41-3.93-3.26A4.02 4.02 0 012 8a4 4 0 014-4l.77.07C7.5 3.41 8.45 3 9.5 3c1.19 0 2.27.5 3 1.35.73-.85 1.81-1.35 3-1.35 1.96 0 3.59 1.41 3.93 3.26A4.02 4.02 0 0122 10a4 4 0 01-4 4l-.77-.07c-.73.66-1.68 1.07-2.73 1.07M6 6a2 2 0 00-2 2 2 2 0 002 2c.33 0 .64-.08.92-.22A2 2 0 006.5 11a2 2 0 002 2c.6 0 1.14-.27 1.5-.69l1.47-1.68L13 12.34c.38.4.91.66 1.5.66 1 0 1.83-.74 2-1.7.34.43.89.7 1.5.7a2 2 0 002-2 2 2 0 00-2-2c-.33 0-.64.08-.92.22A2 2 0 0017.5 7a2 2 0 00-2-2c-.59 0-1.12.26-1.5.66l-1.53 1.71L11 5.69c-.36-.42-.9-.69-1.5-.69-1 0-1.83.74-2 1.7C7.16 6.27 6.61 6 6 6m2.5 11.5a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1z" />
          </svg>
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 flex justify-center font-bold text-2xl">
            Gup Shup
          </h3>
        </div>
        <ul className="mt-5">
          {sideBarOptions.map((option) => (
            <div key={option.name} className="flex gap-2 items-center">
              <div className="mt-2">{option.icon}</div>
              <li
                key={option.name}
                className={`p-2 rounded-md font-semibold cursor-pointer w-44 transition-all ease-in-out duration-300 ${
                  active === option.name
                    ? "bg-blue-200 mt-1"
                    : "hover:bg-blue-200 mt-1"
                }`}
                onClick={() => handleNavigation(option)}
              >
                {option.name}
              </li>
            </div>
          ))}
        </ul>
      </div>

      <div className="flex-1 md:col-span-9 p-4">
        <button
          className="md:hidden p-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
