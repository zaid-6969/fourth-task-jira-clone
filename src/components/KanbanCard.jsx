import React, { useState, useRef, useEffect } from "react";
import IssueModal from "./IssueModal";
import { FiMoreVertical } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
const KanbanCard = ({
  item,
  sourceCol,
  index,
  renameCard,
  updateIssue,
  projectName,
  columns,
  moveCard, // ✅ ADD THIS
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.content);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [showMoveMenu, setShowMoveMenu] = useState(false);

  /* CLOSE MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* DRAG START */
  const handleDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setData(
      "application/card",
      JSON.stringify({
        card: item,
        sourceCol,
        fromIndex: index,
      }),
    );
  };

  return (
    <>
      <div
        className={`kanban-card ${
          item.columnTitle === "Done" ? "done-card" : ""
        }`}
        draggable
        onDragStart={handleDragStart}
        onClick={() => !editing && setShowModal(true)}
      >
        {editing ? (
          <input
            value={text}
            autoFocus
            onBlur={() => {
              renameCard(sourceCol, item.id, text);
              setEditing(false);
            }}
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <>
            <p className="card-content">{item.content}</p>
            <span className="card-date">
              <SlCalender />{" "}
              {item.createdAt &&
                new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </>
        )}

        {/* CARD MENU */}
        <span
          className="card-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <FiMoreVertical />
        </span>

        {menuOpen && (
          <div className="card-menu" ref={menuRef}>
            {/* RENAME */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
                setMenuOpen(false);
              }}
            >
              <FaPencilAlt /> Rename
            </button>

            {/* CHANGE STATUS */}
            <div className="card-submenu">
              <button
                className="submenu-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoveMenu((p) => !p);
                }}
              >
                Change status →
              </button>

              {showMoveMenu && (
                <div className="submenu-list">
                  {Array.isArray(columns) &&
                    columns.map((col) => {
                      const isCurrent = col.id === item.columnId;

                      return (
                        <button
                          key={col.id}
                          className={isCurrent ? "active-status" : ""}
                          disabled={isCurrent}
                          onClick={(e) => {
                            e.stopPropagation();

                            moveCard(item.columnId, col.id, item, index, 0);

                            setMenuOpen(false);
                            setShowMoveMenu(false);
                          }}
                        >
                          {col.title}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* DELETE */}
            <button
              className="danger"
              onClick={(e) => {
                e.stopPropagation();
                updateIssue({ id: item.id, delete: true });
              }}
            >
              <MdDelete /> Delete
            </button>
          </div>
        )}

        {/* META */}
        <div className="card-meta">
          <div className="card-issue-key">
            <span>
              <label className="icon-checkbox always-checked">
                <span className="checkbox-box">
                  <FaCheck className="checkbox-icon" />
                </span>
              </label>
            </span>
            <span style={{ fontSize: "15px" }}>DEV-{index + 1}</span>
          </div>

          <span className="user-hover">
            <div className={`priority-badge priority-${item.priority}`}>
              {item.priority}
            </div>

            <span className="user-tooltip">
              {" "}
              <span>👤</span>{" "}
              <span className="tooltip-username">
                {" "}
                {item.createdByName}{" "}
              </span>{" "}
            </span>
          </span>
        </div>
      </div>

      {showModal && (
        <IssueModal
          item={item}
          projectName={projectName}
          columns={columns}
          onClose={() => setShowModal(false)}
          onUpdate={updateIssue}
        />
      )}
    </>
  );
};

export default KanbanCard;
