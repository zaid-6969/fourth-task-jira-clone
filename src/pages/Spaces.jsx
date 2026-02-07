import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

import "../styles/User.scss";

import { GiThreeFriends } from "react-icons/gi";
import { BsThreeDots } from "react-icons/bs";
import { FiShare2 } from "react-icons/fi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { TiArrowMaximise } from "react-icons/ti";

import Tabination from "../components/Tabination";
import Kanban from "../components/Kanban";
import ProjectWorkTable from "../components/ProjectWorkTable";

import { TbWorld } from "react-icons/tb";
import { LiaThListSolid } from "react-icons/lia";
import { CiViewColumn } from "react-icons/ci";

const Spaces = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const ref = doc(db, "projects", projectId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() });
      }
    });

    return () => unsub();
  }, [projectId]);

  if (!project) return <div style={{ padding: 20 }}>Loading...</div>;

  const tabs = [
    {
      id: "Summary",
      label: "Summary",
      icon: <TbWorld />,
      content: <div>Summary</div>,
    },
    {
      id: "List",
      label: "List",
      icon: <LiaThListSolid />,
      content: <ProjectWorkTable projectId={projectId} />,
    },
    {
      id: "Board",
      label: "Board",
      icon: <CiViewColumn />,
      content: <Kanban projectId={projectId} projectName={project.name} />,
    },
  ];

  return (
    <div className="landing-container">
      <div className="landing">
        <p>spaces</p>

        <div className="topic-spaces">
          <div className="spaces-first-icon">
            <h3>{project.name}</h3>
            <span>
              <GiThreeFriends />
            </span>
            <span>
              <BsThreeDots />
            </span>
          </div>

          <div className="spaces-second-icon">
            <span>
              <FiShare2 />
            </span>
            <span>
              <AiOutlineThunderbolt />
            </span>
            <span>
              <TiArrowMaximise />
            </span>
          </div>
        </div>

        {/* 🔥 Board tab opens by default */}
        <Tabination tabs={tabs} defaultActiveTab="Board" />
      </div>
    </div>
  );
};

export default Spaces;
