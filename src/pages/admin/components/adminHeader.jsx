import React from "react";
import { useCtx } from "../../../context/Ctx";
import { BsCartFill } from "react-icons/bs";
import { useCartCtx } from "../../../context/CartCtx";
import { useNavigate } from "react-router";
import api from "../../../config/AxiosBase";

export function AdminHeader() {
  const navigate = useNavigate();
  const {
    managerSidebarToggle,
    updateManagerSidebarToggle,
    updateAdminSidebarLinks,
    setAuthenticatedUser,
  } = useCtx();

  const logout = async () => {
    try {
      await api.get("/signout", { withCredentials: true });
      updateAdminSidebarLinks("Branches")();
      navigate("/global-signin");
      setAuthenticatedUser(null);
      localStorage.removeItem("ADMIN");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-between md:justify-end min-h-[10vh] w-full">
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
      <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-36 group-hover:h-20 opacity-10"></span>
        <button className="relative" onClick={logout}>
          Logout
        </button>
      </div>
      {/* <div className={`relative justify-end`}>
        <BsCartFill
          className="cursor-pointer"
          size={16}
          onClick={() => updateCartStatus(true)}
        />
        <span
          className={`absolute -top-3 -right-3 bg-red-500 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center`}
        >
          3
        </span>
      </div> */}
    </div>
  );
}
