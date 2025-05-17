// // src/components/Orders.jsx
// import React, { useState } from "react";
// import "./Orders.css";

// const Orders = () => {
//   // Mock orders data
//   const [orders] = useState([
//     {
//       orderId: "1234",
//       status: "Shipped",
//       estimatedDelivery: "May 10, 2025",
//       items: [
//         { title: "Inception", quantity: 1, price: 14.99 },
//         { title: "The Godfather", quantity: 2, price: 19.99 },
//       ],
//     },
//     {
//       orderId: "1235",
//       status: "In Transit",
//       estimatedDelivery: "May 12, 2025",
//       items: [
//         { title: "Guardians of the Galaxy Vol. 3", quantity: 1, price: 24.99 },
//       ],
//     },
//     {
//       orderId: "1236",
//       status: "Delivered",
//       estimatedDelivery: "Delivered on May 2, 2025",
//       items: [
//         { title: "Mission Impossible: Dead Reckoning", quantity: 1, price: 17.99 },
//         { title: "Top Gun: Maverick", quantity: 1, price: 21.99 },
//       ],
//     },
//   ]);

//   return (
//     <div className="orders-container">
//       <h1>Your Orders</h1>

//       {orders.length === 0 ? (
//         <p>You have no orders yet.</p>
//       ) : (
//         orders.map((order) => {
//           const orderTotal = order.items.reduce(
//             (sum, item) => sum + item.quantity * item.price,
//             0
//           );

//           return (
//             <div className="order-card" key={order.orderId}>
//               <h2>Order #{order.orderId}</h2>
//               <p><strong>Status:</strong> {order.status}</p>
//               <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>

//               <div className="order-items">
//                 <h4>Items:</h4>
//                 <ul>
//                   {order.items.map((item, idx) => (
//                     <li key={idx}>
//                       {item.title} &times; {item.quantity} — ${item.price.toFixed(2)} each
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <p className="order-total">
//                 <strong>Total:</strong> ${orderTotal.toFixed(2)}
//               </p>
//             </div>
//           );
//         })
//       )}

//       <p className="orders-note">
//         (In a real app, this page would pull your orders from your account and let you track shipping, request returns, and more.)
//       </p>
//     </div>
//   );
// };

// export default Orders;



// src/components/Orders.jsx
import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      // 1) get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 2) fetch orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select("id, status, created_at, shipping_name, shipping_address, shipping_city, shipping_state, shipping_postal_code, shipping_phone")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersErr) {
        console.error(ordersErr);
        setLoading(false);
        return;
      }

      // 3) fetch all line-items
      const orderIds = ordersData.map(o => o.id);
      const { data: itemsData, error: itemsErr } = await supabase
        .from("order_items")
        .select("order_id, product_type, product_serial_no, quantity, unit_price")
        .in("order_id", orderIds);

      if (itemsErr) {
        console.error(itemsErr);
        setLoading(false);
        return;
      }

      // 4) fetch movie titles in bulk
      const regularIds = itemsData.filter(i => i.product_type === "regular")
                                  .map(i => i.product_serial_no);
      const adultIds   = itemsData.filter(i => i.product_type === "adult")
                                  .map(i => i.product_serial_no);

      const [{ data: regTitles }, { data: adultTitles }] = await Promise.all([
        supabase.from("Regular_titles")
                .select("RegSerialNo, Title")
                .in("RegSerialNo", regularIds),
        supabase.from("Adult_titles")
                .select("AdultSerialNo, Title")
                .in("AdultSerialNo", adultIds),
      ]);

      const regMap   = new Map(regTitles.map(r => [r.RegSerialNo, r.Title]));
      const adultMap = new Map(adultTitles.map(a => [a.AdultSerialNo, a.Title]));

      // 5) attach items to each order, look up title
      const ordersWithItems = ordersData.map(order => ({
        ...order,
        items: itemsData
          .filter(i => i.order_id === order.id)
          .map(i => ({
            ...i,
            title: i.product_type === "regular"
              ? regMap.get(i.product_serial_no)
              : adultMap.get(i.product_serial_no)
          }))
      }));

      setOrders(ordersWithItems);
      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) return <div>Loading orders…</div>;
  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {orders.map(order => {
        const total = order.items
          .reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
          .toFixed(2);
        return (
          <div className="order-card" key={order.id}>
            <h2>Order #{order.id}</h2>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Placed On:</strong> {new Date(order.created_at).toLocaleString()}</p>

            <div className="shipping-info">
              <h4>Ship To:</h4>
              <p>{order.shipping_name}</p>
              <p>{order.shipping_address}</p>
              <p>
                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              </p>
              <p>📞 {order.shipping_phone}</p>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} &times; {item.quantity} @ ${item.unit_price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="order-total">
              <strong>Order Total:</strong> ${total}
            </p>
          </div>
        );
      })}
    </div>
  );
}
