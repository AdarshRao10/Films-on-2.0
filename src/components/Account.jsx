// // src/components/Account.jsx
// import React, { useState } from "react";
// import {
//   FaUserEdit,
//   FaLock,
//   FaCreditCard,
//   FaClipboardList,
//   FaArrowLeft,
// } from "react-icons/fa";
// import "./Account.css";

// const Account = () => {
//   const [activeSection, setActiveSection] = useState(null);

//   // Form states
//   const [personalInfo, setPersonalInfo] = useState({
//     name: "",
//     email: "",
//   });
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   });
//   const [paymentMethod, setPaymentMethod] = useState({
//     cardNumber: "",
//     expiry: "",
//   });

//   // Handlers
//   const handlePersonalInfoChange = (e) => {
//     const { name, value } = e.target;
//     setPersonalInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePaymentChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentMethod((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (section) => (e) => {
//     e.preventDefault();
//     alert(`${section} updated successfully!`);
//   };

//   return (
//     <div className="account-container">
//       <h2>My Account</h2>

//       {!activeSection && (
//         <div className="account-links">
//           <p>Select an option below:</p>
//           <ul>
//             <li>
//               <button onClick={() => setActiveSection("personalInfo")}>
//                 <FaUserEdit className="account-icon" />
//                 Update Personal Information
//               </button>
//             </li>
//             <li>
//               <button onClick={() => setActiveSection("password")}>
//                 <FaLock className="account-icon" />
//                 Change Password
//               </button>
//             </li>
//             <li>
//               <button onClick={() => setActiveSection("payment")}>
//                 <FaCreditCard className="account-icon" />
//                 Manage Payment Methods
//               </button>
//             </li>
//             <li>
//               <button onClick={() => setActiveSection("orders")}>
//                 <FaClipboardList className="account-icon" />
//                 View Order History
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}

//       {/* Personal Info Section */}
//       {activeSection === "personalInfo" && (
//         <section className="account-section">
//           <h3>Update Personal Information</h3>
//           <form onSubmit={handleSubmit("Personal Information")}>
//             <label>
//               <span>Name</span>
//               <input
//                 type="text"
//                 name="name"
//                 value={personalInfo.name}
//                 onChange={handlePersonalInfoChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Email</span>
//               <input
//                 type="email"
//                 name="email"
//                 value={personalInfo.email}
//                 onChange={handlePersonalInfoChange}
//                 required
//               />
//             </label>
//             <div className="account-buttons">
//               <button type="button" onClick={() => setActiveSection(null)}>
//                 <FaArrowLeft className="back-icon" />
//                 Back
//               </button>
//               <button type="submit">Update Info</button>
//             </div>
//           </form>
//         </section>
//       )}

//       {/* Change Password Section */}
//       {activeSection === "password" && (
//         <section className="account-section">
//           <h3>Change Password</h3>
//           <form onSubmit={handleSubmit("Password")}>
//             <label>
//               <span>Current Password</span>
//               <input
//                 type="password"
//                 name="current"
//                 value={passwords.current}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>New Password</span>
//               <input
//                 type="password"
//                 name="new"
//                 value={passwords.new}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Confirm New Password</span>
//               <input
//                 type="password"
//                 name="confirm"
//                 value={passwords.confirm}
//                 onChange={handlePasswordChange}
//                 required
//               />
//             </label>
//             <div className="account-buttons">
//               <button type="button" onClick={() => setActiveSection(null)}>
//                 <FaArrowLeft className="back-icon" />
//                 Back
//               </button>
//               <button type="submit">Change Password</button>
//             </div>
//           </form>
//         </section>
//       )}

//       {/* Payment Methods Section */}
//       {activeSection === "payment" && (
//         <section className="account-section">
//           <h3>Manage Payment Methods</h3>
//           <form onSubmit={handleSubmit("Payment Method")}>
//             <label>
//               <span>Card Number</span>
//               <input
//                 type="text"
//                 name="cardNumber"
//                 value={paymentMethod.cardNumber}
//                 onChange={handlePaymentChange}
//                 required
//               />
//             </label>
//             <label>
//               <span>Expiry Date</span>
//               <input
//                 type="text"
//                 name="expiry"
//                 placeholder="MM/YY"
//                 value={paymentMethod.expiry}
//                 onChange={handlePaymentChange}
//                 required
//               />
//             </label>
//             <div className="account-buttons">
//               <button type="button" onClick={() => setActiveSection(null)}>
//                 <FaArrowLeft className="back-icon" />
//                 Back
//               </button>
//               <button type="submit">Save Payment Method</button>
//             </div>
//           </form>
//         </section>
//       )}

