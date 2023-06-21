import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { BsCartFill } from "react-icons/bs";
import { useCartCtx } from "../../../context/CartCtx";
import { useNavigate } from "react-router-dom";
import { useCtx } from "../../../context/Ctx";
import api from "../../../config/AxiosBase";

export function WaiterHeader() {
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ query: `(max-width:786px)` });
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const {
    managerSidebarToggle,
    updateManagerSidebarToggle,
    setAuthenticatedUser,
  } = useCtx();
  const { updateCartStatus, cartNoOfItems } = useCartCtx();
  const logout = async () => {
    try {
      await api.get("/signout", { withCredentials: true });
      navigate("/global-signin");
      setAuthenticatedUser(null);
      localStorage.removeItem("ADMIN");
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentDateTime(new Date());
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);
  
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

      // Remove the "at" part
      const formattedDateWithoutAt = formattedDate.replace("at", "");

      setCurrentDateTime(formattedDateWithoutAt);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex items-center justify-between  min-h-[10vh] w-full">
      <p className=" font-semibold text-lg">
        {currentDateTime.toLocaleString()}
      </p>
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
      <div className={`relative justify-end flex space-x-4 items-center`}>
        {/* <div className="relative">
          <BsCartFill
            className="cursor-pointer w-6 h-6 text-gray-900 hover:scale-110 duration-200"
            size={16}
            onClick={() => updateCartStatus(true)}
          />
          {cartNoOfItems >= 1 && (
            <span
              className={`absolute -top-3 -right-3 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center`}
            >
              {cartNoOfItems}
            </span>
          )}
        </div> */}
        <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
          <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-20 opacity-10"></span>
          <button className="relative" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
