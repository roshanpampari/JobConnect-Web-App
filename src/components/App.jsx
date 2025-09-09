import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import SignIn from "./SignIn";
import axios from "axios";
import RoleSelection from "./RoleSelection";
import JobSeekerDashboard from "./JobSeekerDashboard";
import RecruiterDashboard from "./RecruiterDashboard";
import UpdateProfile from "./UpdateProfile";

function App() {
  const [signedIn, setSignIn] = useState(false);
  const [notes, setNotes] = useState([]);
  const server_API_URL = "http://localhost:3001";
  const [googleSignInFlag, setgoogleSignInFlag] = useState(0);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // "jobSeeker" or "recruiter"
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  function switchUserRole(role) {
    setUserRole(role);
  }

  async function InitialCallForData() {
    try {
      const response = await axios.get(server_API_URL + "/login", {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (response.data.verdict === true) {
        setSignIn(true);
        setUserName(response.data.userName);
        setShowRoleSelection(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    InitialCallForData();
  }, [googleSignInFlag]);

  async function AuthUser(route, userFD) {
    const endpoint = server_API_URL + "/" + route;

    try {
      if (route === "register" || route === "auth/local") {
        const result = await axios.post(endpoint, userFD, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });

        if (result.data.verdict === true) {
          setSignIn(true);
          setNotes(result.data.contents);
          setUserName(result.data.userName);
          setShowRoleSelection(true);
        } else {
          console.log(result.data.message);
        }
      } else {
        const windowFeatures = 'width=500,height=600';
        const result = window.open(endpoint, "New Window", windowFeatures);

        const loginCheck = setInterval(async () => {
          try {
            const loginResult = await axios.get(server_API_URL + "/login", {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
            });

            if (loginResult.data.verdict === true) {
              result.close();
            }

            if (result.closed && loginResult.data.verdict === true) {
              clearInterval(loginCheck);
              setgoogleSignInFlag(1);
              setUserName(loginResult.data.userName);
              setSignIn(true);
              setShowRoleSelection(true);
            }
          } catch (err) {
            console.log("Failed to connect server");
          }
        }, 1000);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function UserLogout() {
    const endpoint = server_API_URL + "/logout";
    setgoogleSignInFlag(0);
    try {
      const result = await axios.get(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (result.data.verdict === true) {
        setSignIn(false);
        setNotes([]);
        setUserName("");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      {signedIn ? (
        showRoleSelection ? (
          <RoleSelection
            setUserRole={(role) => {
              setUserRole(role);
              setShowRoleSelection(false);
            }}
          />
        ) : userRole === "jobSeeker" ? (
          showUpdateProfile ? (
            <UpdateProfile
              server_API_URL={server_API_URL}
              goBackToDashboard={() => setShowUpdateProfile(false)}
            />
          ) : (
            <JobSeekerDashboard
              server_API_URL={server_API_URL}
              switchRole={switchUserRole}
              onUpdateProfileClick={() => setShowUpdateProfile(true)}
            />
          )
        ) : userRole === "recruiter" ? (
          <RecruiterDashboard server_API_URL={server_API_URL} switchRole={switchUserRole} />
        ) : (
          <div>Please select a role.</div>
        )
      ) : (
        <div>
          <Header />
          <SignIn AUthUserFunc={AuthUser} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
