import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "../styles/WorkTable.scss";

const ProjectAssignmentTable = ({ mode }) => {
  const [projects, setProjects] = useState([]);
  const [starred, setStarred] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  /*  LOAD PROJECTS */
  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      let q =
        mode === "admin"
          ? query(
              collection(db, "projects"),
              where("createdBy", "==", user.uid)
            )
          : query(
              collection(db, "projects"),
              where("assignedUserIds", "array-contains", user.uid)
            );

      const snap = await getDocs(q);
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadProjects();
  }, [mode, user]);

  /*  LOAD STARRED */
  useEffect(() => {
    if (!user) return;

    const loadStarred = async () => {
      const q = query(
        collection(db, "starred"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      setStarred(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadStarred();
  }, [user]);

  /*  TOGGLE STAR */
  const toggleStar = async (projectId) => {
    const existing = starred.find((s) => s.projectId === projectId);

    if (existing) {
      await deleteDoc(doc(db, "starred", existing.id));
      setStarred((prev) => prev.filter((s) => s.id !== existing.id));
    } else {
      const ref = await addDoc(collection(db, "starred"), {
        userId: user.uid,
        projectId,
        createdAt: serverTimestamp(),
      });

      setStarred((prev) => [
        ...prev,
        { id: ref.id, userId: user.uid, projectId },
      ]);
    }
  };

  const isStarred = (projectId) =>
    starred.some((s) => s.projectId === projectId);

  if (projects.length === 0) {
    return <p style={{ padding: 16 }}>No projects found</p>;
  }

  return (
    <div className="worktable-container">
      <table className="worktable">
        <thead>
          <tr>
            <th></th>
            <th>Project</th>
            <th>{mode === "admin" ? "Assigned To" : "Assigned By"}</th>
            <th>Submitted</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              {/*  STAR COLUMN (NO LAYOUT CHANGE) */}
              <td
                className="star-cell"
                onClick={() => toggleStar(p.id)}
              >
                {isStarred(p.id) ? (
                  <AiFillStar className="star active" />
                ) : (
                  <AiOutlineStar className="star" />
                )}
              </td>

              <td className="work-col">
                <span className="task-title">{p.name}</span>
              </td>

              {mode === "admin" ? (
                <td>{p.assignedUserIds?.length || 0} users</td>
              ) : (
                <td>Admin</td>
              )}

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

export default ProjectAssignmentTable;
