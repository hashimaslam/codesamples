import React, { Component } from "react";
// export const DownloadState = React.createContext({ downloading: false });
import dynamic from "next/dynamic";
import osType from "../configs/detectOs";
import BannerImage from "../components/BannerImage";
import { Membership } from "../components/Membership";
import Header from "./ipl2021/NewHeader";
import { FooterLinks } from "./ipl2021/FooterLinks";
import MoneyWithdraw from "../components/MoneyWithdraw";
import ShowTopGames from "./ShowTopGames";
import Steps from "../components/Steps";
import { PageInfo } from "./PageInfo";
import TopGames from "./TopGames";
import AboutSection from "./AboutSection";
import Footer from "../components/Footer";
import Disclaimer from "./Disclaimer";
import StickyButton from "../components/StickyButton";
import SendSMS from "../components/SendSMS";
import { PageInfoParagraph } from "../components/PageInfoParagraph";
import { ListPoints } from "../components/ListPoints";
import { MiddleHeading } from "../components/MiddleHeading";
import RummyFaqs from "../components/RummyFaqs";
import { EnteringTheTournament } from "../components/EnteringTheTournament";
import { FaqsComponent } from "../components/FaqsComponent";
import { StepsBoxImg } from "../components/StepsBoxImg";
import { CricketTip } from "../components/CricketTip";
import ActionButton from "../components/ActionButton";
import { ListImage } from "../components/ListImage";
import ListPointsToggle from "../components/ListPointsToggle";
import ContentListPointsToggle from "../components/ContentListPointsToggle";
import DownloadButtonBanner from "../components/DownloadButtonBanner";
import DownloadButton from "../components/DownloadButton";
import DownloadButtonBannerStatic from "../components/DownloadButtonBannerStatic";
import { ImageContainer } from "../components/ImageContainer";
import Fqas from "../components/Faqs";

import { Container } from "../components/Container";
import {
  HowToPlayPoker,
  Variantions,
  HandRanks,
  HowtoPlayPokerList,
} from "../components/HowToPlayPokerComponents";
import PointsTable from "../components/PointsTable";
import Testimonials from "../components/Testimonials";
// import OfferSticker from "../components/offerSticker";
import { ImageComponent } from "./ImageComponent";
import DownloadButtonCheckbox from "../components/DownloadButtonCheckbox";
import InfoWithImage from "../components/InfoWithImage";
import { VideoContainer } from "../components/VideoContainer";
import { EsportsGameInfo } from "../components/EsportsGameInfo";
import { Heading } from "../components/Heading";
import { ImageCard } from "../components/ImageCard";
import { BackButton } from "../components/BackButton";
import { PokerAffiliateForms } from "../components/PokerAffiliateForms";
import PageInfoShowMore from "./PageInfoShowMore";
import ListPointsShowMore from "./ListPointsShowMore";
import BoxComponent from "./BoxComponent";
import CarouselComponent from "./CarouselComponent";
import { Dropdown } from "../components/Dropdown";
import { Table } from "../components/Table";
import { CardInfo } from "../components/CardInfo";
import ListModal from "../components/ListModal";
//Banner Carousel Experiment
import BannerCarousel from "./BannerCarousel";
/* First we will make a new context */
const DownloadStateContext = React.createContext();

import LiveStream from "../components/LiveStream";
// onbaording experiments
const OnBoarding2 = dynamic(() => import("../components/OnBoarding2"));
const OnBoarding3 = dynamic(() => import("../components/OnBoarding3"));
const FlashCards = dynamic(() => import("../components/FlashCards"));
import ScheduleTable from "../components/ScheduleTable";
// import { WinnerSlider } from "../components/WinnerSlider";
import { ContentVerticalImg } from "./ContentVerticalImg";
import { vplSportsVIP } from "../components/ipl2021/vplSportsVIP";
import { H2header } from "../components/ipl2021/H2header";
import { TestimonialIPL } from "../components/ipl2021/Testimonial-IPL";
import BannerImageIPL from "./ipl2021/BannerImageIPL";
import RewardsBarSliding from "./ipl2021/RewardsBarSliding";
import IconTextButton from "./ipl2021/IconTextButton";
import { StickySection } from "./ipl2021/StickySection";
import SendSMSIPL from "./ipl2021/SendSMSIPL";
import NewHeader from "./ipl2021/NewHeader";

