import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

function RecruiterDashboard({ server_API_URL, switchRole }) {
  const [job, setJob] = useState({ title: "", description: "", company: "" });
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicantsByJob, setApplicantsByJob] = useState({});

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get(`${server_API_URL}/myJobs`, {
        withCredentials: true,
      });
      if (response.data.verdict) {
        setPostedJobs(response.data.jobs);
      } else {
        console.error("Error fetching jobs:", response.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const response = await axios.get(`${server_API_URL}/job-applicants/${jobId}`, {
        withCredentials: true,
      });

      if (response.data.verdict) {
        setApplicantsByJob((prev) => ({
          ...prev,
          [jobId]: response.data.applicants,
        }));
      } else {
        alert("Failed to fetch applicants: " + response.data.message);
      }
    } catch (err) {
      console.error("Error fetching applicants", err);
    }
  };

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${server_API_URL}/postJob`, job, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.verdict) {
        alert("Job posted!");
        setJob({ title: "", description: "", company: "" });
        fetchPostedJobs();
      } else {
        alert("Failed to post job: " + response.data.message);
      }
    } catch (err) {
      console.error("Failed to post job", err);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await axios.delete(`${server_API_URL}/deleteJob/${jobId}`, {
        withCredentials: true,
      });
      if (response.data.verdict) {
        fetchPostedJobs();
      } else {
        alert("Failed to delete job: " + response.data.message);
      }
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${server_API_URL}/logout`, {
        withCredentials: true,
      });
      if (response.data.verdict) {
        window.location.reload();
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div style={{ padding: 0, fontFamily: "Montserrat, sans-serif" }}>
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#0A66C2",
          color: "#fff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>Recruiter Dashboard</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => switchRole("jobSeeker")}
            style={{
              backgroundColor: "#fff",
              color: "#0A66C2",
              border: "none",
              padding: "10px 18px",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            JobSeeker Dashboard
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#fff",
              color: "#0A66C2",
              border: "none",
              padding: "10px 18px",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Job posting form */}
      <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        <h3 style={{ marginBottom: "20px", color: "#0A66C2" }}>Post a New Job</h3>
        <input
          type="text"
          name="title"
          value={job.title}
          placeholder="Job Title"
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <input
          type="text"
          name="company"
          value={job.company}
          placeholder="Company Name"
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <textarea
          name="description"
          value={job.description}
          placeholder="Job Description"
          onChange={handleChange}
          rows={4}
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={handleSubmit}
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
          Post Job
        </button>
      </div>

      {/* Posted Jobs */}
      <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        <h3 style={{ marginBottom: "20px", color: "#0A66C2" }}>My Posted Jobs</h3>
        {postedJobs.map((postedJob) => (
          <div
            key={postedJob.id}
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              padding: "20px",
              marginBottom: "20px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ maxWidth: "70%" }}>
                <h4 style={{ marginBottom: "8px", color: "#0A66C2" }}>{postedJob.title}</h4>
                <p style={{ marginBottom: "5px" }}>{postedJob.description}</p>
                <p style={{ fontWeight: "bold" }}>
                  Company: <span style={{ fontWeight: "normal" }}>{postedJob.company}</span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => handleDelete(postedJob.id)}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => fetchApplicants(postedJob.id)}
                  style={{
                    backgroundColor: "#0A66C2",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  View Applicants
                </button>
              </div>
            </div>

            {/* Applicant List */}
            {applicantsByJob[postedJob.id] && (
              <div style={{ marginTop: "16px", paddingLeft: "10px" }}>
              
                {applicantsByJob[postedJob.id].length === 0 ? (
                  <p>No applicants yet.</p>
                ) : (
                  <ul>
                  {applicantsByJob[postedJob.id] && (
  <div style={{ marginTop: "20px", paddingLeft: "10px" }}>
    <h4 style={{ fontSize: "18px", color: "#0A66C2", marginBottom: "10px" }}>Applicants:</h4>
    {applicantsByJob[postedJob.id].length === 0 ? (
      <p>No applicants yet.</p>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {applicantsByJob[postedJob.id].map((applicant) => (
          <div
            key={applicant.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "12px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p style={{ margin: "2px 0", fontWeight: "bold" }}>
                {applicant.first_name} {applicant.last_name}
              </p>
              <p style={{ margin: "2px 0" }}>{applicant.email}</p>
              <p style={{ margin: "2px 0" }}>{applicant.phone}</p>
            </div>
            {applicant.resume && (
              <a
                href={`${server_API_URL}/resume/${applicant.id}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: "#0A66C2",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                Download Resume
              </a>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
                )}

                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
