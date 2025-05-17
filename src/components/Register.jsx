// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../supabaseClient";
// import "./Register.css";

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
//     setError("");
//     setLoading(true);

//     // 1️⃣ Basic validation
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }
//     if (!dateOfBirth) {
//       setError("Please enter your date of birth.");
//       setLoading(false);
//       return;
//     }

//     // 2️⃣ Sign up user
//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
//       { email, password },
//       { redirectTo: `${window.location.origin}/login` }
//     );

//     if (signUpError) {
//       setError(signUpError.message);
//       setLoading(false);
//       return;
//     }

//     // 3️⃣ Profile insert: always use signUpData.user.id
//     const userId = signUpData.user.id;
//     if (userId) {
//       const { error: profileError } = await supabase
//         .from("customers")
//         .insert([
//           {
//             id: userId,
//             first_name: firstName,
//             last_name: lastName,
//             date_of_birth: dateOfBirth,
//           },
//         ]);
//       if (profileError) {
//         setError("Profile save failed: " + profileError.message);
//         setLoading(false);
//         return;
//       }
//     }

//     // 4️⃣ Handle email confirmation vs session
//     if (!signUpData.session) {
//       alert(
//         "Registration successful! Please check your email to confirm your account, then log in."
//       );
//       setLoading(false);
//       navigate("/login", { replace: true });
//       return;
//     }

//     // 5️⃣ If session exists
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      { email, password },
      { redirectTo: `${window.location.origin}/login` }
    );

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

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

    if (!signUpData.session) {
      alert("Registration successful! Please check your email to confirm your account, then log in.");
      setLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    setLoading(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please fill in the details below to register
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* First + Last Name Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Rest Vertical */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
