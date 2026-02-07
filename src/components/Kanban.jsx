import React, { useEffect, useRef, useState } from "react";
import Column from "./Column";
import "../styles/kanbaborad.scss";
import { FiPlus } from "react-icons/fi";

import {
  doc,
  serverTimestamp,
  onSnapshot,
  setDoc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";
import { setColumns } from "../store/kanbanSlice";

import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthProvider";

const DEFAULT_COLUMNS = [
  { id: "todo", title: "To Do", items: [] },
  { id: "progress", title: "In Progress", items: [] },
  { id: "done", title: "Done", items: [] },
];

const Kanban = ({ projectId, projectName }) => {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();

  const rawColumns = useSelector((state) => state.kanban.columns);
  const columns = rawColumns.length ? rawColumns : DEFAULT_COLUMNS;

  const loaded = useRef(false);
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  const [search, setSearch] = useState("");

  if (loading) return null;

  /* RESET ON PROJECT CHANGE */
  useEffect(() => {
    dispatch(setColumns([]));
    loaded.current = false;
  }, [projectId, dispatch]);

  /* INIT BOARD */
  useEffect(() => {
    if (!projectId) return;

    const ref = doc(db, "projects", projectId, "kanban", "board");

    const init = async () => {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { columns: DEFAULT_COLUMNS });
      }
    };

    init();
  }, [projectId]);

  /* REALTIME LOAD */
  useEffect(() => {
    if (!projectId) return;

    const ref = doc(db, "projects", projectId, "kanban", "board");

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        dispatch(setColumns(snap.data().columns));
        loaded.current = true;
      }
    });

    return () => unsub();
  }, [projectId, dispatch]);

  /* SAVE TO FIRESTORE */
  useEffect(() => {
    if (!loaded.current || !projectId) return;
    const ref = doc(db, "projects", projectId, "kanban", "board");
    setDoc(ref, { columns }, { merge: true });
  }, [columns, projectId]);

  /* ADD CARD */
  const addCard = async (columnId, content) => {
    const ticketRef = await addDoc(collection(db, "tickets"), {
      content,
      projectId,
      columnId,
      summary: "",
      description: "",
      createdBy: user.uid,
      createdByName: user.displayName || user.email,
      createdAt: new Date().toISOString(),
    });

    dispatch(
      setColumns(
        columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                items: [
                  ...col.items,
                  {
                    id: ticketRef.id,
                    content,
                    summary: "",
                    description: "",
                    columnId,
                    columnTitle: col.title,
                    createdByName: user.displayName || user.email,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : col,
        ),
      ),
    );
  };

  /* LOG MOVE ACTIVITY */
  const logMoveActivity = async (issueId, from, to) => {
    if (!user) return;

    await addDoc(collection(db, "tickets", issueId, "activity"), {
      type: "move", // ✅ consistent
      from,
      to,
      userId: user.uid,
      userName: user.displayName || user.email,
      createdAt: serverTimestamp(),
    });
  };

  /* MOVE CARD */
  const moveCard = (fromCol, toCol, card, fromIndex, toIndex) => {
    const updated = structuredClone(columns);

    const source = updated.find((c) => c.id === fromCol);
    const target = updated.find((c) => c.id === toCol);
    if (!source || !target) return;

    // REMOVE
    source.items.splice(fromIndex, 1);

    // ADD
    target.items.splice(toIndex, 0, {
      ...card,
      columnId: target.id,
      columnTitle: target.title,
    });

    dispatch(setColumns(updated));

    // ✅ LOG ACTIVITY (ON REAL MOVE)
    if (source.title !== target.title) {
      logMoveActivity(card.id, source.title, target.title);
    }
  };

  /* MOVE COLUMN */
  const moveColumn = (fromIndex, toIndex) => {
    const updated = [...columns];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    dispatch(setColumns(updated));
  };

  /* RENAME COLUMN */
  const renameColumn = (columnId, newTitle) => {
    dispatch(
      setColumns(
        columns.map((col) =>
          col.id === columnId ? { ...col, title: newTitle } : col,
        ),
      ),
    );
  };

  /* DELETE COLUMN */
  const deleteColumn = (columnId) => {
    dispatch(setColumns(columns.filter((col) => col.id !== columnId)));
  };

  /* UPDATE / MOVE / DELETE ISSUE */
  const updateIssue = (updatedItem) => {
    const updated = structuredClone(columns);

    if (updatedItem.delete) {
      updated.forEach(
        (col) => (col.items = col.items.filter((c) => c.id !== updatedItem.id)),
      );
      dispatch(setColumns(updated));
      return;
    }

    let sourceCol = null;
    let index = -1;

    for (const col of updated) {
      index = col.items.findIndex((c) => c.id === updatedItem.id);
      if (index !== -1) {
        sourceCol = col;
        break;
      }
    }

    if (!sourceCol) return;

    const card = sourceCol.items[index];
    sourceCol.items.splice(index, 1);

    const merged = { ...card, ...updatedItem };
    const target = updated.find((c) => c.id === merged.columnId);
    if (!target) return;

    target.items.push({
      ...merged,
      columnTitle: target.title,
    });

    dispatch(setColumns(updated));
  };

  const filteredColumns = columns.map((col) => {
    if (!search.trim()) return col;

    const query = search.toLowerCase();

    return {
      ...col,
      items: col.items.filter(
        (item) =>
          item.content?.toLowerCase().includes(query) ||
          item.summary?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.createdByName?.toLowerCase().includes(query) ||
          `dev-${col.items.indexOf(item) + 1}`.includes(query),
      ),
    };
  });

  return (
    <>
     {/* SEARCH BAR */}
        <div className="kanban-search">
          <input
            type="text"
            placeholder="Search issues…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      <div className="kanban-board">
        {filteredColumns.map((col, index) => (
          <Column
            key={col.id}
            column={col}
            index={index}
            moveCard={moveCard}
            moveColumn={moveColumn}
            addCard={addCard}
            projectName={projectName}
            columns={columns}
            updateIssue={updateIssue}
            renameColumn={renameColumn}
            deleteColumn={deleteColumn}
          />
        ))}

        {/* ADD COLUMN */}
        <div className="add-column">
          {showColumnInput ? (
            <div>
              <input
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => {
                  if (!columnTitle.trim()) return;
                  dispatch(
                    setColumns([
                      ...columns,
                      {
                        id: Date.now().toString(),
                        title: columnTitle,
                        items: [],
                      },
                    ]),
                  );
                  setColumnTitle("");
                  setShowColumnInput(false);
                }}
              >
                Add
              </button>
            </div>
          ) : (
            <button onClick={() => setShowColumnInput(true)}>
              <FiPlus />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Kanban;
