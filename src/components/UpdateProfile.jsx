import React, { useState } from "react";
import axios from "axios";

function UpdateProfile({ server_API_URL, goBackToDashboard }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    skills: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("phone", formData.phone);
      data.append("skills", formData.skills);
      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await axios.post(`${server_API_URL}/update-profile`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.verdict) {
        alert("Profile updated successfully!");
        goBackToDashboard(); // return to JobSeekerDashboard
      } else {
        alert("Failed to update profile: " + response.data.message);
      }
    } catch (err) {
      console.error("Profile update error", err);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div style={{
      padding: "40px",
      maxWidth: "600px",
      margin: "40px auto",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <h2 style={{
        color: "#0A66C2",
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "bold"
      }}>Update Your Profile</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Skills (comma-separated)", name: "skills", type: "text" }
        ].map(({ label, name, type }) => (
          <div style={{ marginBottom: "16px" }} key={name}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "15px"
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>Upload Resume</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#0A66C2",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={goBackToDashboard}
            style={{
              backgroundColor: "#f0f0f0",
              color: "#333",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
