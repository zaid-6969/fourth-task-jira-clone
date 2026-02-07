import React from "react";
import "../styles/User.scss";
import { IoIosArrowDown } from "react-icons/io";

const SupportCard = ({
  children,
  showDelete = false,
  onDelete,
  onClick,
}) => {
  return (
    <div className="support-card-wrapper" onClick={onClick}>
      <div className="support-card">
        <div className="accent-bar"></div>

        <div className="card-content">
          <div className="card-header">
            <div className="card-left">
              <div className="icon">🎫</div>
              <div>
                <div className="title">{children}</div>
                <p className="subtitle">Service management</p>
              </div>
            </div>

            {showDelete && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete project"
              >
                ✖
              </button>
            )}
          </div>

          <div className="card-body">
            <p className="section-title">Recent queues</p>

            <div className="row">
              <span>All open</span>
              <span className="count">0</span>
            </div>

            <div className="row">
              <span>Assigned to me</span>
              <span className="count">0</span>
            </div>

            <div className="card-hr"></div>

            <div className="footer" style={{ fontSize: "12px" }}>
              <span>3 queues</span>
              <span className="arrow"><IoIosArrowDown/> </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCard;
