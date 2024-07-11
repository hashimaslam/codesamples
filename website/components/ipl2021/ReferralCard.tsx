import { Text, Button, componentLookUpText } from "./vplSportsVIP";
import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const ReferralCard = (props) => {
  useEffect(() => {
    lazyImage();
  });

  let referralData = props.config.config.referral;
  const copyTextToClipboard = () => {
    try {
      navigator.clipboard.writeText(referralData.referralCode);
    } catch (err) {
      console.log("Oops, unable to copy");
    }
  };

  return (
    <>
      {props.config.config.referral && props.device !== "desktop" && (
        <section
          className={`content--container ${props.cssClasses}`}
          style={props.styles}
        >
          <div className="content">
            <img
              data-src={props.mobileImageurl.png}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
              className="lazy-image"
            />

            <div className="referral-content">
              <p
                className="header--small m-0 margin--bottom"
                style={{ color: "#F5E6F9;" }}
              >
                {referralData.displayName} has invited you !
              </p>
              <p
                className="semi--bold--text m-0 margin--bottom"
                style={{ color: "#FFFFFF;" }}
              >
                USE CODE
              </p>
              <p className="referral--code m-0 margin--bottom">
                {referralData.referralCode}
              </p>
              <div onClick={copyTextToClipboard} className="copy--code--btn">
                COPY CODE
              </div>
            </div>
          </div>

          <div className="text-container">
            {props.contentText &&
              props.contentText.map((data, key) =>
                componentLookUpText(data, props.device, key)
              )}
          </div>
        </section>
      )}

      <style jsx>
        {`
          .content {
            background-color: #400756;
            max-width: 100%;
            border-radius: 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-evenly;
            padding: 0px;

            img {
              height: 90px;
              width: 90px;
            }
          }
          .content--container {
            padding: 52px 24px;
          }
          .margin--bottom {
            margin: 4px 0px;
          }
          .referral--code {
            color: #fff200;
            font-size: 28px;
            line-height: 28px;
            text-transform: capitalize;
          }
          .copy--code--btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 12px;
            background: #bd00ff;
            border-radius: 2px;
            margin: 12px 0px;
            font-size: 14px;
            line-height: 20px;
            color: #ffffff;
            width: fit-content;
            cursor: pointer;
          }
          .text-container {
            margin-top: 24px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: flex-start;
          }

          @media screen and (min-width: 320px) {
            .content {
              img {
                height: 141px;
                width: 141px;
              }
            }
            .content--container {
              padding: 52px 12px;
            }
          }

          @media screen and (min-width: 360px) {
            .content {
              img {
                height: 156px;
                width: 156px;
              }
            }
          }

          @media screen and (min-width: 411px) {
            .content {
              img {
                height: 156px;
                width: 156px;
              }
            }

            .content--container {
              padding: 52px 24px;
            }
          }
        `}
      </style>
    </>
  );
};
