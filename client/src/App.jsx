// import { Routes, Route, Navigate } from "react-router-dom";




// // Owner screens
// import AddMember from "./pages/owner/AddMember"; // if file is AddMember.jsx
// import Memberlist from "./pages/owner/Memberslist";

// // ... import other owner screens

// // Member screens



// import Layout from "./component/Layout";
// import UpDateMember from "./pages/owner/UpdateMembers";

// import PaymentList from "./pages/owner/Payment";

// import DailyAttendanceAll from "./pages/owner/OwnerDailyAttendance";
// import Reports from "./pages/owner/Reports";
// import AddPlan from "./pages/owner/AddPlan";
// import PlanPage from "./pages/owner/PlanPage";
// import PaymentHistory from "./pages/Members/PaymentHistory";
// import ScanQR from "./pages/Members/ScanQR";
// import QrDisplay from "./pages/Members/QrDisplay";
// import GymAttendance from "./pages/Members/GymAttendance";
// import MemberLogoutButton from "./pages/Members/MemberLogOut";


// import MemberProfile from "./pages/Members/MemberProfile";


// import Register from "./pages/owner/Login/Register";
// import Home from "./pages/owner/Home";


// import MemberPlans from "./pages/Members/memberplan";
// import OwnerProfile from "./pages/owner/OwnerProfile";
// import Login from "./pages/owner/Login/OwnerLogin";
// import ForgotPassword from "./pages/owner/Login/Forgetpassword";
// import ResetPassword from "./pages/owner/Login/Resetpassword";
// import WorkoutDietPage from "./pages/Trainer/WorkoutDietPage";

// import ActiveMembers from "./pages/owner/ActiveMembers";
// import ExpiredMembers from "./pages/owner/ExpiringDate";
// import Food from "./pages/Trainer/Food";
// import MemberDiet from "./pages/Members/MemberDiet";
// import AddTrainer from "./pages/owner/AddTrainer";
// import TrainerList from "./pages/owner/TrainerList";
// import Trainer from "./pages/Trainer/Trainer";
// import AddStaff from "./pages/owner/AddStaff";
// import useAccess from "./hooks/useAccess";




// // ... import other member screens

// // Simple role-based route protection
// const ProtectedRoute = ({ children, role }) => {
//   const { hasAccess } = useAccess();
//   const userRole = sessionStorage.getItem("role");
//   const token = sessionStorage.getItem("token");

//   if (!token) return <Navigate to="/login" />;
//   if (role && userRole !== role) return <Navigate to="/login" />;


//   return children;
// };

// function App() {

//   return (

//     <Routes>

//       <Route path="/" element={<Navigate to="/login" replace />} />
//       {/* Login route */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/forgotpassword" element={<ForgotPassword />} />
//       <Route path="/resetpassword/:token" element={<ResetPassword />} />

//       <Route path="/" element={<Layout />}>

//         {/* Owner routes */}
//         <Route
//           path="/owner/addmember"
//           element={
//             <ProtectedRoute role="owner">
//               <AddMember />
//             </ProtectedRoute>
//           }
//         />


//         <Route
//           path="/owner/memberlist"
//           element={
//             <ProtectedRoute role="owner">
//               <Memberlist />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/owner/addmember/update/:id"
//           element={
//             <ProtectedRoute role="owner">
//               <UpDateMember />
//             </ProtectedRoute>
//           }
//         />






//         <Route
//           path="/owner/home"
//           element={
//             <ProtectedRoute role="owner">
//               <Home />
//             </ProtectedRoute>
//           }
//         />


//         <Route
//           path="/owner/addstaff"
//           element={
//             <ProtectedRoute role="owner">
//               <AddStaff />
//             </ProtectedRoute>
//           }
//         />


//         <Route
//           path="/owner/addtrainer"
//           element={
//             <ProtectedRoute role="owner">
//               <AddTrainer />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/owner/trainerdetails"
//           element={
//             <ProtectedRoute role="owner">
//               <TrainerList />
//             </ProtectedRoute>
//           }
//         />







//         <Route path="/owner/ActiveMembers"
//           element={
//             <ProtectedRoute role="owner">
//               <ActiveMembers />
//             </ProtectedRoute>
//           } />

//         <Route path="owner/payment" element={<ProtectedRoute role="owner"><PaymentList /></ProtectedRoute>} />
//         <Route path="owner/expiring" element={<ProtectedRoute role="owner"><ExpiredMembers /></ProtectedRoute>} />


