import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginUser, loginAdmin } = useAuth();

  useEffect(() => {
    try {
      const token = params.get("token");
      const userData = params.get("user");
      const error = params.get("error");
      const ref = params.get("ref");

      // لو في error أو ناقص بيانات أساسية → رجع login
      if (error || !token || !userData) {
        navigate("/login", { replace: true });
        return;
      }

      // خزّن ref بتاع affiliate لو مش متخزن قبل كده
      if (ref && !localStorage.getItem("affiliate_ref")) {
        localStorage.setItem("affiliate_ref", ref);
      }

      // فك بيانات اليوزر
      let user;
      try {
        user = JSON.parse(atob(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
        navigate("/login", { replace: true });
        return;
      }

      // 🟥 Admin
      if (user.role === "admin") {
        loginAdmin(user, token);
        navigate("/adminDashboard", { replace: true });
        return;
      }

      // 🟩 أي حاجة تاني = user عادي
      loginUser(user, token);

      if (user.email_verified_at === null || user.email_verified_at === "null") {
        navigate("/UnverifiedUsers", { replace: true });
      } else {
        navigate("/userDashboard", { replace: true });
      }

    } catch (e) {
      console.error(e);
      // مهم: متعمليش localStorage.clear() عشان اللغة
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("affiliateToken");
      navigate("/login", { replace: true });
    }
  // 👇 خلي الـ effect يشتغل مرة واحدة بس عند mount
  // ومتحطيش loginUser / loginAdmin هنا عشان ما يعملوش loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Logging you in...</p>
    </div>
  );
}





// import { useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";

// export default function GoogleCallback() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();
//   const { loginUser, loginAdmin } = useAuth();

//   useEffect(() => {
//     const handleGoogleCallback = () => {
//       try {
//         const token = params.get("token");
//         const userData = params.get("user");
//         const ref = params.get("ref");
//         const error = params.get("error");
        
//         // Check for error parameter
//         if (error || !token || !userData) {
          
//           navigate("/login");
//           return;
//         }
//         if (ref && !localStorage.getItem("affiliate_ref")) {
//         localStorage.setItem("affiliate_ref", ref);
//         }



//         // Decode user data from base64
//         const user = JSON.parse(atob(userData));
        

//         if (user.role === 'user') {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//         loginUser(user, token);

//         if (user.email_verified_at == null) {
//           navigate("/UnverifiedUsers");
//           return;
//         }

        
//           navigate("/userDashboard");
        
//         }
//           else if (user.role === 'admin') {
//           localStorage.setItem("adminToken", token);
//           loginAdmin(user, token);
//           navigate('/adminDashboard');
//         } else {
//           // Unknown role
          
//           navigate("/login");
//         }
//       } catch (error) {
//         localStorage.clear();
//         navigate("/login");
//       }
//     };

//     handleGoogleCallback();
//   }, [params, navigate]);

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <p>Logging you in...</p>
//     </div>
//   );
// }