import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const WorkedOnTable = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "projects"),
        where("assignedUserIds", "array-contains", user.uid),
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setProjects(list);
    };

    fetchProjects();
  }, []);

  if (projects.length === 0) {
    return <p>No projects found</p>;
  }

  return (
    <div className="workedon-list-wrapper">
      {/* 🔹 TOPIC / HEADER */}
      <div className="workedon-header">
        <span>Project</span>
        <span>Assigned by</span>
      </div>

      {/* 🔹 LIST */}
      <div className="workedon-list">
        {projects.map((project) => (
          <div key={project.id} className="workedon-item">
            <div className="workedon-left">
              <input type="checkbox" />

              <div className="workedon-text">
                <p className="workedon-title-text">{project.name}</p>
                <span className="workedon-meta">
                  DEV-{project.id.slice(0, 2)} · My Software Team
                </span>
              </div>
            </div>

            <span className="workedon-status todo">Admin</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkedOnTable;
