import React, { useState, useEffect } from "react";
import { lazyImage } from "../configs/util";
import { getHTML } from "../configs/util";
import { ListPoints } from "./ListPoints";

const Blinds = ({ blinds }) => {
  const [show, toggleShow] = useState(false);
  useEffect(() => {
    lazyImage();
  }, [show]);

  return (
    <div className="box">
      <div className="showBarItem" onClick={() => toggleShow(!show)}>
        <div className="wrapperImgHeader">
          <h3 className="fantasy-games-header">{blinds.heading}</h3>
        </div>
        {!show ? <div className="down"></div> : <div className="up"></div>}
      </div>
      {show ? (
        <div>
          {blinds.content.map((text, key) => (
            <p key={key}>{getHTML(text)}</p>
          ))}
          <img
            data-src={blinds.imageurl.png}
            alt="vpl poker blinds image"
            className="lazy-image"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          />
        </div>
      ) : (
        ""
      )}
      <style jsx>{`
        .showBarItem {
          justify-content: space-between;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .wrapperImgHeader {
          display: flex;
          align-items: center;
        }
        .fantasy-games-header {
          margin: 0;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #222222;
          text-align: left;
          padding: 0;
        }
        .up {
          width: 0;
          height: 0;
          border-bottom: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: none;
          cursor: pointer;
        }
        .down {
          width: 0;
          height: 0;
          border-top: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: none;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: auto;
        }
        p {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #828282;
          text-align: left;
          margin: 12px 0;
        }
        .box {
          background: #ffffff;
          border-radius: 4px;
          margin-top: 12px;
          padding: 12px;
          box-sizing: border-box;
        }
        @media screen and (min-width: 768px) {
          img {
            width: 312px;
            height: 112px;
            margin-top: 12px;
            display: flex;
            align-items: left;
          }

          .box {
            border: 1px solid #e6e6e6;
            border-radius: 8px;
            padding: 12px;
          }

          .fantasy-games-header {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            margin: 4px 0px;
            color: #4a4a4a;
          }

          p {
            font-size: 16px;
            line-height: 22px;
            margin: 24px 0;
          }
        }

        @media screen and (min-width: 1244px) {
          .fantasy-games-header {
            font-size: 20px;
            line-height: 28px;
          }

          img {
            width: 792px;
            height: auto;
          }

          .box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

const PreFlop = ({ preFlop }) => {
  const [show, toggleShow] = useState(false);
  useEffect(() => {
    lazyImage();
  }, [show]);
  return (
    <div className="box">
      <div className="showBarItem" onClick={() => toggleShow(!show)}>
        <div className="wrapperImgHeader">
          <h3 className="fantasy-games-header">{preFlop.heading}</h3>
        </div>
        {!show ? <div className="down"></div> : <div className="up"></div>}
      </div>
      {show ? (
        <div>
          {preFlop.content.map((para, key) => (
            <p>{getHTML(para)}</p>
          ))}

          <img
            data-src={preFlop.imageurl.png}
            className="lazy-image"
            alt="vpl poker blinds image"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          ></img>
        </div>
      ) : (
        ""
      )}
      <style jsx>{`
        .showBarItem {
          justify-content: space-between;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .wrapperImgHeader {
          display: flex;
          align-items: center;
        }
        .fantasy-games-header {
          margin: 0;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #222222;
          text-align: left;
          padding: 0;
        }
        .up {
          width: 0;
          height: 0;
          border-bottom: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: none;
          cursor: pointer;
        }
        .down {
          width: 0;
          height: 0;
          border-top: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: none;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 112px;
        }
        p {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #828282;
          text-align: left;
          margin: 12px 0;
        }
        .box {
          background: #ffffff;
          border-radius: 4px;
          margin-top: 12px;
          padding: 12px;
        }
        @media screen and (min-width: 768px) {
          .fantasy-games-header {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            margin: 4px 0px;
            color: #4a4a4a;
          }
          img {
            width: 312px;
            height: 112px;
            margin-top: 12px;
            display: flex;
            align-items: left;
          }
          .box {
            border: 1px solid #e6e6e6;
            border-radius: 8px;
            padding: 12px;
          }
        }

        @media screen and (min-width: 1244px) {
          .fantasy-games-header {
            font-size: 20px;
            line-height: 28px;
          }
          p {
            font-size: 16px;
            line-height: 22px;
            margin: 24px 0;
          }
          img {
            width: 792px;
            height: auto;
          }

          .box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

const RiverTurnFlop = ({ data }) => {
  const [show, toggleShow] = useState(false);

  useEffect(() => {
    lazyImage();
  }, [show]);

  return (
    <div className="box">
      <div className="showBarItem" onClick={() => toggleShow(!show)}>
        <div className="wrapperImgHeader">
          <h3 className="fantasy-games-header">{data.heading}</h3>
        </div>
        {!show ? <div className="down"></div> : <div className="up"></div>}
      </div>
      {show ? (
        <div>
          {data.content.map((text, key) => (
            <p key={key}>{text}</p>
          ))}
          <img
            data-src={data.imageurl.png}
            alt="vpl poker image"
            className="lazy-image"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          ></img>
        </div>
      ) : (
        ""
      )}
      <style jsx>{`
        .showBarItem {
          justify-content: space-between;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        .wrapperImgHeader {
          display: flex;
          align-items: center;
        }
        .fantasy-games-header {
          margin: 0;
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #222222;
          text-align: left;
          padding: 0;
        }
        .up {
          width: 0;
          height: 0;
          border-bottom: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: none;
          cursor: pointer;
        }
        .down {
          width: 0;
          height: 0;
          border-top: 5px solid #4a4a4a;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: none;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 112px;
        }
        p {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: #828282;
          text-align: left;
          margin: 12px 0;
        }
        .box {
          background: #ffffff;
          border-radius: 4px;
          margin-top: 12px;
          padding: 12px;
        }

        @media screen and (min-width: 768px) {
          .fantasy-games-header {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            margin: 4px 0px;
            color: #4a4a4a;
          }
          img {
            width: 312px;
            height: 112px;
            margin-top: 12px;
            display: flex;
            align-items: left;
          }
          .box {
            border: 1px solid #e6e6e6;
            border-radius: 8px;
            padding: 12px;
          }
        }

        @media screen and (min-width: 1244px) {
          .fantasy-games-header {
            font-size: 20px;
            line-height: 28px;
          }
          p {
            font-size: 16px;
            line-height: 22px;
            margin: 24px 0;
          }
          img {
            width: 792px;
            height: auto;
          }

          .box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export const HowToPlayPoker = (props) => (
  <section className="how-to-play-background">
    <div className="container">
      <div className="section-layout">
        <div className="row how-to-play-row">
          <div className="how-to-play-layout">
            <h1 className="section-header section-header--large">
              {props.header}
            </h1>
            <Blinds blinds={props.blinds} />
            <PreFlop preFlop={props.preFlop} />
            <RiverTurnFlop data={props.flop} />
            <RiverTurnFlop data={props.turn} />
            <RiverTurnFlop data={props.river} />
            <Blinds blinds={props.showdown} />
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .how-to-play-background {
        background: #f0f0f0;
      }
      .how-to-play-row {
        flex-direction: column;
      }

      @media screen and (min-width: 768px) {
        .how-to-play-background {
          background: #fff;
        }
      }

      @media screen and (min-width: 1244px) {
        .how-to-play-layout {
          width: 830px;
          margin: auto;
        }
      }
    `}</style>
  </section>
);

export const HandRanks = (props) => (
  <section
    className={`hold-rank-section ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    }`}
  >
    <div className="container">
      <div className="section-layout">
        <div className="row">
          <h2 className="section-header section-header--large">
            {props.header}
          </h2>
          {props.iconImage.png && (
            <div className="hold-rank-icon">
              <img
                className="icon"
                src={props.iconImage.png}
                alt="vpl poker image"
              ></img>
              <p>{props.iconText} </p>
            </div>
          )}

          {props.pokerHeading && (
            <h3 className="poker-header">{props.pokerHeading}</h3>
          )}
          <p>{props.handRankOrderText}</p>
          {props.contentList
            ? props.contentList.map((data, key) => (
                <div key={key} className="hold-rank-tile">
                  <h3>{data.heading}</h3>
                  {data.info.map((para, key) => (
                    <p key={key}>{para}</p>
                  ))}
                  <img
                    data-src={data.imageurl.png}
                    alt="vpl poker image"
                    className="lazy-image"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                  ></img>
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
    <style jsx>{`
      .hold-rank-section {
        background: #ffffff;
        &.rules-of-rummy {
          .hold-rank-tile {
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            img {
              margin-bottom: 36px;
            }
          }
        }
        .row {
          text-align: left;
          flex-direction: column;
        }
        .icon {
          width: 20px;
          height: 20px;
          margin: 0 12px 12px 0;
        }
        .hold-rank-icon {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }

        img {
          width: 100%;
          height: auto;
        }
        h2 {
          font-size: 14px;
          line-height: 18px;
          margin-bottom: 24px;
        }
        .poker-header {
          text-transform: capitalize;
        }
        h3 {
          font-size: 12px;
          line-height: 16px;
          text-transform: uppercase;
          color: #4a4a4a;
          font-weight: bold;
          margin: 24px 0 8px 0;
          width: 100%;
        }

        p {
          font-size: 12px;
          line-height: 16px;
          color: #4a4a4a;
          margin: 0;
          // margin: 0 0 8px 0;
        }

        .hold-rank-tile {
          p {
            margin: 0 0 8px 0;
          }
        }
      }
      @media screen and (min-width: 768px) {
        .hold-rank-section {
          .row {
            text-align: center;
          }
          img {
            width: 312px;
            height: 112px;
          }

          .hold-rank-icon {
            justify-content: center;
            align-items: center;
          }
        }

        @media screen and (min-width: 1244px) {
          .hold-rank-section {
            .row {
              flex-direction: column;
              text-align: center;
            }
            .poker-header {
              margin-top: 68px;
            }
            .section-header--large {
              margin-bottom: 68px;
            }

            h2 {
              font-size: 36px;
              line-height: 44px;
            }
            h3 {
              font-weight: 500;
              font-size: 20px;
              line-height: 28px;
              margin: 56px 0 8px 0;
              text-transform: capitalize;
            }
            p {
              font-size: 20px;
              line-height: 28px;
              color: #828282;
              //  margin:0 24px;
              margin: 0;
            }

            .hold-rank-tile {
              p {
                margin: 0 0 24px 0;
              }
            }
            img {
              width: 504px;
              height: auto;
            }
            .icon {
              width: 48px;
              height: 48px;
              margin: 0 16px 0px 0px;
            }
          }
        }
      }
    `}</style>
  </section>
);
export const HowtoPlayPokerList = (props) => {
  if (props.osType === "desktop")
    return (
      <ListPoints
        config={props.config}
        device={props.osType}
        osType={props.osType}
        {...props.listPoints}
      />
    );
  return (
    <HowToPlayPokerGame
      config={props.config}
      device={props.osType}
      osType={props.osType}
      {...props.howToPlayPoker}
    />
  );
};
const HowToPlayPokerGame = (props) => (
  <section className="list-para-normal-grey">
    <div className="width-wrapper">
      <h2>{props.header}</h2>
      <p>{props.pokerText}</p>
      <h3>{props.h3Heading}</h3>
      <div className="poker-game-layout">
        {props.contentList.map((text, key) => (
          <div className="wrapper">
            <div key={key}>
              <svg
                width="8px"
                height="10px"
                viewBox="0 0 8 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.1 0.200012L0.399994 5.8L0.850001 6.20005H4.00002V9.80001H4.90003L7.59999 4.24439L7.26716 3.80003H4.00002V0.200012H3.1Z"
                  fill="#828282"
                />
              </svg>
            </div>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
    <style jsx>
      {`
        .list-para-normal-grey {
          background: #f0f0f0;
          .width-wrapper {
            padding: 32px 24px;
            .wrapper {
              display: flex;
              margin: 8px 0;
              p {
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                color: #828282;
                align-self: center;
                margin: 0;
                margin-left: 8px;
                text-align: left;
              }
            }
            > p {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              align-self: center;
              margin: 12px 0;
              text-align: left;
            }
            > h2 {
              font-weight: bold;
              font-size: 16px;
              line-height: 20px;
              text-align: center;
              color: #222222;
              align-self: center;
              margin-bottom: 12px;
            }
            > h3 {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #4a4a4a;
              margin-top: 24px;
              text-align: left;
            }
          }
        }
        .list-para-normal {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #ffffff;
          box-sizing: border-box;
          .width-wrapper {
            padding: 32px 24px;
            .wrapper {
              display: flex;
              margin: 8px 0;
              p {
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                color: #828282;
                align-self: center;
                margin: 0;
                margin-left: 8px;
                text-align: left;
              }
            }
            p {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              align-self: center;
              margin: 12px 0;
              text-align: left;
              width: 100%;
            }
            h2 {
              font-weight: bold;
              font-size: 14px;
              line-height: 18px;
              text-align: center;
              color: #222222;
              align-self: center;
              margin-bottom: 12px;
            }
          }
        }
        @media screen and (min-width: 768px) {
          .poker-game-layout {
            padding: 0 110px;
          }
          .list-para-normal-grey {
            background-color: #fff;
          }
          .list-para-normal {
            .width-wrapper {
              width: 720px;
              margin: auto;
            }
          }
          .list-para-normal-grey {
            .width-wrapper {
              width: 720px;
              margin: auto;
              p,
              h3 {
                text-align: center;
              }
            }
          }
        }
      `}
    </style>
  </section>
);

export const Variantions = (props) => (
  <section className="variations-section">
    <div className="container">
      <div className="section-layout">
        <div className="row">
          <div className="width-wrapper">
            <h2>{props.header}</h2>
            <h3>{props.h3PotLimit}</h3>
            <div className="variations-layout">
              <p>{props.p1Text}</p>
              <h3 className="variations-header">{props.h3How}</h3>

              {props.contentList.map((para, key) => (
                <div className="wrapper">
                  <div>
                    <svg
                      width="8px"
                      height="10px"
                      viewBox="0 0 8 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="variations-icon"
                    >
                      <path
                        d="M3.1 0.200012L0.399994 5.8L0.850001 6.20005H4.00002V9.80001H4.90003L7.59999 4.24439L7.26716 3.80003H4.00002V0.200012H3.1Z"
                        fill="#828282"
                      />
                    </svg>
                  </div>
                  <div>
                    <p>{para.text1}</p>
                    {para.list ? (
                      <ul>
                        {para.list.map((text, key) => (
                          <li key={key}>{text}</li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}

                    {para.text2 ? (
                      <p className="variations-paragraph">{para.text2}</p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="variations-bottom-block">
              <h3 className="variations-subheader">{props.h3end}</h3>
              <p>{props.p1End1}</p>

              <p>{props.p1End2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .variations-section {
          .width-wrapper {
            .wrapper {
              display: flex;
              p {
                margin: 0 0 12px 8px;
              }
            }
            p {
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              text-align: left;
              width: 100%;
              margin-left: 0;
            }
            > h2 {
              font-weight: bold;
              font-size: 16px;
              line-height: 20px;
              text-align: center;
              color: #222222;
              margin-bottom: 28px;
            }
            h3 {
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #4a4a4a;
              text-align: left;
              margin: 0 0 4px 0;
            }
            ul {
              padding: 0;
              margin: 0 0 12px 8px;
              text-align: left;
            }
            ul li {
              padding: 0;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              text-transform: capitalize;
            }

            .variations-header {
              margin: 40px 0 16px 0;
            }

            .variations-subheader {
              margin: 52px 0 4px 0;
              text-align: left;
            }
          }
        }

        @media screen and (min-width: 728px) {
          .variations-section {
            .variations-layout {
              padding: 0 110px;
            }
            .variations-layout > p {
              text-align: center;
            }
            .width-wrapper {
              h3 {
                text-align: center;
              }

              .variations-bottom-block {
                h3,
                p {
                  text-align: center;
                }
              }
            }
          }
        }
        @media screen and (min-width: 1244px) {
          .variations-section {
            .variations-layout {
              padding: 0 110px;
            }

            .width-wrapper {
              .wrapper {
                justify-content: left;

                .variations-paragraph {
                  margin: 0 0 24px 0;
                }

                p {
                  margin: 0 0 24px 18px;
                }
              }
              p {
                font-size: 20px;
                line-height: 28px;
                margin: 0 0 0 8px;
              }

              h3 {
                text-align: center;
                font-size: 20px;
                line-height: 28px;
                color: #222222;
                margin: 0 0 8px 0;
              }

              ul li {
                font-size: 20px;
                line-height: 28px;
              }
              > h2 {
                font-size: 36px;
                line-height: 44px;
                margin: 0 0 56px 0;
              }
              .variations-header {
                margin: 56px 0 24px 0;
              }
              .variations-bottom-block {
                h3,
                p {
                  text-align: center;
                  margin-left: 0;
                }

                h3 + p {
                  margin-bottom: 24px;
                }
                .variations-subheader {
                  margin: 56px 0 8px 0;
                  text-align: center;
                }
              }
              .variations-icon {
                width: 14px;
                height: 28px;
              }
            }
          }
        }
      `}
    </style>
  </section>
);
