import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import StudentDashboard from "./components/StudentDashboard";

type ScreenState = "landing" | "login" | "dashboard";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("landing");
  const [authenticatedEmail, setAuthenticatedEmail] = useState("");

  const handleGetStarted = () => {
    setScreen("login");
  };

  const handleLoginClick = () => {
    setScreen("login");
  };

  const handleLoginSuccess = (email: string) => {
    setAuthenticatedEmail(email);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setAuthenticatedEmail("");
    setScreen("landing");
  };

  return (
    <div className="w-full min-h-screen">
      {screen === "landing" && (
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onLogin={handleLoginClick} 
        />
      )}

      {screen === "login" && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setScreen("landing")}
        />
      )}

      {screen === "dashboard" && (
        <StudentDashboard 
          studentEmail={authenticatedEmail}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
