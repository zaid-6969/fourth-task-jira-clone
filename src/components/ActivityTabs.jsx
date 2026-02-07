import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const TABS = ["All", "Comments", "History"];

const ActivityTabs = ({ activeTab, onTabChange, onToggle }) => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen((p) => !p);
    onToggle?.(!open);
  };

  return (
    <div className="activity-wrapper">
      <div className="activity-header" onClick={handleToggle}>
        <span>{open ? <IoIosArrowDown/>: <IoIosArrowForward/> } </span><span>Activity</span>
        {/* <span className={`activity-arrow ${open ? "open" : ""}`}>▾</span> */}
      </div>

      {open && (
        <div className="activity-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`activity-tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTabs;
