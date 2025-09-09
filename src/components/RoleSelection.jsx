import React, { useState } from "react";

function RoleSelection({ setUserRole }) {
  const [hoveredRole, setHoveredRole] = useState(null);

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Segoe UI, Helvetica, Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      margin: 0
    },
    header: {
      height: "15vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "42px",
      fontWeight: "700",
      color: "#ffffff",
      backgroundColor: "#0A66C2", // LinkedIn blue
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    body: {
      height: "85vh",
      display: "flex"
    },
    optionBase: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "28px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.25s ease-in-out",
      backgroundColor: "#ffffff",
      border: "1px solid #e0e0e0"
    },
    hovered: {
      backgroundColor: "#e6f2ff",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
      transform: "scale(1.02)"
    },
    left: {
      borderRight: "none"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Tell Us Who You Are</div>

      <div style={styles.body}>
        <div
          style={{
            ...styles.optionBase,
            ...styles.left,
            ...(hoveredRole === "jobSeeker" ? styles.hovered : {})
          }}
          onMouseEnter={() => setHoveredRole("jobSeeker")}
          onMouseLeave={() => setHoveredRole(null)}
          onClick={() => setUserRole("jobSeeker")}
        >
          👩‍💼 Job Seeker
        </div>

        <div
          style={{
            ...styles.optionBase,
            ...(hoveredRole === "recruiter" ? styles.hovered : {})
          }}
          onMouseEnter={() => setHoveredRole("recruiter")}
          onMouseLeave={() => setHoveredRole(null)}
          onClick={() => setUserRole("recruiter")}
        >
          🧑‍💼 Recruiter
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
