// // src/components/CartSuccess.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './CartSuccess.css';

// const CartSuccess = () => {
//   return (
//     <div className="cart-success-container">
//       <h2>✅ Thank you for your order!</h2>
//       <p>Your order has been successfully placed. We'll send you a confirmation email soon.</p>
      
//       <div className="cart-success-actions">
//         <Link to="/" className="success-button">← Continue Shopping</Link>
//         <Link to="/orders" className="success-button">View My Orders</Link>
//       </div>
//     </div>
//   );
// };

// export default CartSuccess;




// src/components/CartSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CartSuccess.css';

const CartSuccess = () => {
  return (
    <div className="cart-success-container">
      <h2>✅ Thank you for your order!</h2>
      <p>Your order has been successfully placed. We'll send you a confirmation email soon.</p>
      
      <div className="cart-success-actions">
        <Link to="/" className="success-button">← Continue Shopping</Link>
        <Link to="/orders" className="success-button">View My Orders</Link>
      </div>
    </div>
  );
};

export default CartSuccess;
