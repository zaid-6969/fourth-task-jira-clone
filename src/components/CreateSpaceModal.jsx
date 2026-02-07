import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/CreateSpaceModal.scss";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";

const CreateSpaceModal = ({ users, onClose }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [showUsers, setShowUsers] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    // auto include creator
    if (currentUser) {
      setSelectedUsers([currentUser.uid]);
    }
  }, [currentUser]);

  const toggleUser = (uid) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid],
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    await addDoc(collection(db, "projects"), {
      name,
      description: desc,
      createdBy: currentUser.uid,
      assignedUserIds: selectedUsers,
      createdAt: serverTimestamp(),
    });

    onClose();
  };

  return (
    <div className="jira-modal-overlay" onClick={onClose}>
      <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create space</h2>

        <label>Space name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Frontend Team"
        />

        <label>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Optional"
        />

        <label>Add members</label>

        <button
          type="button"
          className="user-list-btn"
          onClick={() => setShowUsers((p) => !p)}
        >
          Add members
        </button>

        {showUsers && (
          <div className="user-list-dropdown">
            {users.map((u) => (
              <div
                key={u.id}
                className={`user-item ${
                  selectedUsers.includes(u.id) ? "selected" : ""
                }`}
                onClick={() => toggleUser(u.id)}
              >
                <span className="avatar">
                  {u.name?.charAt(0).toUpperCase()}
                </span>
                <span>{u.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="create" onClick={handleCreate}>
            Create space
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
