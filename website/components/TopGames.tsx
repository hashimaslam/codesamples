import React, { Component, useEffect } from "react";
import { LIST_TOP_GAMES } from "../configs/TopGames";
import { getHTML, lazyImage } from "../configs/util";

const Pargraph = ({
  subParagraph,
  paragraph,
  showBlock,
  showParagraph,
  blockId,
  pageLink,
  knowMoreBtnLabel,
  moreText,
  language,
  page,
}) => {
  useEffect(() => {
    lazyImage();
  });

  if (showBlock) {
    return (
      <div className="top-games-expand" style={{ display: "block" }}>
        <p className="top-games-detail__description">{getHTML(paragraph)}</p>
        {subParagraph &&
          subParagraph.map((para) => (
            <div>
              <h2 className="top-games-detail__header">{para.header}</h2>
              <p className="top-games-detail__description--inner">
                {getHTML(para.text)}
              </p>
            </div>
          ))}
        <div
          className={`top-games-know-more ${
            (language === "id" && pageLink !== "/fantasy") ||
            page == "vpl-games"
              ? "know-more-hide"
              : ""
          }`}
        >
          <a href={pageLink} className="top-games-know-more__text">
            {knowMoreBtnLabel}
          </a>
        </div>

        <style jsx>
          {`
            .top-games-detail__header {
              color: #4a4a4a;
              font-size: 12px;
            }

            .top-games-detail__description--inner {
              font-size: 12px;
            }
            .top-games-detail__description {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              margin-top: 10px;
              margin-bottom: 0;
            }

            .top-games-expand {
              margin: 0 auto;
              text-align: left;
            }
            .top-games-know-more {
              display: flex;
              justify-content: flex-end;
              cursor: pointer;
              padding-top: 12px;
              &.know-more-hide {
                display: none;
              }
            }

            .top-games-know-more > .top-games-know-more__text {
              color: #ff1e46;
              border: 1px solid #ff1e46;
              border-radius: 2px;
              padding: 8px 12px;
            }
          `}
        </style>
      </div>
    );
  } else {
    return (
      <div className="top-games-detail">
        <p className="top-games-detail__description">{getHTML(paragraph)}</p>
        <div
          className="top-games-detail__more"
          onClick={() => showParagraph(blockId)}
        >
          <h2>...{moreText}</h2>
        </div>
        <div
          className={`top-games-know-more ${
            (language === "id" && pageLink !== "/fantasy") ||
            page == "vpl-games"
              ? "know-more-hide"
              : ""
          }`}
        >
          <a href={pageLink} className="top-games-know-more__text">
            {knowMoreBtnLabel}
          </a>
        </div>
        <style jsx>
          {`
            .top-games-detail__description {
              color: #828282;
              font-size: 12px;
              line-height: 16px;
              font-weight: normal;

              margin-top: 10px;
              margin-bottom: 0;
            }
            .top-games-detail {
              margin: 0 auto;
              text-align: left;
              height: 40px;
              overflow: hidden;
              position: relative;
            }

            .top-games-detail__more {
              cursor: pointer;
              color: red;
              bottom: 0;
              right: 0;
              position: absolute;
              background: #ffffff;
              padding-left: 5px;

              h2 {
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                color: #ff0000;
                margin: 0;
              }
            }

            .top-games-know-more {
              display: none;
            }

            .top-games-know-more {
              display: flex;
              justify-content: flex-start;
              cursor: pointer;
              padding-top: 0;
              &.know-more-hide {
                display: none;
              }
            }

            @media screen and (min-width: 768px) {
              .top-games-detail__description {
                font-size: 14px;
                line-height: 20px;
                margin: 18px 0;
              }

              .top-games-detail {
                overflow: visible;
                height: auto;
              }

              .top-games-detail__more {
                display: none;
              }

              .top-games-know-more {
                padding-top: 12px;
              }
              .top-games-know-more > .top-games-know-more__text {
                color: #ff1e46;
                border: 1px solid #ff1e46;
                border-radius: 2px;
                padding: 8px;
                font-size: 12px;
                font-weight: 500;
              }
            }

            @media screen and (min-width: 1224px) {
              .top-games-detail__description {
                font-size: 16px;
                line-height: 22px;
              }

              .top-games-know-more > .top-games-know-more__text {
                padding: 8px 12px;
                font-size: 14px;
              }
            }
          `}
        </style>
      </div>
    );
  }
};
class TopGames extends Component {
  constructor(props) {
    super(props);
    this.state = { ids: [] };
  }
  showParagraph = (id) => {
    this.setState((prevState) => ({
      ids: [...prevState.ids, id],
    }));
  };
  hideParagraph = (id) => {
    const arr = [...this.state.ids];
    const index = arr.indexOf(parseInt(id));
    arr.splice(index, 1);
    this.setState({
      ids: [...arr],
    });
  };

