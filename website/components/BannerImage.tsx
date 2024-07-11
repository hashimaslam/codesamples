import React, { Component, useState, useEffect } from "react";
import RewardsBar from "../components/RewardsBar";
import SendSMS from "../components/SendSMS";
import "../styles/modal.scss";
import Modal from "react-modal";
import DownloadButtonBanner from "../components/DownloadButtonBanner";

import { getHTML } from "../configs/util";

const TopgameIcons = ({ topGameIconsList }) => (
  <div className="image-wrapper">
    {topGameIconsList.map((data, key) => (
      <div>
        <img src={data.imageurl.png} alt="vpl game icon" key={key}></img>
        <h3>{data.text}</h3>
      </div>
    ))}
    <style jsx>
      {`
        .image-wrapper {
          display: flex;
          display: -webkit-box;
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
const BannerImageMobile = (props) => {
  return (
    <div>
      <div
        className={`banner-landing ${props.page} ${
          props.classList ? props.classList.join(" ") : ""
        }`}
      >
        {(props.page !== "vpl-stories" ||
          !props.page ||
          (props.page === "vpl-stories" && props.isShow404Banner)) && (
          <picture>
            <source srcSet={props.mobileImageurl.webp} type="image/webp" />
            <source srcSet={props.mobileImageurl.png} type="image/png" />

            <img
              className="banner-landing--img"
              src={props.mobileImageurl.png}
              alt={props.mobileImageurl.alt}
            />
          </picture>
        )}

        <div className="img-header-footer-wrapper">
          <div className="header-box">
            <div className="header">
              {props.breadCrumbs?.status && (
                <div className="banner-breadcrumbs-container">
                  <div className="breadcrumbs-item">
                    <a href="https://www.vpl.live">
                      <span
                        style={
                          props.cssAddDarkGradient
                            ? { color: "#f4f3f4 " }
                            : { color: "#4A4A4A" }
                        }
                      >
                        Home
                      </span>
                    </a>
                  </div>
                  <div
                    className="breadcrumbs-item"
                    style={
                      props.cssAddDarkGradient
                        ? { color: "#f4f3f4 " }
                        : { color: "#4A4A4A" }
                    }
                  >
                    /
                  </div>
                  {props.breadCrumbs?.status &&
                    props.breadCrumbs?.data?.map((breadcrumb, i) => {
                      if (i === props.breadCrumbs?.data?.length - 1) {
                        return (
                          <div className="breadcrumbs-item">
                            <a href={breadcrumb.link}>
                              <span
                                style={
                                  props.cssAddDarkGradient
                                    ? { color: "#f4f3f4 " }
                                    : { color: "#4A4A4A" }
                                }
                              >
                                {breadcrumb.title}
                              </span>
                            </a>
                          </div>
                        );
                      }
                      return (
                        <>
                          <div className="breadcrumbs-item">
                            <a href={breadcrumb.link}>
                              <span
                                style={
                                  props.cssAddDarkGradient
                                    ? { color: "#f4f3f4 " }
                                    : { color: "#4A4A4A" }
                                }
                              >
                                {breadcrumb.title}
                              </span>
                            </a>
                          </div>
                          <div
                            className="breadcrumbs-item"
                            style={
                              props.cssAddDarkGradient
                                ? { color: "#f4f3f4 " }
                                : { color: "#4A4A4A" }
                            }
                          >
                            /
                          </div>
                        </>
                      );
                    })}
                </div>
              )}
              <h1
                style={
                  props.cssAddDarkGradient
                    ? { color: "#FFFFFF" }
                    : { color: "#222222" }
                }
              >
                {props.isShow404Banner
                  ? props.carouselSlider.header404
                  : props.header}
              </h1>
              <h2
                style={
                  props.cssAddDarkGradient
                    ? { color: "#FFFFFF" }
                    : { color: "#4A4A4A" }
                }
              >
                {getHTML(
                  props.isShow404Banner
                    ? props.carouselSlider.subHeader404
                    : props.subheader
                )}
              </h2>
              {props.thirdHeader && <h4>{props.thirdHeader}</h4>}
              {props.fourthHeader && <h5>{getHTML(props.fourthHeader)}</h5>}
            </div>
          </div>

          <div
            className="footer-box"
            style={
              props.cssAddDarkGradient
                ? {
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%)",
                    color: "#fff",
                  }
                : {}
            }
          >
            <div className="button-section">
              {props.topGameIconsList ? (
                <TopgameIcons topGameIconsList={props.topGameIconsList} />
              ) : (
                ""
              )}

              {props.smsData.pageName && props.smsData.pageName === "tiktok" ? (
                ""
              ) : (
                <DownloadButtonBanner
                  device={props.device}
                  browser={props.browser}
                  showDownload={props.showDownload}
                  buttonPosition="banner"
                  page={props.page}
                  smsData={props.smsData}
                  langauge={props.config.config.LANG_CODE}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {typeof props.showRewards !== "undefined" ? (
        props.showRewards ? (
          <RewardsBar
            config={props.config}
            rewardsBar={props.rewardsBar}
            device={props.device}
            page={props.page}
          />
        ) : (
          ""
        )
      ) : (
        <RewardsBar
          config={props.config}
          rewardsBar={props.rewardsBar}
          device={props.device}
          page={props.page}
        />
      )}

      {props.smsData.pageName && props.smsData.pageName === "tiktok" ? (
        <SendSMS
          {...props.smsData}
          langauge={props.config.config.LANG_CODE}
          tiktokClass="true"
        />
      ) : (
        ""
      )}
      <style jsx>{`
        @media screen and (min-width: 768px) and (max-width: 1024px) {
          .banner-breadcrumbs-container {
            .breadcrumbs-item {
              font-size: 14px !important;
              a {
                span {
                  font-size: 14px !important;
                }
              }
            }
          }
        }
        .banner-breadcrumbs-container {
          z-index: 1;
          display: flex;
          align-items: center;
          justify-self: flex-start !important;
          margin-bottom: 10px;
          cursor: pointer;
          /* text-transform: capitalize; */

          .breadcrumbs-item {
            font-size: 10px;
            margin-right: 3px !important;
            font-weight: 400;
            text-transform: capitalize;
            a {
              span {
                font-size: 10px;
                font-weight: 400;
                margin-right: 3px !important;
                text-transform: capitalize;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

const BannerImageDesktop = (props) => {
  const [emailSentModal, setEmailSentModal] = useState(false);

  const openEmailSentModal = () => {
    setEmailSentModal(true);
  };

  const closeEmailSentModal = () => {
    setEmailSentModal(false);
  };

  return (
    <section
      className={`banner-large ${props.device} ${props.page} ${
        props.classList ? props.classList.join(" ") : ""
      }`}
    >
      <div
        className={
          "banner-layout" +
          (!props.cssAddDarkGradient ? " banner-dark" : " banner-light")
        }
      >
        {/* <img src={props.imgBackgroundDesktop} alt="banner-image-vpl" /> */}
        {(props.page !== "vpl-stories" ||
          !props.page ||
          (props.page === "vpl-stories" && props.isShow404Banner)) && (
          <picture>
            <source srcSet={props.desktopImageurl.webp} type="image/webp" />
            <source srcSet={props.desktopImageurl.png} type="image/png" />

            <img
              src={props.desktopImageurl.png}
              alt={props.desktopImageurl.alt}
            />
          </picture>
        )}

        <div className="container">
          {props.breadCrumbs?.status && (
            <div className="banner-breadcrumbs-container">
              <div className="breadcrumbs-item">
                <a href="https://www.vpl.live">
                  <span
                    style={
                      props.cssAddDarkGradient
                        ? { color: "#f4f3f4 " }
                        : { color: "#4A4A4A" }
                    }
                  >
                    Home
                  </span>
                </a>
              </div>
              <div
                className="breadcrumbs-item"
                style={
                  props.cssAddDarkGradient
                    ? { color: "#f4f3f4 " }
                    : { color: "#4A4A4A" }
                }
              >
                /
              </div>
              {props.breadCrumbs?.data?.map((breadcrumb, i) => {
                if (i === props.breadCrumbs?.data?.length - 1) {
                  return (
                    <div className="breadcrumbs-item">
                      <a href={breadcrumb.link}>
                        <span
                          style={
                            props.cssAddDarkGradient
                              ? { color: "#f4f3f4 " }
                              : { color: "#4A4A4A" }
                          }
                        >
                          {breadcrumb.title}
                        </span>
                      </a>
                    </div>
                  );
                }
                return (
                  <>
                    <div className="breadcrumbs-item">
                      <a href={breadcrumb.link}>
                        <span
                          style={
                            props.cssAddDarkGradient
                              ? { color: "#f4f3f4 " }
                              : { color: "#4A4A4A" }
                          }
                        >
                          {breadcrumb.title}
                        </span>
                      </a>
                    </div>
                    <div
                      className="breadcrumbs-item"
                      style={
                        props.cssAddDarkGradient
                          ? { color: "#f4f3f4 " }
                          : { color: "#4A4A4A" }
                      }
                    >
                      /
                    </div>
                  </>
                );
              })}
            </div>
          )}
          <div className="section-layout">
            <div className="row banner-row">
              <div className="image-button-wrapper">
                <div className="text-button-wrapper">
                  <div className="header">
                    <h1
                      style={
                        !props.cssAddDarkGradient
                          ? { color: "#222222" }
                          : { color: "#FFFFFF" }
                      }
                    >
                      {props.isShow404Banner
                        ? props.carouselSlider.header404
                        : props.header}
                    </h1>

                    <h2>
                      {getHTML(
                        props.isShow404Banner
                          ? props.carouselSlider.subHeader404
                          : props.subheader
                      )}
                    </h2>
                    {props.thirdHeader && <h4>{props.thirdHeader}</h4>}
                    {props.fourthHeader && (
                      <h5>{getHTML(props.fourthHeader)}</h5>
                    )}
                  </div>
                  <div>
                    {props.carouselSlider &&
                      props.carouselSlider.thirdHeader404 && (
                        <h4 className="not-found-thirdheader">
                          {props.carouselSlider.thirdHeader404}
                        </h4>
                      )}
                    {props.page && props.page.toLowerCase() === "lp/us" ? (
                      <>
                        {/* <SendEmail
                          openEmailSentModal={openEmailSentModal}
                          device={props.device}
                        />

                        <Modal
                          isOpen={emailSentModal}
                          onRequestClose={closeEmailSentModal}
                          contentLabel="Sent Email Success Modal"
                          ariaHideApp={false}
                          style={{
                            overlay: {
                              background: "rgba(0, 0, 0, 0.5)",
                              zIndex: 10000,
                            },
                            modal: {},
                            content: {
                              padding: "32px",
                              top: "54%",
                              left: "50%",
                              right: "auto",
                              bottom: "auto",
                              marginRight: "-50%",
                              transform: "translate(-50%, -50%)",
                              width: "25%",
                            },
                          }}
                        >
                          <EmailSent
                            closeEmailSentModal={closeEmailSentModal}
                            device={props.device}
                          />
                        </Modal> */}
                      </>
                    ) : typeof props.showSMS !== "undefined" ? (
                      props.showSMS ? (
                        <SendSMS
                          {...props.smsData}
                          langauge={props.config.config.LANG_CODE}
                          page={props.page}
                        />
                      ) : (
                        ""
                      )
                    ) : (
                      <SendSMS
                        {...props.smsData}
                        langauge={props.config.config.LANG_CODE}
                        page={props.page}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
        }
        .banner-breadcrumbs-container {
          z-index: 1;
          display: flex;
          justify-self: flex-start !important;
          padding-left: 24px;
          cursor: pointer;
          /* text-transform: capitalize; */

          .breadcrumbs-item {
            font-size: 16px !important;
            font-weight: 400;
            margin-right: 5px !important;
            text-transform: capitalize;
            a {
              span {
                font-size: 16px !important;
                font-weight: 400;
                margin-right: 5px !important;
                text-transform: capitalize;
              }
            }
          }
        }
      `}</style>
    </section>
  );
};
class BannerImage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { osType } = this.props;
    const bannerProps = { ...this.props };
    if (osType === undefined) return "";

    return (
      <div>
        {osType === "desktop" ? (
          <BannerImageDesktop {...bannerProps} />
        ) : (
          <BannerImageMobile {...bannerProps} />
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
                position: relative;
                .header {
                  padding: 16px 24px;
                  text-transform: none;
                  position: absolute;
                  z-index: 2;
                  top: 0;
                  left: 0;
                  right: 0;
                  h1 {
                    font-weight: bold;
                    font-size: 20px;
                    line-height: 24px;
                    text-align: center;
                    align-self: center;
                    margin-top: 0;
                    margin-bottom: 12px;
                  }
                  > h2 {
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
                position: relative;

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
              &.refer-and-earn {
                .banner-landing--img {
                  object-fit: contain;
                }
                .img-header-footer-wrapper .header-box .header {
                  padding: 100px 24px 16px 24px !important;
                }
                .img-header-footer-wrapper .header-box .header h2 {
                  margin-bottom: 8px;
                }
                .img-header-footer-wrapper .header-box .header > h3 {
                  color: rgba(0, 0, 0, 0.5) !important;
                }
              }
            }

            .banner-landing--img {
              pointer-events: none;
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 0;
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

              h1 {
                font-size: 40px;
              }
              h2 {
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
                  h1,
                  h2 {
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

            .not-found-thirdheader {
              margin-bottom: -41px;
            }

            .banner-large.ipl-page {
              .banner-row h3 {
                color: #fafafa !important;
                opacity: 1 !important;
              }
              #sms-form #sms-msg {
                color: rgba(255, 255, 255, 0.8) !important;
              }
              #sms-form .inp-txt1.white-20 {
                background: rgba(255, 255, 255, 0.2) !important;
                label {
                  border: none;
                }
                .inp-box {
                  background: none;
                  border: none;
                  border-left: solid 1px #ffffff;
                  color: #fff;
                }
              }
            }

            .banner-large.refer-and-earn {
              .banner-layout {
              }
              .banner-layout img {
                object-fit: contain;
              }
              .banner-row {
                align-items: center;
                justify-content: end;
                h3 {
                  font-size: 24px;
                  margin: 0 0 117px 0;
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