/* Then create a provider Component */
class DownloadStateProvider extends Component {
  constructor(props) {
    super(props);
    let KeysToComponentMap = {
      bannerimage: BannerImage,
      header: Header,
      moneywithdraw: MoneyWithdraw,
      showtopgames: ShowTopGames,
      steps: Steps,
      pageinfo: PageInfo,
      topgames: TopGames,
      aboutsection: AboutSection,
      membership: Membership,
      footer: FooterLinks,
      disclaimer: Disclaimer,
      stickybutton: StickyButton,
      SendSMS: SendSMS,
      middleheading: MiddleHeading,
      pageinfoparagraph: PageInfoParagraph,
      listpoints: ListPoints,
      faqscomponent: FaqsComponent,
      rummyfaqs: RummyFaqs,
      enteringthetournament: EnteringTheTournament,
      stepsboximg: StepsBoxImg,
      crickettip: CricketTip,
      pointstable: PointsTable,
      handranks: HandRanks,
      howtoplaypoker: HowToPlayPoker,
      variantions: Variantions,
      howtoplaypokerlist: HowtoPlayPokerList,
      actionbutton: ActionButton,
      listimage: ListImage,
      listpointstoggle: ListPointsToggle,
      contentlistpointstoggle: ContentListPointsToggle,
      downloadbuttonbanner: DownloadButtonBanner,
      downloadbutton: DownloadButton,
      downloadbuttonbannerstatic: DownloadButtonBannerStatic,
      imagecontainer: ImageContainer,
      faqs: Fqas,
      testimonials: Testimonials,
      imagecomponent: ImageComponent,
      downloadbuttoncheckbox: DownloadButtonCheckbox,
      infowithimage: InfoWithImage,
      videocontainer: VideoContainer,
      esportsgameinfo: EsportsGameInfo,
      heading: Heading,
      imagecard: ImageCard,
      backbutton: BackButton,
      container: Container,
      pokeraffiliateforms: PokerAffiliateForms,
      pageinfoshowmore: PageInfoShowMore,
      listpointsshowmore: ListPointsShowMore,
      boxcomponent: BoxComponent,
      carouselcomponent: CarouselComponent,
      dropdown: Dropdown,
      table: Table,
      cardinfo: CardInfo,
      listmodal: ListModal,
      livestream: LiveStream,
      onboarding2: OnBoarding2,
      onboarding3: OnBoarding3,
      flashcards: FlashCards,
      scheduletable: ScheduleTable,
      contentverticalimg: ContentVerticalImg,
      vplsportsvip: vplSportsVIP,
      h2header: H2header,
      testimonialipl: TestimonialIPL,
      bannerimageipl: BannerImageIPL,
      rewardsbarsliding: RewardsBarSliding,
      icontextbutton: IconTextButton,
      stickysection: StickySection,
      sendsmsipl: SendSMSIPL,
      footerlinks: FooterLinks,
      newheader: NewHeader,
      bannercarousel: BannerCarousel,
    };
    this.state = {};
    this.state = {
      isWebView: false,
      currentState: false,
      config: this.props.children ? this.props.children.props.config : "",
      keysToComponentMap: KeysToComponentMap,
      pageJson: this.props.children
        ? Object.keys(this.props.children.props.pageJson).length > 0
          ? this.props.children.props.pageJson
          : ""
        : "",
    };
  }

  getvariantAPK() {
    // window.onboardingExperiment = this.props.config.config.DOWNLOAD_LINK.ONBOARDING_V3;
    let variantapklink = this.props.children.props.config.config.APP_URL;
    if (!window.onboardingExperiment) {
      window.onboardingExperiment = variantapklink;
    }
  }

