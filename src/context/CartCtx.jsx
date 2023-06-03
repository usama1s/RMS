import { createContext, useContext, useEffect, useState } from "react";
const CartCtx = createContext();

export function CartCtxProvider({ children }) {
  const [orderData, setOrderData] = useState({});
  const [cartStatus, setCartStatus] = useState(false);
  const [cartModalStatus, setCartModalStatus] = useState({
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [cartStatus]);
  const onItemAdd = (data) => {
    console.log({ data });
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
  const onItemAddFromAPI = (data) => {
    const itemExists = apiItemsOfCart.find((d) => d.slug === data.slug);
    if (itemExists) {
      setApiItemsOfCart((prevItems) => {
        return prevItems.map((item) =>
          item.slug === data.slug
            ? { ...item, qty: data.qty + item.qty }
            : { ...item }
        );
      });

      return;
    }
    setApiItemsOfCart((prevItems) => [...prevItems, data]);
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
  const addOrderData = (lobby, table) => {
    console.log("Received lobby and table:", lobby, table);

    setOrderData({
      lobby,
      table,
    });

    console.log("Order data updated:", orderData);
  };
  const updateCartStatus = (value) => setCartStatus(value);
  const updateCartModalStatus = (status, value) =>
    setCartModalStatus({ open: status, value });

  return (
    <CartCtx.Provider
      value={{
        cartStatus,
        updateCartStatus,
        cartModalStatus,
        updateCartModalStatus,
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
        addOrderData,
        orderData,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}
export function useCartCtx() {
  return useContext(CartCtx);
}
