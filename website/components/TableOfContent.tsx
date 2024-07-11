import React, { useState, useCallback } from "react";

function TableOfContent({ data }) {
  // const [current, setCurrent] = useState(data?.data[0]?.title);
  const [toggle, setToggle] = useState(false);
  const handleToggle = useCallback(() => {
    setToggle(!toggle);
  }, [toggle]);

  const handleScroll = (section) => {
    let el = document.getElementById(section);
    // setCurrent(section);
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };
  return (
    <div className="table_content">
      <div className="table_content-header">
        <div className="table_content-header_logo" onClick={handleToggle}>
          <img src="/static/2x/sidebar_hamdburger.svg" />
        </div>
        <div className="table_content-header_title">Table of contents</div>
      </div>
      {toggle && (
        <div className="table_content-menulist">
          {data?.map((item) => (
            <div
              className="table_content-menulist_item"
              onClick={() => handleScroll(item.title)}
            >
              <div className="sidebar_arrow-right" />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      )}
      <style jsx>
        {`
          .table_content {
            margin-top: 144px;
            margin-bottom:124px;

            &-header {
              padding: 0px 0px 20px 0px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid rgba(25, 10, 40, 0.3);
              &_logo {
                width: 44px;
                height: 44px;
                cursor: pointer;
              }
              &_title {
                font-size: 32px;
                font-weight: 600;
                line-height: 40px;
                color: #230046;
                margin-left: 20px;
              }
            }
            &-menulist {
              margin-left: 64px;
              margin-top: 32px;
              &_item {
                cursor: pointer;
                font-size: 16px;
                line-height: 20px;
                color: #230046;
                padding: 20px 0px;
                border-bottom: 1px solid rgba(25, 10, 40, 0.3);
                .sidebar_arrow-right {
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-top: 2px solid #e91051;
                  border-left: 2px solid #e91051;
                  transition: all 250ms ease-in-out;
                  color: transparent;

                  transform: rotate(135deg);
                }
                span {
                  margin-left: 10px;
                }
              }
            }
          }
          @media screen and (max-width: 1224px) {
            .table_content {
              margin-right: 16px;
              margin-left: 16px;
              margin-top: 35px;
              margin-bottom:24px;
            }

            .table_content-header_title {
              font-size: 16px;
              font-weight: 600;
              line-height: 22px;
            }
            .table_content-menulist {
              margin-left: 32px;
              &_item {
                font-size: 14px;
                .sidebar_arrow-right {
                  width: 8px;
                  height: 8px;
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default TableOfContent;
