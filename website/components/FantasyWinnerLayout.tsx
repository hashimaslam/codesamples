import React, { Component } from "react";
import FantasyWinner from "./FantasyWinner";
import Header from "./Header";
import Steps from "./Steps";
import StickyButton from "./StickyButton";
import Footer from "./Footer";
import Stats from "./Stats";
import vplApp from "./vplApp";
import * as imgRef from "../configs/images";
import * as CONSTANTS from "../configs/constants";
import * as vplAppText from "../configs/vplAppText";
import {
  butTxt,
  butnum,
  SUPERTEAM_HEADING11,
  SUPERTEAM_HEADING12,
  SUPERTEAM_HEADING_P,
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
  SUPERTEAM_HEADING11,
  SUPERTEAM_HEADING12,
  SUPERTEAM_HEADING_P,
  HEADING2,
  STEP11,
  STEP12,
  STEP2,
  STEP3,
  SUBHEAD,
  STICKY_MSG,
};

export default class extends Component {
  render() {
    return (
      <React.Fragment>
        <Header
          logo={imgRef.vpl_TXT_LOGO}
          firstNav={CONSTANTS.vpl}
          redirect={"/"}
        />
        <FantasyWinner />
        <Stats pageType="SUPERTEAM" />

        <vplApp
          title={"PLAY & WIN BIG CASH DAILY"}
          imageObj={imgRef.SUPERTEAM_PLAY_WIN}
          header1={vplAppText.HEADER_SUPER_1}
          header2={vplAppText.HEADER_SUPER_2}
          header3={vplAppText.HEADER_SUPER_3}
          paragraph1={vplAppText.PARAGRAPH_SUPER_1}
          paragraph2={vplAppText.PARAGRAPH_SUPER_2}
          paragraph3={vplAppText.PARAGRAPH_SUPER_3}
        />
        {/* <GameTiles page={"superteam"} /> */}
        <Steps lang={lang} heading={CONSTANTS.STEPS_TO_INSTALL_APP} />
        <Footer classObj={"superteam-footer vpl-footer"} />
        <StickyButton
          device={this.props.device}
          browser={this.props.browser}
          config={this.props.config}
        />
        <style jsx>{``}</style>
      </React.Fragment>
    );
  }
}
