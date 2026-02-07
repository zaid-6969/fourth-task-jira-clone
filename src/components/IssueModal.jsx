import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../styles/issueModal.scss";
import IssueComments from "./IssueComments";
import ActivityTabs from "./ActivityTabs";
import IssueActivity from "./IssueActivity";
import IssueAllActivity from "./IssueAllActivity";

const IssueModal = ({ item, projectName, columns, onClose, onUpdate }) => {
  const summaryRef = useRef(null);
  const descriptionRef = useRef(null);

  const summaryQuill = useRef(null);
  const descriptionQuill = useRef(null);

  const [editSummary, setEditSummary] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const [summaryHTML, setSummaryHTML] = useState(item.summary || "");
  const [descriptionHTML, setDescriptionHTML] = useState(
    item.description || "",
  );

  const [showDetails, setShowDetails] = useState(true);

  /* INIT QUILL WHEN EDIT MODE */
  useEffect(() => {
    if (editSummary && !summaryQuill.current) {
      summaryQuill.current = new Quill(summaryRef.current, {
        theme: "snow",
        placeholder: "Add a summary…",
      });
      summaryQuill.current.root.innerHTML = summaryHTML;
    }

    if (editDescription && !descriptionQuill.current) {
      descriptionQuill.current = new Quill(descriptionRef.current, {
        theme: "snow",
        placeholder: "Add a description…",
      });
      descriptionQuill.current.root.innerHTML = descriptionHTML;
    }
  }, [editSummary, editDescription, summaryHTML, descriptionHTML]);

  /* SAVE SUMMARY ONLY */
  const saveSummary = () => {
    const html = summaryQuill.current.root.innerHTML;
    setSummaryHTML(html);

    onUpdate({
      ...item,
      summary: html,
      updatedAt: new Date().toISOString(),
    });

    setEditSummary(false);
    summaryQuill.current = null;
  };

  /* SAVE DESCRIPTION ONLY */
  const saveDescription = () => {
    const html = descriptionQuill.current.root.innerHTML;
    setDescriptionHTML(html);

    onUpdate({
      ...item,
      description: html,
      updatedAt: new Date().toISOString(),
    });

    setEditDescription(false);
    descriptionQuill.current = null;
  };

  /* MAIN SAVE */
  const handleSave = () => {
    onUpdate({
      ...item,
      summary: summaryHTML,
      description: descriptionHTML,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const [activeActivityTab, setActiveActivityTab] = useState("Comments");
  const [activityOpen, setActivityOpen] = useState(true);

  return (
    <div className="issue-overlay">
      <div className="issue-container">
        {/* HEADER */}
        <div className="issue-header">
          <h1>{item.content}</h1>
          <button className="issue-close" onClick={onClose}>
            <ImCross />
          </button>
        </div>

        {/* BODY */}
        <div className="issue-body">
          {/* LEFT CONTENT */}
          <div className="issue-content">
            {/* SUMMARY */}
            <div className="issue-group">
              <label>Summary</label>

              {!editSummary ? (
                <div
                  className="issue-view"
                  style={{ fontSize: "15px", fontWeight: "100" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      summaryHTML ||
                      "<span class='muted'>Click to add summary</span>",
                  }}
                  onClick={() => setEditSummary(true)}
                />
              ) : (
                <>
                  <div ref={summaryRef} className="issue-editor" />
                  <div className="inline-actions">
                    <button className="inline-save" onClick={saveSummary}>
                      Save
                    </button>
                    <button
                      className="inline-cancel"
                      onClick={() => setEditSummary(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="issue-group">
              <label>Description</label>

              {!editDescription ? (
                <div
                  className="issue-view"
                  style={{ fontSize: "15px", fontWeight: "100" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      descriptionHTML ||
                      "<span class='muted'>Click to add description</span>",
                  }}
                  onClick={() => setEditDescription(true)}
                />
              ) : (
                <>
                  <div ref={descriptionRef} className="issue-editor" />
                  <div className="inline-actions">
                    <button className="inline-save" onClick={saveDescription}>
                      Save
                    </button>
                    <button
                      className="inline-cancel"
                      onClick={() => setEditDescription(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ✅ COMMENT SECTION (FIXED) */}

            <ActivityTabs
              activeTab={activeActivityTab}
              onTabChange={setActiveActivityTab}
              onToggle={setActivityOpen}
            />

            {activityOpen && (
              <>
                {activeActivityTab === "All" && (
                  <IssueAllActivity issueId={item.id} />
                )}
                {activeActivityTab === "Comments" && (
                  <IssueComments issueId={item.id} />
                )}
                {activeActivityTab === "History" && (
                  <IssueActivity issueId={item.id} />
                )}

                {activeActivityTab === "Work log" && (
                  <div className="activity-placeholder">
                    Work log coming soon
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="issue-sidebar">
            <div className="issue-meta">
              <select
                value={item.columnId}
                onChange={(e) => {
                  const col = columns.find((c) => c.id === e.target.value);
                  if (!col) return;
                  onUpdate({
                    ...item,
                    columnId: col.id,
                    columnTitle: col.title,
                  });
                }}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="issue-details">
              <div
                className="issue-details-header"
                onClick={() => setShowDetails((p) => !p)}
              >
                <span>Details</span>
                <span className={`arrow ${showDetails ? "open" : ""}`}>▸</span>
              </div>

              {showDetails && (
                <div className="issue-details-body">
                  <div className="issue-meta">
                    <label>Created by</label>
                    <div className="issue-meta-value">
                      {item.createdByName || "Unknown"}
                    </div>
                  </div>

                  <div className="issue-meta">
                    <label>Created</label>
                    <div className="issue-meta-value">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>

                  <div className="issue-meta">
                    <label>Project</label>
                    <div className="issue-meta-value">{projectName}</div>
                  </div>

                  <div className="issue-meta">
                    <label>Reporter</label>
                    {item.createdByName || "none"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="issue-footer">
          <button className="issue-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="issue-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
