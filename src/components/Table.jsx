import "../styles/Table.scss";

const data = [
  {
    id: "DEV-10",
    title: "dsfgsdfg",
    assignee: null,
    reporter: "Mohammed Zaid",
    priority: "Medium",
    status: "ADD",
    resolution: "",
    created: "",
    updated: "",
    duedate: "",
  },
  {
    id: "DEV-9",
    title: "gsdfdfg",
    assignee: null,
    reporter: "Mohammed Zaid",
    priority: "Medium",
    status: "TO DO",
    resolution: "",
    created: "",
    updated: "",
    duedate: "",
  },
  {
    id: "DEV-1",
    title: "Feature release",
    assignee: "Mohammed Zaid",
    reporter: "Mohammed Zaid",
    priority: "High",
    status: "IN PROGRESS",
    resolution: "",
    created: "",
    updated: "",
    duedate: "",
  },
];

const Table = () => {
  return (
    <div className="table-wrapper">
      <table className="work-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Work</th>
            <th>Assignee</th>
            <th>Reporter</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Resolution</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Due Date</th>
            <th>⋮</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>

              <td className="work">
                <span className="work-id">{item.id}</span>
                <span className="work-title">{item.title}</span>
              </td>

              <td>
                {item.assignee ? (
                  <div className="user">
                    <span className="avatar">MB</span>
                    {item.assignee}
                  </div>
                ) : (
                  <span className="unassigned">Unassigned</span>
                )}
              </td>

              <td>
                <div className="user">
                  <span className="avatar">MB</span>
                  {item.reporter}
                </div>
              </td>

              <td>
                <span className={`priority ${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </td>

              <td>
                <select className="status">
                  <option>{item.resolution}</option>
                </select>
              </td>
              <td>
                <select className="status">
                  <option>{item.created}</option>
                </select>
              </td>
              <td>
                <select className="status">
                  <option>{item.updated}</option>
                </select>
              </td>
              <td>
                <select className="status">
                  <option>{item.duedate}</option>
                </select>
              </td>

              <td className="menu">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <span>+ Create</span>
        <span>3 of 3 ⟳</span>
      </div>
    </div>
  );
};

export default Table;
