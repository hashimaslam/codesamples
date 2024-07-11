import React, { Component } from "react";
import osType from "../configs/detectOs";
import Landing from "./Landing";
import Header from "./HeaderStatic";
import Steps from "./StepsStatic";
import StickyButton from "./StickyButtonStatic";
import Footer from "./FooterStatic";
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
        <Landing
          parentId={"superteam-landing"}
          heading1={lang.SUPERTEAM_HEADING11}
          heading2={lang.SUPERTEAM_HEADING12}
          paragraph={lang.SUPERTEAM_HEADING_P}
          sectionClass={"superteam-landing-section"}
          secondaryClass={"superteam-landing-sec"}
          imageObj={imgRef.NEW_KL_RAHUL}
          imageDesktopObj={imgRef.NEW_KL_RAHUL}
          imageDesktopWebObj={imgRef.NEW_KL_RAHUL}
          config={this.props.config}
          osType={this.props.device}
        />
        <Stats pageType="SUPERTEAM" />
        <Steps lang={lang} heading={CONSTANTS.STEPS_TO_INSTALL_APP} />
        <Footer classObj={"superteam-footer vpl-footer"} />
        <StickyButton device={this.props.device} config={this.props.config} />
        <style jsx>{``}</style>
      </React.Fragment>
    );
  }
}
