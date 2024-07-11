import React, { Component } from "react";
import Head from "next/head";
import { DownloadStateConsumer } from "../components/DownloadState";
import DownloadButton from "../components/DownloadButton";
import { vpl_WIKI } from "../configs/schema";
import FlashCards from "../components/FlashCards";
import { vplSportsVIP } from "../components/ipl2021/vplSportsVIP";
import { TestimonialIPL } from "../components/ipl2021/Testimonial-IPL";
import BannerImageIPL from "./ipl2021/BannerImageIPL";
import RewardsBarSliding from "./ipl2021/RewardsBarSliding";
import IconTextButton from "./ipl2021/IconTextButton";
import { StickySection } from "./ipl2021/StickySection";
import SendSMSIPL from "./ipl2021/SendSMSIPL";
import "../styles/trim_global.scss";
import PageHeader from "../components/ipl2021/PageHeader";
import { CustomImage } from "../components/ipl2021/CustomImage";
import { Text } from "../components/ipl2021/Text";
import { H4header } from "../components/ipl2021/H4header";
import { H2header } from "../components/ipl2021/H2header";
import { PaymentsComponent } from "../components/ipl2021/PaymentsComponent";
import FaqsComponent from "../components/ipl2021/FaqsComponent";
import { ImgComponent } from "../components/ipl2021/ImgComponent";
import TextualContentComponent from "../components/ipl2021/TextualContentComponent";
import { FooterLinks } from "../components/ipl2021/FooterLinks";
import { SingleLineText } from "../components/ipl2021/SingleLineText";
import { AndroidInstallSteps } from "../components/ipl2021/AndroidInstallSteps";
import { Sponsor } from "../components/ipl2021/Sponsor";
import PageHeaderHiddenComponents from "./ipl2021/PageHeaderHiddenComponents";

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

let KeysToComponentMap = {
  downloadbutton: DownloadButton,
  pageheader: PageHeader,
  customimage: CustomImage,
  text: Text,
  h2header: H2header,
  h4header: H4header,
  paymentscomponent: PaymentsComponent,
  faqscomponent: FaqsComponent,
  imgcomponent: ImgComponent,
  textualcontentcomponent: TextualContentComponent,
  footerlinks: FooterLinks,
  singlelinetext: SingleLineText,
  androidinstallsteps: AndroidInstallSteps,
  sponsor: Sponsor,
  vplsportsvip: vplSportsVIP,
  testimonialipl: TestimonialIPL,
  bannerimageipl: BannerImageIPL,
  rewardsbarsliding: RewardsBarSliding,
  icontextbutton: IconTextButton,
  stickysection: StickySection,
  sendsmsipl: SendSMSIPL,
  pageheaderhiddencomponents: PageHeaderHiddenComponents,
};

export default class extends Component {
  constructor(props) {
    super(props);
    let pagename = "home";
    let pageData = props.pageJson;

    let bannerComponent = pageData.body.components.filter(
      (comp) => comp.name === "BannerImage"
    )[0];

    if (!bannerComponent) {
      bannerComponent = pageData.body.components.filter(
        (comp) => comp.name === "bannerimageipl"
      )[0];
    }
    const desktopWebp = bannerComponent.data.desktopImageurl.webp;
    const mobileWebp = bannerComponent.data.mobileImageurl.webp;
    this.state = {
      pageJson: pageData,
      desktopWebp,
      mobileWebp,
      page: pagename,
    };
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            <Head>
              <title>{this.state.pageJson.head.title}</title>
              <link
                rel="icon"
                type="image/x-icon"
                href={this.state.pageJson.head.faviconImageUrl}
              />
              <link rel="canonical" href={this.state.pageJson.head.canonical} />
              {this.state.pageJson.head.noindex && (
                <meta name="robots" content="noindex, nofollow" />
              )}
              <script
                defer
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: vpl_WIKI }}
              />
              {this.state.pageJson.head.metaTags.map(
                (data, index) =>
                  (data.property && (
                    <meta
                      property={data.property}
                      content={data.content}
                      key={index}
                    ></meta>
                  )) ||
                  (data.name && (
                    <meta
                      name={data.name}
                      content={data.content}
                      key={index}
                    ></meta>
                  ))
              )}
              {config.config.LANG_CODE === "id" ? (
                <link rel="preconnect" href="https://id-cledge.vpl.live" />
              ) : (
                <link rel="preconnect" href="https://akedge.vpl.live" />
              )}
              {this.props.device == "desktop" ? (
                <link
                  rel="preload"
                  as="image"
                  href={this.state.desktopWebp}
                  type="image/webp"
                />
              ) : (
                <link
                  rel="preload"
                  as="image"
                  href={this.state.mobileWebp}
                  type="image/webp"
                />
              )}
            </Head>
            {this.state.pageJson.body.components.map((comp, index) => {
              if (comp.isParent) {
                let componentName = comp.name.toLowerCase();
                let Component = KeysToComponentMap[componentName];
                let compProps = "";
                switch (componentName) {
                  case "bannerimageipl":
                    compProps = {
                      ...comp.data,
                      config: this.props.config,
                      device: this.props.device,
                      osType: this.props.device,
                      smsData: this.state.pageJson.body.components[1].data,
                      rewardsBar: this.state.pageJson.body.components[2].data,
                      page: this.state.page,
                    };
                    break;
                  case "stickybutton":
                    compProps = {
                      ...comp.data,
                      config: this.props.config,
                      device: this.props.device,
                      osType: this.props.device,
                      rewardsBar: this.state.pageJson.body.components[2].data,
                      page: this.state.page,
                    };
                    break;
                  default:
                    compProps = {
                      ...comp.data,
                      config: this.props.config,
                      device: this.props.device,
                      osType: this.props.device,
                      page: this.state.page,
                    };
                }

                return <Component {...compProps} key={index} />;
              }
            })}
            <FlashCards
              device={this.props.device}
              config={this.props.config}
            ></FlashCards>
            <style jsx global>
              {`
                #sms-msg {
                  color: rgba(255, 255, 255, 0.95) !important;
                  text-align: left !important;
                }
              `}
            </style>
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}
