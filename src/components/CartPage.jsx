// // src/components/CartPage.jsx
// import React from 'react';
// import { useCart } from '../context/CartContext';
// import { Link } from 'react-router-dom';
// import supabase from "../supabaseClient";
// import './CartPage.css';

// const CartPage = () => {
//   const {
//     cart,
//     incrementItem,
//     decrementItem,
//     removeLineItem,
//     getTotalPrice
//   } = useCart();


//   const totalPrice = getTotalPrice();

//   return (
//     <div className="cart-page-container">
//       <h2>Your Cart</h2>

//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <div className="cart-items-list">
//           {cart.map(item => {
//             const {
//               lineId,
//               Title,
//               PosterURL,
//               price,
//               quantity
//             } = item;
//             const lineTotal = price * quantity;

//             return (
//               <div className="cart-item" key={lineId}>
//                 <img
//                   src={PosterURL || 'https://via.placeholder.com/150'}
//                   alt={Title}
//                   className="cart-item-image"
//                 />
//                 <div className="cart-item-details">
//                   <h4>{Title}</h4>
//                   <p>Unit Price: ${price.toFixed(2)}</p>

//                   <div className="qty-controls">
//                     <button onClick={() => decrementItem(lineId)}>-</button>
//                     <span>{quantity}</span>
//                     <button onClick={() => incrementItem(lineId)}>+</button>
//                   </div>

//                   <p>Total: ${lineTotal.toFixed(2)}</p>

//                   <button
//                     className="remove-line"
//                     onClick={() => removeLineItem(lineId)}
//                   >
//                     Remove Item
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cart.length > 0 && (
//         <div className="cart-summary">
//           <h3>Total: ${totalPrice.toFixed(2)}</h3>
//           <div className="cart-summary-buttons">
//             <Link to="/movies" className="continue-shopping">← Continue Shopping</Link>
//             <button
//               className="checkout-button"
//               onClick={() => {
//               // Navigate to success page
//               window.location.href = '/cart-success';
//               }}
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;




// src/components/CartPage.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import supabase from "../supabaseClient";
import emailjs from '@emailjs/browser';
import './CartPage.css';

const CartPage = () => {
  const {
    cart,
    incrementItem,
    decrementItem,
    removeLineItem,
    getTotalPrice,
    clearCart
  } = useCart();

  const totalPrice = getTotalPrice();
  const navigate = useNavigate();

  // Shipping & contact form state
  const [info, setInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setInfo(i => ({ ...i, [name]: value }));
  };

  const handleConfirm = async e => {
    e.preventDefault();

    // 1) Validate all fields
    for (let key in info) {
      if (!info[key]) {
        return alert('Please fill in all fields.');
      }
    }

    // 2) Auth check
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      return alert('Authentication error—please log in again.');
    }
    if (!user) {
      return navigate('/login', { state: { from: '/cart' } });
    }

    // 3) Insert order with shipping & email
    const resOrder = await supabase
      .from('orders')
      .insert([{
        user_id:              user.id,
        status:               'pending',
        shipping_name:        info.name,
        shipping_address:     info.address,
        shipping_city:        info.city,
        shipping_state:       info.state,
        shipping_postal_code: info.postalCode,
        shipping_phone:       info.phone,
        shipping_email:       info.email
      }])
      .select()
      .single();

    if (resOrder.error) {
      console.error('Order insert error:', resOrder.error);
      return alert(`Could not place order:\n${resOrder.error.message}`);
    }
    const order = resOrder.data;

    // 4) Insert line items
    const itemsPayload = cart.map(item => ({
      order_id:           order.id,
      product_type:       item.isAdult ? 'adult' : 'regular',
      product_serial_no:  item.product_serial_no,
      quantity:           item.quantity,
      unit_price:         item.price
    }));
    const resItems = await supabase
      .from('order_items')
      .insert(itemsPayload);

    if (resItems.error) {
      console.error('Items insert error:', resItems.error);
      return alert(`Could not save order items:\n${resItems.error.message}`);
    }

    // 5) Send confirmation email via EmailJS
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_name: info.name,
          to_email: info.email,
          order_id: order.id,
          order_total: `$${totalPrice.toFixed(2)}`,
          order_date: new Date(order.created_at).toLocaleDateString(),
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      console.log('Confirmation email sent.');
    } catch (emailError) {
      console.error('EmailJS error:', emailError);
      // not blocking success
    }

    // 6) clear cart & navigate
    clearCart();
    navigate('/cart-success');
  };

  return (
    <div className="cart-page-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cart.map(item => {
              const { lineId, Title, PosterURL, price, quantity } = item;
              const lineTotal = price * quantity;
              return (
                <div className="cart-item" key={lineId}>
                  <img
                    src={PosterURL || 'https://via.placeholder.com/150'}
                    alt={Title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h4>{Title}</h4>
                    <p>Unit Price: ${price.toFixed(2)}</p>
                    <div className="qty-controls">
                      <button onClick={() => decrementItem(lineId)}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => incrementItem(lineId)}>+</button>
                    </div>
                    <p>Total: ${lineTotal.toFixed(2)}</p>
                    <button
                      className="remove-line"
                      onClick={() => removeLineItem(lineId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Cart Total: ${totalPrice.toFixed(2)}</h3>
            <Link to="/movies" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>

          <div className="checkout-section">
            <h3>Shipping & Contact Information</h3>
            <form className="checkout-form" onSubmit={handleConfirm}>
              <div className="form-grid">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={info.name}
                  onChange={handleChange}
                />
                <input
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  value={info.email}
                  onChange={handleChange}
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  type="tel"
                  value={info.phone}
                  onChange={handleChange}
                />
                <input
                  name="address"
                  placeholder="Street Address"
                  value={info.address}
                  onChange={handleChange}
                />
                <input
                  name="city"
                  placeholder="City"
                  value={info.city}
                  onChange={handleChange}
                />
                <input
                  name="state"
                  placeholder="State"
                  value={info.state}
                  onChange={handleChange}
                />
                <input
                  name="postalCode"
                  placeholder="Postal Code"
                  value={info.postalCode}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="confirm-button">
                Confirm & Place Order
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;





