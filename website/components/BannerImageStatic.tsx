import React, { Component } from "react";
import RewardsBar from "../components/RewardsBarStatic";
import SendSMS from "../components/SendSMSStatic";

import DownloadButtonBanner from "../components/DownloadButtonBannerStatic";
const TopgameIcons = ({ topGameIcons }) => (
  <div className="image-wrapper">
    {topGameIcons
      ? topGameIcons.map((data, key) => (
          <div>
            <img src={data.imgLink} alt="vpl game icon" key={key}></img>
            <h3>{data.text}</h3>
          </div>
        ))
      : ""}
    <style jsx>
      {`
        .image-wrapper {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 16px;
          img {
            width: 36px;
            height: 36px;
          }
          h3 {
            font-weight: 500;
            font-size: 10px;
            line-height: 12px;
            text-align: center;
            align-self: center;
            margin: 0 2px;
            color: #fff;
          }
        }
      `}
    </style>
  </div>
);
const BannerImageMobile = (props) => (
  <div>
    <div className="banner-landing">
      {/* <img
        className="banner-landing--img"
        src={props.img}
        alt="vpl banner"
      ></img> */}

      <picture>
        <source srcSet={props.mobileImgWebp} type="image/webp" />
        <source srcSet={props.mobileImgPng} type="image/png" />

        <img
          className="banner-landing--img"
          src={props.mobileImgPng}
          alt="vpl banner"
        />
      </picture>

      <div className="img-header-footer-wrapper">
        <div className="header-box">
          <div className="header">
            <h2
              style={
                props && props.addDarkGradient
                  ? { color: "#FFFFFF" }
                  : { color: "#222222" }
              }
            >
              {props && props.headingSubHeading
                ? props.headingSubHeading.heading
                : ""}
            </h2>
            <h3
              style={
                props && props.addDarkGradient
                  ? { color: "#FFFFFF" }
                  : { color: "#4A4A4A" }
              }
            >
              {props && props.headingSubHeading
                ? props.headingSubHeading.subHeading
                : ""}
            </h3>
          </div>
        </div>
        <div
          className="footer-box"
          style={
            props && props.addDarkGradient
              ? {
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
                  color: "#fff",
                }
              : {}
          }
        >
          <div className="button-section">
            {props.topGameIcons ? (
              <TopgameIcons topGameIcons={props.topGameIcons} />
            ) : (
              ""
            )}
            <DownloadButtonBanner
              device={props.device}
              browser={props.browser}
            />
          </div>
        </div>
      </div>
    </div>
    <RewardsBar config={props.config} device={props.device} />
  </div>
);
const BannerImageDesktop = (props) => (
  <section className="banner-large">
    <div
      className={
        "banner-layout" +
        (props && !props.addDarkGradient ? " banner-dark" : " banner-light")
      }
    >
      {/* <img src={props.imgBackgroundDesktop} alt="banner-image-vpl" /> */}

      <picture>
        <source srcSet={props.desktopImgWebp} type="image/webp" />
        <source srcSet={props.desktopImgPng} type="image/png" />

        <img src={props.desktopImgPng} alt="vpl banner" />
      </picture>

      <div className="container">
        <div className="section-layout">
          <div className="row banner-row">
            <div className="image-button-wrapper">
              <div className="text-button-wrapper">
                <div className="header">
                  <h2
                    style={
                      props && !props.addDarkGradient
                        ? { color: "#222222" }
                        : { color: "#FFFFFF" }
                    }
                  >
                    {props && props.headingSubHeading
                      ? props.headingSubHeading.heading
                      : ""}
                  </h2>
                  <h3>
                    {props && props.headingSubHeading
                      ? props.headingSubHeading.subHeading
                      : ""}
                  </h3>
                </div>
                <div>
                  <SendSMS />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
class BannerImage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { osType } = this.props;
    if (osType === undefined) return "";
    return (
      <div>
        {osType === "desktop" ? (
          <BannerImageDesktop {...this.props} />
        ) : (
          <BannerImageMobile {...this.props} />
        )}
        <style global jsx>
          {`
            .img-header-footer-wrapper {
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              height: 440px;
              .header-box {
                height: 140px;
                color: #222;
                .header {
                  padding: 16px 24px;
                  text-transform: none;
                  h2 {
                    font-weight: bold;
                    font-size: 20px;
                    line-height: 24px;
                    text-align: center;
                    align-self: center;
                    margin-top: 0;
                    margin-bottom: 12px;
                  }
                  > h3 {
                    font-weight: normal;
                    font-size: 14px;
                    line-height: 18px;
                    text-align: center;
                    align-self: center;
                    padding: unset;
                    margin: 0;
                  }
                }
              }
              .footer-box {
                height: 112px;
                display: flex;
                width: 100%;

                .button-section {
                  padding: 16px 24px;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-end;
                  align-items: center;
                  width: 100%;
                }
              }
            }
            .banner-landing {
              margin-top: 56px;
              background-repeat: no-repeat;
              background-size: cover;
              display: block;
              height: 440px;
              background-position: center;
              position: relative;
            }

            .banner-landing--img {
              pointer-events: none;
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: -1;
              display: block;
              object-fit: cover;
              object-position: center;
            }

            .banner-layout {
              height: 712px;
              display: flex;
              align-items: center;
              overflow: hidden;
              position: relative;
              width: 100%;
              img {
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                object-fit: cover;
              }
            }

            .banner-row {
              justify-content: flex-start;
              text-align: left;
              h2 {
                font-size: 40px;
              }
              h3 {
                color: #828282;
                font-weight: normal;
                font-size: 28px;
              }
            }
            .image-button-wrapper {
              width: 52%;
            }

            @media screen and (min-width: 768px) {
              .banner-landing {
                height: 650px;
              }

              .img-header-footer-wrapper {
                height: 650px;
                .header-box {
                  .header {
                    h2 {
                      font-size: 23px;
                    }
                    > h3 {
                      font-size: 15px;
                    }
                  }
                }
              }

              section.banner-large {
                .header {
                  h2,
                  h3 {
                    margin: 24px 0;
                  }
                }
                .section-layout {
                  padding: 88px 24px;
                }

                .banner-row h3 {
                  line-height: 44px;
                }

                div.banner-layout {
                  border-bottom: solid 4px #f0f0f0;
                  div#sms-form {
                    div.inp-txt1 {
                      background-color: transparent;
                      > #mobile.inp-box {
                        background-color: transparent;
                      }
                    }
                  }
                }
              }
              section.banner-large {
                div.banner-layout.banner-light {
                  .banner-row h3 {
                    color: #ffffff;
                    opacity: 0.5;
                    font-weight: 100;
                    font-size: 28px;
                  }

                  div#sms-form {
                    div.inp-txt1 label {
                      color: #fff;
                    }

                    input::placeholder {
                      color: rgba(255, 255, 255, 0.3);
                      font-weight: 200;
                    }
                  }
                }
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default BannerImage;
