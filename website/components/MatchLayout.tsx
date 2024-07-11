import React, { Component } from "react";
import osType from "../configs/detectOs";
import Match from "./Match";
import Header from "./Header";
import Steps from "./Steps";
import StickyButton from "./StickyButton";
import Footer from "./Footer";
import Stats from "./Stats";
import vplApp from "./vplApp";
import GameTiles from "./GamesTiles";
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
        <Match
          parentId={"superteam-landing"}
          heading1={lang.SUPERTEAM_HEADING11}
          heading2={lang.SUPERTEAM_HEADING12}
          paragraph={lang.SUPERTEAM_HEADING_P}
          sectionClass={"superteam-landing-section"}
          secondaryClass={"superteam-landing-sec"}
          imageObj={imgRef.NEW_KL_RAHUL}
          imageDesktopObj={imgRef.NEW_KL_RAHUL}
          device={this.props.device}
          config={this.props.config}
        />
        <Stats pageType="SUPERTEAM" />

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
