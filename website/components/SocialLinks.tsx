import React from "react";
import SendSMSIPL from "./ipl2021/SendSMSIPL";
function SocialLinks(props) {
  console.log(props);
  return (
    <div>
      <div className="social_links">
        <div className="links">
          <div className="share_icon">
            <div className="social_icons-item">
              <img
                className="share_icon"
                src={"/static/2x/share_icon.svg"}
                alt="ig icon"
                style={{ marginTop: "3px" }}
              />
            </div>
          </div>
          <div className="text">share with</div>
          <div className="bar">|</div>
          <div className="social_icons">
            {props.iconLinks.map((icon) => {
              return (
                <a
                  href={icon.link}
                  className="social_icons-item"
                  target="_blank"
                >
                  <img
                    className="img--css"
                    src={icon.imgUrl.png}
                    alt={icon.imgUrl.alt}
                  />
                </a>
              );
            })}
          </div>
        </div>
        {props.tags&&<div className="tags">
          {props.tags.map((i) => {
            return <div className="items">{i}</div>;
          })}
        </div>}
        
      </div>

      {props.osType === "desktop" && (
        <div className="links-sms">
          <div className="title">{props.header}</div>
          <SendSMSIPL
            {...props.smsData}
            langauge={props.config.config.LANG_CODE}
            tiktokClass="true"
          />
        </div>
      )}
      {/* <div className="">
      </div> */}
      <style jsx global>
        {`
          .social_links {
            margin-top: 64px;
            margin-bottom: 64px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(25, 10, 40, 0.3);
            padding-bottom: 20px;
            justify-content: space-between;
            .links {
              width: 40%;
              display: flex;
              .text {
                font-size: 22px;
                line-height: 24px;
                margin-right: 20px;
              }
              .bar {
                font-size: 30px;
                line-height: 24px;
                font-weight: 200;
                margin-right: 20px;
              }
            }
            .social_icons {
              &-item {
                img {
                  width: 20px;
                  height: 20px;
                  margin-right: 16px;
                  fill: rgba(25, 10, 40, 0.6);
                }
              }
            }

            .tags {
              display: flex;
              flex-wrap: wrap-reverse;
              width: 60%;
              .items {
                background: rgba(25, 10, 40, 0.05);
                border-radius: 100px;
                font-size: 16px;
                line-height: 20px;
                color: rgba(25, 10, 40, 0.6);
                margin-right: 10px;
                margin-bottom: 10px;
                display: flex;
                padding: 10px 20px;
              }
            }
          }
          .links-sms {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 64px;
            .title {
              font-size: 32px;
              line-height: 40px;
              text-align: center;
              color: #230046;
              font-weight: 600;
              margin-bottom: 20px;
            }
            #sms-form form {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
            }

            #sms-but.download-but {
              margin-top: 0;
              margin-left: 20px;
            }
          }
          @media screen and (max-width: 1224px) {
            .social_links {
              flex-direction: column;
              margin-right: 16px;
              margin-left: 16px;
              .links {
                margin-top: 30px;
                width: 100%;
                order: 2;
                align-items: center;
                .text {
                  font-size: 16px;
                  line-height: 24px;
                  margin-right: 10px;
                }
                .bar {
                  font-size: 20px;
                  line-height: 24px;
                  font-weight: 200;
                  margin-right: 10px;
                }
              }
              .social_icons {
                &-item {
                  .share_icon {
                    height: 14px !important;
                  }
                  img {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    fill: rgba(25, 10, 40, 0.6);
                  }
                }
              }
              .tags {
                width: 100%;
                .items {
                  background: rgba(25, 10, 40, 0.05);
                  border-radius: 100px;
                  font-size: 12px;
                  line-height: 20px;
                  color: rgba(25, 10, 40, 0.6);
                  margin-right: 10px;
                  margin-bottom: 10px;
                  display: flex;
                  padding: 8px 16px;
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}

export default SocialLinks;
