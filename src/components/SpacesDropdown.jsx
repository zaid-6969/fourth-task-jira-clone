import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { setSelectedProject } from "../store/projectSlice";

const SpacesDropdown = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(
    (state) => state.project.selectedProject
  );

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(list);

      // auto-select first project (Jira-like)
      if (!selectedProject && list.length > 0) {
        dispatch(setSelectedProject(list[0]));
      }
    };

    fetchProjects();
  }, [dispatch, selectedProject]);

  if (projects.length === 0) {
    return <p style={{ opacity: 0.6 }}>No projects</p>;
  }

  return (
    <select
      value={selectedProject?.id || ""}
      onChange={(e) => {
        const project = projects.find(
          (p) => p.id === e.target.value
        );
        dispatch(setSelectedProject(project));
      }}
    >
      {projects.map((project) => (
        <option key={project.id} value={project.id}>
          {project.name}
        </option>
      ))}
    </select>
  );
};

export default SpacesDropdown;
