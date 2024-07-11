import RewardsBar from "./RewardsBarSliding";
import IconTextButton from "./IconTextButton";
import React, { useState, useEffect } from "react";
import {isEmptyObject} from '../../config/validation';

export const StickySection = (props) => {
  const [show, setShow] = useState(!props.showAlways ? false : true);

  useEffect(() => {
    if (!props.showAlways) {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <>
      {show && (
        <>
          {props.device !== "desktop" && (
            <div
              className={`${props.cssClasses ? props.cssClasses : ""} `}
              style={props.styles}
            >
              {props.showRewards && (
                <RewardsBar
                  {...props.rewardsBar}
                  {...{ config: props.config }}
                />
              )}
              <div className="download-section">
                {!isEmptyObject(props.iconImageButton) && !isEmptyObject(props.linkImageIOSButton)  &&
                <IconTextButton
                  iconImageButton={props.iconImageButton}
                  linkImageIOSButton={props.linkImageIOSButton}
                  osType={props.device}
                  config={props.config}
                  buttonPosition="bottom"
                  isreferral={props.isreferral}
                />
             } 
              </div>
            </div>
          )}

          <style jsx>
            {`
              .sticky-section {
                color: white;
                text-align: right;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                position: fixed;
                bottom: 0;
                z-index: 2;
                background: #fff;
                box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.15);
                flex-direction: column;
                .download-section {
                  display: flex;
                  padding: 16px 0;
                  width: 100%;
                  justify-content: center;
                }
              }
            `}
          </style>
        </>
      )}
    </>
  );
};
