import React, { Component, useState, useEffect } from "react";
import IconTextButton from "./IconTextButton";
import SendSMSIPL from "../../components/ipl2021/SendSMSIPL";
import { getHTML } from "../../configs/util";
import { isEmptyObject } from "../../config/validation";

const BannerImageMobile = (props) => {
  const imageUrl = !props.mobileImageurl
    ? {
        mobileImageurl: {
          webp: "/static/banners/banner_mobile_ipl.webp",
          png: "/static/banners/banner_mobile_ipl.png",
          width: 720,
          height: 800,
          sizeInBytes: 200000,
        },
      }
    : props.mobileImageurl;
  return (
    <>
      <div
        className={`banner mobile-banner ${
          props.cssClasses ? props.cssClasses : ""
        } `}
        style={props.styles}
      >
        {props.breadCrumbs?.status && (
          <div className="banner-breadcrumbs-container">
            <div className="breadcrumbs-item">
              <a href="https://www.vpl.live">
                <span
                  style={
                    props.breadCrumbs.mobile === "white"
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
                props.breadCrumbs.mobile === "white"
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
                            props.breadCrumbs.mobile === "white"
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
                            props.breadCrumbs.mobile === "white"
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
                        props.breadCrumbs.mobile === "white"
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
        <picture>
          <source srcSet={imageUrl.webp} type="image/webp" />
          <source srcSet={imageUrl.png} type="image/png" />
          <img
            className="banner--image"
            src={imageUrl.png}
            alt="vpl US banner"
          />
        </picture>
        <div className="banner--text">
          {!isEmptyObject(props.vplLogoImageurl) && (
            <img src={props.vplLogoImageurl.png} className="mb-26 vpl-logo" />
          )}
          <div className="banner-text-container">
            {props.contentTextMobile &&
              props.contentTextMobile.map((data, key) =>
                componentLookUpText(data, key)
              )}
            {props.contentImageMobile &&
              props.contentImageMobile.map((data, key) =>
                componentLookUpImage(data, key)
              )}
          </div>
        </div>
        {!isEmptyObject(props.iconImageButton) &&
          !isEmptyObject(props.linkImageIOSButton) && (
            <IconTextButton
              {...{
                iconImageButton: { ...props.iconImageButton },
                linkImageIOSButton: { ...props.linkImageIOSButton },
                osType: props.device,
              }}
            />
          )}
      </div>
      <div
        className={`trust-text ${props.cssClasses ? props.cssClasses : ""} `}
        style={{
          display:
            props.cssClasses.indexOf("banner-variant-2") > -1 ||
            props.cssClasses.indexOf("banner-variant-30") > -1
              ? "block"
              : "none",
        }}
      >
        TRUSTED BY 6 CRORE+ USERS
      </div>
      <div
        className="banner-variant-1-footer-image"
        style={{
          display:
            props.cssClasses.indexOf("banner-variant-1") > -1
              ? "block"
              : "none",
        }}
      >
        <img src="/static/banners/banneer-variant-1.png" />
      </div>
      <style jsx>
        {`
          .banner-small {
            height: 345px !important;
          }
          .banner {
            margin-top: 56px;
            background-repeat: no-repeat;
            background-size: cover;
            display: block;
            height: 424px;
            // height: 370px;
            background-position: center;
            position: relative;
            padding: 24px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
          }
          .banner--text {
            z-index: 1;
            text-align: left;
          }

          .full-width-banner-header {
            .banner--text {
              width: 100%;
            }
          }

          .center-header {
            .banner--text {
              text-align: center;
              img {
                margin-bottom: 10px;
              }
            }
          }

          .vpl-logo {
            width: 64px;
            height: 24px;
          }
          .main-header {
          }

          .second-header {
          }

          .third-header {
          }

          .banner--image {
            pointer-events: none;
            position: absolute;
            height: 100%;
            z-index: 0;
            display: block;
            right: 0;
            width: 100%;
            left: 50%;
            top: 50%;
            object-fit: cover;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
          }
          .vpl-vip-banner {
            // height: 232px;
            .banner--image {
              height: auto;
              max-width: 100%;
              // width: 184px;
              // height: 193px;
              bottom: 0;
              transform: none;
              top: auto;
              left: auto;
            }
            .banner-text-container {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            }
          }

          .banner.banner-variant-3,
          .banner.banner-variant-2 {
            // height: 467px;
          }

          .banner.banner-variant-10,
          .banner.banner-variant-3 {
            height: 400px;
          }

          .banner-variant-1-footer-image img {
            max-width: 100%;
          }
          @media screen and (min-width: 350px) {
            .banner.banner-variant-10 {
              height: 540px;
            }
            .banner.banner-variant-3 {
              height: 400px;
            }
          }

          @media screen and (min-width: 400px) {
            .banner.banner-variant-10 {
              height: 550px;
            }
            .banner.banner-variant-3 {
              height: 450px;
            }
          }

          @media screen and (min-width: 450px) {
            .banner.banner-variant-3 {
              height: 500px;
            }
          }

          @media screen and (min-width: 500px) {
            .banner {
              height: 469px;
            }

            .banner.banner-variant-10 {
              height: 660px;
            }
            .banner.banner-variant-3 {
              height: 550px;
            }
          }

          @media screen and (min-width: 550px) {
            .banner.banner-variant-3 {
              height: 600px;
            }
          }

          @media screen and (min-width: 600px) {
            .banner.banner-variant-10 {
              height: 800px;
            }

            .banner.banner-variant-3 {
              height: 700px;
            }
          }

          .trust-text {
            color: #33ff66;
            background: #230046;
            font-size: 24px;
            font-family: Trim-BoldItalic;
            text-align: center;
            height: 50px;
            line-height: 50px;
            margin-bottom: 1px;
          }
          @media screen and (min-width: 700px) {
            .banner {
              height: 700px;
              overflow: hidden;
            }
          }
          @media screen and (min-width: 768px) and (max-width: 1024px) {
            .banner-breadcrumbs-container {
              .breadcrumbs-item {
                font-size: 14px !important;
                a {
                  font-size: 14px !important;
                }
              }
            }
          }
          .banner-breadcrumbs-container {
            z-index: 1;
            display: flex;
            justify-self: flex-start !important;
            margin-bottom: 10px;
            .breadcrumbs-item {
              cursor: pointer;
              margin-right: 2px !important;
              font-size: 10px;
              font-weight: 400;
              text-transform: capitalize;
              a {
                font-size: 10px;
                font-weight: 400;
                text-transform: capitalize;
              }
            }
          }
        `}
      </style>
    </>
  );
};

const Text = (props) => (
  <>
    {props.text.trim() && (
      <props.type
        className={`${props.cssClasses ? props.cssClasses : ""} `}
        style={props.styles}
      >
        {props.image && getHTML(props.image)}
        {getHTML(props.text)}
      </props.type>
    )}
    <style jsx global>
      {`
        .text_medium {
          font-size: 48px !important;
          margin-bottom: 0px !important;
        }
        .white-header {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          text-align: right;
          color: #ffffff;
          margin: 0 0 4px 0;
        }
        .grey-header--medium {
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 22px;
          text-transform: uppercase;
          color: #230046;
        }
        .dark-header {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          text-align: right;
          color: #230046;
          margin: 0 0 4px 0;
        }

        .sky-blue-header {
          font-weight: bold;
          font-size: 28px;
          line-height: 28px;
          text-align: right;
          text-transform: capitalize;
          color: #00e0ff;
          margin: 0 0 4px 0;
        }
        .yellow-header {
          color: #fff200;
          font-weight: bold;
        }

        .grey-header,
        grey-header--main {
          font-style: normal;
          font-weight: 600;
          font-size: 32px;
          line-height: 32px;
          text-transform: uppercase;
          color: #230046;
        }
        .red-header {
          font-style: normal;
          font-weight: 600;
          text-transform: uppercase;
          color: #ff1e46;
          font-weight: 600;
          font-size: 24px;
          line-height: 29px;
        }
        .banner-red-header {
          font-weight: 700;
          font-size: 48px;
          line-height: 48px;
          color: #ff1e46;
          text-transform: uppercase;
        }
        .light-grey-header {
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 20px;
          color: #230046;
          margin-top: 16px;
        }

        .desktop-header {
          font-size: 56px;
          line-height: 70px;
          font-weight: bold;
          text-align: left;
        }

        .desktop-sub-header {
          font-weight: normal;
          color: rgba(255, 255, 255, 0.6);
          font-size: 24px;
          line-height: 40px;
          text-transform: capitalize;
          margin: 40px 0 48px 0;
        }

        .order-1 {
          order: 1;
        }
        .order-2 {
          order: 2;
        }
        .order-3 {
          order: 3;
        }

        .vpl-vip-banner {
          .white-header {
            font-size: 24px;
            line-height: 28px;
          }
          .dark-header {
            font-size: 24px;
            line-height: 28px;
          }
          .light-small {
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            color: #ffffff;
            text-align: left;
          }
        }

        .image-header-mobile {
          margin-bottom: 7px;
          margin-top: 20px;
          img {
            width: 188px;
            height: 60px;
          }
        }

        .fantasy-cricket-banner {
          .grey-header {
            text-align: center;
            font-size: 24px;
            line-height: 29px;
            margin-bottom: 4px;
            margin-top: 0;
          }
          .light-grey-header {
            text-align: center;
            margin: 0;
          }
          .white-header {
            font-weight: 600;
            font-size: 32px;
            line-height: 36px;
            color: #ffffff;
            text-align: center;
          }
          .dark-header {
            font-weight: 600;
            font-size: 32px;
            line-height: 36px;
            color: #230046;
            text-align: center;
          }
          .white-sub-header {
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            color: #ffffff;
            text-align: center;
          }
        }
        .flex-header {
          display: flex !important;
          align-items: center;
          justify-content: center;
        }

        .subheader-red-background .banner-red-header {
          background: #ff1e46;
          border-radius: 2px;
          font-size: 26px;
          line-height: 30px;
          color: #ffffff;
          display: inline-block;
          padding: 0px 4px;
          margin-top: 2px;
        }

        @media screen and (min-width: 700px) {
          .grey-header {
            font-size: 40px !important;
            line-height: 45px !important;
          }
          .banner-red-header {
            font-size: 48px !important;
            line-height: 58px !important;
          }
          .grey-header--main {
            font-size: 40px;
            line-height: 45px;
          }
          .light-grey-header {
            font-size: 30px;
            line-height: 30px;
          }
          .fantasy-cricket-banner {
            .white-header {
              font-weight: 600;
              font-size: 36px;
              line-height: 45px;
              color: #ffffff;
              text-align: center;
            }
            .dark-header {
              font-weight: 600;
              font-size: 36px;
              line-height: 45px;
              color: #230046;
              text-align: center;
            }
            .white-sub-header {
              font-size: 20px;
              line-height: 20px;
              text-align: center;
              color: #ffffff;
              text-align: center;
            }
          }
        }
        @media screen and (min-width: 1224px) {
          .grey-header--main {
            font-size: 56px;
            line-height: 70px;
            color: #230046;
            margin: 0;
          }
          .vpl-vip-banner {
            .white-header {
              font-size: 36px;
              line-height: 36px;
            }
            .dark-header {
              font-size: 36px;
              line-height: 36px;
            }
            .light-small {
              font-size: 24px;
              line-height: 20px;
              margin: 0 0 80px 0;
            }

            .image-header-desktop {
              margin: 0 0 40px 0;
            }
          }
          .light-grey-header {
            font-size: 24px;
            line-height: 40px;
          }

          .red-header {
            font-weight: bold;
            text-transform: uppercase;
            color: #ff1e46;
            font-size: 56px;
            line-height: 70px;
          }

          .fantasy-cricket-banner {
            .grey-header {
              text-align: left;
              font-weight: bold;
              font-size: 56px;
              line-height: 70px;
            }
            .white-sub-header {
              font-size: 24px;
              line-height: 36px;
            }

            .white-header {
              font-size: 56px;
              line-height: 70px;
              text-align: left;
              text-transform: uppercase;
            }
            .dark-header {
              font-size: 56px;
              line-height: 70px;
              text-align: left;
              text-transform: uppercase;
            }

            .fantasy-cricket-header-margin {
              margin-bottom: 40px;
            }

            .fantasy-cricket-header-margin {
              margin-bottom: 40px;
            }

            .fantasy-cricket-sub-header-margin {
              margin-bottom: 40px;
            }

            .light-grey-header {
              margin: 40px 0 48px 0;
            }
          }
        }
      `}
    </style>
  </>
);

const Button = (props) => (
  <>
    {props.text.trim() && (
      <a
        className={`${props.cssClasses ? props.cssClasses : ""} `}
        style={props.styles}
        href={props.href}
      >
        {props.text}
      </a>
    )}
    <style jsx>
      {`
        .green-background {
          background: #33ff66;
          border-radius: 2px;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          text-transform: uppercase;
          color: #230046;
          margin-top: 24px;
          padding: 4px 12px;
        }
      `}
    </style>
  </>
);

const Image = (props) => (
  <>
    {!isEmptyObject(props.backgroundImageUrl) && (
      <div className={`${props.cssClasses} `}>
        <img src={props.backgroundImageUrl.png} />
      </div>
    )}
    <style jsx>
      {`
        .vpl-vip img {
          width: 181.4px;
          height: 58px;
        }
      `}
    </style>
  </>
);

export const factoryComponetsText = {
  text: Text,
};

const componentLookUpText = (data, key) => {
  const Component = factoryComponetsText[data.name.toLowerCase()];
  if (!Component) return <></>;
  return <Component {...data.data} key={key} />;
};

export const factoryComponentsImage = {
  Image,
};

const componentLookUpImage = (data, key) => {
  const Component = factoryComponentsImage[data.name];
  if (!Component) return <></>;
  return <Component {...data.data} key={key} />;
};

const BannerImageDesktop = (props) => {
  const imageUrl = !props.desktopImageurl
    ? {
        desktopImageurl: {
          webp: "/static/banners/banner_desktop_ipl.webp",
          png: "/static/banners/banner_desktop_ipl.png",
          width: 1920,
          height: 712,
          sizeInBytes: 300000,
        },
      }
    : props.desktopImageurl;
  return (
    <>
      <div
        className={`banner ${props.cssClasses ? props.cssClasses : ""} `}
        style={props.styles}
      >
        {props.breadCrumbs?.status && (
          <div className="banner-breadcrumbs-container">
            <div className="breadcrumbs-item">
              <a href="https://www.vpl.live">
                <span
                  style={
                    props.breadCrumbs.desktop === "white"
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
                props.breadCrumbs.desktop === "white"
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
                            props.breadCrumbs.desktop === "white"
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
                            props.breadCrumbs.desktop === "white"
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
                        props.breadCrumbs.desktop === "white"
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
        <picture>
          <source srcSet={imageUrl.webp} type="image/webp" />
          <source srcSet={imageUrl.png} type="image/png" />
          <img
            className="banner--image"
            src={imageUrl.png}
            alt="vpl US banner"
          />
        </picture>

        <div className="banner--text">
          <div className="banner-text-container">
            {/* {props.desktopHeader.map((data, key) =>
              componentLookUpText(data, key)
            )}
            {props.desktopSubHeader.map((data, key) =>
              componentLookUpText(data, key)
            )} */}

            {props.contentTextDesktop &&
              props.contentTextDesktop.map((data, key) =>
                componentLookUpText(data, key)
              )}
            {props.contentImageDesktop &&
              props.contentImageDesktop.map((data, key) =>
                componentLookUpImage(data, key)
              )}
          </div>
        </div>

        <div className="banner-sms-container">
          {!isEmptyObject(props.smsData) && (
            <SendSMSIPL
              {...props.smsData}
              langauge={props.config.config.LANG_CODE}
              tiktokClass="true"
            />
          )}
          {props.page == "poker" && (
            <a href="https://poker.vpl.live/login" className="red-background">
              Login
            </a>
          )}
        </div>
      </div>
      <style jsx global>
        {`
          .banner--image {
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            object-fit: cover;
          }
          .banner-small {
            height: 366px !important;
          }

          .banner-container {
            height: 712px;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            overflow: hidden;
            position: relative;
            width: 100%;
            flex-direction: column;
            margin-top: 72px;
            justify-content: center;
            align-items: flex-start;
            div#sms-form {
              div.inp-txt1 {
                // background-color: transparent;
                margin-right: 16px;
                > #mobile.inp-box {
                  // background-color: transparent;
                }
              }
            }
          }

          .banner--text {
            z-index: 2;
            width: 100%;
            display: flex;
            padding-left: 117px;
            justify-self: center;
          }

          .banner-sms-container {
            z-index: 2;
            padding-left: 117px;
            justify-self: center;

            #sms-form form {
              display: flex;
              justify-content: flex-start;
              align-items: center;
            }

            #sms-but.download-but {
              margin-top: 0;
            }
          }

          .banner-text-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-self: center !important;
            max-width: 50%;
          }

          .order-1 {
            order: 1;
          }
          .order-2 {
            order: 2;
          }
          .order-3 {
            order: 3;
          }
          .banner-breadcrumbs-container {
            z-index: 1;
            display: flex;
            justify-self: flex-start !important;
            position: absolute;
            top: 30px;
            padding-left: 117px;
            .breadcrumbs-item {
              cursor: pointer;
              margin-right: 5px !important;

              font-size: 16px;
              font-weight: 400;
              text-transform: capitalize;
              a {
                font-size: 16px;
                font-weight: 400;
                text-transform: capitalize;
              }
            }
          }
          .red-background {
            width: 350px;
            display: inline-block;
            text-align: center;
            font-weight: 400;
            border-radius: 4px;
            color: rgb(255, 255, 255);
            background: rgb(233, 16, 81);
            padding: 12px 32px;
            font-size: 18px;
          }
        `}
      </style>
    </>
  );
};

class BannerImageIPL extends Component {
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
            .banner-variant-3 {
              .download-btn-android.download-btn-android--banner {
                bottom: 26px;
              }
            }

            .banner-variant-10 {
              .download-btn-android.download-btn-android--banner {
                bottom: 97px;
              }
            }

            .banner-container.mobile-banner.banner-variant-1 .banner-red-header,
            .banner-container.mobile-banner.banner-variant-3
              .banner-red-header {
              display: none;
            }

            @media screen and (min-width: 400px) {
              .banner-variant-2 {
                .download-btn-android.download-btn-android--banner {
                  bottom: 2px;
                }
              }

              .banner-variant-10 {
                .download-btn-android.download-btn-android--banner {
                  bottom: 94px;
                }
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default BannerImageIPL;
