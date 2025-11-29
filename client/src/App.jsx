import { useState } from "react";
import Register from "./components/Register";
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import ApplyScheme from "./components/ApplyScheme";
import MyApplications from "./components/MyApplications";
import Profile from "./components/Profile";

export default function App() {
  const [digitalId, setDigitalId] = useState(null);
  const [step, setStep] = useState("login");

  return (
    <div className="p-6">
      {step === "register" && (
        <Register
          onRegistered={(id) => {
            setDigitalId(id);
            setStep("otp");
          }}
        />
      )}

      {step === "otp" && (
        <VerifyOtp
          digitalId={digitalId}
          onVerified={() => setStep("login")}
        />
      )}

      {step === "login" && (
        <Login onLogged={() => setStep("actions")} />
      )}

      {step === "actions" && (
        <div className="space-y-4">
          <button onClick={() => setStep("apply")}>Apply Scheme</button>
          <button onClick={() => setStep("apps")}>My Applications</button>
          <button onClick={() => setStep("profile")}>Profile</button>
        </div>
      )}

      {step === "apply" && <ApplyScheme />}
      {step === "apps" && <MyApplications />}
      {step === "profile" && <Profile />}
    </div>
  );
}
