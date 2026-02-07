import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

const IssueAllActivity = ({ issueId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!issueId) return;

    // COMMENTS
    const commentsQ = query(
      collection(db, "issues", issueId, "comments"),
      orderBy("createdAt", "asc"),
    );

    // HISTORY (MOVES)
    const activityQ = query(
      collection(db, "tickets", issueId, "activity"),
      orderBy("createdAt", "asc"),
    );

    const unsubComments = onSnapshot(commentsQ, (snap) => {
      setItems((prev) => {
        const others = prev.filter((i) => i.type !== "comment");
        const comments = snap.docs.map((d) => ({
          id: d.id,
          type: "comment",
          ...d.data(),
        }));
        return [...others, ...comments].sort(sortByTime);
      });
    });

    const unsubActivity = onSnapshot(activityQ, (snap) => {
      setItems((prev) => {
        const others = prev.filter((i) => i.type !== "move");
        const moves = snap.docs.map((d) => ({
          id: d.id,
          type: "move",
          ...d.data(),
        }));
        return [...others, ...moves].sort(sortByTime);
      });
    });

    return () => {
      unsubComments();
      unsubActivity();
    };
  }, [issueId]);

  return (
    <div className="activity-all">
      {items.map((item) => (
        <div key={item.id} className={`activity-row ${item.type}`}>
          {/* left timeline dot */}
          <div className="activity-dot" />

          {/* content */}
          <div className="activity-content">
            {/* header */}
            <div className="activity-user">
              <strong>{item.userName}</strong>

              <span className="activity-action">
                {item.type === "comment" ? "commented" : "moved this issue"}
              </span>
            </div>

            {/* COMMENT */}
            {item.type === "comment" && (
              <div
                className="activity-comment"
                dangerouslySetInnerHTML={{
                  __html: item.content,
                }}
              />
            )}

            {/* HISTORY */}
            {item.type === "move" && (
              <div className="activity-move">
                <span className="activity-from">{item.from}</span>
                <span className="activity-arrow">→</span>
                <span className="activity-to">{item.to}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueAllActivity;

/* ---------- helpers ---------- */
function sortByTime(a, b) {
  const t1 = a.createdAt?.seconds || 0;
  const t2 = b.createdAt?.seconds || 0;
  return t1 - t2;
}
