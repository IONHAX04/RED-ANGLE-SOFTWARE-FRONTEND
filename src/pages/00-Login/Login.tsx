import React, { useRef, useState } from "react";
import "./Login.css";
import { InputText } from "primereact/inputtext";
import { KeyRound, UserRound } from "lucide-react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

import LoginImage from "../../assets/logo/Logo.png";
import logoImage from "../../assets/logo/Logo.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

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
                strokeWidth="4"
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