  pixelSetup = () => {
    (function () {
      var colombiaPixelURL =
        "https://ade.clmbtech.com/cde/eventTracking.htm?pixelId=6232&_w=1&rd=" +
        new Date().getTime();
      new Image().src = colombiaPixelURL;
    })();
  };
  performTwoAction = () => {
    this.pixelSetup();
  };
  componentDidMount() {
    lazyImage();
  }

  render() {
    let language = this.props.config.config.LANG_CODE;
    return (
      <section
        className={`top-games-section ${
          language === "id" ? "top-games-indo" : ""
        }`}
      >
        <div className="container">
          <div className="section-layout">
            <div className="row">
              <h2 className="section-header section-header--medium">
                {" "}
                {this.props.header}{" "}
              </h2>
            </div>
            <div className="row top-games-row">
              {this.props.topGamesList.map((game, key) => (
                <div className="top-games-tile" key={key}>
                  <div
                    className="top-games-bar"
                    onClick={
                      !this.state.ids.includes(key)
                        ? () => this.showParagraph(key)
                        : () => this.hideParagraph(key)
                    }
                  >
                    <div className="top-games-tile__header">
                      {/* <img
                        src={game.imgLink}
                        alt={game.altImg}
                        className="section-tile-image"
                      /> */}

                      <img
                        data-src={game.imageurl.png}
                        alt={game.altText}
                        className="section-tile-image lazy-image"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                      />

                      <h3 className="top-games-tile__title section-header--medium">
                        {game.header}
                      </h3>
                    </div>
                    {!this.state.ids.includes(key) ? (
                      <div className="plus"></div>
                    ) : (
                      <div className="dash"></div>
                    )}
                  </div>
                  <Pargraph
                    showBlock={this.state.ids.includes(key)}
                    subParagraph={
                      game.subParagraphes ? game.subParagraphes : undefined
                    }
                    paragraph={game.text ? game.text : undefined}
                    blockId={key}
                    showParagraph={this.showParagraph}
                    pageLink={game.pageLink}
                    knowMoreBtnLabel={this.props.knowMoreBtnLabel}
                    moreText={this.props.moreText}
                    language={language}
                    page={this.props.page}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <style jsx global>
          {`
            .top-games-section a {
              all: inherit;
              display: inline;
              cursor: pointer;
              color: #ff0000;
              font-weight: 500;
            }
          `}
        </style>
        <style jsx>
          {`
            .top-games-section {
              background: #f0f0f0;
              .section-layout {
                padding: 32px 12px;
              }
            }

            .top-games-section a {
              all: inherit;
              display: inline;
              cursor: pointer;
              color: #ff0000;
              font-weight: 500;
            }
            .top-games-tile {
              border-radius: 4px;
              box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
              background-color: #ffffff;
              width: 100%;
              padding: 12px;
              margin-bottom: 6px;

              .dash {
                width: 0;
                height: 0;
                border-bottom: 5px solid #4a4a4a;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: none;
                cursor: pointer;
              }
              .plus {
                width: 0;
                height: 0;
                border-top: 5px solid #4a4a4a;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: none;
                cursor: pointer;
              }

              .top-games-bar {
                justify-content: space-between;
                display: flex;
                align-items: center;
                cursor: pointer;
              }
              .top-games-tile__header {
                display: flex;
                align-items: center;
              }
              .section-tile-image {
                width: 32px;
                height: 32px;
              }

              .top-games-tile__title {
                color: #4a4a4a;
                text-align: left;
                margin: 0;
                margin-left: 12px;
                font-weight: 500;
                font-size: 12px;
              }
            }

            @media screen and (min-width: 768px) {
              .top-games-section {
                background: #ffffff;
                .section-layout {
                  padding: 60px 24px;
                }
              }
              .top-games-container {
                display: flex;
                flex-wrap: wrap;
              }

              .top-games-bar {
                cursor: not-allowed;
                pointer-events: none;
              }

              .top-games-tile {
                width: 25%;
                box-shadow: none;
                margin-bottom: 30px;
                padding-left: 24px;
                padding-right: 24px;

                .section-tile-image {
                  height: 80px;
                  width: 80px;
                }

                .plus,
                .dash {
                  display: none;
                }

                .top-games-tile__title {
                  color: #222222;
                  font-size: 14px;
                  margin-left: 20px;
                }
              }

              .top-games-row {
                justify-content: flex-start;
                margin-right: -8px;
              }
            }

            @media screen and (min-width: 1224px) {
              .top-games-tile {
                width: 28%;
                margin-bottom: 72px;
                .top-games-tile__title {
                  font-size: 28px;
                }
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default TopGames;
