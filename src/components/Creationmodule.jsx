import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { toggleModule } from "../store/module";
import "../styles/creationModule.scss";

import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";

import style from "../styles/btn.module.scss";
import TextEditor from "./TextEditor";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { storage } from "../firebase/firebase";
import { FaEquals } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

export const uploadImageToFirebase = async (file) => {
  if (!file) return null;

  try {
    // create unique path
    const imageRef = ref(storage, `issues/${Date.now()}-${file.name}`);

    // upload file
    await uploadBytes(imageRef, file);

    // get downloadable URL
    const imageUrl = await getDownloadURL(imageRef);

    return imageUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};

const Creationmodule = () => {
  const dispatch = useDispatch();
  const user = getAuth().currentUser;

  const [projects, setProjects] = useState([]);
  const [columns, setColumns] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);

  /* LOAD PROJECTS */
  useEffect(() => {
    const loadProjects = async () => {
      const snap = await getDocs(collection(db, "projects"));
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadProjects();
  }, []);

  /* LOAD KANBAN COLUMNS */
  useEffect(() => {
    if (!selectedProject) return;

    const loadColumns = async () => {
      const ref = doc(db, "projects", selectedProject.id, "kanban", "board");
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const board = snap.data();
      setColumns(board.columns || []);
      setSelectedColumn(board.columns?.[0] || null);
    };

    loadColumns();
  }, [selectedProject]);

  /* CREATE TICKET */
  const handleCreateTicket = async () => {
    if (!title || !selectedProject || !selectedColumn) return;
    if (loading) return;

    setLoading(true);
    console.log("🚀 Submit started");

    try {
      const boardRef = doc(
        db,
        "projects",
        selectedProject.id,
        "kanban",
        "board",
      );

      const snap = await getDoc(boardRef);
      if (!snap.exists()) {
        console.error("❌ Board not found");
        setLoading(false);
        return;
      }

      const board = snap.data();

      // 🖼️ IMAGE UPLOAD
      let imageUrl = null;
      if (imageFile) {
        console.log("⬆️ Uploading image...");
        imageUrl = await uploadImageToFirebase(imageFile);
        console.log("✅ Image uploaded:", imageUrl);
      }

      const updatedColumns = board.columns.map((col) =>
        col.id === selectedColumn.id
          ? {
              ...col,
              items: [
                ...(col.items || []),
                {
                  id: Date.now().toString(),
                  content: title,
                  summary,
                  description,
                  priority,
                  dueDate,
                  imageUrl,
                  columnId: col.id,
                  columnTitle: col.title,
                  createdBy: user?.uid || "",
                  createdByName: user?.displayName || user?.email || "",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : col,
      );

      console.log("💾 Saving to Firestore...");
      await setDoc(boardRef, { columns: updatedColumns }, { merge: true });
      console.log("✅ Ticket created");

      // RESET
      setTitle("");
      setSummary("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setImageFile(null);
      setSelectedColumn(columns[0] || null);

      dispatch(toggleModule());
    } catch (err) {
      console.error("🔥 CREATE TICKET FAILED:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creation-overlay">
      <div className="creation-container">
        {/* HEADER (FIXED) */}
        <div className="creation-header">
          <h1>Create Ticket</h1>
          <button
            className="creation-close"
            onClick={() => dispatch(toggleModule())}
          >
            <ImCross />
          </button>
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="creation-body">
          {/* PROJECT */}
          <div className="form-group">
            <label>Project *</label>
            <div className="user-dropdown">
              <div
                className="user-dropdown-trigger"
                onClick={() => setShowProjectDropdown((p) => !p)}
              >
                {selectedProject?.name || "Select project"}
                <span className="arrow">▾</span>
              </div>

              {showProjectDropdown && (
                <div className="user-dropdown-menu">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="user-option"
                      onClick={() => {
                        setSelectedProject(p);
                        setShowProjectDropdown(false);
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="form-group">
            <label>Status *</label>
            <div className="user-dropdown">
              <div
                className="user-dropdown-trigger"
                onClick={() => setShowStatusDropdown((p) => !p)}
              >
                {selectedColumn?.title || "Select status"}
                <span className="arrow">▾</span>
              </div>

              {showStatusDropdown && (
                <div className="user-dropdown-menu">
                  {columns.map((col) => (
                    <div
                      key={col.id}
                      className="user-option"
                      onClick={() => {
                        setSelectedColumn(col);
                        setShowStatusDropdown(false);
                      }}
                    >
                      {col.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Summary</label>
            <TextEditor value={summary} onChange={setSummary} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <TextEditor value={description} onChange={setDescription} />
          </div>

          <div style={{ width: "20%" }} className="form-group">
            <label>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="priority-wrapper">
            <span className={`priority-icon ${priority}`}>
              {priority === "low" && <MdKeyboardDoubleArrowDown />}
              {priority === "medium" && <FaEquals />}
              {priority === "high" && <MdKeyboardDoubleArrowUp />}
            </span>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">Highest</option>
            </select>
          </div>

           {/* <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
             /> */}

        </div>

        {/* FOOTER (FIXED) */}
        <div className="creation-footer">
          <button
            className={style["create-btn"]}
            disabled={loading || !title || !selectedProject || !selectedColumn}
            onClick={handleCreateTicket}
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creationmodule;
