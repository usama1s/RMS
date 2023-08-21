import { useCtx } from '../../../context/Ctx';

export function AdminSidebar() {
  const { adminSidebarLinks, updateAdminSidebarLinks, managerSidebarToggle } =
    useCtx();

  const JSX = adminSidebarLinks.map(({ title, active }) => (
    <div
      key={title}
      className={`flex items-center w-full h-12 px-3 mt-1 cursor-pointer ${
        active && 'bg-gray-900 text-white'
      }  rounded`}
      onClick={updateAdminSidebarLinks(title)}
    >
      <span className="ml-0 md:ml-2 text-xs md:text-sm font-medium">
        {title}
      </span>
    </div>
  ));

  return (
    <div
      className={`flex flex-col items-center ${
        managerSidebarToggle ? '-translate-x-[-100%] w-0' : 'translate-x-0 w-64'
      } md:translate-x-0 md:w-64 min-h-[100vh] overflow-hidden text-gray-700 bg-gray-100 rounded transition-all duration-75 ease-in`}
    >
      <div className="flex justify-center items-center w-full h-14">
        <div className="flex gap-1 sm:gap-2 items-center">
          <img
            src="/assets/indiagateLogo.png"
            alt="indiagate logo"
            className="w-32 mt-14"
          />
        </div>
      </div>
      <div className="w-full px-2 mt-12">
        <div className="flex flex-col items-center w-full mt-2 border-t border-gray-300">
          {JSX}
        </div>
      </div>
    </div>
  );
}
