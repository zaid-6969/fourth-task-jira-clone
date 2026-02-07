import React from "react";
import { useSelector } from "react-redux";
import "../styles/WorkTable.scss";

const ProjectWorkTable = () => {
  const columns = useSelector((state) => state.kanban.columns);

  // 🔥 FLATTEN ALL KANBAN CARDS INTO ONE LIST
  const tasks = columns.flatMap((col) =>
    col.items.map((item) => ({
      ...item,
      columnTitle: col.title,
    }))
  );

  if (tasks.length === 0) {
    return <p style={{ padding: 16 }}>No tasks yet</p>;
  }

  return (
    <div className="worktable-container">
      <table className="worktable">
        <thead>
          <tr>
            <th></th>
            <th>Work</th>
            <th>Created By</th>
            <th>Status</th>
            <th>Column</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <input type="checkbox" />
              </td>

              <td className="work-col">
                <span className="task-title">{task.content}</span>
              </td>

              <td>{task.createdByName}</td>

              <td>
                <span className="status">
                  {task.columnTitle}
                </span>
              </td>

              <td>{task.columnTitle}</td>

              <td>
                {new Date(task.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectWorkTable;
