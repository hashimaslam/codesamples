import React, { Component } from "react";
import "../styles/landing-play-store.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import PlayStoreDownloadButton from "./PlayStoreDownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";
import StarRatingComponent from "react-star-rating-component";
import * as imgRef from "../configs/images";

const ratings = [
  {
    rating: 5,
    pecentage: 45,
  },
  {
    rating: 4,
    pecentage: 30,
  },
  {
    rating: 3,
    pecentage: 6,
  },
  {
    rating: 2,
    pecentage: 4,
  },
  {
    rating: 1,
    pecentage: 12,
  },
];
export default class extends Component {
  componentDidMount() {
    // const imgRef = require("../configs/images");
    this.setState({
      osType: osType(),
    });
  }
  render() {
    const getText = (config) => {
      let text = "";
      if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} + ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
      } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} Free!`;
      } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
      } else {
        text = "";
      }
      return text;
    };
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            <div id={this.props.parentId}>
              <div className="top-banner">
                <img
                  src={this.props.bannerImage}
                  alt=""
                  style={{
                    alignSelf: "stretch",
                    height: "auto",
                    width: "100%",
                    paddingTop: 40,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: "stretch",
                  backgroundColor: "white",
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <div
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    display: "flex",
                  }}
                >
                  <img
                    src={this.props.secondaryLogo}
                    alt=""
                    style={{
                      height: 40,
                      width: 40,
                      border: "1px solid black",
                      borderCollapse: "separate",
                      borderSpacing: "10px",
                      padding: 5,
                      marginTop: 5,
                      // backgroundColor: "red"
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 15,
                      marginTop: 0,
                      // backgroundColor: "blue",
                      flex: 1,
                      alignItems: "flex-start",
                      textAlign: "left",
                    }}
                  >
                    <h2>{this.props.heading}</h2>
                    <p style={{ marginTop: 0, opacity: "90%", width: "80%" }}>
                      {this.props.paragraph}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 0,
                  }}
                >
                  {/*<button*/}
                  {/*style={{*/}
                  {/*paddingLeft: 20,*/}
                  {/*paddingRight: 20,*/}
                  {/*paddingTop: 8,*/}
                  {/*paddingBottom: 8,*/}
                  {/*background: "#00865E",*/}
                  {/*color: "white",*/}
                  {/*display: "flex"*/}
                  {/*}}*/}
                  {/*>*/}
                  {/*INSTALL*/}
                  {/*</button>*/}
                  <PlayStoreDownloadButton />
                </div>

                <div
                  style={{
                    marginTop: 10,
                    alignSelf: "stretch",
                    height: 2,
                    marginLeft: -20,
                    marginRight: -20,
                    backgroundColor: "#E0E0E0",
                  }}
                />

                <div className="app-info">
                  <div className={"rating-info"}>
                    <div className={"rating-info-content"}>
                      <p>4.5</p>
                      <img src={this.state && imgRef.STAR_ICON} />
                    </div>

                    <span>53K reviews</span>
                  </div>
                  <div className={"rating-info"}>
                    <div className={"rating-info-content"}>
                      <img src={this.state && imgRef.PS_DOWNLOAD_ICON} />
                    </div>
                    <span>65 mb</span>
                  </div>
                  <div className={"rating-info"}>
                    <div className={"rating-info-content"}>
                      <img src={this.state && imgRef.THREE_PLUS} />
                    </div>
                    <span>Rated for 3+</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  alignSelf: "stretch",
                  height: 260,
                }}
              >
                <img
                  src={this.props.middleImage}
                  alt=""
                  style={{
                    alignSelf: "stretch",
                    height: "auto",
                    width: "100%",
                    paddingTop: 20,
                  }}
                />
              </div>

              <div
                style={{
                  paddingTop: 20,
                  paddingBottom: 20,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  backgroundColor: "white",
                }}
              >
                <p style={{ fontSize: 16, color: "#000000", marginLeft: 10 }}>
                  Ratings and reviews
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "stretch",
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 0.3,
                    }}
                  >
                    <p style={{ fontSize: 32, color: "#000000", margin: 0 }}>
                      4.5
                    </p>
                    <StarRatingComponent
                      starCount={5}
                      value={4.5}
                      starColor="#00885F"
                      emptyStarColor="#EBEBEB"
                    />
                    <p
                      style={{
                        fontSize: 14,
                        color: "#000000",
                        margin: 0,
                        marginTop: 30,
                      }}
                    >
                      53K Reviews
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingRight: 30,
                      flex: 0.7,
                    }}
                  >
                    {ratings.map((item) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                          marginBottom: 5,
                          alignSelf: "stretch",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: "#000000",
                          }}
                        >
                          {item.rating}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flex: 1,
                            marginLeft: 5,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#EBEBEB",
                          }}
                        >
                          <div
                            style={{
                              width: `${item.pecentage}%`,
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: "#00885F",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}
