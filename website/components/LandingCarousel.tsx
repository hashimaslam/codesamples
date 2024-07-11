import React, { Component, Fragment } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/landing-carousel.scss";

import * as imgRef from "../configs/images";
import osType from "../configs/detectOs";
import { DownloadStateConsumer } from "./DownloadState";
import SendSMSStatic from "./SendSMSStatic";
import DownloadButton from "./DownloadButton";

export default class extends Component {
  componentDidMount() {
    this.setState({
      osType: osType(),
    });
  }
  render() {
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
            <Carousel showThumbs={false} showStatus={false}>
              {carouselConfig.map((carousel) => (
                <div className={carousel.className}>
                  <div className="head">
                    <div className="mobile">
                      <h2>{carousel.heading}</h2>
                      <h2>{this.props.heading2}</h2>
                      <p>{this.props.paragraph}</p>
                    </div>
                  </div>
                  <div className={this.props.sectionClass}>
                    {this.state && this.state.osType === "desktop" ? (
                      <div id="heading-txt" className="desktop">
                        <h2>{this.props.heading1}</h2>
                        <h2>{this.props.heading2}</h2>
                        <p>{this.props.paragraph}</p>
                        <SendSMSStatic />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className={this.props.secondaryClass}>
                      <picture>
                        <source
                          srcSet={carousel.imageDesktopObj}
                          type="image/webp"
                        />
                        <source
                          srcSet={carousel.imageDesktopObj}
                          type="image/jpeg"
                        />
                        <img src={carousel.imageDesktopObj} />
                      </picture>
                    </div>
                  </div>
                  {/* <img id="crest-back" src={imgRef.vpl_CREST_WHITE} alt="" /> */}
                </div>
              ))}
            </Carousel>
            {this.state && this.state.osType !== "desktop" ? (
              <div id="download-bar">
                <DownloadButton />

                <div>
                  <a href="" />
                </div>
                <div className="download-text-landing">
                  {getText(config.config)}
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
