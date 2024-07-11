import React, { useState } from "react";

export const ShowMoreText = (props) => {
  const [readMore, setReadMore] = useState(false);

  const linkName = readMore ? "View Less " : "View More  ";
  return (
    <>
      <div className="show-more">
        {props.text.length < props.maxCharacterLength ? (
          <span className="text header--small">{props.text}</span>
        ) : (
          <a
            className="show-more-link"
            onClick={() => {
              setReadMore(!readMore);
            }}
          >
            <span>
              {readMore ? (
                <span className="text header--small"> {props.text} </span>
              ) : (
                <span className="text header--small">
                  {" "}
                  {props.text.substring(0, props.maxCharacterLength - 1)}
                </span>
              )}{" "}
              <span className="header--small show-more-link">{linkName}</span>
            </span>
          </a>
        )}
      </div>
      <style jsx>{`
        .show-more-link {
          font-family: trim-Regular;
          color: #ff0000;
        }
        .text {
          font-family: trim-Regular;
          color: rgba(25, 10, 40, 0.6);
        }
      `}</style>

      <style jsx global>{`
        .extra-content {
          color: rgba(25, 10, 40, 0.6);
        }
      `}</style>
    </>
  );
};

export default ShowMoreText;
