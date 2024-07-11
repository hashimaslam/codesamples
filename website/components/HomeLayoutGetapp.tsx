import React, { Component } from "react";
import osType from "../configs/detectOs";
import Landing from "./Landing";
import Header from "../components/HeaderStatic";
import Steps from "../components/StepsStatic";
import Footer from "../components/FooterStatic";
import StickyButton from "../components/StickyButtonStatic";
import Stats from "./Stats";
import vplApp from "./vplApp";
import GameTiles from "./GamesTiles";
import PlayStoreStickyButton from "../components/PlayStoreStickyButton";
import DownlaodReferral from "./DownloadReferral";
import {
  butTxt,
  butnum,
  HEADING11,
  HEADING12,
  HEADING2,
  STEP11,
  STEP12,
  STEP2,
  STEP3,
  SUBHEAD,
  STICKY_MSG,
} from "../configs/home_data";
let lang = {
  butTxt,
  butnum,
  HEADING11,
  HEADING12,
  HEADING2,
  STEP11,
  STEP12,
  STEP2,
  STEP3,
  SUBHEAD,
  STICKY_MSG,
};
import * as imgRef from "../configs/images";
import * as CONSTANTS from "../configs/constants";
import * as vplAppText from "../configs/vplAppText";

export default class extends Component {
  componentDidMount() {}
  render() {
    return (
      <React.Fragment>
        <Header
          logo={imgRef.vpl_TXT_LOGO}
          firstNav={CONSTANTS.SUPER_TEAM}
          redirect={"/superteam"}
        />
        {this.props.config.config.referral ? (
          <DownlaodReferral
            imageObj={imgRef.VK_HERO_ANRDOID}
            imageDesktopObj={imgRef.VK_HERO_DESKTOP}
            referralData={this.props.config.config.referral}
          />
        ) : (
          <Landing
            parentId={"landing"}
            heading1={
              this.props.ln === "hi"
                ? "भारत का सबसे बड़ा गेमिंग ऍप"
                : lang.HEADING11
            }
            heading2={lang.HEADING12}
            paragraph={
              this.props.ln === "hi"
                ? "खेलिये मोबाइल गेम्स और रोज़ जीतिए  रियल कॅश!"
                : "Play Mobile Games & Win Big Cash Daily!"
            }
            sectionClass={"landing-section"}
            secondaryClass={"landing-sec"}
            imageObj={imgRef.VK_HERO_ANRDOID}
            imageDesktopObj={imgRef.VK_HERO_DESKTOP}
            config={this.props.config}
            osType={this.props.device}
          />
        )}
        {/* <Landing
          parentId={"landing"}
          heading1={lang.HEADING11}
          heading2={lang.HEADING12}
          paragraph={"Play Mobile Games & Win Big Cash Daily!"}
          sectionClass={"landing-section"}
          secondaryClass={"landing-sec"}
          imageObj={imgRef.VK_HERO_ANRDOID}
          imageDesktopObj={imgRef.VK_HERO_DESKTOP}
        /> */}
        <Stats />
        {/* <GameTiles page={"home"} /> */}
        {/* <vplApp
          title={"PLAY & WIN BIG CASH DAILY"}
          imageObj={imgRef.vpl_APP}
          header1={vplAppText.HEADER_1}
          header2={vplAppText.HEADER_2}
          header3={vplAppText.HEADER_3}
          paragraph1={vplAppText.PARAGRAPH_1}
          paragraph2={vplAppText.PARAGRAPH_2}
          paragraph3={vplAppText.PARAGRAPH_3}
        /> */}
        {/* <Steps lang={lang} /> */}
        <Steps lang={lang} heading={CONSTANTS.STEPS_TO_INSTALL_APP} />
        {/* {this.state.osType !== "desktop" ? <StickyButton /> : ""} */}
        <Footer classObj={"vpl-footer"} />
        <StickyButton device={this.props.device} config={this.props.config} />
        <style jsx>{``}</style>
      </React.Fragment>
    );
  }
}
