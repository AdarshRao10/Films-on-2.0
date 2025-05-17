// // src/context/CartContext.js
// import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';

// const CartContext = createContext();
// // Load initial cart from localStorage
// const initialState = JSON.parse(localStorage.getItem('cart')) || [];

// function cartReducer(state, action) {
//   switch (action.type) {
//     case 'ADD_ITEM': {
//       const payload = action.payload;
//       // Determine numeric price from various possible fields
//       const rawPrice = payload.CurrentPrice ?? payload.currentPrice ?? payload.Price ?? payload.price ?? 0;
//       const price = parseFloat(rawPrice) || 0;
//       const mergeKey = payload.id ?? payload.Title;
//       const existingIndex = state.findIndex(item => item.mergeKey === mergeKey);
//       if (existingIndex !== -1) {
//         const newState = [...state];
//         newState[existingIndex] = {
//           ...newState[existingIndex],
//           quantity: newState[existingIndex].quantity + 1
//         };
//         return newState;
//       }
//       const lineId = crypto.randomUUID?.() || Date.now().toString();
//       return [
//         ...state,
//         {
//           mergeKey,
//           lineId,
//           price,
//           quantity: 1,
//           id: payload.id,
//           Title: payload.Title,
//           PosterURL: payload.PosterURL
//         }
//       ];
//     }
//     case 'INCREMENT':
//       return state.map(item =>
//         item.lineId === action.id
//           ? { ...item, quantity: item.quantity + 1 }
//           : item
//       );
//     case 'DECREMENT':
//       return state
//         .map(item =>
//           item.lineId === action.id
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//         .filter(item => item.quantity > 0);
//     case 'REMOVE':
//       return state.filter(item => item.lineId !== action.id);
//     default:
//       return state;
//   }
// }

// export function CartProvider({ children }) {
//   const [cart, dispatch] = useReducer(cartReducer, initialState);

//   // Persist cart whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const value = useMemo(() => ({
//     cart,
//     addItem: product => dispatch({ type: 'ADD_ITEM', payload: product }),
//     addToCart: product => dispatch({ type: 'ADD_ITEM', payload: product }),
//     incrementItem: id => dispatch({ type: 'INCREMENT', id }),
//     decrementItem: id => dispatch({ type: 'DECREMENT', id }),
//     removeLineItem: id => dispatch({ type: 'REMOVE', id }),
//     getTotalItems: () => cart.reduce((sum, item) => sum + item.quantity, 0),
//     getTotalPrice: () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   }), [cart]);

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) throw new Error('useCart must be used within CartProvider');
//   return context;
// }




import React, { createContext, useReducer, useContext, useMemo, useEffect } from 'react';

const CartContext = createContext();
// Load initial cart from localStorage, but drop any item without product_serial_no
const rawCart     = JSON.parse(localStorage.getItem('cart')) || [];
const initialState = rawCart.filter(item => item.product_serial_no != null);



function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const payload = action.payload;
      // Determine numeric price from various possible fields
      const rawPrice = payload.CurrentPrice ?? payload.currentPrice ?? payload.Price ?? payload.price ?? 0;
      const price = parseFloat(rawPrice) || 0;
      // Use title as merge key
      const mergeKey = payload.Title;
      const existingIndex = state.findIndex(item => item.mergeKey === mergeKey);
      if (existingIndex !== -1) {
        const newState = [...state];
        newState[existingIndex] = {
          ...newState[existingIndex],
          quantity: newState[existingIndex].quantity + 1
        };
        return newState;
      }
      const lineId = crypto.randomUUID?.() || Date.now().toString();
      // extract serial number and adult flag
      const serial = payload.RegSerialNo ?? payload.AdultSerialNo;
      const isAdult = payload.AdultSerialNo != null;
      return [
        ...state,
        {
          mergeKey,
          lineId,
          price,
          quantity: 1,
          id: payload.id,
          Title: payload.Title,
          PosterURL: payload.PosterURL,
          product_serial_no: serial,
          isAdult
        }
      ];
    }
    case 'INCREMENT':
      return state.map(item =>
        item.lineId === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case 'DECREMENT':
      return state
        .map(item =>
          item.lineId === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
    case 'REMOVE':
      return state.filter(item => item.lineId !== action.id);
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    addItem: product => dispatch({ type: 'ADD_ITEM', payload: product }),
    addToCart: product => dispatch({ type: 'ADD_ITEM', payload: product }),
    incrementItem: id => dispatch({ type: 'INCREMENT', id }),
    decrementItem: id => dispatch({ type: 'DECREMENT', id }),
    removeLineItem: id => dispatch({ type: 'REMOVE', id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    getTotalItems: () => cart.reduce((sum, item) => sum + item.quantity, 0),
    getTotalPrice: () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}