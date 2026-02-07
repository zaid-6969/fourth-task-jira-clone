import React, { useState, useRef, useEffect } from "react";
import KanbanCard from "./KanbanCard";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";

const Column = ({
  column,
  index,
  moveCard,
  moveColumn,
  addCard,
  projectName,
  columns,
  renameColumn,
  deleteColumn,
  updateIssue,
}) => {
  /* ===== CARD ADD ===== */
  const [showInput, setShowInput] = useState(false);
  const [cardText, setCardText] = useState("");

  /* ===== COLUMN MENU ===== */
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* ===== RENAME STATE ===== */
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const items = column.items || [];

  /* KEEP TITLE IN SYNC */
  useEffect(() => {
    setTitleDraft(column.title);
  }, [column.title]);

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

  /* COLUMN DROP */
  const handleColumnDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/column");
    if (!raw) return;
    moveColumn(JSON.parse(raw).index, index);
  };

  /* CARD DROP */
  const handleCardDrop = (e, toIndex) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/card");
    if (!raw) return;

    const { card, sourceCol, fromIndex } = JSON.parse(raw);
    moveCard(sourceCol, column.id, card, fromIndex, toIndex);
  };

  /* SAVE COLUMN TITLE */
  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.title) {
      renameColumn(column.id, trimmed);
    }
    setEditingTitle(false);
  };

  /* CANCEL RENAME */
  const handleCancelTitle = () => {
    setTitleDraft(column.title);
    setEditingTitle(false);
  };

  return (
    <div
      className={`column ${column.title === "Done" ? "done-column" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleColumnDrop}
    >
      {/* ================= BODY (SCROLL CONTAINER) ================= */}
      <div className="column-scroll">
        {/* ================= HEADER (NOW STICKY) ================= */}
        <div className="column-header">
          {editingTitle ? (
            <div className="column-title-edit">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
              />
              <button className="save" onClick={handleSaveTitle}>
                Save
              </button>
              <button className="cancel" onClick={handleCancelTitle}>
                Cancel
              </button>
            </div>
          ) : (
            <div
              className="column-title"
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData(
                  "application/column",
                  JSON.stringify({ index }),
                )
              }
            >
              <span className="column-name">{column.title}</span>
              <span className="column-count">{items.length}</span>
            </div>
          )}

          {/* THREE DOTS */}
          <div className="column-menu-wrapper" ref={menuRef}>
            <button
              className="column-menu-btn"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <FiMoreHorizontal />
            </button>

            {menuOpen && (
              <div className="column-menu">
                <button
                  onClick={() => {
                    setEditingTitle(true);
                    setMenuOpen(false);
                  }}
                >
                  Rename
                </button>

                <button
                  className="danger"
                  onClick={() => {
                    deleteColumn(column.id);
                    setMenuOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= CARDS ================= */}
        {items.map((item, i) => (
          <div
            key={item.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleCardDrop(e, i)}
          >
            <KanbanCard
              item={item}
              sourceCol={column.id}
              index={i}
              projectName={projectName}
              columns={columns}
              updateIssue={updateIssue}
              moveCard={moveCard}
            />
          </div>
        ))}

        {/* DROP TARGET */}
        <div
          className={`${items.length === 0 ? "empty-drop-zone" : "drop-zone-invisible"} 
    ${column.title === "Done" ? "done-drop-zone" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleCardDrop(e, items.length)}
        >
          {items.length === 0 && "Drop here"}
        </div>

        {/* ADD CARD */}
        {showInput ? (
          <div className="add-card">
            <textarea
              value={cardText}
              autoFocus
              onChange={(e) => setCardText(e.target.value)}
            />
            <div className="add-card-actions">
              <button
                onClick={() => {
                  if (!cardText.trim()) return;
                  addCard(column.id, cardText);
                  setCardText("");
                  setShowInput(false);
                }}
              >
                Add
              </button>
              <button
                className="cancel"
                onClick={() => {
                  setShowInput(false);
                  setCardText("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="create-card" onClick={() => setShowInput(true)}>
            <FiPlus /> Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;
