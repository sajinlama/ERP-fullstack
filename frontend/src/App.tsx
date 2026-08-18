import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { RequesterDashboard } from "./components/features/RequesterDashboard";
import { ApproverDashboard } from "./components/features/ApproverDashboard";
import { AppLayout } from "./layout/AppLayout";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";

const ProtectedDashboardRoute: React.FC = () => {
  const [activeView, setActiveView] = useState<string>("DIRECTORY");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userRole === "REQUESTER") {
      setActiveView("MY_SUBMISSIONS");
    } else if (userRole === "APPROVER") {
      setActiveView("APPROVALS");
    }
  }, [userRole]);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === "MY_SUBMISSIONS" && <RequesterDashboard />}
      {activeView === "APPROVALS" && <ApproverDashboard />}
      {activeView === "DIRECTORY" && <ApproverDashboard />}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedDashboardRoute />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;