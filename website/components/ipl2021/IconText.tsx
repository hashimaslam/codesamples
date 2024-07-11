import { getHTML } from "../../configs/util";
import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const IconText = (props) => {
  useEffect(() => {
    lazyImage();
  });

  return (
    <section className="container">
      <div className={` ${props.cssClasses} ${props.device} ${props.page}`}>
        <ul className={`${props.cssClasses}-list`}>
          {props.contentList.map((comp, key) => {
            return (
              <li key={key}>
                <img
                  data-src={comp.iconImageurl.png}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                  className="lazy-image"
                />{" "}
                <div className="text-content">
                  {comp.contentText.map((text, key) => {
                    return (
                      <text.type
                        className={`${text.cssClasses ? text.cssClasses : ""} `}
                        style={text.styles}
                        key={key}
                      >
                        {text.text}
                      </text.type>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style jsx global>{`
        .vpl-vip {
          padding: 0 18px 68px 18px;
        }
        .vpl-vip-list {
          padding: 0 0 80px 0;
          img {
            width: 40px;
            height: 40px;
            margin-right: 12px;
          }
          li {
            display: flex;
            min-height: 64px;
          }

          .text-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .bold-header {
            font-size: 14px;
            line-height: 20px;
            color: #190a28;
            margin-bottom: 2px;
            text-transform: none;
          }

          .light-header {
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
            text-transform: none;
          }
        }

        @media screen and (min-width: 1224px) {
          .vpl-vip {
            padding: 0 18px 68px 60px;
            width: 55%;
            margin: auto;
          }
          .vpl-vip-list {
            img {
              width: 120px;
              height: 120px;
              margin-right: 24px;
            }
            li {
              display: flex;
              min-height: 152px;
              align-items: center;
            }
            .bold-header {
              font-size: 24px;
              line-height: 28px;
            }
            .light-header {
              font-size: 20px;
              line-height: 24px;
            }
          }
        }
      `}</style>
    </section>
  );
};
