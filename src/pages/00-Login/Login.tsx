import React, { useRef, useState } from "react";
import "./Login.css";
import { InputText } from "primereact/inputtext";
import { KeyRound, UserRound } from "lucide-react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";

import LoginImage from "../../assets/logo/Logo.png";
import logoImage from "../../assets/logo/Logo.png";

const API_URL = import.meta.env.VITE_API_URL; // your backend base URL

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  // ===== Login API call =====
  const loginUser = async (payload: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/routes/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || "Login failed"
      );
    }
  };

  // ===== Login handler =====
  const onLogin = async () => {
    if (!username || !password) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please enter both username and password.",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = { email: username, password };
      const result = await loginUser(payload);

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Login Successful",
          detail: "Welcome back!",
          life: 3000,
        });

        // Store user info / token in localStorage
        localStorage.setItem("userDetails", JSON.stringify(result.data[0]));

        // Redirect to dashboard or leads page
        navigate("/leads/view");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Login Failed",
          detail: result.message || "Invalid credentials",
          life: 3000,
        });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginComponent">
      <Toast ref={toast} position="top-right" />

      <div className="loginLeft">
        <div className="loginLeftContent">
          <img src={LoginImage} alt="ERP Banner" className="loginImage" />
          <p className="loginLeftText">Red Angle Studio</p>
        </div>
      </div>

      <div className="loginRight">
        <div className="loginForm">
          <div className="loginImage w-full flex justify-content-center align-items-center">
            <img src={logoImage} alt="" style={{ width: "150px" }} />
          </div>
          <h2 className="login-title">Welcome to Red Angle Studio</h2>

          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <UserRound strokeWidth={1.25} />
            </span>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full"
            />
          </div>

          <div className="p-inputgroup mt-3">
            <span className="p-inputgroup-addon">
              <KeyRound strokeWidth={1.25} />
            </span>
            <Password
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
              toggleMask
              feedback={false}
              className="w-full"
            />
          </div>

          <div className="passwordFeatures mt-4">
            <span
              className="forgot"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>

          <Button
            label={loading ? "" : "Login"}
            className="w-full mt-3 loginButton uppercase font-bold flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#060606",
              borderColor: "#060606",
            }}
            onClick={onLogin}
            disabled={loading}
          >
            {loading && (
              <ProgressSpinner
                style={{ width: "20px", height: "20px" }}
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
