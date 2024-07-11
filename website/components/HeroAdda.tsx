import * as imgRef from "../configs/images";
import SendSMSStatic from "./SendSMSStatic";
import Banners from "./Banners";
import Head from "next/head";
import React, { Component } from "react";
export default class extends Component {
  state = {
    audioIcon: this.props.imgRef.AUDIO_PLAY,
    audioState: {
      raja: "STOP",
      bhayandar: "STOP",
      cool_macha: "STOP",
      rasta: "STOP",
    },
    audioValue: {
      raja: 0,
      bhayandar: 0,
      cool_macha: 0,
      rasta: 0,
    },
  };

  audioAction = (e) => {
    var audio = document.getElementById(e);

    let audioState = { ...this.state.audioState };

    if (this.state.audioState[e] === "STOP") {
      audio.play();
      audioState[e] = "PLAYING";
      this.setState({
        audioState,
        audioDuration: audio.duration,
      });
    } else if (this.state.audioState[e] === "PLAYING") {
      audio.pause();
      audioState[e] = "STOP";
      this.setState({
        audioState,
      });
    }
  };
  audioPlay = (e) => {
    var aud = document.getElementById(e);
    let audioValue = { ...this.state.audioValue };
    audioValue[e] = (100 / aud.duration) * aud.currentTime;
    this.setState({
      audioValue,
    });
    if (aud.currentTime === aud.duration) {
      let audioState = { ...this.state.audioState };
      audioState[e] = "STOP";
      let audioValue = { ...this.state.audioValue };
      audioValue[e] = 0;
      this.setState({
        audioState,
        audioValue,
      });
    }
  };
  render() {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div id="hero-adda">
          <div>
            <div>
              <img
                id="adda-logo"
                src={this.props.imgRef.HERO_ADDA_LOGO}
                alt=""
              />
            </div>
            <div className="hero-section " id="adda-head">
              <h3>DOWNLOAD vpl HERO SONGS</h3>
              <div id="adda-ringtones">
                <div className="ringtone">
                  <div>
                    <span> Raja Beta vpl</span>
                    <span className="controls">
                      <div>
                        <a onClick={() => this.audioAction("raja")}>
                          <img
                            src={
                              this.state.audioState["raja"] === "STOP"
                                ? this.props.imgRef.AUDIO_PLAY
                                : this.props.imgRef.AUDIO_PAUSE
                            }
                            alt=""
                          />
                        </a>
                      </div>
                    </span>
                    <audio
                      onTimeUpdate={() => this.audioPlay("raja")}
                      id="raja"
                    >
                      <source
                        src="/static/heroadda/Raja_Beta_vpl.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="seekbar">
                    <div
                      style={{ width: `${this.state.audioValue["raja"]}%` }}
                    />
                  </div>
                  <div>
                    <a
                      href="/static/heroadda/Raja_Beta_vpl.mp3"
                      download="Raja Beta vpl.mp3"
                    >
                      <span>
                        <img src={this.props.imgRef.IC_DOWNLOAD} alt="" />{" "}
                      </span>
                      <span>DOWNLOAD SONG</span>
                    </a>
                  </div>
                </div>
                <div className="ringtone">
                  <div>
                    <span>Bhayandar Fast vpl</span>
                    <span className="controls">
                      <div>
                        <a onClick={() => this.audioAction("bhayandar")}>
                          <img
                            src={
                              this.state.audioState["bhayandar"] === "STOP"
                                ? this.props.imgRef.AUDIO_PLAY
                                : this.props.imgRef.AUDIO_PAUSE
                            }
                            alt=""
                          />
                        </a>
                      </div>
                    </span>
                    <audio
                      onTimeUpdate={() => this.audioPlay("bhayandar")}
                      id="bhayandar"
                    >
                      <source
                        src="/static/heroadda/Bhayandar_Fast_vpl.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="seekbar">
                    <div
                      style={{
                        width: `${this.state.audioValue["bhayandar"]}%`,
                      }}
                    />
                  </div>
                  <div>
                    <a
                      href="/static/heroadda/Bhayandar_Fast_vpl.mp3"
                      download="Bhayandar Fast vpl.mp3"
                    >
                      <span>
                        <img src={this.props.imgRef.IC_DOWNLOAD} alt="" />{" "}
                      </span>
                      <span>DOWNLOAD SONG</span>
                    </a>
                  </div>
                </div>
                <div className="ringtone">
                  <div>
                    <span>Rasta Chordo Chatarji vpl</span>
                    <span className="controls">
                      <div>
                        <a onClick={() => this.audioAction("rasta")}>
                          <img
                            src={
                              this.state.audioState["rasta"] === "STOP"
                                ? this.props.imgRef.AUDIO_PLAY
                                : this.props.imgRef.AUDIO_PAUSE
                            }
                            alt=""
                          />
                        </a>
                      </div>
                    </span>
                    <audio
                      onTimeUpdate={() => this.audioPlay("rasta")}
                      id="rasta"
                    >
                      <source
                        src="/static/heroadda/Raasta_vpl.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="seekbar">
                    <div
                      style={{ width: `${this.state.audioValue["rasta"]}%` }}
                    />
                  </div>
                  <div>
                    <a
                      href="/static/heroadda/Raasta_vpl.mp3"
                      download="Rasta Chordo Chatarji vpl.mp3"
                    >
                      <span>
                        <img src={this.props.imgRef.IC_DOWNLOAD} alt="" />{" "}
                      </span>
                      <span>DOWNLOAD SONG</span>
                    </a>
                  </div>
                </div>
                <div className="ringtone">
                  <div>
                    <span>Cool Macha vpl</span>
                    <span className="controls">
                      <div>
                        <a onClick={() => this.audioAction("cool_macha")}>
                          <img
                            src={
                              this.state.audioState["cool_macha"] === "STOP"
                                ? this.props.imgRef.AUDIO_PLAY
                                : this.props.imgRef.AUDIO_PAUSE
                            }
                            alt=""
                          />
                        </a>
                      </div>
                    </span>
                    <audio
                      onTimeUpdate={() => this.audioPlay("cool_macha")}
                      id="cool_macha"
                    >
                      <source
                        src="/static/heroadda/Cool_Macha_vpl.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                  <div className="seekbar">
                    <div
                      style={{
                        width: `${this.state.audioValue["cool_macha"]}%`,
                      }}
                    />
                  </div>
                  <div>
                    <a
                      href="/static/heroadda/Cool_Macha_vpl.mp3"
                      download="Cool Macha vpl.mp3"
                    >
                      <span>
                        <img src={this.props.imgRef.IC_DOWNLOAD} alt="" />{" "}
                      </span>
                      <span>DOWNLOAD SONG</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-section adda-video" id="ad-video">
            <h3>WATCH AND SHARE THE HERO STEPS</h3>
            <div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/iCLXktJaxXA"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/301_I4cu-EA"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/ew6euR7ErPQ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/mWH_wwRyeE0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          <div className="hero-section adda-video" id="ad-news-video">
            <h3>vpl HEROES ON CRICBUZZ</h3>
            <div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/KTuUiS2zqog"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/f_twU7AddfI"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/tU21PaajcdE"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/JlQsYYTGYHE"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
          {/* <div className="hero-section" id="ad-article">
          <h3>vpl HEROS IN THE NEWS</h3>
          <div>
            <img src="/static/heroadda/winner-article.png" alt="" />
          </div>
        </div> */}
          <style jsx>{`
            #hero-adda {
              #adda-logo {
                width: 250px;
              }
              #adda-head {
                h3 {
                  margin-top: 30px;
                  margin-bottom: 10px;
                }
              }
              background-color: #f0f0f0;
              padding-bottom: 50px;
              #adda-head {
                h2 {
                  color: #000;
                  margin-bottom: 30px;
                }
                h3 {
                  color: #919191;
                  // margin-bottom: 20px;
                }
              }
              .hero-section {
                h3 {
                  color: #919191;
                  margin-bottom: 10px;
                  margin-top: 50px;
                }
              }
              padding-top: 45px;

              font-size: 16px;
              line-height: 40px;

              font-style: normal;

              line-height: normal;

              color: #fcfcfc;
              #adda-ringtones {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .ringtone {
                margin: 15px 0;
                border-radius: 6px;
                box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.26);
                width: 80%;
                // margin: auto;

                a {
                  text-decoration: none;
                  color: #fff;
                  > span {
                    color: #fff;
                  }
                }
                > div:first-child {
                  display: flex;
                  align-items: center;
                  padding-left: 10px;
                  height: 40px;
                  border-top-left-radius: 6px;
                  border-top-right-radius: 6px;
                  background-color: #fff;
                  justify-content: space-between;

                  color: #000;
                  img {
                    vertical-align: middle;
                    width: 32px;
                  }

                  .controls {
                    display: flex;
                  }
                  .border {
                    width: 1px;
                  }
                }
                .seekbar {
                  position: absolute;
                  width: 80%;
                  div {
                    height: 2px;
                    width: 0;
                    background: #000;
                  }
                }
                > div:last-child {
                  height: 40px;
                  img {
                    width: 15px;
                    vertical-align: middle;
                  }
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-bottom-left-radius: 6px;
                  border-bottom-right-radius: 6px;

                  background-image: linear-gradient(
                    to bottom,
                    #a4cf00,
                    #33cc00
                  );
                }
              }
              .adda-video {
                width: 80%;
                margin: auto;

                iframe {
                  // width: 80%;
                  margin: 15px 0;
                }
              }
              #ad-news-video {
                img {
                  width: 80vw;
                }
              }
              #ad-article {
                padding-bottom: 20px;
                div > img {
                  width: 80%;
                  border-radius: 10px;
                }
              }
            }
            @media (min-width: 1200px) {
              #hero-adda {
                #adda-logo {
                  width: 400px;
                }
                #adda-head > h3 {
                  margin-top: 40px;
                  margin-bottom: 40px;
                }
                padding-bottom: 100px;
                padding-top: 80px;
                .ringtone {
                  margin: 0 20px;
                  width: 40%;
                  .seekbar {
                    position: absolute;
                    width: 260px;
                    div {
                      height: 2px;
                      width: 0;
                      background: #000;
                    }
                  }
                }

                .hero-section {
                  h3 {
                    color: #919191;
                    margin-bottom: 30px;
                    margin-top: 80px;
                    font-size: 22px;
                  }
                }
                #adda-ringtones {
                  max-width: 1200px;
                  margin: auto;
                  flex-direction: row;
                  justify-content: center;

                  > div {
                    width: 30%;
                  }
                }
                .adda-video {
                  max-width: 1200px;
                  > div {
                    > div {
                      width: 40%;
                      margin: 0 20px;
                    }
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                  }

                  iframe {
                    width: 100%;
                    height: 300px !important;
                  }
                }
                #ad-article {
                  div > img {
                    width: 40%;
                  }
                }
              }
            }
          `}</style>
        </div>
      </>
    );
  }
}
