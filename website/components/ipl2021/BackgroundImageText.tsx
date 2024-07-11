import { Text, Button, componentLookUpText } from "./vplSportsVIP";
import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const BackgroundImageText = (props) => {
  useEffect(() => {
    lazyImage();
  });

  return (
    <>
      {props.cssClasses.indexOf("vpl-brain-storm") > -1 ? (
        <section
          className={`${props.cssClasses}  ${props.device}`}
          style={props.styles}
        >
          <div className="content-container">
            {props.device === "desktop" ? (
              <img
                data-src={props.backgroundImageDesktop.png}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                className="lazy-image"
              />
            ) : (
              <img
                data-src={props.backgroundImageMobile.png}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                className="lazy-image"
              />
            )}
            <div className="text-container">
              {props.contentText &&
                props.contentText.map((data, key) =>
                  componentLookUpText(data, props.device, key)
                )}
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`${props.cssClasses}  ${props.device}`}
          style={props.styles}
        >
          <div className="content">
            {props.device === "desktop" ? (
              <img
                data-src={props.desktopImageurl.png}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                className="lazy-image"
              />
            ) : (
              <img
                data-src={props.mobileImageurl.png}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                className="lazy-image"
              />
            )}
            <div className="text-container">
              {props.contentText &&
                props.contentText.map((data, key) =>
                  componentLookUpText(data, props.device, key)
                )}
            </div>
          </div>
        </section>
      )}
      <style jsx global>
        {`
          .red--background .content {
            background: #ff1e46;
            border-radius: 8px;
          }
          .image-container {
            img {
              pointer-events: none;
              position: absolute;
              z-index: 0;
              display: block;
              max-width: 100%;
              border-radius: 12px;
              left: 0;
            }
          }

          .content-container {
            display: flex;
            position: relative;
            width: 100%;
          }
          .content {
            position: relative;
            width: 100%;
          }

          .vpl-sports {
            position: relative;
            display: flex;
            justify-content: space-between;
            overflow: hidden;
            background-repeat: no-repeat;
            justify-content: flex-end;
            background-size: cover;
            justify-content: center;
            margin-left: 12px;
            margin-right: 12px;

            .content {
              border-radius: 12px;
            }
            img {
              position: absolute;
              border-radius: 12px;
              height: 100%;
              left: 0;
              width: 100%;
              bottom: 0;
              z-index: -1;
            }
          }

          .text-container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 16px 0px 39px 16px;
            align-items: flex-start;
            z-index: 1;
          }

          @media screen and (min-width: 320px) {
            .vpl-sports {
              img {
                height: 100%;
                width: 100%;
              }
            }
          }

          @media screen and (min-width: 360px) {
            .vpl-sports {
              img {
                height: 100%;
                width: 100%;
              }
            }
          }

          @media screen and (min-width: 411px) {
            .vpl-sports {
              img {
                height: 100%;
                width: 100%;
              }
            }
          }

          @media screen and (min-width: 1224px) {
            .vpl-sports .content {
              width: 824px;
              height: 360px;
              margin: auto;
              border-radius: 24px;
              img {
                height: 100%;
                width: 100%;
              }
              .image-container {
                img {
                  height: 360px;
                }
              }
            }
            .text-container {
              padding: 24px 0px 33px 33px;
            }
          }
        `}
      </style>
    </>
  );
};
