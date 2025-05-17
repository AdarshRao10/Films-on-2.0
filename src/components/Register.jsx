// // src/components/Register.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../supabaseClient";
// import "./Register.css"; // ✅ Import the CSS file

// export default function Register() {
//   const navigate = useNavigate();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState(""); // YYYY-MM-DD
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submitted - starting registration process");
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       console.log("Validation failed: Passwords don't match");
//       return;
//     }
//     if (!dateOfBirth) {
//       setError("Please enter your date of birth.");
//       console.log("Validation failed: Missing date of birth");
//       return;
//     }

//     setLoading(true);
//     console.log("Attempting to sign up user with email:", email);

//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
//       { email, password },
//       { redirectTo: `${window.location.origin}/login` }
//     );
    
//     console.log("Sign up response:", signUpData);
//     console.log("Sign up error (if any):", signUpError);
    
//     if (signUpError) {
//       setError(signUpError.message);
//       console.log("Sign up failed with error:", signUpError.message);
//       setLoading(false);
//       return;
//     }

//     if (!signUpData.session) {
//       console.log("No session returned - email confirmation required");
//       alert(
//         "Registration successful! Please check your email to confirm your account, then log in."
//       );
//       setLoading(false);
//       navigate("/login", { replace: true });
//       return;
//     }

//     const userId = signUpData.session.user.id;
//     console.log("Session exists - attempting to insert customer with ID:", userId);
//     console.log("Customer data to insert:", {
//       id: userId,
//       first_name: firstName,
//       last_name: lastName,
//       date_of_birth: dateOfBirth,
//     });
    
//     const { data: insertData, error: profileError } = await supabase
//       .from("customers")
//       .insert([
//         {
//           id: userId,
//           first_name: firstName,
//           last_name: lastName,
//           date_of_birth: dateOfBirth,
//         },
//       ]);
    
//     console.log("Insert response data:", insertData);
//     console.log("Insert error (if any):", profileError);

//     if (profileError) {
//       setError("Profile save failed: " + profileError.message);
//       console.log("Profile save failed with error:", profileError.message);
//       setLoading(false);
//       return;
//     }

//     // 5️⃣ Done! Navigate to login or home
//     setLoading(false);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="register-container">
//       <h2>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           First Name
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Last Name
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Date of Birth
//           <input
//             type="date"
//             value={dateOfBirth}
//             onChange={(e) => setDateOfBirth(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Email
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Confirm Password
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </label>

//         {error && <p className="error">{error}</p>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating…" : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// }




// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(""); // YYYY-MM-DD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1️⃣ Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!dateOfBirth) {
      setError("Please enter your date of birth.");
      setLoading(false);
      return;
    }

    // 2️⃣ Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password },
      { redirectTo: `${window.location.origin}/login` }
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ Profile insert: always use signUpData.user.id
    const userId = signUpData.user.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from("customers")
        .insert([
          {
            id: userId,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
          },
        ]);
      if (profileError) {
        setError("Profile save failed: " + profileError.message);
        setLoading(false);
        return;
      }
    }

    // 4️⃣ Handle email confirmation vs session
    if (!signUpData.session) {
      alert(
        "Registration successful! Please check your email to confirm your account, then log in."
      );
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    // 5️⃣ If session exists
    setLoading(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </button>
      </form>
    </div>
  );
}
