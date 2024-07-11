// import * as imgRef from "../configs/images";
import SendSMSStatic from "./SendSMSStatic";
import React, { Component } from "react";
import osType from "../configs/detectOs";
import "../styles/hero.scss";
import * as imgRef from '../configs/images';
export default class extends Component {
    constructor (props) {
        super(props);
       // this.state = { imgRef: false };
    }
    componentDidMount () {
       // const imgRef = require('../configs/images');
        this.setState({
            osType: osType()
        });
    }

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${imgRef.HERO_BG})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
      >
        <div id="hero">
          <div id="hero-content">
            <div>
              <div>
                <img id="hero-logo" src={imgRef.HERO_LOGO} alt="" />
              </div>
              <div className="hero-head">
                <h2>PRIZE POOL</h2>
                <h1> &#8377; 1 Crore</h1>
              </div>
            </div>
            <div id="hero-schedule">
              <h2>UPCOMING GAMES</h2>

              <div className="hero-head">
                <div className="game">
                  <div>
                    <img
                      className="game-icon"
                      src={imgRef.CARROM_ICON}
                      alt=""
                    />{" "}
                  </div>
                  <div className="desc">
                    <h3>CARROM</h3>
                    <h4>
                      <img src={imgRef.BATTLE_ICON} /> BATTLE ARENA
                    </h4>
                    <h4>
                      20<sup>TH</sup> APR 10AM - 21<sup>ST</sup> APR 10PM
                    </h4>
                  </div>
                </div>
                <div className="game">
                  <div>
                    <img
                      className="game-icon"
                      src={imgRef.RUNOUT_ICON}
                      alt=""
                    />{" "}
                  </div>
                  <div className="desc">
                    <h3>RUNOUT</h3>
                    <h4>
                      <img src={imgRef.TE_ICON} /> TOURNAMENT
                    </h4>
                    <h4>
                      21<sup>ST</sup> APR 12PM - 11PM
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div />
          </div>

          <div id="sms">
            <SendSMSStatic />
          </div>
        </div>
        <style jsx>{`
          h3 img {
            height: 30px !important;
            width: auto !important;
            margin-right: 0 !important;
          }
        `}</style>
      </div>
    );
  }
}
