import { createContext, useContext, useEffect, useState } from 'react';
const CartCtx = createContext();

export function CartCtxProvider({ children }) {
  const [orderData, setOrderData] = useState({});
  const [cartStatus, setCartStatus] = useState(false);
  const [manTakeawayCartStatus, setManTakeawayCartStatus] = useState(false);
  const [cartModalStatus, setCartModalStatus] = useState({
    open: false,
    value: null,
  });
  const [takeawayCartStatus, setTakeawayCartStatus] = useState(false);
  const [takeawayCartModalStatus, setTakeawayCartModalStatus] = useState({
    open: false,
    value: null,
  });
  const [itemsOfCart, setItemsOfCart] = useState([]);
  const [apiItemsOfCart, setApiItemsOfCart] = useState([]);
  const cartNoOfItems = itemsOfCart.length;
  const cartNoOfItems2 = apiItemsOfCart.length;
  const cartTotalPrice =
    cartNoOfItems > 0
      ? itemsOfCart.reduce((accum, item) => {
          return accum + item.price * item.qty;
        }, 0)
      : 0;
  const cartTotalPrice2 =
    cartNoOfItems2 > 0
      ? apiItemsOfCart.reduce((accum, item) => {
          return accum + item.price * item.qty;
        }, 0)
      : 0;
  let TotalPriceOfCart = cartTotalPrice + cartTotalPrice2;

  useEffect(() => {
    if (cartStatus) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [cartStatus]);
  useEffect(() => {
    if (manTakeawayCartStatus) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [manTakeawayCartStatus]);
  const onItemAdd = (data) => {
    const itemExists = itemsOfCart.find((d) => d.slug === data.slug);
    if (itemExists) {
      setItemsOfCart((prevItems) => {
        return prevItems.map((item) =>
          item.slug === data.slug
            ? { ...item, qty: data.qty + item.qty }
            : { ...item }
        );
      });

      return;
    }
    setItemsOfCart((prevItems) => [...prevItems, data]);
  };
  const onClearCart = () => {
    setItemsOfCart([]);
  };
  const onItemAddFromAPI = (data) => {
    setApiItemsOfCart([data]);
  };
  const onItemDelete = (slug) => {
    setItemsOfCart((prevItems) =>
      prevItems.filter((item) => item.slug !== slug)
    );
  };
  const onApiItemDelete = (slug) => {
    setApiItemsOfCart((prevItems) =>
      prevItems.filter((item) => item.slug !== slug)
    );
  };
  const onCartItemAdd = (data) => {
    setItemsOfCart((prevItems) =>
      prevItems.map((item) => {
        return item.slug === data.slug
          ? { ...item, qty: item.qty + 1 }
          : { ...item };
      })
    );
  };
  const onCartItemRemove = (data) => {
    const item = itemsOfCart.find((element) => element.slug === data.slug);
    if (item.qty - 1 === 0) {
      setItemsOfCart((prevItems) =>
        prevItems.filter((element) => element.slug !== data.slug)
      );
    } else {
      setItemsOfCart((prevItems) =>
        prevItems.map((item) => {
          return item.slug === data.slug
            ? { ...item, qty: item.qty - 1 }
            : { ...item };
        })
      );
    }
  };
  const resetCart = () => {
    setItemsOfCart([]);
  };
  const resetApiCart = () => {
    setApiItemsOfCart([]);
  };
  const addOrderData = (lobby, table) => {
    setOrderData({
      lobby,
      table,
    });
  };
  const updateCartStatus = (value) => setCartStatus(value);
  const updateCartModalStatus = (status, value) =>
    setCartModalStatus({ open: status, value });
  const updateTakeawayCartStatus = (value) => setTakeawayCartStatus(value);
  const updateTakeawayCartModalStatus = (status, value) =>
    setTakeawayCartModalStatus({ open: status, value });
  const updateManTakeawayCartStatus = (value) =>
    setManTakeawayCartStatus(value);

  return (
    <CartCtx.Provider
      value={{
        // dine in cart status
        cartStatus,
        updateCartStatus,
        cartModalStatus,
        updateCartModalStatus,
        // takeaway cart status
        takeawayCartStatus,
        updateTakeawayCartStatus,
        takeawayCartModalStatus,
        updateTakeawayCartModalStatus,
        // else
        onClearCart,
        onItemAdd,
        onItemAddFromAPI,
        onApiItemDelete,
        cartNoOfItems,
        itemsOfCart,
        apiItemsOfCart,
        onItemDelete,
        cartTotalPrice,
        TotalPriceOfCart,
        onCartItemAdd,
        onCartItemRemove,
        resetCart,
        resetApiCart,
        addOrderData,
        orderData,
        // manager cart
        updateManTakeawayCartStatus,
        manTakeawayCartStatus,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}
export function useCartCtx() {
  return useContext(CartCtx);
}