//         <Route path="owner/profile" element={<ProtectedRoute role="owner"><OwnerProfile /></ProtectedRoute>} />
//         <Route path="owner/daily/attendance" element={<ProtectedRoute role="owner"><DailyAttendanceAll /></ProtectedRoute>} />
//         <Route path="owner/reports" element={<ProtectedRoute role="owner"><Reports /></ProtectedRoute>} />
//         <Route path="owner/addplan" element={<ProtectedRoute role="owner"><AddPlan /></ProtectedRoute>} />
//         <Route path="owner/planpage" element={<ProtectedRoute role="owner"><PlanPage /></ProtectedRoute>} />


//         {/* Member routes */}
//         <Route
//           path="/member/profile"
//           element={
//             <ProtectedRoute role="member">
//               <MemberProfile />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/member/deitfood"
//           element={
//             <ProtectedRoute role="member">
//               <MemberDiet />
//             </ProtectedRoute>
//           }
//         />




//         <Route path="member/plan" element={<ProtectedRoute role="member"><MemberPlans /></ProtectedRoute>} />
//         <Route path="member/payments" element={<ProtectedRoute role="member"><PaymentHistory /></ProtectedRoute>} />
//         <Route path="member/qr" element={<ProtectedRoute role="member"><QrDisplay /></ProtectedRoute>} />
//         <Route path="member/scan" element={<ProtectedRoute role="member"><ScanQR /></ProtectedRoute>} />
//         <Route path="member/attendance" element={<ProtectedRoute role="member"><GymAttendance /></ProtectedRoute>} />
//         <Route path="/login" element={<ProtectedRoute role="member"><MemberLogoutButton /></ProtectedRoute>} />

//         {/* Traine */}
//         <Route path="trainer/profile" element={<ProtectedRoute role="trainer"><Trainer /></ProtectedRoute>} />

//         <Route
//           path="/trainer/food"
//           element={
//             <ProtectedRoute role="trainer">
//               <Food />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/trainer/deitfood"
//           element={
//             <ProtectedRoute role="trainer">
//               <WorkoutDietPage />
//             </ProtectedRoute>
//           } />



//       </Route>
//       {/* Catch-all */}
//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default App;





import { Routes, Route, Navigate } from "react-router-dom";
import useAccess from "./hooks/useAccess";

/* ---------- Owner Pages ---------- */
import AddMember from "./pages/owner/AddMember";
import Memberlist from "./pages/owner/Memberslist";
import UpDateMember from "./pages/owner/UpdateMembers";
import Home from "./pages/owner/Home";
import AddStaff from "./pages/owner/AddStaff";
import AddTrainer from "./pages/owner/AddTrainer";
import TrainerList from "./pages/owner/TrainerList";
import PaymentList from "./pages/owner/Payment";
import ActiveMembers from "./pages/owner/ActiveMembers";
import ExpiredMembers from "./pages/owner/ExpiringDate";
import OwnerProfile from "./pages/owner/OwnerProfile";
import DailyAttendanceAll from "./pages/owner/OwnerDailyAttendance";
import Reports from "./pages/owner/Reports";
import AddPlan from "./pages/owner/AddPlan";
import PlanPage from "./pages/owner/PlanPage";

/* ---------- Member Pages ---------- */
import MemberProfile from "./pages/Members/MemberProfile";
import MemberPlans from "./pages/Members/memberplan";
import PaymentHistory from "./pages/Members/PaymentHistory";
import QrDisplay from "./pages/Members/QrDisplay";
import ScanQR from "./pages/Members/ScanQR";
import GymAttendance from "./pages/Members/GymAttendance";
import MemberDiet from "./pages/Members/MemberDiet";

/* ---------- Trainer Pages ---------- */
import Trainer from "./pages/Trainer/Trainer";
import WorkoutDietPage from "./pages/Trainer/WorkoutDietPage";
import Food from "./pages/Trainer/Food";

/* ---------- Auth ---------- */
import Login from "./pages/owner/Login/OwnerLogin";
import Register from "./pages/owner/Login/Register";
import ForgotPassword from "./pages/owner/Login/Forgetpassword";
import ResetPassword from "./pages/owner/Login/Resetpassword";

/* ---------- Layout ---------- */
import Layout from "./component/Layout";
import StaffProfile from "./pages/owner/Staffprofile";

