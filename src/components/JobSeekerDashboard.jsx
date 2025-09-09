import React, { useEffect, useState } from "react";
import axios from "axios";

function JobSeekerDashboard({ server_API_URL, switchRole, onUpdateProfileClick }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

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

  const applyToJob = async (jobId) => {
    try {
      const response = await axios.post(
        `${server_API_URL}/apply-to-job`,
        { job_id: jobId },
        { withCredentials: true }
      );
      if (response.data.verdict) {
        alert("Successfully applied to the job!");
        setAppliedJobs((prev) => new Set(prev).add(jobId));
      } else {
        alert("Already applied: " + response.data.message);
      }
    } catch (err) {
      console.error("Application error", err);
      alert("Failed to apply for the job.");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${server_API_URL}/jobs`, {
          withCredentials: true,
        });
        if (response.data.verdict) {
          setJobs(response.data.contents);
        } else {
          console.error("Error fetching jobs:", response.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };

    fetchJobs();
  }, [server_API_URL]);

  return (
    <div style={{ padding: "0", fontFamily: "Montserrat, sans-serif" }}>
      {/* Top Bar */}
      <div style={{
        backgroundColor: "#0A66C2",
        color: "#fff",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>Available Jobs</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => switchRole("recruiter")}
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
            Recruiter Dashboard
          </button>
          <button
            onClick={onUpdateProfileClick}
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
            Update Profile
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

      {/* Job Listings */}
      <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              padding: "20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ maxWidth: "70%" }}>
              <h3 style={{ margin: "0 0 10px", color: "#0A66C2" }}>{job.title}</h3>
              <p style={{ marginBottom: "8px", color: "#333" }}>{job.description}</p>
              <p style={{ fontWeight: "bold", color: "#555" }}>
                Company: <span style={{ fontWeight: "normal" }}>{job.company}</span>
              </p>
            </div>
            <div>
              <button
                disabled={appliedJobs.has(job.id)}
                onClick={() => applyToJob(job.id)}
                style={{
                  backgroundColor: appliedJobs.has(job.id) ? "#aaa" : "#0A66C2",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: appliedJobs.has(job.id) ? "not-allowed" : "pointer",
                  transition: "0.3s ease"
                }}
              >
                {appliedJobs.has(job.id) ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
