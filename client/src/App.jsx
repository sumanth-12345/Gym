import { Routes, Route, Navigate } from "react-router-dom";

/* ---------- Owner Pages ---------- */
import AddMember from "./pages/owner/AddMember";
import Memberlist from "./pages/owner/Memberslist";
import UpDateMember from "./pages/owner/UpdateMembers";
import Home from "./pages/owner/Home";

import AddTrainer from "./pages/owner/AddTrainer";
import TrainerList from "./pages/owner/TrainerList";
import PaymentList from "./pages/owner/Payment";
import ActiveMembers from "./pages/owner/ActiveMembers";
import ExpiredMembers from "./pages/owner/ExpiringDate";
import OwnerProfile from "./pages/owner/OwnerProfile";

import Reports from "./pages/owner/Reports";
import AddPlan from "./pages/owner/AddPlan";
import PlanPage from "./pages/owner/PlanPage";

/* ---------- Member Pages ---------- */
import MemberProfile from "./pages/Members/MemberProfile";
import MemberPlans from "./pages/Members/memberplan";
import PaymentHistory from "./pages/Members/PaymentHistory";


import MemberDiet from "./pages/Members/MemberDiet";

/* ---------- Trainer Pages ---------- */
import Trainer from "./pages/Trainer/Trainer";
import WorkoutDietPage from "./pages/Trainer/WorkoutDietPage";
import Food from "./pages/Trainer/Food";
import TrainerMembers from "./pages/Trainer/TrainerMember";

/* ---------- Auth ---------- */
import Login from "./pages/owner/Login/OwnerLogin";
import Register from "./pages/owner/Login/Register";
import ForgotPassword from "./pages/owner/Login/Forgetpassword";
import ResetPassword from "./pages/owner/Login/Resetpassword";

/* ---------- Layout ---------- */
import Layout from "./component/Layout";

import MemberRecharge from "./pages/Members/MemberRecharge";
import OwnerRequests from "./pages/owner/OwnerRequests";
import OwnerRequestDetails from "./pages/owner/OwnerRequestDetails";
import OwnerMemberDetails from "./pages/owner/OwnerMemberDetails";
import MemberRequests from "./pages/Members/MemberRequest";


/* ---------- NO ACCESS ---------- */
const NoAccess = () => (
  <div className="p-10 text-center">
    <h1 className="text-xl font-bold text-red-500">No Access</h1>
  </div>
);

/* ---------- PROTECTED ROUTE ---------- */
const ProtectedRoute = ({ children, roles = [] }) => {

  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/login" />;
  }

  // Owner full access
  if (role === "owner") return children;



  return children;
};

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

        {/* ===== OWNER ROUTES ===== */}

        <Route path="/owner/home"
          element={
            <ProtectedRoute roles={["owner"]}>
              <Home />
            </ProtectedRoute>
          }
        />


        <Route path="/owner/addmember"
          element={
            <ProtectedRoute roles={["owner"]} >
              <AddMember />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/memberlist"
          element={
            <ProtectedRoute roles={["owner"]} >
              <Memberlist />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/addmember/update/:id"
          element={
            <ProtectedRoute roles={["owner"]} >
              <UpDateMember />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/payment"
          element={
            <ProtectedRoute roles={["owner"]} >
              <PaymentList />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/expiring"
          element={
            <ProtectedRoute roles={["owner"]} >
              <ExpiredMembers />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/ActiveMembers"
          element={
            <ProtectedRoute roles={["owner"]} >
              <ActiveMembers />
            </ProtectedRoute>
          }
        />

        <Route path="/owner/trainerdetails"
          element={
            <ProtectedRoute roles={["owner"]} >
              <TrainerList />
            </ProtectedRoute>
          }
        />

        {/* ===== OWNER ONLY ===== */}



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

        <Route path="/owner/member/:id" element={<ProtectedRoute roles={["owner"]}><OwnerMemberDetails />  </ProtectedRoute>} />

        <Route path="/owner/requests"
          element={
            <ProtectedRoute roles={["owner"]}>
              <OwnerRequests />
            </ProtectedRoute>
          } />
        <Route path="/owner/request/:id"
          element={
            <ProtectedRoute roles={["owner"]}>
              <OwnerRequestDetails />
            </ProtectedRoute>
          } />



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

        <Route path="/member/massage"
          element={
            <ProtectedRoute roles={["member"]}>
              <MemberRequests />
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



        <Route path="/member/recharge/:planId"
          element={
            <ProtectedRoute roles={["member"]}>
              <MemberRecharge />
            </ProtectedRoute>
          } />

        {/* ===== TRAINER ===== */}

        <Route path="/trainer/profile"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <Trainer />
            </ProtectedRoute>
          }
        />

        <Route path="/trainer/member"
          element={
            <ProtectedRoute roles={["trainer"]}>
              <TrainerMembers />
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


