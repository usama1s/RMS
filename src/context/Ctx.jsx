import { createContext, useContext, useEffect, useState } from "react";
export const LOCAL_STORAGE_BASE = "INDIA_GATES_";
export const WAITER_SIDERBARLINKS_CHEF = [
  { title: "Pending Orders", active: true },
];
export const WAITER_SIDERBARLINKS_NORMAL = [
  { title: "Dine in", active: true },
  { title: "Take away", active: false },
];

export const WAITER_SIDERBARLINKS_HEAD = [
  { title: "Dine in", active: true },
  { title: "Take away", active: false },
  { title: "Pending Orders", active: false },
];
const Ctx = createContext();
export function CtxProvider({ children }) {
  const [modalStatus, setModalStatus] = useState({ status: false, jsx: null });
  // const user = localStorage.getItem(`${LOCAL_STORAGE_BASE}Data`);

  const [activeTab, setActiveTab] = useState("Pending Orders");
  const [activeWaiterTab, setActiveWaiterTab] = useState("Dine in");
  const [managerSidebarToggle, setManagerSidebarToggle] = useState(false);
  const [waiterSidebarLinks, setWaiterSidebarLinks] = useState([
    { title: "Dine in", active: true },
    { title: "Take away", active: false },
  ]);
  const [headWaiterSidebarLinks, setHeadWaiterSidebarLinks] = useState([
    { title: "Dine in", active: true },
    { title: "Take away", active: false },
    // { title: "Dine in", active: true },
  ]);
  const [adminSidebarLinks, setAdminSidebarLinks] = useState([
    { title: "Branches", active: true },
    { title: "Z", active: false },
  ]);
  const [activeAdminTab, setActiveAdminTab] = useState("Branches");
  const [managerSidebarLinks, setManagerSidebarLinks] = useState([
    {
      title: "Pending Orders",
      active: true,
    },
    {
      title: "Lobbies",
      active: false,
    },
    {
      title: "Categories",
      active: false,
    },
    {
      title: "Menu Items",
      active: false,
    },
    {
      title: "Waiters",
      active: false,
    },
    {
      title: "Payment Methods",
      active: false,
    },
    {
      title: "Clocking System",
      active: false,
    },
  ]);
  const [authenticatedUser, setAuthenticatedUser] = useState();
  const [authStatus, setAuthStatus] = useState(false);
  const [editedCategoryValue, setEditCategoryValue] = useState(null);
  const [editedItemValue, setEditedItemValue] = useState(null);
  const [editedLobbyValue, setEditedLobbyValue] = useState(null);
  const [apiDone, setApiDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

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
    setAuthenticatedUser(localStorage.getItem("ADMIN"));
    setAuthStatus(true);
  }, []);
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
        setAuthenticatedUser,
        setActiveWaiterTab,
        setWaiterSidebarLinks,
        setHeadWaiterSidebarLinks,
        updateApiDoneStatus,
        apiDone,
        paymentMethod,
        updatePaymentMethod,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export function useCtx() {
  return useContext(Ctx);
}
