import React, { useState } from "react";
import LocalAuth from "./LocalAuth";
import GoogleAuth from "./GoogleAuth";

function SignIn(props) {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>
        {isRegistering ? "Register" : "Sign In"}
      </h2>

      <div className="create-note" style={{ textAlign: "left" }}>
        <LocalAuth
          AUthUserFunc={props.AUthUserFunc}
          path={isRegistering ? "register" : "auth/local"}
        />

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <GoogleAuth AUthUserFunc={props.AUthUserFunc} path="auth/google" />
        </div>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {isRegistering ? "Already have an account?" : "New user?"}{" "}
          <button
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "1em"
            }}
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
