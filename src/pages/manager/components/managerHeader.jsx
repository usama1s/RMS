import React, { useEffect, useState } from "react";
import { useCtx } from "../../../context/Ctx";
import { useNavigate } from "react-router";
import { IoIosArrowUp } from "react-icons/io";
import api from "../../../config/AxiosBase";

export function ManagerHeader() {
  const navigate = useNavigate();
  const {
    managerSidebarToggle,
    updateManagerSidebarToggle,
    setAuthenticatedUser,
    updateManagerSidebarLinks,
  } = useCtx();
  const [profileData, setProfileData] = useState();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const logout = async () => {
    try {
      await api.get("/signout", { withCredentials: true });
      updateManagerSidebarLinks("Pending Orders")();
      setAuthenticatedUser(null);
      localStorage.removeItem("ADMIN");
      navigate("/global-signin");
    } catch (e) {
      console.log(e);
    }
  };

  const getMe = async () => {
    try {
      const resp = await api.get("/me", { withCredentials: true });
      setProfileData(resp.data.data.doc);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      const formattedDateWithoutAt = formattedDate.replace("at", "");

      setCurrentDateTime(formattedDateWithoutAt);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex items-center justify-between min-h-[10vh] w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 block md:hidden"
        onClick={updateManagerSidebarToggle(!managerSidebarToggle)}
      >
        <path
          fillRule="evenodd"
          d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
          clipRule="evenodd"
        />
      </svg>
      <p className="font-semibold text-lg">
        {currentDateTime.toLocaleString()}
      </p>
      <div
        onClick={() => {
          setToggleDropdown(!toggleDropdown);
        }}
        className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white"
      >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-20 opacity-10"></span>
        <button className="relative flex items-center">
          <div className="relative flex-shrink-0 mr-4">
            <img
              src="https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png"
              alt=""
              className="w-8 h-8 border rounded-full dark:bg-gray-500 dark:border-gray-700"
            />
          </div>
          {profileData?.name}{" "}
          <IoIosArrowUp
            className={`${
              toggleDropdown != true ? "rotate-180" : ""
            } w-4 h-4 ml-2`}
          />
        </button>
        <div
          className={`${
            toggleDropdown != true
              ? "hidden"
              : "absolute top-14 right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-900"
          } `}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <span
                onClick={logout}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-36 group-hover:h-20 opacity-10"></span>
        <button className="relative" onClick={logout}>
          Logout
        </button>
      </div> */}
    </div>
  );
}
