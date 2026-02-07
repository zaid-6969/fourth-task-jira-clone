import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FiMoreVertical } from "react-icons/fi";
import { db } from "../firebase/firebase";
import TextEditor from "./TextEditor";

const IssueComments = ({ issueId }) => {
  const [editorValue, setEditorValue] = useState("");
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  /* FETCH COMMENTS */
  useEffect(() => {
    if (!issueId) return;

    const q = query(
      collection(db, "issues", issueId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [issueId]);

  /* ADD COMMENT */
  const handleAddComment = async () => {
    if (
      !editorValue ||
      editorValue.replace(/<(.|\n)*?>/g, "").trim() === ""
    )
      return;

    await addDoc(collection(db, "issues", issueId, "comments"), {
      content: editorValue,
      userName:
        currentUser?.displayName || currentUser?.email || "User",
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    setEditorValue("");
  };

  /* DELETE COMMENT */
  const handleDelete = async (commentId) => {
    await deleteDoc(
      doc(db, "issues", issueId, "comments", commentId)
    );
  };

  /* SAVE EDIT */
  const handleSaveEdit = async (commentId) => {
    await updateDoc(
      doc(db, "issues", issueId, "comments", commentId),
      {
        content: editValue,
        editedAt: serverTimestamp(),
      }
    );

    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="jira-comments">
      <h4>Comments</h4>

      {/* COMMENT LIST */}
      <div className="comment-list">
        {comments.map((c) => {
          const isOwner = c.userId === currentUser?.uid;

          return (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">
                {c.userName.charAt(0).toUpperCase()}
              </div>

              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-user">
                    {c.userName}
                  </span>

                  {/* THREE DOTS – ONLY FOR OWNER */}
                  {isOwner && (
                    <div className="comment-menu">
                      <FiMoreVertical />
                      <div className="comment-menu-dropdown">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditValue(c.content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* COMMENT CONTENT */}
                {editingId === c.id ? (
                  <div className="comment-edit">
                    <TextEditor
                      value={editValue}
                      onChange={setEditValue}
                    />
                    <div className="comment-actions">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="comment-text"
                    dangerouslySetInnerHTML={{
                      __html: c.content,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD COMMENT */}
      <div className="comment-editor">
        <TextEditor
          value={editorValue}
          onChange={setEditorValue}
        />
        <div className="comment-actions">
          <button onClick={handleAddComment}>
            Add comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueComments;