/* ---------- NO ACCESS ---------- */
const NoAccess = () => (
  <div className="p-10 text-center">
    <h1 className="text-xl font-bold text-red-500">No Access</h1>
  </div>
);

/* ---------- PROTECTED ROUTE ---------- */
const ProtectedRoute = ({ children, roles = [], feature }) => {
  const { hasAccess } = useAccess();
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  // Owner full access
  if (role === "owner") return children;

  // Staff feature check
  if (role === "staff" && feature && !hasAccess(feature)) {
    return <Navigate to="/no-access" />;
  }

  return children;
};
// const ProtectedRoute = ({ children, roles = [], feature }) => {
//   const { hasAccess } = useAccess();
//   const role = sessionStorage.getItem("role");
//   const token = sessionStorage.getItem("token");

//   if (!token) return <Navigate to="/login" />;

//   if (roles.length && !roles.includes(role)) {
//     return <Navigate to="/login" />;

//   } if (role === "owner") return children; // owner ki feature skip


//   // 🔥 ONLY staff check
//   if (role === "staff" && feature && !hasAccess(feature)) {
//     return <Navigate to="/no-access" />;
//   }
//   return children;
// };

function App() {
  return (
    <Routes>

      {/* ---------- AUTH ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />
      <Route path="/no-access" element={<NoAccess />} />

      {/* ---------- MAIN LAYOUT ---------- */}
      <Route path="/" element={<Layout />}>

        {/* ===== OWNER + STAFF ROUTES ===== */}

        <Route path="/owner/home"
          element={
            <ProtectedRoute roles={["owner", "staff"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute roles={["staff"]}>
              <StaffProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/addmember"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="memberadd">
              <AddMember />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/memberlist"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="memberList">
              <Memberlist />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/addmember/update/:id"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="memberadd">
              <UpDateMember />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/payment"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="payments">
              <PaymentList />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/expiring"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="expiredMembers">
              <ExpiredMembers />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/ActiveMembers"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="activeMembers">
              <ActiveMembers />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/trainerdetails"
          element={
            <ProtectedRoute roles={["owner", "staff"]} feature="trainerList">
              <TrainerList />
            </ProtectedRoute>
          }
        />

        {/* ===== OWNER ONLY ===== */}

        <Route path="/owner/addstaff"
          element={
            <ProtectedRoute roles={["owner"]}>
              <AddStaff />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/addtrainer"
          element={
            <ProtectedRoute roles={["owner"]}>
              <AddTrainer />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/profile"
          element={
            <ProtectedRoute roles={["owner"]}>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/daily/attendance"
          element={
            <ProtectedRoute roles={["owner"]}>
              <DailyAttendanceAll />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/reports"
          element={
            <ProtectedRoute roles={["owner"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/addplan"
          element={
            <ProtectedRoute roles={["owner"]}>
              <AddPlan />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/planpage"
          element={
            <ProtectedRoute roles={["owner"]}>
              <PlanPage />
            </ProtectedRoute>
          }
        />

        {/* ===== MEMBER ===== */}

        <Route path="/member/profile"
          element={
            <ProtectedRoute roles={["member"]}>
              <MemberProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/member/deitfood"
          element={
            <ProtectedRoute roles={["member"]}>
              <MemberDiet />
            </ProtectedRoute>
          }
        />

        <Route path="/member/plan"
          element={
            <ProtectedRoute roles={["member"]}>
              <MemberPlans />
            </ProtectedRoute>
          }
        />

        <Route path="/member/payments"
          element={
            <ProtectedRoute roles={["member"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />

        <Route path="/member/qr"
          element={
            <ProtectedRoute roles={["member"]}>
              <QrDisplay />
            </ProtectedRoute>
          }
        />

        <Route path="/member/scan"
          element={
            <ProtectedRoute roles={["member"]}>
              <ScanQR />
            </ProtectedRoute>
          }
        />

        <Route path="/member/attendance"
          element={
            <ProtectedRoute roles={["member"]}>
              <GymAttendance />
            </ProtectedRoute>
          }
        />

        {/* ===== TRAINER ===== */}

        <Route path="/trainer/profile"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <Trainer />
            </ProtectedRoute>
          }
        />

        <Route path="/trainer/food"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <Food />
            </ProtectedRoute>
          }
        />

        <Route path="/trainer/deitfood"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <WorkoutDietPage />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default App;


