import React from "react";
import { useCtx } from "../../../../context/Ctx";
const TEST_CARDS = [
  {
    title: "Dine In",
    image:
      "https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    title: "Take Away",
    image:
      "https://images.pexels.com/photos/6613047/pexels-photo-6613047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];
export function ManagerDashboard() {
  const { updateManagerSidebarLinks } = useCtx();
  return (
    <>
      <h1 className="py-2  font-semibold text-xl text-left">Dasboard</h1>
      <div className="flex items-center flex-wrap basis-[20rem]">
        {TEST_CARDS.map(({ title, image }) => (
          <div
            className={` w-[16rem] border-[0.5px] border-[#F3F4F6] shadow-lg mr-4 py-2 pt-0 my-2 rounded-md cursor-pointer`}
            key={title}
            onClick={updateManagerSidebarLinks("Orders")}
          >
            <img
              className="h-[30vh] w-full object-cover rounded-t-lg"
              src={image}
            />
            <h1 className="text-gray-900 pt-2 flex items-center font-semibold justify-center">
              {title}
            </h1>
          </div>
        ))}
      </div>
    </>
  );
}
