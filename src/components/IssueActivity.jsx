import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const IssueActivity = ({ issueId }) => {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    if (!issueId) return;

    const q = query(
      collection(db, "tickets", issueId, "activity"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setActivity(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, [issueId]);

  return (
    <div className="issue-activity">
      {activity.map((a) => (
        <div key={a.id} className="activity-item">
          <strong>{a.userName}</strong> moved this issue
          <div className="activity-move">
            <span>{a.from}</span> → <span>{a.to}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueActivity;
