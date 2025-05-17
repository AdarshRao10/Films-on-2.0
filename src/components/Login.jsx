// // src/components/Login.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import supabase from "../supabaseClient";
// import "./Login.css"; // ✅ Import the CSS file

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // 1️⃣ Sign in
//     const { data: signInData, error: signInError } =
//       await supabase.auth.signInWithPassword({ email, password });

//     if (signInError) {
//       setError(signInError.message);
//       setLoading(false);
//       return;
//     }

//     // 2️⃣ Fetch the current session (so we get the latest user_metadata)
//     const {
//       data: { session },
//       error: sessionError
//     } = await supabase.auth.getSession();

//     if (sessionError || !session) {
//       setError("Could not get session after login.");
//       setLoading(false);
//       return;
//     }

//     // 3️⃣ Extract the role from the JWT-backed session
//     const role = session.user.user_metadata?.role;

//     // 4️⃣ Redirect based on role
//     if (role === "admin") {
//       navigate("/admin", { replace: true });
//     } else {
//       navigate("/", { replace: true });
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Sign In</h2>
//       <p>
//         Don’t have an account?{" "}
//         <Link to="/register">Register here</Link>
//       </p>
//       <form onSubmit={handleSubmit}>
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
//         {error && <p className="error">{error}</p>}
//         <button type="submit" disabled={loading}>
//           {loading ? "Signing in…" : "Sign In"}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      setError("Could not get session after login.");
      setLoading(false);
      return;
    }

    const role = session.user.user_metadata?.role;

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to login
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don’t have an account?{" "}
              <Link to="/register" className="underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
