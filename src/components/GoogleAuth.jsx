import React from "react";
import GoogleIcon from '@mui/icons-material/Google';

function GoogleAuth(props) {
  return (
    <button
      className="gSignIn"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
      onClick={() => props.AUthUserFunc(props.path)}
    >
      <GoogleIcon />
      SignIn with Google
    </button>
  );
}

export default GoogleAuth;
