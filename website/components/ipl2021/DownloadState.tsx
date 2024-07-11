import React, { Component } from "react";
import osType from "../../configs/detectOs";
/* First we will make a new context */
const DownloadStateContext = React.createContext();

/* Then create a provider Component */
class DownloadStateProviderNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWebView: false,
      currentState: false,
      config: this.props.children ? this.props.children.props.config : "",
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

    const onelinkGenerator = new window.AF.OneLinkUrlGenerator({
      oneLinkURL: "https://vpl.onelink.me/cRBD",
      pidKeysList: ["af_pid", "utm_source"],
      campaignKeysList: ["af_c", "utm_campaign"],
      gclIdParam: "af_sub1",
    });

    const url = onelinkGenerator.generateUrl();

    console.log("on-page-load-one-link-url");
    console.log(url);

    window.onelinkurl = url;

    if (url) {
      if (window.location.pathname === "/") {
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
          buttonlocation: buttonIdentifier,
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
      // element.style.display = "block";
      div.appendChild(element);
      element.click();

      if (language === "id") {
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
          buttonlocation: "chrome-button",
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
          androidDownloadStateOverlay: this.androidDownloadStateOverlay,
        }}
      >
        {this.props.children}
      </DownloadStateContext.Provider>
    );
  }
}

/* then make a consumer which will surface it */
const DownloadStateConsumerNew = DownloadStateContext.Consumer;

export default DownloadStateProviderNew;
export { DownloadStateConsumerNew };
