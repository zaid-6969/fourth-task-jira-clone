import { useParams } from "react-router-dom";
import KanbanBoard from "../components/Kanban";

const SpacesBoard = () => {
  const { projectId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Kanban Board</h2>
      <p>Project ID: {projectId}</p>

      <KanbanBoard projectId={projectId} />
    </div>
  );
};

export default SpacesBoard;
