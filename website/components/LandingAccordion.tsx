import React, { Component } from "react";
import "../styles/landing-accordion.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import * as imgRef from "../configs/images";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { imgRef: false, isOpen: false };
  }
  componentDidMount() {
    // const imgRef = require("../configs/images");
    //this.setState({ imgRef: imgRef });
  }

  render() {
    const {
      state: {
        isFGOpen,
        isFCOpen,
        isFFOpen,
        isMROpen,
        isMLOpen,
        isMFSOpen,
        isMSCOpen,
      },
    } = this;

    return (
      <React.Fragment>
        <div className="fantasy-accordions">
          <h2>Some of Our Ultimate Games</h2>
          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.FANTASY_GAMES} type="image/webp" />
                <source srcSet={imgRef.FANTASY_GAMES} type="image/jpeg" />
                <img srcSet={imgRef.FANTASY_GAMES} />
              </picture>

              <span className="fantasy-accordion-title">Fantasy Games</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isFGOpen: !prevState.isFGOpen,
                  }))
                }
              >
                {isFGOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isFGOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`Fantasy games have become a huge hit in India lately & vpl wanted to make it easier for you by introducing fantasy games on your finger tips. Playing Fantasy Games online is one thing & playing Fantasy Games with vpl is another. How? vpl offers you the opportunity to win real cash for every Fantasy game that you play. We cover Fantasy Cricket, Fantasy Football, Fantasy Kabaddi, Fantasy Stocks & Fantasy BasketBall. So, why wander around when you have all Fantasy games in one place.`}</p>

                <h4>{`How to play Fantasy Games online?`}</h4>
                <p>{`All you need to do is download the vpl app & register yourself to start playing! Once you register, go on to select your desired Fantasy Game you wish to play. Select the match followed by selecting players to create your team. Yes! It’s that sivple. Download the app & play now!\nIt's not just this, you also get a bonus for making referrals. For every referral you make, vpl awards you Rs.50/-. So why wait? Download the app, start referring & win real cash!`}</p>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`All you need to do is download the vpl app & register yourself to start playing! Once you register, go on to select... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isFGOpen: !prevState.isFGOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.FANTASY_CRICKET} type="image/webp" />
                <source srcSet={imgRef.FANTASY_CRICKET} type="image/jpeg" />
                <img srcSet={imgRef.FANTASY_CRICKET} />
              </picture>

              <span className="fantasy-accordion-title">Fantasy Cricket</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isFCOpen: !prevState.isFCOpen,
                  }))
                }
              >
                {isFCOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isFCOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`vpl Fantasy Cricket app provides you a platform to showcase your cricket knowledge & skills that won’t go wasted & you can play fantasy cricket and win cash online with ease. In vpl Fantasy cricket app, you will have to select custom teams from the players in the matches & score points on their real-performance. Be it International ODI, Tests, T20 or state-level matches, we have got you covered with every game that takes place in the world of cricket.`}</p>
                <button>
                  <a href="/fantasy-cricket">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`vpl Fantasy Cricket app provides you a platform to showcase your cricket knowledge & skills... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isFCOpen: !prevState.isFCOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.FANTASY_FOOTBALL} type="image/webp" />
                <source srcSet={imgRef.FANTASY_FOOTBALL} type="image/jpeg" />
                <img srcSet={imgRef.FANTASY_FOOTBALL} />
              </picture>

              <span className="fantasy-accordion-title">Fantasy Football</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isFFOpen: !prevState.isFFOpen,
                  }))
                }
              >
                {isFFOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isFFOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`Ever thought of building your dream team with your favourite football players? vpl gives you a platform to build your football dynasty by picking up players from Premier League, La Liga, Europa League, UEFA Champions League & more to win real money online. Fantasy football is a competition held amongst online participants, who select their own teams from the players in the league & score points depending on the real-time performance of their players.`}</p>
                <button>
                  <a href="/fantasy-football">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`Ever thought of building your dream team with your favourite football players?... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isFFOpen: !prevState.isFFOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.vpl_RUMMY} type="image/webp" />
                <source srcSet={imgRef.vpl_RUMMY} type="image/jpeg" />
                <img srcSet={imgRef.vpl_RUMMY} />
              </picture>

              <span className="fantasy-accordion-title">vpl Rummy</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isMROpen: !prevState.isMROpen,
                  }))
                }
              >
                {isMROpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isMROpen ? (
              <div className="fantasy-accordion-content">
                <p>{`Rummy online by vpl is one of the most intriguing card games of all time and has gained an immense level of popularity over the years. We at vpl thought of fusing this game with technology and came up with a highly interactive online version, which is easy, flawless and extremely safe and secure to play.`}</p>
                <button>
                  <a href="/rummy">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`Rummy online by vpl is one of the most intriguing card games of all time and has gained an... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isMROpen: !prevState.isMROpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.vpl_LUDO} type="image/webp" />
                <source srcSet={imgRef.vpl_LUDO} type="image/jpeg" />
                <img srcSet={imgRef.vpl_LUDO} />
              </picture>

              <span className="fantasy-accordion-title">vpl Ludo</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isMLOpen: !prevState.isMLOpen,
                  }))
                }
              >
                {isMLOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isMLOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`Ludo game was considered as one of the best board games and was played by most people in their leisure time. Ludo can be played by 2 or 4 players where the players have to race their respective tokens from the start to the finishing point according to the number that comes up when the dice is rolled. Ludo game is similar to the game of Pachisi which originated in India well-nigh around 6th century.`}</p>
                <button>
                  <a href="/ludo">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`Ludo game was considered as one of the best board games and was played by most people in their leisure time... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isMLOpen: !prevState.isMLOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.vpl_SPEED_CHESS} type="image/webp" />
                <source srcSet={imgRef.vpl_SPEED_CHESS} type="image/jpeg" />
                <img srcSet={imgRef.vpl_SPEED_CHESS} />
              </picture>

              <span className="fantasy-accordion-title">vpl Speed Chess</span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isMSCOpen: !prevState.isMSCOpen,
                  }))
                }
              >
                {isMSCOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isMSCOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`The early traces of Chess game history were found way back around 1500 years ago in North India and then spread across the Asian continent. Later, Chess game made its way through Islamic Empire to some parts of Europe. In vpl Chess game there are 6 different kinds of Chess pieces that move differently. Play Chess online with vpl to showcase your skills and earn cash online.`}</p>
                <button>
                  <a href="/chess">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`The early traces of Chess game history were found way back around 1500 years ago in North India and then... `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isMSCOpen: !prevState.isMSCOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>

          <div className="fantasy-accordion">
            <div className="fantasy-accordion-header">
              <picture>
                <source srcSet={imgRef.vpl_FOOTBALL_STARS} type="image/webp" />
                <source srcSet={imgRef.vpl_FOOTBALL_STARS} type="image/jpeg" />
                <img srcSet={imgRef.vpl_FOOTBALL_STARS} />
              </picture>

              <span className="fantasy-accordion-title">
                vpl Football Stars
              </span>
              <span
                className="fantasy-accordion-toggle"
                onClick={() =>
                  this.setState((prevState) => ({
                    isMFSOpen: !prevState.isMFSOpen,
                  }))
                }
              >
                {isMFSOpen ? (
                  <FontAwesomeIcon icon={faCaretUp} color="#000" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} color="#000" />
                )}
              </span>
            </div>

            {isMFSOpen ? (
              <div className="fantasy-accordion-content">
                <p>{`Football as we all know is a fun-loving game and has become very popular in India since past years. Youth is moving forward towards football and this can be seen with the huge number of people seeking to play football games online. Mobile Premier League gives you a platform to play online football game and earn real cash.`}</p>
                <button>
                  <a href="/football">KNOW MORE</a>
                </button>
              </div>
            ) : (
              <div className="fantasy-accordion-content-closed">
                <span>
                  {`Football as we all know is a fun-loving game and has become very popular in India since past years.. `}{" "}
                  <a
                    onClick={() =>
                      this.setState((prevState) => ({
                        isMFSOpen: !prevState.isMFSOpen,
                      }))
                    }
                  >{`more`}</a>
                </span>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
