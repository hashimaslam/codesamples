import React, { Component } from "react";
import osType from "../configs/detectOs";
import dynamic from "next/dynamic";
import LandingBanner from "./LandingBanner";
import Payout from "./Payout";
import TopGames from "./TopGames";
import ShowTopGames from "./ShowTopGames";
import Header from "../components/HeaderStatic";
const Steps = dynamic(() => import("../components/StepsStatic"));
import StickyButton from "../components/StickyButtonStatic";
import DownlaodReferral from "./DownloadReferral";
import Footer from "../components/FooterStatic";
import MoneyWithdraw from "./MoneyWithdraw";
import { Membership } from "../components/Membership";
import { PageInfo } from "./PageInfo";
import LandingAccordion from "../components/LandingAccordion";
import Head from "next/head";
import browser from "../configs/detectBrowser";
import BannerImage from "../components/BannerImage";
import Landing from "./Landing";
import "../styles/seopage.scss";
import * as imgRef from "../configs/images";
import {
  butTxt,
  butnum,
  HEADING11,
  HEADING12,
  HEADING122,
  HEADING123,
  HEADING2,
  STEP11,
  STEP12,
  STEP2,
  STEP3,
  SUBHEAD,
  STICKY_MSG,
} from "../configs/home_data";
import {
  LANDING_PAGE_TOP_GAMES_HEADER,
  FANTASY,
  STEPS_TO_INSTALL_APP,
  MAIN_PAGE_ABOUT_vpl_HEADER,
  MAIN_PAGE_ABOUT_vpl_PARAGRAPH,
  HOME_PAGE_BANNER_TITLE,
} from "../configs/constants";
let lang = {
  butTxt,
  butnum,
  HEADING11,
  HEADING12,
  HEADING122,
  HEADING123,
  HEADING2,
  STEP11,
  STEP12,
  STEP2,
  STEP3,
  SUBHEAD,
  STICKY_MSG,
};

export default class extends Component {
  constructor(props) {
    super(props);
    let deviceType = props.device;
    let browserName = props.browser;
    if (typeof window !== "undefined") {
      deviceType = osType();
      browserName = browser();
    }

    // const imgRef = require("../configs/images")(browserName);
    let bannerImageBGURL = "";
    let bannerMobileImage = "";
    if (deviceType === "desktop") {
      bannerImageBGURL = imgRef.HOME_PAGE_BANNER_DESKTOP_png;
    } else bannerMobileImage = imgRef.HOME_PAGE_BANNER_MOBILE_png;
    this.state = {
      osType: deviceType,
      bannerImageBGURL: bannerImageBGURL,
      browser: browserName,
      bannerMobileImage,
    };
  }

  // componentDidMount () {
  //     const imgRef = require('../configs/images');
  //     this.setState({
  //         osType: osType(),
  //         imgRef: imgRef
  //     });
  // }

  renderSwitch(param) {
    switch (param) {
      case "referral":
        return (
          <DownlaodReferral
            imageObj={imgRef.VK_HERO_ANRDOID}
            imageDesktopObj={imgRef.VK_HERO_DESKTOP}
            imageDesktopWebObj={imgRef.VK_HERO_DESKTOP_WEB}
            referralData={this.props.config.config.referral}
          />
        );

      default:
        return (
          // <BannerImage
          // img={this.state.bannerMobileImage}
          // headingSubHeading={HOME_PAGE_BANNER_TITLE}
          // showPlayNow={false}
          // addDarkGradient={false}
          // osType={this.state.osType}
          // imgBackgroundDesktop = {this.state.bannerImageBGURL}
          // device={this.state.osType}
          // browser={this.state.browser}
          // config={this.props.config}
          // />
          <div></div>
        );
    }
  }
  render() {
    return (
      <React.Fragment>
        <Header
          logo={imgRef.vpl_TXT_LOGO}
          firstNav={FANTASY}
          redirect={"/fantasy"}
        />
        <Head>
          <meta
            id="meta-description"
            name="description"
            content="vpl brings to you real money earning games. Download vpl pro now to win real cash by playing Fantasy Cricket, Fantasy Football, Bubble Shooter & many more games online."
          />
          <meta
            name="keywords"
            content="real money earning games, earn money playing games, online money earning games, online cash winning games, win real cash games, win real cash games, play and win cash, play games for cash, win real money games, play and earn money, play fantasy cricket and win cash daily, play fantasy cricket and win real cash"
          />
        </Head>
        {this.props.config.config.referral
          ? this.renderSwitch("referral")
          : this.renderSwitch("desktop")}

        <Landing
          parentId={"landing"}
          heading1={lang.HEADING11}
          heading2={lang.HEADING12}
          paragraph="Play Mobile Games & Win Big Cash Daily!"
          sectionClass={"landing-section"}
          secondaryClass={"landing-sec"}
          imageObj={imgRef.VK_HERO_ANRDOID}
          imageDesktopObj={imgRef.VK_HERO_DESKTOP}
          config={this.props.config}
          osType={this.props.device}
        />
        {/* <Payout imgRef={imgRef} /> */}
        {/* <MoneyWithdraw paymentMode={imgRef.MONEY_WITHDRAW_OPTIONS} /> */}
        <div id="abt1">
          <img className="icnimg" src={imgRef.LANDING_TRUST} />
        </div>
        {/* <TopGames imgRef={imgRef} appUrl={this.props.config.config.APP_URL}  /> */}
        {/* <ShowTopGames
          topGamesImages={imgRef.TOP_GAMES_LANDING_PAGE}
          heading={LANDING_PAGE_TOP_GAMES_HEADER}
          device={this.state.osType}
          browser={this.state.browser}
        /> */}
        {/* <PageInfo
          header ={MAIN_PAGE_ABOUT_vpl_HEADER}
            paragraphes = {MAIN_PAGE_ABOUT_vpl_PARAGRAPH}
            headingStyle={'true'}
          /> */}
        {/* <TopGames /> */}
        <Steps lang={lang} heading={STEPS_TO_INSTALL_APP} />
        {/* <Membership membership={imgRef.MEMBERSHIPS_WCC_PAGE} /> */}

        <Footer classObj={"vpl-footer"} />
        <StickyButton
          device={this.state.osType}
          browser={this.state.browser}
          config={this.props.config}
        />
      </React.Fragment>
    );
  }
}