  marketingTrackerCode() {
    var vm = this;
    if (
      !vm.props.children.props.config ||
      !vm.props.children.props.config.config
    )
      return;
    // if (pageName === "/superteam") {

    // var url = vm.generateUrl(false);

    const onelinkGenerator =
      window.location.href.indexOf("vpl.live/?trackers=false") == -1 &&
      new window.AF.OneLinkUrlGenerator({
        oneLinkURL: "https://vpl.onelink.me/cRBD",
        pidKeysList: ["af_pid", "utm_source"],
        campaignKeysList: ["af_c", "utm_campaign"],
        gclIdParam: "af_sub1",
      });

    let url;
    if (onelinkGenerator) {
      url = onelinkGenerator.generateUrl();
      window.onelinkurl = url;
    }
    if (
      (window.location.pathname == "/rd" ||
        window.location.pathname == "/download") &&
      (vm.getParameterFromURL("referralCode") ||
        vm.getParameterFromURL("referralcode"))
    ) {
      url = vm.generateUrl(false);
      window.onelinkurl = url;
    }
    if (url) {
      if (window.location.pathname) {
        this.getvariantAPK();

        vm.setState({
          APK_URL: encodeURI(
            url +
              `&af_android_url=${
                window.battleAPK
                  ? window.battleAPK
                  : vm.props.children.props.config.config.APP_URL
              }`
          ),
        });
      } else {
        vm.setState({
          APK_URL: encodeURI(
            url +
              `&af_android_url=${vm.props.children.props.config.config.APP_URL}`
          ),
        });
      }
    }
    // created for blog use
    // window.androidAPKUrl = window.battleAPK
    //   ? window.battleAPK
    //   : vm.props.children.props.config.config.APP_URL;
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "/static/js/onelink-smart-script.js";
    script.async = true;
    window.location.href.indexOf("vpl.live/?trackers=false") == -1 &&
      document.body.appendChild(script);
    const ostype = osType();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "Page-Load",
      var_os: ostype,
      referral_url: window.location.href,
    });

    let lang = "en";
    let vim = this;
    try {
      let lang = this.props.children.props.config.config
        ? vim.props.children.props.config.config.LANG_CODE
        : "";
    } catch (ex) {
      lang = "en";
    }

    if (lang === "en") {
      window.onload = function () {
        vim.marketingTrackerCode();
      };
    } else {
      vim.marketingTrackerCode();
    }
    if (navigator.userAgent.includes("wv")) this.setState({ isWebView: true });
    if (window.location.pathname == "/apk-download") {
      this.downloadAPK();
    }
  }
  ////////////

  //Returns the value of a parameter existing in the page's URL or ' ' if not exists.
  getParameterFromURL(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  isMobileDevice() {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  }

  getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent) {
      if (/android/i.test(userAgent)) {
        return "Android";
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
      }
    }
    return "unknown";
  }

  isAFTrackingLink() {
    return this.getParameterFromURL("af_redirect");
  }

  isFacebook() {
    if (document.referrer && document.referrer != "") {
      return document.referrer.toLowerCase().includes("facebook");
    } else {
      return false;
    }
  }

  // generateUrl returns the URL to use behind the iOS and Android "Download" buttons on a landing page, based on the source of the page visitor.
  // By default these buttons should direct to the apps' pages on iTunes and Google Play.
  // If these links should be kept with no change, generateUrl returns ' '.
  // Otherwise, generateUrl returns the URL to be used under BOTH buttons (a single app download button could also be used in this case).
  // Parameters: isDebug - if true, alerts are issued for each of the cases, otherwise not.
  generateUrl(isDebug) {
    var vm = this;
    let config = vm.props.children.props.config.config;
    var oneLinkURL =
      config.LANG_CODE === "id"
        ? config.ONE_LINK
        : "https://vpl.onelink.me/cRBD"; // **** Replace with your own basic OneLink URL ****
    var webFormURL =
      config.LANG_CODE === "id" ? "https://id.vpl.live" : "https://vpl.live"; // **** Replace with your own web form URL for getting the user's email or SMS ****
    var finalURL = "";
    var partnerIDParam = "?pid=";
    var isCustomNetwork = false;
    var campaignValue;
    if (vm.getParameterFromURL("af_c")) {
      campaignValue = vm.getParameterFromURL("af_c");
    } else if (vm.getParameterFromURL("utm_campaign")) {
      campaignValue = vm.getParameterFromURL("utm_campaign");
    }
    //  else if (document.getElementsByTagName("title")[0]) {
    //   campaignValue = document.getElementsByTagName("title")[0].innerText;
    // }
    else {
      campaignValue = "unknown";
    }
    var campaignParam = "&c=";
    var gclidParam = "&af_sub1=";
    var gclidValue = vm.getParameterFromURL("gclid");
    var kwParam = "&af_keywords=";
    var pidValue;
    var kwValue = vm.getParameterFromURL("keyword");
    var afprtParam = "&af_prt=";
    var afprtValue;

    if (vm.getParameterFromURL("af_pid")) {
      pidValue = vm.getParameterFromURL("af_pid");
    } else if (vm.getParameterFromURL("utm_source")) {
      pidValue = vm.getParameterFromURL("utm_source");
      isCustomNetwork = true;
    }
    // indo website params
    if (vm.getParameterFromURL("af_prt")) {
      afprtValue = vm.getParameterFromURL("af_prt");
    }

    var SRNs = [
      //list of supported SRNs
      "twitter_lp",
      "fbpost_lp",
      "snapchat_lp",
      "doubleclick_lp",
      "oath_lp",
      "yahoojapan_lp",
    ];

    // Desktop user
    if (!this.isMobileDevice()) {
      return webFormURL;
    }

    // User was redirected using af_r parameter on an AppsFlyer tracking link
    if (this.isAFTrackingLink()) {
      if (isDebug) {
        alert(
          "This user comes from AppsFlyer by redirection and is ready to be attributed. \nKeep direct app store links."
        );
      }
      return; // in this case, the original store links in the install buttons stay the same

      /*
    If you want one install button in the landing page that serves both iOS and Android, uncomment the code below
    The code identifies the operating system and returns the relevant direct link to Google Play or iTunes
 
    if (getMobileOperatingSystem() === 'Android') {
      return 'direct link to Google Play';
    } 
 
    if (getMobileOperatingSystem() === 'iOS') {
      return 'direct link to iTunes';
    }
    */
    }

    // Google Ads
    if (gclidValue) {
      partnerIDParam += "google_lp";
      campaignParam += campaignValue;
      gclidParam += gclidValue;
      afprtParam += afprtValue;
      if (!kwValue) {
        if (config.LANG_CODE === "id") {
          finalURL =
            oneLinkURL +
            partnerIDParam +
            campaignParam +
            gclidParam +
            afprtParam;
        } else {
          finalURL = oneLinkURL + partnerIDParam + campaignParam + gclidParam;
        }
        if (isDebug) {
          alert("This user comes from Google AdWords\n " + finalURL);
        }
        return finalURL;
      } else {
        // Google Ads with KW
        kwParam += kwValue;
        if (config.LANG_CODE === "id") {
          finalURL =
            oneLinkURL +
            partnerIDParam +
            campaignParam +
            gclidParam +
            kwParam +
            afprtParam;
        } else {
          finalURL =
            oneLinkURL + partnerIDParam + campaignParam + gclidParam + kwParam;
        }

        if (isDebug) {
          alert(
            "This user comes from Google AdWords - there is a keyword associated with the ad\n " +
              finalURL
          );
        }
        return finalURL;
      }

      // Other SRNs and custom networks
    } else if (pidValue) {
      if (SRNs.includes(pidValue) || isCustomNetwork) {
        campaignParam += campaignValue;
        partnerIDParam += pidValue;
        afprtParam += afprtValue;
        if (config.LANG_CODE === "id") {
          finalURL = oneLinkURL + partnerIDParam + campaignParam + afprtParam;
        } else {
          finalURL = oneLinkURL + partnerIDParam + campaignParam;
        }
        if (isDebug) {
          alert(
            "This user comes the SRN or custom network " +
              pidValue +
              "\n" +
              finalURL
          );
        }
        return finalURL;
      }
    } else if (this.isFacebook()) {
      if (isDebug) {
        alert(
          "This user comes from a paid Facebook ad - don't do anything. \nKeep direct app store links."
        );
      }
      return "";
    } else {
      // organic mobile user
      //  campaignParam += campaignValue;
      // partnerIDParam += "website"; //**** Replace value if you wish organic users to be attributed to another media source than 'website' ****
      //finalURL = oneLinkURL + partnerIDParam + campaignParam;
      if (isDebug) {
        alert(
          "This user comes from an unknown mobile source.\n The user would be attributed to media source 'website' and to the campaign " +
            campaignParam +
            "\n" +
            finalURL
        );
      }
      return "";
    }
  }

  getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  /////////////

  changeState = (buttonIdentifier) => {
    console.log("download-click-button-1");
    console.log(this.state.APK_URL);

    //onboarding experiments
    this.getvariantAPK();
    //changeState

    console.log("download-click-button-1");
    console.log(this.state.APK_URL);

    //onboarding experiments
    this.getvariantAPK();
    //changeState
    let pagename = window.location.pathname;

    try {
      const ostype = osType();
      let language = this.props.children.props.config.config.LANG_CODE;

      var element = document.createElement("a");

      if (ostype === "android") {
        if (this.state.APK_URL !== undefined) {
          if (
            this.state.APK_URL.length > 0 &&
            !this.state.config.config.BRANCH_URL
          ) {
            element.setAttribute("href", this.state.APK_URL);
            console.log("download-click-button-0");
            console.log(this.state.APK_URL);
            window.clickonelinkurl = this.state.APK_URL;
          } else if (pagename === "/" && window.battleAPK) {
            element.setAttribute("href", window.battleAPK);
            window.clickonelinkurl = window.battleAPK;
            console.log("download-click-button-1");
            console.log(window.battleAPK);
          } else {
            console.log("download-click-button-2");
            console.log(this.props.children.props.config.config.APP_URL);
            window.clickonelinkurl =
              this.props.children.props.config.config.APP_URL;
            element.setAttribute(
              "href",
              this.props.children.props.config.config.APP_URL
            );
          }
        } else if (pagename === "/" && window.battleAPK) {
          console.log("download-click-button-3");
          console.log(window.battleAPK);
          element.setAttribute("href", window.battleAPK);
          window.clickonelinkurl = window.battleAPK;
        } else {
          ////////////////////////// Normal URL WIthout CHange/////////////////////////
          console.log("download-click-button-4");
          console.log(this.props.children.props.config.config.APP_URL);
          window.clickonelinkurl =
            this.props.children.props.config.config.APP_URL;

          element.setAttribute(
            "href",
            this.props.children.props.config.config.APP_URL
          );
        }
      } else {
        ////////////////////////// IOS Campaign URL/////////////////////////
        element.setAttribute(
          "href",
          "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
        );
        window.clickonelinkurl = "IOS";
      }

      // element.setAttribute("target", "_blank");
      // element.setAttribute("onClick", "javascript: setTimeout(window.close, 15);");
      console.log("onelinkfinalurl-onclick");
      console.log(window.clickonelinkurl);
      //alert(window.clickonelinkurl);

      element.style.display = "none";
      document.body.appendChild(element);

      // if (pagename === "/lp/poker") {
      //   var ua = navigator.userAgent.toLowerCase();
      //    var isXiomi = ua.indexOf("mi") > -1 || ua.indexOf("redmi") > -1;
      //    if (isXiomi) {

      //    //  if (this.getParameterFromURL("af_r")) {
      //      // let appsStore = this.getParameterFromURL("af_r");
      //        element.setAttribute("href", 'http://mimarket://details?id=com.vpl.androidapp');
      //    //  }
      //    }
      //  }

      if (this.state.isWebView) {
        element.setAttribute("href", "#");
        element.setAttribute(
          "onclick",
          "window.location = 'intent:https://vpl.live/apk-download#Intent;end';"
        );
        // element.setAttribute('onclick', "window.location = 'intent://dweb.vpl.live/apk-download?name=1#Intent;scheme=https;package=com.android.chrome;end';");
      }

      element.click();

      document.body.removeChild(element);

      if (language === "id") {
        window.location.href.indexOf("vpl.live/?trackers=false") == -1 &&
          gtag("event", "Download-App-v0", {
            event_category: ostype,
            event_label: "v0",
          });
      } else {
        fbq("track", "Download-Pro");
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "Download-Pro",
          ButtonName: "Download_Now",
          var_os: ostype,
          LocationOfAction:
            buttonIdentifier == "bottom" ? "footer" : buttonIdentifier,
          referral_url: window.location.href,
          onelinkurl: window.clickonelinkurl,
        });
      }

      if (ostype === "android") {
        try {
          try {
            let step = document.getElementById("steps");
            let bodyRect = document.body.getBoundingClientRect();
            let elemRect = step.getBoundingClientRect();
            let offset = Number(elemRect.top - bodyRect.top);

            if (typeof step != "undefined" && step != null) {
              window.scroll({
                behavior: "smooth",
                left: 0,
                top: offset,
              });
            }
          } catch (error) {}
          document
            .getElementById("sticky-layer")
            .setAttribute("style", "display:block");
          document
            .getElementById("msg")
            .setAttribute("style", "display: none;");
          document
            .getElementById("bar")
            .setAttribute("style", "display: none;");
          document
            .getElementById("copyright")
            .setAttribute("style", "margin-bottom: 90px;");

          window.location.hash = "steps";
        } catch (error) {}
      }

      if (this.props.referralData !== undefined) {
        var $body = document.getElementsByTagName("body")[0];
        var $tempInput = document.createElement("INPUT");
        $body.appendChild($tempInput);
        $tempInput.setAttribute(
          "value",
          `vpl::${this.props.referralData.referralCode}::WEB`
        );
        $tempInput.select();
        document.execCommand("copy");
        $body.removeChild($tempInput);
      } else {
      }
      if (ostype === "android") {
        this.setState({
          currentState: !this.state.currentState,
        });
      } else {
      }
    } catch (error) {}
  };

  downloadAPK() {
    // if(window.location.pathname == "/apk-download"){
    let pagename = window.location.pathname;

    try {
      const ostype = osType();
      let language = this.props.children.props.config.config.LANG_CODE;
      var element = document.createElement("a");

      if (ostype === "android") {
        if (this.state.APK_URL !== undefined) {
          if (
            this.state.APK_URL.length > 0 &&
            !this.state.config.config.BRANCH_URL
          ) {
            element.setAttribute("href", this.state.APK_URL);
            window.clickonelinkurlchromeissue = this.state.APK_URL;
          } else if (pagename === "/" && window.onboardingExperiment) {
            element.setAttribute("href", window.onboardingExperiment);
            window.clickonelinkurlchromeissue = window.onboardingExperiment;
          } else {
            window.clickonelinkurlchromeissue =
              this.props.children.props.config.config.APP_URL;
            element.setAttribute(
              "href",
              this.props.children.props.config.config.APP_URL
            );
          }
        } else if (pagename === "/" && window.onboardingExperiment) {
          element.setAttribute("href", window.onboardingExperiment);
          window.clickonelinkurlchromeissue = window.onboardingExperiment;
        } else {
          ////////////////////////// Normal URL WIthout CHange/////////////////////////

          window.clickonelinkurlchromeissue =
            this.props.children.props.config.config.APP_URL;
          element.setAttribute(
            "href",
            this.props.children.props.config.config.APP_URL
          );
        }
      } else {
        ////////////////////////// IOS Campaign URL/////////////////////////
        element.setAttribute(
          "href",
          "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
        );
        window.clickonelinkurlchromeissue = "IOS";
      }
      var div = document.createElement("div");
      document.body.appendChild(div);
      div.appendChild(document.createElement("br"));
      div.appendChild(document.createElement("br"));
      var divText = document.createElement("div");
      divText.appendChild(
        document.createTextNode(
          "Your download should start soon.In case it doesn't please click the link below"
        )
      );
      div.appendChild(divText);
      div.appendChild(document.createElement("br"));

      var textNode = document.createTextNode("DOWNLOAD The vpl App");
      element.appendChild(textNode);
      element.style = "color:blue;";
      // element.style.display = "block";

      div.appendChild(element);

      div.appendChild(document.createElement("br"));
      div.appendChild(document.createElement("br"));
      var img = document.createElement("img");

      var field = "lang";
      var url = window.location.href;

      if (url.indexOf("?" + field + "=hi") != -1)
        img.src =
          "https://www.vpl.live/static/banners/how-to-install-hindi.png";
      else if (url.indexOf("?" + field + "=mr") != -1)
        img.src =
          "https://www.vpl.live/static/banners/how-to-install-marathi.png";
      else
        img.src =
          "https://www.vpl.live/static/banners/how-to-install-section.png";

      div.appendChild(img);
      element.click();

      if (language === "id") {
        window.location.href.indexOf("vpl.live/?trackers=false") == -1 &&
          gtag("event", "Download-App-v0", {
            event_category: ostype,
            event_label: "v0",
          });
      } else {
        fbq("track", "Download-Pro");
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "Download-Pro",
          var_os: ostype,
          LocationOfAction: "chrome-button",
          referral_url: window.location.href,
          onelinkurl: window.clickonelinkurlchromeissue,
        });
      }

      if (ostype === "android") {
        try {
          try {
            let step = document.getElementById("steps");
            let bodyRect = document.body.getBoundingClientRect();
            let elemRect = step.getBoundingClientRect();
            let offset = Number(elemRect.top - bodyRect.top);

            if (typeof step != "undefined" && step != null) {
              window.scroll({
                behavior: "smooth",
                left: 0,
                top: offset,
              });
            }
          } catch (error) {}
          document
            .getElementById("sticky-layer")
            .setAttribute("style", "display:block");
          document
            .getElementById("msg")
            .setAttribute("style", "display: none;");
          document
            .getElementById("bar")
            .setAttribute("style", "display: none;");
          document
            .getElementById("copyright")
            .setAttribute("style", "margin-bottom: 90px;");

          window.location.hash = "steps";
        } catch (error) {}
      }

      if (this.props.referralData !== undefined) {
        var $body = document.getElementsByTagName("body")[0];
        var $tempInput = document.createElement("INPUT");
        $body.appendChild($tempInput);
        $tempInput.setAttribute(
          "value",
          `vpl::${this.props.referralData.referralCode}::WEB`
        );
        $tempInput.select();
        document.execCommand("copy");
        $body.removeChild($tempInput);
      } else {
      }
      if (ostype === "android") {
        this.setState({
          currentState: !this.state.currentState,
        });
      } else {
      }
    } catch (error) {}
  }

  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  androidDownloadStateOverlay = () => {
    let anchorTag = document.createElement("a");

    anchorTag.setAttribute(
      "href",
      "https://akedge.vpl.live/pb/static/app/20201016/vpl-pro-v110-superteam-50.apk"
    );
    anchorTag.style.display = "none";
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "vpl_Homepage_PopupClick_Optimize",
      ExperimentName: "vpl_Homepage_ExitPopupTest",
      ExperimentID: " K8kaRefYRsyROkC_5agXHg",
      Variant: "Variant1",
      eventAction: "vpl_Homepage_PopupClick_Optimize",
    });

    this.setState({
      currentState: !this.state.currentState,
    });
  };
  render() {
    return (
      <DownloadStateContext.Provider
        value={{
          currentState: this.state.currentState,
          changeState: this.changeState,
          config: this.state.config,
          pageJson: this.state.pageJson,
          keysToComponentMap: this.state.keysToComponentMap,
          androidDownloadStateOverlay: this.androidDownloadStateOverlay,
        }}
      >
        {this.props.children}
      </DownloadStateContext.Provider>
    );
  }
}

/* then make a consumer which will surface it */
const DownloadStateConsumer = DownloadStateContext.Consumer;

export default DownloadStateProvider;
export { DownloadStateConsumer };
