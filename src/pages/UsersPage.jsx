import React, { useEffect, useState } from "react";
import "../styles/User.scss";
import Tabination from "../components/Tabination";
import SupportCard from "../components/Card";
import Creationmodule from "../components/Creationmodule";
import { useSelector } from "react-redux";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import WorkedOnTable from "../components/WorkedOn";
import ProjectWorkTable from "../components/ProjectWorkTable";
import { useAuth } from "../auth/AuthProvider";
import ProjectAssignmentTable from "../components/ProjectAssignedProjectsTable";
import StarredProjectsTable from "../components/StarredProjectsTable";
import { useNavigate, useLocation } from "react-router-dom";
import TextEditor from "../components/TextEditor";

const UsersPage = () => {
  const showModule = useSelector((state) => state.module.showModule);
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isInSpace = location.pathname.startsWith("/spaces/");

  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState("");
  useEffect(() => {
    const fetchProjects = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "projects"),
        where("assignedUserIds", "array-contains", currentUser.uid)
      );

      const snapshot = await getDocs(q);
      const projectList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProjects(projectList);
    };

    fetchProjects();
  }, []);

  const tabs = [
    {
      id: "Worked on",
      label: "Worked on",
      content:
        role === "admin" ? (
          <ProjectAssignmentTable mode="admin" />
        ) : (
          <ProjectAssignmentTable mode="user" />
        ),
    },
    {
      id: "Viewed",
      label: "Viewed",
      content: <ProjectWorkTable />,
    },
    {
      id: "Assigned to me",
      label: "Assigned to me",
      content: <WorkedOnTable />,
    },
    {
      id: "Starred",
      label: "Starred",
      content: <StarredProjectsTable />,
    },
    {
      id: "Boards",
      label: "Boards",
      content: <h2>📋 Boards</h2>,
    },
  ];

  return (
    <>
      {/* MODULE */}
      {showModule && (
        <div className="creation-module">
          <Creationmodule />

        </div>
      )}

      {/* 🔥 HIDE DASHBOARD WHEN INSIDE SPACE */}
      {!isInSpace && (
        <div style={{marginTop:'20px'}} className="landing-container">
          <div style={{width:'90%'}} className="landing">
            <h2>For you</h2>
            <div style={{margin:"15px 0px"}} className="hr"></div>

            <div className="tabination-container">
              <div>
                <div className="tabination-topic">
                  <p>Recent spaces</p>
                  <p style={{ color: "#669df1" }}>View all spaces</p>
                </div>

                {/* PROJECT CARDS */}
                <div className="card-container">
                  {projects.length === 0 && (
                    <p>No projects assigned to you</p>
                  )}

                  {projects.map((project) => (
                    <SupportCard
                      key={project.id}
                      onClick={() => navigate(`/spaces/${project.id}`)}
                    >
                      {project.name}
                    </SupportCard>
                  ))}
                </div>
              </div>

              <div className="home-tabination">
                <Tabination style={{ height: "45vh" }} tabs={tabs} />
                {/* <TextEditor  value={summary} onChange={setSummary}  /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersPage;
