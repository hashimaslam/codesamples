import React, { Component } from "react";
import { LANDING_PAGE_TOP_GAMES_SUB_HEADING } from "../configs/constants";
import DownloadButton from "../components/TopGamesDownloadButton";
import DownloadButtonCheckbox from "../components/DownloadButtonCheckbox";
import { lazyImage } from "../configs/util";
class ShowTopGames extends Component {
  componentDidMount() {
    lazyImage();
  }
  render() {
    const { header, subheader, newGamesText, topGameList, device } = this.props;
    return (
      <section
        className={`show-top-games-section ${this.props.page} ${this.props.device}`}
      >
        <div className="container">
          <div className="section-layout show-top-games-layout">
            <div className="row show-top-games-headings">
              {
                <h2 className="section-header section-header--large">
                  {header}
                </h2>
              }
              {<h3 className="section-header">{subheader}</h3>}
            </div>
            <div className="row show-top-games-start">
              {topGameList
                ? topGameList.map((game, key) => (
                    <div className="show-top-games-tile" key={key}>
                      {game.newGameImageurl ? (
                        <span className="new-game-wrapper">{newGamesText}</span>
                      ) : (
                        <div className="align-images"></div>
                      )}
                      {game.link ? (
                        <a href={game.link} style={{ display: "contents" }}>
                          <img
                            alt={game.text}
                            data-src={game.gameImageurl.png}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                            className="section-tile-image lazy-image"
                          />
                        </a>
                      ) : (
                        <span style={{ display: "contents" }}>
                          <img
                            alt={game.text}
                            data-src={game.gameImageurl.png}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                            className="section-tile-image lazy-image"
                          />
                        </span>
                      )}
                      <div className="show-top-games-tile__text">
                        {game.link ? (
                          <a href={game.link} style={{ display: "contents" }}>
                            <p>{game.text}</p>
                          </a>
                        ) : (
                          <span style={{ display: "contents" }}>
                            <p>{game.text}</p>
                          </span>
                        )}
                        {game.newGameImageurl ? (
                          <div>
                            <span className="new-game-wrapper-desktop">
                              {newGamesText}
                            </span>{" "}
                          </div>
                        ) : (
                          <div className="align-images"></div>
                        )}
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            {device && device !== "desktop" ? (
              <div className="row">
                {!this.props.downloadButtonHide ? (
                  this.props.page !== "vpl-games-generic" ? (
                    <DownloadButton
                      device={this.props.device}
                      browser={this.props.browser}
                      showDownload={this.props.showDownload}
                      buttonPosition="top games"
                      page={this.props.page}
                    />
                  ) : (
                    <DownloadButtonCheckbox
                      device={this.props.device}
                      browser={this.props.browser}
                      showDownload={this.props.showDownload}
                      buttonPosition="top-games"
                      page={this.props.page}
                    />
                  )
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <style jsx>
          {`
            .show-top-games-section {
              background: #ffffff;
              h3 {
                color: #828282;
                font-size: 14px;
                font-weight: normal;
              }
              .align-images {
                margin: 0;
                margin-top: 16px;
              }
            }

            .show-top-games-headings {
              flex-direction: column;
              h2 {
                margin-bottom: 8px;
              }
            }

            .new-game-wrapper {
              padding: 1px 11px;
              background: #ffe500;
              font-size: 8px;
              line-height: 13px;
              font-weight: bold;
              border-radius: 8px;
              margin: 0px 4px 4px 4px;
              display: inline-block;
              height: 12px;
            }

            .show-top-games-start {
              justify-content: flex-start;
            }
            .show-top-games-tile {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 25%;
              margin-bottom: 12px;
              .show-top-games-tile__info {
                display: flex;
                flex-direction: column;
                margin-left: 16px;
                justify-content: center;
              }
              p {
                font-size: 10px;
                color: #4a4a4a;
                margin-bottom: 0;
                font-weight: normal;
              }
              h2 {
                font-size: 10px;
                color: #4a4a4a;
                margin-bottom: 0;
                font-weight: normal;
              }
            }

            .show-top-games-tile {
              .new-game-wrapper-desktop {
                display: none;
              }
            }

            @media screen and (min-width: 768px) {
              .show-top-games-section {
                h3 {
                  font-size: 16px;
                  margin-bottom: 24px;
                  font-weight: 100;
                }
              }

              .show-top-games-headings {
                h2 {
                  margin-bottom: 17px;
                }
              }

              .show-top-games-layout {
                margin-bottom: -8px;
              }

              .show-top-games-start {
                justify-content: center;
                padding: 0 30px;
              }
              .show-top-games-tile {
                flex-direction: column;
                width: 23%;
                margin-bottom: 30px;

                .show-top-games-tile__text {
                  display: flex;
                  flex-direction: column;
                }
                p {
                  font-size: 12px;
                  font-weight: 400;
                }
                h2 {
                  font-size: 12px;
                  font-weight: 400;
                }
              }
            }

            .show-top-games-section.vpl-stories.desktop {
              display: none;
            }

            .show-top-games-section.redeem-vi-coupon {
              .section-layout {
                padding-top: 0;
              }
            }
            @media screen and (min-width: 1224px) {
              .new-game-wrapper {
                display: none;
              }

              .show-top-games-section {
                h3 {
                  font-size: 20px;
                  margin-bottom: 64px;
                }
              }

              .show-top-games-tile {
                .new-game-wrapper-desktop {
                  padding: 4px 12px;
                  background: #ffe500;
                  border-radius: 13px;
                  font-size: 12px;
                  font-weight: bold;
                  line-height: 14px;
                  text-align: left;
                  display: block;
                  width: 50px;
                  box-sizing: border-box;
                  display: block;
                }
              }

              .show-top-games-tile {
                flex-direction: row;
                box-sizing: border-box;
                width: 24%;
                padding: 16px;
                margin-bottom: 8px;
                // margin-right: 16px;

                .show-top-games-tile__text {
                  height: 80px;
                  padding-left: 16px;
                  text-align: left;
                }
                p {
                  font-size: 20px;
                  line-height: 28px;
                  margin: 8px 0 8px 0;
                }
                h2 {
                  font-size: 20px;
                  line-height: 28px;
                  margin: 8px 0 8px 0;
                }
              }
            }
          `}
        </style>
      </section>
    );
  }
}

export default ShowTopGames;
