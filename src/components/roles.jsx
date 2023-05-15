import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROLES } from "../utils/roles";
function RolesComponent() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState();
  useEffect(() => {
    setRoles(
      Object.entries(ROLES).map(([key, value]) => ({
        navigateTopath: () => navigate(`/${value.toLowerCase()}`),
        value,
      }))
    );
  }, []);

  return (
    <div className="flex items-center justify-center gap-5 flex-col h-[100vh]">
      <h1 className="font-bold text-2xl text-center py-2">Select a role.</h1>
      <div className="flex flex-col sm:flex-row gap-5">
        {roles?.map(({ value, navigateTopath }) => (
          <div
            key={value}
            onClick={() => navigateTopath()}
            class="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white"
          >
            <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
            <span class="relative">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RolesComponent;
