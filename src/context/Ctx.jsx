import { createContext, useContext, useEffect, useState } from 'react';
export const LOCAL_STORAGE_BASE = 'INDIA_GATES_';
export const WAITER_SIDERBARLINKS_CHEF = [
  { title: 'Pending Orders', active: true },
];
export const WAITER_SIDERBARLINKS_NORMAL = [
  { title: 'Dine in', active: true },
  { title: 'Take away', active: false },
];
export const WAITER_SIDERBARLINKS_HEAD = [
  { title: 'Dine in', active: true },
  { title: 'Take away', active: false },
  { title: 'Pending Orders', active: false },
];

const Ctx = createContext();

export function CtxProvider({ children }) {
  const [modalStatus, setModalStatus] = useState({ status: false, jsx: null });
  const [activeTab, setActiveTab] = useState('Home');
  const [activeWaiterTab, setActiveWaiterTab] = useState('Dine in');
  const [managerSidebarToggle, setManagerSidebarToggle] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState();
  const [authDetailInfo, setAuthDetailInfo] = useState();
  const [authStatus, setAuthStatus] = useState(false);
  const [editedCategoryValue, setEditCategoryValue] = useState(null);
  const [editedItemValue, setEditedItemValue] = useState(null);
  const [editedLobbyValue, setEditedLobbyValue] = useState(null);
  const [apiDone, setApiDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState('PaymentDone');
  const [managerClocking, setManagerClocking] = useState();
  const [waiterSidebarLinks, setWaiterSidebarLinks] = useState([
    { title: 'Dine in', active: true, ref: 'Dine-In' },
    { title: 'Take away', active: false, ref: 'Takeaway' },
  ]);
  const [headWaiterSidebarLinks, setHeadWaiterSidebarLinks] = useState([
    { title: 'Dine in', active: true },
    { title: 'Take away', active: false },
  ]);
  const [adminSidebarLinks, setAdminSidebarLinks] = useState([
    { title: 'Branches', active: true },
    // { title: "Z", active: false },
  ]);
  const [activeAdminTab, setActiveAdminTab] = useState('Branches');
  const [managerSidebarLinks, setManagerSidebarLinks] = useState([
    {
      title: 'Home',
      active: true,
    },
    {
      title: 'Floors',
      active: false,
    },
    {
      title: 'Menu Items',
      active: false,
    },
    {
      title: 'Waiters',
      active: false,
    },
    {
      title: 'Payment Methods',
      active: false,
    },
    {
      title: 'Branch Statistics',
      active: false,
    },
  ]);

  const updateManagerClocking = (value) => {
    setManagerClocking(value);
  };
  const updateOrderType = (value) => {
    setSelectedOrderType(value);
  };
  const updatePaymentMethod = (value) => {
    setPaymentMethod(value);
  };
  const updateApiDoneStatus = (value) => {
    setApiDone(value);
  };
  const updateActiveTab = (tab) => {
    setActiveTab(tab);
  };
  const updateModalStatus = (status, jsx) => {
    setModalStatus({ ...status, jsx, status });
  };
  const updateCategoryValue = (value) => {
    setEditCategoryValue(value);
  };
  const updateItemValue = (value) => {
    setEditedItemValue(value);
  };
  const updateLobbyValue = (value) => {
    setEditedLobbyValue(value);
  };
  const updateManagerSidebarLinks = (title) => () => {
    setManagerSidebarLinks(
      managerSidebarLinks.map((link) =>
        link.title === title
          ? { ...link, active: true }
          : { ...link, active: false }
      )
    );
    updateActiveTab(title);
  };
  const updateWaiterSidebarLinks = (title) => () => {
    setWaiterSidebarLinks(
      waiterSidebarLinks.map((link) =>
        link.title === title
          ? { ...link, active: true }
          : { ...link, active: false }
      )
    );
    setActiveWaiterTab(title);
  };
  const updateHeadWaiterSidebarLinks = (title) => () => {
    setHeadWaiterSidebarLinks(
      headWaiterSidebarLinks.map((link) =>
        link.title === title
          ? { ...link, active: true }
          : { ...link, active: false }
      )
    );
    setActiveWaiterTab(title);
  };
  const updateAdminSidebarLinks = (title) => () => {
    setAdminSidebarLinks(
      adminSidebarLinks.map((link) =>
        link.title === title
          ? { ...link, active: true }
          : { ...link, active: false }
      )
    );
    setActiveAdminTab(title);
  };
  const updateManagerSidebarToggle = (value) => () =>
    setManagerSidebarToggle(value);
  useEffect(() => {
    setAuthenticatedUser(localStorage.getItem('ADMIN'));
    setAuthStatus(true);
  }, []);

  const setDetialAuthData = (data) => {
    setAuthDetailInfo(data);
  };

  return (
    <Ctx.Provider
      value={{
        activeTab,
        updateActiveTab,
        modalStatus,
        updateModalStatus,
        authenticatedUser,
        setAuthenticatedUser,
        authStatus,
        editedCategoryValue,
        updateCategoryValue,
        updateItemValue,
        editedItemValue,
        managerSidebarLinks,
        managerSidebarToggle,
        updateManagerSidebarToggle,
        updateManagerSidebarLinks,
        updateLobbyValue,
        editedLobbyValue,
        waiterSidebarLinks,
        headWaiterSidebarLinks,
        updateWaiterSidebarLinks,
        updateHeadWaiterSidebarLinks,
        activeWaiterTab,
        adminSidebarLinks,
        updateAdminSidebarLinks,
        activeAdminTab,
        setActiveWaiterTab,
        setWaiterSidebarLinks,
        setHeadWaiterSidebarLinks,
        updateApiDoneStatus,
        apiDone,
        paymentMethod,
        updatePaymentMethod,
        updateOrderType,
        selectedOrderType,
        managerClocking,
        updateManagerClocking,
        setDetialAuthData,
        authDetailInfo,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export function useCtx() {
  return useContext(Ctx);
}
