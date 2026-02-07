import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import SupportCard from "../components/Card";

const AdminPage = () => {
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ MULTI USER
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔹 EDIT
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  /* 🔹 FETCH USERS */
  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(list);
  };

  /* 🔹 FETCH PROJECTS */
  const fetchProjects = async () => {
    const snap = await getDocs(collection(db, "projects"));
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(list);
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  /* 🔹 CREATE PROJECT WITH MULTIPLE USERS */
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName || selectedUsers.length === 0) return;

    const assignedUsers = users.filter((u) =>
      selectedUsers.includes(u.id)
    );

    setLoading(true);
    try {
      await addDoc(collection(db, "projects"), {
        name: projectName,

        // ✅ MULTI USER DATA
        assignedUserIds: assignedUsers.map((u) => u.id),
        assignedUserNames: assignedUsers.map((u) => u.name),

        createdAt: serverTimestamp(),
      });

      setProjectName("");
      setSelectedUsers([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /* 🔹 DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  /* 🔹 UPDATE NAME */
  const handleUpdate = async (id) => {
    if (!editName.trim()) return;

    await updateDoc(doc(db, "projects", id), {
      name: editName,
    });

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: editName } : p
      )
    );

    setEditingId(null);
    setEditName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin – Create Project</h2>

      {/* CREATE */}
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        {/* ✅ MULTI SELECT */}
        <select
          multiple
          value={selectedUsers}
          onChange={(e) =>
            setSelectedUsers(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
          style={{ minHeight: "120px" }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          Create Project
        </button>
      </form>

      {/* USERS LIST */}
      <h3 style={{ marginTop: "30px" }}>All Users</h3>
      {users.map((user) => (
        <p key={user.id}>👤 {user.name || user.email}</p>
      ))}

      {/* PROJECTS */}
      <h3 style={{ marginTop: "30px" }}>All Projects</h3>
      <div className="card-container">
        {projects.map((project) => (
          <SupportCard
            key={project.id}
            showDelete
            onDelete={() => handleDelete(project.id)}
          >
            {editingId === project.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => handleUpdate(project.id)}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h4>{project.name}</h4>

                {/* ✅ MULTI USERS DISPLAY */}
                <p>
                  Assigned to:{" "}
                  {project.assignedUserNames?.join(", ") || "—"}
                </p>

                <button
                  onClick={() => {
                    setEditingId(project.id);
                    setEditName(project.name);
                  }}
                >
                  Rename
                </button>
              </>
            )}
          </SupportCard>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
