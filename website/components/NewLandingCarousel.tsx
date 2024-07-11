import React, { Component, Fragment } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/landing-carousel.scss";
import * as imgRef from "../configs/images";
import osType from "../configs/detectOs";
import { DownloadStateConsumer } from "./DownloadState";
import SendSMSStatic from "./SendSMSStatic";
import NewDownlaodButton from "./NewDownlaodButton";

export default class extends Component {
  componentDidMount() {
    this.setState({
      osType: osType(),
    });
  }
  render() {
    const { landingImgages, heading11, imageDesktopObj1 } = this.props;
    if (landingImgages === undefined) return "";

    const carouselCon = landingImgages.map((img) => {
      const temp = {};
      temp.style = { backgroundImage: "url(" + img + ")" };
      temp.heading = heading11;
      temp.imageObj = "this.props.imageDesktopObj";
      temp.imageDesktopObj = imageDesktopObj1;
      temp.className = "carousel-landing";
      return temp;
    });
    const carouselConfig = [
      {
        className: "carousel-landing landing-1",
        heading: this.props.heading11,
        imageObj: "this.props.imageDesktopObj",
        imageDesktopObj: this.props.imageDesktopObj1,
      },

      {
        className: "carousel-landing landing-2",
        heading: this.props.heading12,
        imageObj: "this.props.imageDesktopObj",
        imageDesktopObj: this.props.imageDesktopObj2,
      },
    ];
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
            <Carousel showThumbs={false} showStatus={false} autoPlay>
              {carouselCon
                ? carouselCon.map((carousel) => (
                    <div className={carousel.className} style={carousel.style}>
                      <div className="img-header-footer-wrapper">
                        <div className="header-box">
                          <div className="header">
                            <h2>Play 30+ Games, Win Cash Daily!e</h2>
                            <h3>
                              Play Casual Games, Fantasy Sports, Rummy & More to
                              Big Win Cash Daily!
                            </h3>
                          </div>
                        </div>
                        <div className="footer-box">
                          <div className="button-section">
                            <NewDownlaodButton />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </Carousel>
            {this.state && this.state.osType !== "desktop" ? (
              <div id="download-bar">
                <div>
                  {config && config.config ? getText(config.config) : ""}
                </div>
              </div>
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}
