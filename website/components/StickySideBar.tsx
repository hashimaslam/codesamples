import React from "react";
import "../styles/stickysidebar.scss";
import { useRouter } from "next/dist/client/router";
function StickySideBar({ data }) {
  const router = useRouter();
  return (
    <div className="sticky_sidebar_nav">
      {data.data.map((item) => {
        return (
          <a href={item.link}>
            <div
              className={`sticky_sidebar-item ${
                router.pathname === item.path && "active"
              }`}
              key={Math.random()}
            >
              <div className="sidebar_arrow-right" />
              <span>{item.title}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
export function MobileLinks(props) {

  return (
    <div className="mobile_links">
      {props?.osType !== "desktop" &&
        props?.links?.map((item) => {
          return (
            <a href={item.link}>
              <div className="items">
                <div className="title">{item.title}</div>
                <img src="/static/2x/arrow_right_dark.svg" className="icon" />
              </div>
            </a>
          );
        })}

      <style jsx>
        {`
          .mobile_links {
            margin: 16px;

            .items {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 44px;
              padding: 12px;
              background: #f4f3f4;
              border-radius: 8px;
              font-weight: normal;
              font-size: 14px;
              line-height: 20px;
              color: #230046;
              margin-bottom: 8px;
            }
            .icon {
              height: 12px;
              width: 12px;
            }
          }
        `}
      </style>
    </div>
  );
}
export default StickySideBar;
