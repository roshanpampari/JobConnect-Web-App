import React, { useState } from "react";
import Input from "./Input";

function LocalAuth(props) {
  const [userCred, setUserCred] = useState({ username: "", password: "", confirmPassword: "" });

  const isRegistering = props.path === "register";

  function handleChange(event) {
    const { name, value } = event.target;
    setUserCred((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isRegistering && userCred.password !== userCred.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const dataToSend = {
      username: userCred.username,
      password: userCred.password
    };

    props.AUthUserFunc(props.path, dataToSend);
  }

  return (
    <div style={{ textAlign: "left" }}>
      <form className="create-note" onSubmit={handleSubmit}>
        <Input
          Label="email"
          Name="username"
          Value={userCred.username}
          UpdtChange={handleChange}
        />
        <Input
          Label="password"
          Name="password"
          Value={userCred.password}
          UpdtChange={handleChange}
        />
        {isRegistering && (
          <Input
            Label="retype password"
            Name="confirmPassword"
            Value={userCred.confirmPassword}
            UpdtChange={handleChange}
          />
        )}
        <div style={{ marginTop: "10px" }}>
          <button type="submit" className="btn btn-dark">
            {isRegistering ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LocalAuth;