//       {/* Order History Section */}
//       {activeSection === "orders" && (
//         <section className="account-section">
//           <h3>Order History</h3>
//           <p>No orders found.</p>
//           <button type="button" onClick={() => setActiveSection(null)}>
//             <FaArrowLeft className="back-icon" />
//             Back
//           </button>
//         </section>
//       )}
//     </div>
//   );
// };

// export default Account;




import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaLock,
  FaCreditCard,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";
import Orders from "./Orders"; // order history component
import supabase from "../supabaseClient";
import "./Account.css";

const Account = () => {
  const [activeSection, setActiveSection] = useState(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
  });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [paymentMethod, setPaymentMethod] = useState({ cardNumber: "", expiry: "" });

  // Load user & profile when personalInfo section opens
  useEffect(() => {
    if (activeSection === "personalInfo") {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setPersonalInfo((prev) => ({ ...prev, email: user.email }));
          const { data, error } = await supabase
            .from("customers")
            .select("first_name, last_name, date_of_birth")
            .eq("id", user.id)
            .single();
          if (!error && data) {
            setPersonalInfo({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              email: user.email || "",
              date_of_birth: data.date_of_birth || "",
            });
          }
        }
      })();
    }
  }, [activeSection]);

  // Handlers
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { first_name, last_name, date_of_birth } = personalInfo;
    const { error } = await supabase
      .from("customers")
      .update({ first_name, last_name, date_of_birth })
      .eq("id", user.id);
    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("Personal information updated successfully!");
      setActiveSection(null);
    }
  };

  const handleSubmit = (section) => (e) => {
    e.preventDefault();
    alert(`${section} updated successfully!`);
  };

  return (
    <div className="account-container">
      <h2>My Account</h2>

      {!activeSection && (
        <div className="account-links">
          <p>Select an option below:</p>
          <ul>
            <li>
              <button onClick={() => setActiveSection("personalInfo")}>  
                <FaUserEdit className="account-icon" />
                Update Personal Information
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("password")}>  
                <FaLock className="account-icon" />
                Change Password
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("payment")}>  
                <FaCreditCard className="account-icon" />
                Manage Payment Methods
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection("orders")}>  
                <FaClipboardList className="account-icon" />
                View Order History
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Personal Info Section */}
      {activeSection === "personalInfo" && (
        <section className="account-section">
          <h3>Update Personal Information</h3>
          <form onSubmit={handlePersonalSubmit}>
            <label>
              <span>First Name</span>
              <input
                type="text"
                name="first_name"
                value={personalInfo.first_name}
                onChange={handlePersonalInfoChange}
                required
              />
            </label>
            <label>
              <span>Last Name</span>
              <input
                type="text"
                name="last_name"
                value={personalInfo.last_name}
                onChange={handlePersonalInfoChange}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                disabled
              />
            </label>
            <label>
              <span>Date of Birth</span>
              <input
                type="date"
                name="date_of_birth"
                value={personalInfo.date_of_birth}
                onChange={handlePersonalInfoChange}
                required
              />
            </label>
            <div className="account-buttons">
              <button type="button" onClick={() => setActiveSection(null)}>
                <FaArrowLeft className="back-icon" /> Back
              </button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </section>
      )}

      {/* Change Password Section */}
      {activeSection === "password" && (
        <section className="account-section">
          <h3>Change Password</h3>
          <form onSubmit={handleSubmit("Password")}>        
            <label>
              <span>Current Password</span>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>New Password</span>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>Confirm New Password</span>
              <input
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <div className="account-buttons">
              <button type="button" onClick={() => setActiveSection(null)}>
                <FaArrowLeft className="back-icon" /> Back
              </button>
              <button type="submit">Change Password</button>
            </div>
          </form>
        </section>
      )}

      {/* Payment Methods Section */}
      {activeSection === "payment" && (
        <section className="account-section">
          <h3>Manage Payment Methods</h3>
          <form onSubmit={handleSubmit("Payment Method")}>        
            <label>
              <span>Card Number</span>
              <input
                type="text"
                name="cardNumber"
                value={paymentMethod.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </label>
            <label>
              <span>Expiry Date</span>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={paymentMethod.expiry}
                onChange={handlePaymentChange}
                required
              />
            </label>
            <div className="account-buttons">
              <button type="button" onClick={() => setActiveSection(null)}>
                <FaArrowLeft className="back-icon" /> Back
              </button>
              <button type="submit">Save Payment Method</button>
            </div>
          </form>
        </section>
      )}

      {/* Order History Section */}
      {activeSection === "orders" && (
        <section className="account-section">
          <h3>Order History</h3>
          <Orders />
          <div className="account-buttons">
            <button type="button" onClick={() => setActiveSection(null)}>
              <FaArrowLeft className="back-icon" /> Back
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Account;