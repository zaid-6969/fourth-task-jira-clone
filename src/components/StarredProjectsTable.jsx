import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import { AiFillStar } from "react-icons/ai";
import "../styles/WorkTable.scss";

const StarredProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [starred, setStarred] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  /* 🔹 LOAD STARRED IDS */
  useEffect(() => {
    if (!user) return;

    const loadStarred = async () => {
      const q = query(
        collection(db, "starred"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      setStarred(snap.docs.map((d) => d.data().projectId));
    };

    loadStarred();
  }, [user]);

  /* 🔹 LOAD PROJECTS */
  useEffect(() => {
    if (!user || starred.length === 0) {
      setProjects([]);
      return;
    }

    const loadProjects = async () => {
      const snap = await getDocs(collection(db, "projects"));

      const filtered = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => starred.includes(p.id));

      setProjects(filtered);
    };

    loadProjects();
  }, [starred, user]);

  if (projects.length === 0) {
    return <p style={{ padding: 16 }}>No starred projects</p>;
  }

  return (
    <div className="worktable-container">
      <table className="worktable">
        <thead>
          <tr>
            <th></th>
            <th>Project</th>
            <th>Assigned By</th>
            <th>Submitted</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td className="star-cell">
                <AiFillStar className="star active" />
              </td>

              <td className="work-col">
                <span className="task-title">{p.name}</span>
              </td>

              <td>Admin</td>

              <td>
                {p.createdAt?.toDate
                  ? p.createdAt.toDate().toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StarredProjectsTable;
