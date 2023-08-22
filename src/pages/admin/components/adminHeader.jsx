import { useCtx } from '../../../context/Ctx';
import { useNavigate } from 'react-router';
import { GiHamburgerMenu } from 'react-icons/gi';
import api from '../../../config/AxiosBase';

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
      await api.get('/signout', { withCredentials: true });
      updateAdminSidebarLinks('Branches')();
      setAuthenticatedUser(null);
      localStorage.removeItem('ADMIN');
      navigate('/global-signin');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-between md:justify-end min-h-[10vh] w-full border-b-[1px] border-gray-300">
      <GiHamburgerMenu
        className="w-6 h-6 block md:hidden"
        onClick={updateManagerSidebarToggle(!managerSidebarToggle)}
      />
      <div className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-gray-800 active:shadow-none shadow-lg bg-gradient-to-tr from-gray-900 to-gray-800 border-gray-800 text-white">
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-20 opacity-10"></span>
        <button className="relative" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
