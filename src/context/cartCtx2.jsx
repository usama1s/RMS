import React, { createContext, useContext, useReducer } from 'react';

// Define action types
const ADD_ITEM = 'ADD_ITEM';
const ADD_ITEM_FROM_API = 'ADD_ITEM_FROM_API';
const DELETE_ITEM = 'DELETE_ITEM';
const CLEAR_CART = 'CLEAR_CART';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';
const RESET_CART = 'RESET_CART';
const SET_ORDER_DATA = 'SET_ORDER_DATA';
const UPDATE_CART_STATUS = 'UPDATE_CART_STATUS';
const UPDATE_CART_MODAL_STATUS = 'UPDATE_CART_MODAL_STATUS';
const UPDATE_TAKEAWAY_CART_STATUS = 'UPDATE_TAKEAWAY_CART_STATUS';
const UPDATE_TAKEAWAY_CART_MODAL_STATUS = 'UPDATE_TAKEAWAY_CART_MODAL_STATUS';
const UPDATE_MAN_TAKEAWAY_CART_STATUS = 'UPDATE_MAN_TAKEAWAY_CART_STATUS';

// Create a reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case ADD_ITEM:
      // Handle adding an item to the cart
      return { ...state, itemsOfCart: [...state.itemsOfCart, action.payload] };
    case ADD_ITEM_FROM_API:
      // Handle adding an item from API to the cart
      return { ...state, apiItemsOfCart: [action.payload] };
    case DELETE_ITEM:
      // Handle deleting an item from the cart
      return {
        ...state,
        itemsOfCart: state.itemsOfCart.filter(
          (item) => item.slug !== action.payload
        ),
      };
    case CLEAR_CART:
      // Handle clearing the cart
      return { ...state, itemsOfCart: [] };
    case INCREMENT_ITEM:
      // Handle incrementing the quantity of an item
      return {
        ...state,
        itemsOfCart: state.itemsOfCart.map((item) =>
          item.slug === action.payload ? { ...item, qty: item.qty + 1 } : item
        ),
      };
    case DECREMENT_ITEM:
      // Handle decrementing the quantity of an item
      return {
        ...state,
        itemsOfCart: state.itemsOfCart.map((item) =>
          item.slug === action.payload ? { ...item, qty: item.qty - 1 } : item
        ),
      };
    case RESET_CART:
      // Handle resetting the cart
      return { ...state, itemsOfCart: [] };
    case SET_ORDER_DATA:
      // Handle setting order data
      return {
        ...state,
        orderData: { lobby: action.payload.lobby, table: action.payload.table },
      };
    case UPDATE_CART_STATUS:
      // Handle updating the cart status
      return { ...state, cartStatus: action.payload };
    case UPDATE_CART_MODAL_STATUS:
      // Handle updating the cart modal status
      return {
        ...state,
        cartModalStatus: {
          open: action.payload.open,
          value: action.payload.value,
        },
      };
    case UPDATE_TAKEAWAY_CART_STATUS:
      // Handle updating the takeaway cart status
      return { ...state, takeawayCartStatus: action.payload };
    case UPDATE_TAKEAWAY_CART_MODAL_STATUS:
      // Handle updating the takeaway cart modal status
      return {
        ...state,
        takeawayCartModalStatus: {
          open: action.payload.open,
          value: action.payload.value,
        },
      };
    case UPDATE_MAN_TAKEAWAY_CART_STATUS:
      // Handle updating the manager takeaway cart status
      return { ...state, manTakeawayCartStatus: action.payload };
    default:
      return state;
  }
}

// Initial cart state
const initialCartState = {
  orderData: {},
  cartStatus: false,
  manTakeawayCartStatus: false,
  cartModalStatus: { open: false, value: null },
  takeawayCartStatus: false,
  takeawayCartModalStatus: { open: false, value: null },
  itemsOfCart: [],
  apiItemsOfCart: [],
};

// Create a Cart context
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Context value
  const contextValue = {
    cartState,
    dispatch,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
