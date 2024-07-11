import React, { Component } from "react";
import "../../styles/trim_global.scss";
import { isEmptyObject } from "../../config/validation";
import { getHTMLParagraph } from "../../configs/util";

export const Text = (props) => (
  <>
    {props.text.trim() && (
      <div
        className={`${props.cssClasses ? props.cssClasses : ""} `}
        style={props.styles}
      >
        {getHTMLParagraph(props.text)}
      </div>
    )}
    <style jsx global>
      {`
        .grey--header--sub {
          font-weight: bold;
          font-size: 20px;
          line-height: 28px;
          color: #190a28;
        }
        .white-header {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          text-align: right;
          color: #ffffff;
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
          font-size: 28px;
          line-height: 28px;
          margin: 0 0 4px 0;
        }

        .grey-body-header {
          font-weight: 600;
          font-size: 20px;
          line-height: 24px;
          text-transform: uppercase;
          color: #230046;
        }

        .red-body-header {
          font-weight: 600;
          font-size: 20px;
          line-height: 24px;
          text-transform: uppercase;
          color: #ff1e46;
        }
        .white__body--header {
          font-weight: bold;
          font-size: 28px;
          line-height: 32px;
          color: #ffffff;
        }

        @media screen and (min-width: 320px) {
          .img__wrapper .vpl__sports_logo {
            width: 114px;
            height: 43px;
          }
          .white__body--header {
            font-size: 18px;
            line-height: 22px;
          }
        }

        @media screen and (min-width: 411px) {
          .white__body--header {
            font-size: 20px;
            line-height: 24px;
          }
        }

        @media screen and (min-width: 1224px) {
          .white-header {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #ffffff;
          }

          .sky-blue-header {
            font-size: 40px;
            line-height: 44px;
            text-transform: capitalize;
            color: #00e0ff;
          }

          .yellow-header {
            font-weight: bold;
            font-size: 48px;
            line-height: 52px;
          }
          .grey-body-header {
            font-size: 48px;
            line-height: 52px;
          }

          .red-body-header {
            font-weight: 600;
            font-size: 48px;
            line-height: 52px;
          }
          .white__body--header {
            font-size: 48px;
            line-height: 50px;
          }
        }
      `}
    </style>
  </>
);

export const Button = (props) => (
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
          font-size: 12px;
          line-height: 18px;
          text-transform: uppercase;
          color: #230046;
          margin-top: 18px;
          padding: 4px 12px;
        }
        .vpl-sports-button {
          background: #33ff66;
          border-radius: 2px;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 20px;
          text-transform: uppercase;
          color: #33ff66;
          margin-top: 24px;
          padding: 4px 12px;
          background: #230046;
          border-radius: 2px;
          z-index: 2;
        }

        @media screen and (min-width: 1224px) {
          .green-background {
            font-weight: 500;
            font-size: 23px;
            line-height: 33px;
            color: #230046;
            padding: 12px 27px;
          }
          .vpl-sports-button {
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            color: #33ff66;
            background: #230046;
            padding: 12px 32px;
          }
        }
      `}
    </style>
  </>
);

const Image = (props) => (
  <>
    <div className="image-container">
      <div className={`image-left ${props.device}`}>
        {!isEmptyObject(props.backgroundDesktopImageUrl) &&
        props.device === "desktop" ? (
          <picture>
            <source
              srcSet={props.backgroundDesktopImageUrl.webp}
              type="image/webp"
            />
            <source
              srcSet={props.backgroundDesktopImageUrl.png}
              type="image/png"
            />
            <img
              className=""
              src={props.backgroundDesktopImageUrl.png}
              alt="vpl Sports banner"
            />
          </picture>
        ) : (
          !isEmptyObject(props.backgroundImageUrl) && (
            <picture>
              <source
                srcSet={props.backgroundImageUrl.webp}
                type="image/webp"
              />
              <source srcSet={props.backgroundImageUrl.png} type="image/png" />
              <img
                className=""
                src={props.backgroundImageUrl.png}
                alt="vpl Sports banner"
              />
            </picture>
          )
        )}
      </div>
    </div>

    <style jsx>
      {`
        .image-container {
          display: flex;
          position: relative;
          align-items: flex-end;
          .image-left {
            position: relative;
          }
          img {
            border-radius: 12px;
            max-width: none;
          }

          .image-left.desktop {
            img {
              height: 353px;
            }
          }
        }
      `}
    </style>
  </>
);

export const vplSportsVIP = (props) => {
  return (
    <>
      <section
        className={`${props.cssClasses}  ${props.device}`}
        style={props.styles}
      >
        <>
          {props.contentImage &&
            props.contentImage.map((data, key) =>
              componentLookUpImage(data, props.device, key)
            )}
        </>
        <div className="text-container">
          {props.contentText &&
            props.contentText.map((data, key) =>
              componentLookUpText(data, props.device, key)
            )}
        </div>
      </section>
      <style jsx global>
        {`
          .vpl-vip {
            background: #680485;
            border-radius: 12px;
            height: 230px;
            position: relative;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            margin: 72px 12px;
            .text-container {
              align-items: flex-start;
              padding-left: 24px;
              align-items: flex-start;
            }
            .white-header {
              text-align: left;
            }
          }

          .text-container {
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding-right: 24px;
            align-items: flex-end;
          }

          .vpl-brain-storm {
            .text-container {
              align-items: flex-start;
            }
          }

          @media screen and (min-width: 1224px) {
            .vpl-sports {
              width: 824px;
              height: 360px;
              margin: auto;
              margin: 0 auto 160px auto;
            }

            .vpl-vip {
              width: 800px;
              height: 360px;
              margin: auto;
              margin: 0 auto 160px auto;
            }
          }
        `}
      </style>
    </>
  );
};
const ImageComp = (props) => (
  <div className="img__wrapper">
    <img
      src={props.imgUrl ? props.imgUrl.png : props.Imageurl?.png}
      alt={props.imgUrl ? props.imgUrl.alt : props.Imageurl?.alt}
      className={props.cssClasses}
    />
    <style jsx>{`
      .vpl__sports_logo {
        width: 173px;
        height: 66px;
        position: relative;
        border-radius: unset;
      }
      .img__wrapper {
        position: relative;
      }
      @media screen and (min-width: 320px) {
        .img__wrapper .vpl__sports_logo {
          width: 104px;
          height: 40px;
          margin-bottom: 9px;
        }
      }
      @media screen and (min-width: 411px) {
        .img__wrapper .vpl__sports_logo {
          width: 104px;
          height: 40px;
          margin-bottom: 10px;
        }
      }
      @media screen and (min-width: 1224px) {
        .img__wrapper .vpl__sports_logo {
          width: 173px;
          height: 68px;
          margin-bottom: 12px;
        }
      }
    `}</style>
  </div>
);
export const factoryComponetsImage = {
  image: Image,
};

export const factoryComponetsText = {
  text: Text,
  button: Button,
  imagecomp: ImageComp,
};

const componentLookUpImage = (data, device, key) => {
  const Component = factoryComponetsImage[data.name.toLowerCase()];
  if (!Component) return <></>;
  return <Component {...data.data} key={key} device={device} />;
};

export const componentLookUpText = (data, device, key) => {
  const Component = factoryComponetsText[data.name.toLowerCase()];
  if (!Component) return <></>;
  return <Component {...data.data} key={key} device={device} />;
};

export default vplSportsVIP;
