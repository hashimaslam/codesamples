const LRUCache = require("lru-cache");
const express = require("express");
const next = require("next");
const helmet = require("helmet");
var compression = require("compression");
const sms = require("./data/sms");
const fs = require("fs");
const cors = require("cors");
const email = require("./data/email");
var URL = require("./config/ grpc_url");
var consul = require("./config/Consul");
let port = 8080;
// const app = next({ dev });

const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
// var appRoot = require("app-root-path");
const tsFormat = () => new Date().toLocaleTimeString();
// var MobileDetect = require("mobile-detect");x
// const isMobile = require("ismobilejs");
const logDir = "../logs";
const Winlogger = require("./config/winston");
const zooFn = require("./config/zooConfig");
const isMobile = require("ismobilejs");
const { detect } = require("detect-browser");
const debug = require("debug");
const uuid = require("./config/uuidGen");
const https = require("https");
const rateLimit = require("express-rate-limit");
const bizSdk = require("facebook-nodejs-business-sdk");
const cdnUrl = "";
const agent = new https.Agent({
  rejectUnauthorized: false,
});

// on dev env
var proxy = require("express-http-proxy");
//Proxy for AWS Cloudfront. We cannot use express-http-proxy because we cannot change
//SNI headers there. The 'changeOrigin: true' option for http-proxy-middleware does that for us.
//In longer term - we shall move other bits from express-http-proxy to http-proxy-middleware.
//AWS Cloudfront is currently used for dev cdn (https://dcdn.vpl.live)
const { createProxyMiddleware } = require("http-proxy-middleware");

// const fetch = require("node-fetch");

var corsOptions = {
  origin: "https://install.vpl.live",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const whitelist = [
  "https://dweb-poker.vpl.live",
  "https://qweb-poker.vpl.live",
  "https://poker.vpl.live",
  "https://install.vpl.live",
  "http://localhost:8080",
  "http://dweb.vpl.live",
  "https://dweb.vpl.live",
  "https://www.vpl.live",
  "http://www.vpl.live",
];
const corsOptionsvplWebsites = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, { origin: true, methods: ["GET", "PUT", "POST"] });
    } else {
      callback(null, { origin: false });
    }
  },
};

var proxy = require("express-http-proxy");
var Stories_PROTO = "./proto/StoryService.proto";
var Esports_PROTO = "./proto/GamePlayService.proto";
var inactiveUserOffers_PROTO = "./proto/DailyMissionService.proto";
var userProfile_PROTO = "./proto/UserProfileService.proto";
const caller = require("grpc-caller");
var REFERRAL_PROTO = "./proto/ReferralService.proto";

let storyClient = null;
let inactiveUserOffersClient = null;
let userProfileClient = null;
let esportsLeaderBoardClient = null;
// big boss google spreadsheet
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const creds = require("./config/client_secret.json");

// CACHING

const ssrCache = new LRUCache({
  max: 1000,
  maxAge: 300000, // 5 min
});

let dev = true;
let apiDomain = "https://dintapi.vpl.live";
let indoURL = "https://dweb-id.vpl.live/";
if (process.env.APP_ENV === "production" || process.env.APP_ENV === "stage") {
  dev = false;
  apiDomain = "https://dintapi.vpl.live";
  indoURL = "https://id.vpl.live/";
}

const app = next({ dir: ".", dev });
const logger = Winlogger.getInstance();
let referralSiteUrl = "https://rd.vpl.live";
let config = {};

const { default: PathFinder, Logger } = require("lib-pathfinder-node");

const protos = [
  {
    path: path.join(__dirname, REFERRAL_PROTO), // Path to the proto file
    name: "service-referral", // Consul Service discovery name for this service
  },
];

PathFinder.initialize({
  appName: "service-savple",
  protosToLoad: protos,
  promisify: false,
});

if (process.env.SITE_LANG === "id") {
  console.log("Starting server for GEO : " + process.env.SITE_LANG);
  referralSiteUrl = "https://id-rd.vpl.live";
} else {
  console.log("Starting server for default GEO (ENGLISH)");
}

if (process.env.APP_ENV === "production" || process.env.APP_ENV === "stage") {
  zooFn.getConfig(() => {
    config = { ...global.zooData };
    mainBlock(config);
  });
}
let mainBlock = function (config) {
  try {
    const handle = app.getRequestHandler();

    const smsApiLimiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 15 minutes
      max: 10,
      message: {
        status: 429,
        limiter: true,
        type: "error",
        message: "maximum_accounts",
      },
    });

    let getConsulAPI = async function () {
      try {
        const referralClient = await PathFinder.getInstance().getClient({
          serviceName: "service-referral",
          serviceNameInProto: "ReferralService",
        });
        Logger.info("referral-client");
        Logger.info(referralClient);
        return referralClient;
      } catch (ex) {
        Logger.error("Error is : ", new Error("SOMETHING IS WRONG"));
      }
      return null;
    };

    let getConfigurations = function (page, pageName, request) {
      if (page != undefined) page = page.toString().toUpperCase();
      let languageCode = "en";
      if (request.url.indexOf(indoURL) > -1 || process.env.SITE_LANG === "id")
        languageCode = "id";
      config = { ...global.zooData };



      config.httpsAgent = agent;
      if (config.DOWNLOAD_LINK[page]) {
        config.APP_URL = config.DOWNLOAD_LINK[page];
      } else {
        config.APP_URL = config.DOWNLOAD_LINK.DEFAULT;
      }
      logger.info("pagename " + pageName);
      config.LANG_CODE = languageCode;
      config.PAGE_NAME = pageName;
      config.storyclient = storyClient;
      config.inactiveUserOffersClient = inactiveUserOffersClient;
      config.userProfileClient = userProfileClient;
      //  config.CLAVERTAP_KEY = 'TEST-4RW-9W6-RK5Z';
      //delete config.CLAVERTAP_KEY;
      delete config.BRANCH_KEY;
      return config;
    };
    // app.use(compression());
    app.prepare().then(() => {
      const server = express();

      server.use(compression());
      // server.use(morgan("combined", { stream: winston.stream }));
      server.use(bodyParser.json());

      server.use(
        bodyParser.urlencoded({
          extended: true,
        })
      );

      server.use(
        "/_next",
        express.static(__dirname + "/.next", { maxAge: "364d" })
      );

      server.use(
        "/static",
        express.static(__dirname + "/public/static", {
          maxAge: "365d",
        })
      );

      // removed trailing slash from end of the url and uppercase to lowercase
      // server.use(function (req, res, next) {
      //   let wrongurl=req.url.toLowerCase();
      //   if (wrongurl.slice(-1) === '/'&& wrongurl.length>1) {
      //     req.url = wrongurl.slice(0, -1);
      //    return res.redirect(301,req.url);

      //   }else if(wrongurl!==req.url){
      //     req.url=wrongurl
      //   return  res.redirect(301,req.url)
      //   }
      //   next();
      // })

      const faviconOptions = {
        root: __dirname + "/public/static/",
      };
      const robotOptions = {
        root: __dirname + "/public/",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
      };
      const sitemapOptions = {
        root: __dirname + "/public/",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
      };
      const ampOptions = {
        root: __dirname + "/static/",
        headers: {
          "Content-Type": "text/html",
        },
      };
      const akamaiOptions = {
        root: __dirname + "/static/",
        headers: {
          "Content-Type": "text/htm",
        },
      };

      server.get("/*", function (req, res, next) {
        if (
          req.headers.host &&
          req.headers.host.match(/^www/) == null &&
          req.hostname === "vpl.live"
        ) {
          // next();
          res.redirect(301, "https://www." + req.hostname + req.url);
        } else next();
      });
      server.get("/favicon.ico", (req, res) =>
        res.status(200).sendFile("favicon.ico", faviconOptions)
      );

      server.get("/robots.txt", (req, res) => {
        if (
          req.hostname === "vpl.live" ||
          req.hostname === "www.vpl.live" ||
          req.hostname === "www.id.vpl.live" ||
          req.hostname === "id.vpl.live"
        ) {
          res.status(200).sendFile("robots.txt", robotOptions);
        } else {
          res.type("text/plain");
          res.send("User-agent: *\nDisallow: /");
        }
      });

      //////////////////
      server.get("/sitemap.xml", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          res.status(200).sendFile("sitemap-in.xml", sitemapOptions);
        } else {
          res.status(200).sendFile("sitemap.xml", sitemapOptions);
        }
      });
      ////////////////////////////
      // ads file - requested by marketing team
      server.get("/app-ads.txt", (req, res) =>
        res.status(200).sendFile("app-ads.txt", faviconOptions)
      );
      server.get("/app-ad.txt", (req, res) =>
        res.status(200).sendFile("app-ad.txt", faviconOptions)
      );
      ////////////////////////////

      //  google search console

      server.get("/googlee6cd52656eb68f26.html", (req, res) =>
        res.status(200).sendFile("googlee6cd52656eb68f26.html", faviconOptions)
      );

      server.get("/fantasycricket", (req, res) => {
        res.status(200).sendFile("index.html", ampOptions);
      });
      ////////////////////////////////////
      server.get("/check", (req, res) => {
        res.status(200).send("OK");
      });
      server.get("/app-link", cors(corsOptions), (req, res) => {
        let config = getConfigurations(req.query.type);
        res.status(200).json({ APP_URL: config.APP_URL });
      });

      // server.get("/config", cors(corsOptions), (req, res) => {
      //   res.status(200).json({ config: global.zooData });
      // });

      server.get("/akamai/sureroute-test-object.html", (req, res) => {
        // res.type("text/html");
        res.header("Content-Type", "text/html");
        res.type("text/html");
        res.status(200);
        res.sendFile(
          path.join(__dirname + "/public/static/sureroute-test-object.html")
        );
      });

      ////////////////New Referral//////////////

      ////////////////New Referral//////////////

      ////////////////New Referral//////////////
      async function referralFlow(req, res) {
        let pageConfig = getConfigurations("REFERRAL_SITE", "referral", req);
        let config = getConfigurations("REFERRAL_SITE", "referral", req);
        if (
          req.query.referralCode ||
          (req.query.rc && req.query.ps === "f") ||
          req.query.vplReferrerCode
        ) {
          var referralCode = "";
          if (req.query.vplReferrerCode) {
            referralCode = req.query.vplReferrerCode;
          } else if (req.query.referralCode) {
            referralCode = req.query.referralCode
              ? req.query.referralCode
              : req.query.rc;
          }
          //Logger.info(`Referral Code: ${req.query.referralCode}`);
          const referralClient1 = await getConsulAPI();


          referralClient1.getDownloadPageConfig(
            { referralCode },
            function (error, resp) {
              if (error) {
                Logger.error("Error calling getDownloadPageConfig : ", error);
                console.log('Error calling getDownloadPageConfig');
                console.log(error);
                return app.render(req, res, "/rd", {
                  pageConfig,
                });

              } else {
                if (!resp.error) {
                  Logger.info("referral api success " + resp);
                  createBranchLink(req, config, "REFERRAL", (updatedConfig) => {
                    updatedConfig.referral = resp;
                    return app.render(req, res, `/rd`, {
                      config: updatedConfig,
                    });
                  });
                } else {
                  return app.render(req, res, "/rd", {
                    pageConfig,
                  });


                }
              }
            }
          );
        } else if (req.query.rc && req.query.ps === "t") {
          res.redirect(
            301,
            "https://play.google.com/store/apps/details?id=com.vpl.androidapp.ps"
          );
        } else {

          return app.render(req, res, "/rd", {
            pageConfig,
          });

        }
      }

      // Referral /////////////////////////////////

      server.get("/rd", (req, res) => {
        req.setTimeout(300000);
        res.status(error.status || 500).send({
          error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          },
        });
        if (req.query.referralCode) {
          referralFlow(req, res);
        }
        else {
          let config = getConfigurations("HOME", "referral", req);
          // res.set('Cache-Control', 'no-store');
          return renderAndCache(req, res, `/rd`, {
            config,
          });
        }
      });

      if (
        process.env.SITE_LANG === "en" &&
        (process.env.APP_ENV === "production" ||
          process.env.APP_ENV === "stage")
      ) {
        server.use(
          "/blog",
          proxy("https://blog.vpl.live/", {
            filter: function (req, res) {
              if (req.url.indexOf("/robots.txt") >= 0) return false;
              return true;
            },
            userResDecorator: function (
              proxyRes,
              proxyResData,
              userReq,
              userRes
            ) {
              //Handle URLs within blog sitemap coming from wordpress
              if (
                userReq.originalUrl.indexOf("sitemap") >= 0 &&
                userReq.originalUrl.indexOf("xml") >= 0
              ) {
                updatedSitemap = proxyResData
                  .toString("utf8")
                  .replace(
                    'type="text/xsl" href="//blog.vpl.live/',
                    'type="text/xsl" href="/blog/'
                  )
                  .replace(/blog.vpl.live/g, "www.vpl.live/blog");
                return updatedSitemap;
              }
              // if (userReq.originalUrl.indexOf("all-posts") >= 0) {
              //console.log("all-posts");
              //updatedSitemap = proxyResData.toString('utf8').
              //replace('type="text/xsl" href="//blog.vpl.live/', 'type="text/xsl" href="/blog/').
              //  userRes.replace(/blog.vpl.live/g, "www.vpl.live/blog");
              // return updatedSitemap;
              // }

              // if (userReq.originalUrl.indexOf("admin-ajax.php") >= 0) {
              //  updatedSitemap = proxyResData
              //   .toString("utf8")
              //replace('type="text/xsl" href="//blog.vpl.live/', 'type="text/xsl" href="/blog/').
              //  .replace(/blog.vpl.live/g, "www.vpl.live/blog");
              // return updatedSitemap;
              // }
              return proxyResData;
            },
          })
        );
      }

      // Proxy the images uploaded via dashboard with cledge.vpl.live URLs through vpl.live URL
      // This will load them faster
      // So - URL - https://cledge.vpl.live/pb/website/static/dfb4d68546bc4f468e610810c0ae8c15.webp
      // Should become https://www.vpl.live/cledge.vpl.live/pb/website/static/dfb4d68546bc4f468e610810c0ae8c15.webp
      // and below shall handle it.

      // server.use("/cledge.vpl.live", proxy("https://cledge.vpl.live/"));

      if (process.env.APP_ENV === "production") {
        server.use(
          "/cledge.vpl.live/",
          createProxyMiddleware({
            target: "https://cledge.vpl.live/",
            changeOrigin: true,
            pathRewrite: { "/cledge.vpl.live/": "/" },
          })
        );
      } else {
        server.use(
          "/dcdn.vpl.live/",
          createProxyMiddleware({
            target: "https://dcdn.vpl.live/",
            changeOrigin: true,
            pathRewrite: { "/dcdn.vpl.live/": "/" },
          })
        );
      }

      server.use(helmet.frameguard({ action: "sameorigin" }));

      ///////////////////////////////Superteam redirect//////////////////////////////

      ///////////////////////////////SuperYTeam/////////////////////////////////////

      server.get("/superteam", (req, res) => {
        return res.redirect(301, "/fantasy");
        let pageName = "SUPERTEAM";
        let config = getConfigurations(pageName, "superteam", req);

        // return renderAndCache(req, res, `/superteam`, {
        //   config,
        //  });
        return res.redirect(301, "/fantasy");
      });

      server.get("/lp", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let pageName = "HOME";
        let config = getConfigurations(pageName, "lp/home", req);

        return renderAndCache(req, res, `/lp`, {
          config,
        });
      });

      server.get("/lp/index", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let pageName = "HOME";
        let config = getConfigurations(pageName, "lp/home", req);
        return renderAndCache(req, res, `/lp`, {
          config,
        });
      });

      server.get("/ludo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("LUDO", "ludo", req);
        return renderAndCache(req, res, "/ludo", {
          config,
        });
      });

      server.get("/ludo/rules-of-ludo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("LUDO", "ludo/rules-of-ludo", req);
        return renderAndCache(req, res, "/ludo/rules-of-ludo", {
          config,
        });
      });
      server.get("/ludo/tips-to-play-ludo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("LUDO", "ludo/tips-to-play-ludo", req);
        return renderAndCache(req, res, "/ludo/tips-to-play-ludo", {
          config,
        });
      });

      server.get("/ludo/how-to-play-ludo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/ludo/rules-of-ludo");
        // let config = getConfigurations("LUDO", "ludo/how-to-play-ludo", req);
        // return renderAndCache(req, res, "/ludo/how-to-play-ludo", {
        //   config,
        // });
      });

      server.get("/lp/ludo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/ludo", req);
        return renderAndCache(req, res, "/lp/ludo", {
          config,
        });
      });

      server.get("/cards", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "cards", req);
        return renderAndCache(req, res, "/cards", {
          config,
        });
      });

      server.get("/pubg", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        //bubble-shooter
        return res.redirect(301, "/bubble-shooter");
        // let config = getConfigurations("PUBG");
        // return renderAndCache(req, res, "/pubg", {
        //   config
        // });
      });
      server.get("/refer-and-earn", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "refer-and-earn", req);
        return app.render(req, res, "/refer-and-earn", {
          config,
        });
      });
      server.get("/free-fire", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }

        // let config = getConfigurations("FREEFIRE", "free-fire", req);
        // return renderAndCache(req, res, "/free-fire", {
        //   config,
        // });
        return res.redirect(301, "/bubble-shooter");
      });

      server.get("/lp/free-fire", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("FREEFIRE", "lp/free-fire", req);
        return renderAndCache(req, res, "/lp/free-fire", {
          config,
        });
      });

      server.get("/lp/hp-google", (req, res) => {
        if (process.env.SITE_LANG !== "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("HOME", "hp-google", req);
        return renderAndCache(req, res, "/lp/hp-google", {
          config,
        });
      });

      server.get("/lp/hp-tiktok", (req, res) => {
        if (process.env.SITE_LANG !== "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("HOME", "hp-tiktok", req);
        return renderAndCache(req, res, "/lp/hp-tiktok", {
          config,
        });
      });

      server.get("/lp/fantasy/hp-tiktok", (req, res) => {
        if (process.env.SITE_LANG !== "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("HOME", "fantasy/hp-tiktok", req);
        return renderAndCache(req, res, "/lp/fantasy/hp-tiktok", {
          config,
        });
      });

      server.get("/world-cricket-championship-wcc2", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("WCC", "wcc", req);
        return renderAndCache(req, res, "/world-cricket-championship-wcc2", {
          config,
        });
      });

      server.get("/baseballstars-game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "BASEBALLSTARS",
          "baseballstars-game",
          req
        );
        return renderAndCache(req, res, "/baseballstars-game", {
          config,
        });
      });

      server.get("/lp/wcc", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("WCC", "lp/wcc", req);
        return renderAndCache(req, res, "/lp/wcc", {
          config,
        });
      });

      server.get("/poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "poker", req);
        return renderAndCache(req, res, "/poker", {
          config,
        });
      });

      server.get("/poker/tips-to-play-poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "POKER",
          "poker/tips-to-play-poker",
          req
        );
        return renderAndCache(req, res, "/poker/tips-to-play-poker", {
          config,
        });
      });

      server.get("/poker/types-of-poker-games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "POKER",
          "poker/types-of-poker-games",
          req
        );
        return renderAndCache(req, res, "/poker/types-of-poker-games", {
          config,
        });
      });

      server.get("/poker/rules-of-poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "poker/rules-of-poker", req);
        return renderAndCache(req, res, "/poker/rules-of-poker", {
          config,
        });
      });

      server.get("/call-break-game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("CALL_BREAK", "call-break-game", req);
        return renderAndCache(req, res, "/call-break-game", {
          config,
        });
      });

      server.get("/lp/poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "lp/poker", req);
        return renderAndCache(req, res, "/lp/poker", {
          config,
        });
      });

      server.get("/lp/playnow", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "lp/playnow", req);
        return renderAndCache(req, res, "/lp/playnow", {
          config,
        });
      });

      server.get("/lp/us", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/us", req);
        return renderAndCache(req, res, "/lp/US", {
          config,
        });
      });

      server.get("/404", (req, res) => {
        let config = getConfigurations("HOME", "404", req);
        return renderAndCache(req, res, "/404", {
          config,
        });
      });

      server.get("/rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy", req);
        return renderAndCache(req, res, "/rummy", {
          config,
        });
      });

      server.get("/lp/rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "lp/rummy", req);
        return renderAndCache(req, res, "/lp/rummy", {
          config,
        });
      });

      server.get("/rummy/faqs", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy/faqs", req);
        return renderAndCache(req, res, "/rummy/faqs", {
          config,
        });
      });

      server.get("/fantasy-cricket/how-to-play", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "SUPERTEAM",
          "fantasy-cricket/how-to-play",
          req
        );
        return renderAndCache(req, res, "/fantasy-cricket/how-to-play", {
          config,
        });
      });

      server.get("/poker/how-to-play-poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "poker/how-to-play-poker", req);
        return renderAndCache(req, res, "/poker/how-to-play-poker", {
          config,
        });
      });

      server.get("/poker/how-to-play-poker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "poker/how-to-play-poker", req);
        return renderAndCache(req, res, "/poker/how-to-play-poker", {
          config,
        });
      });

      server.get("/indvssa", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "indvssa", req);
        return renderAndCache(req, res, "/indvssa", {
          config,
        });
      });

      server.get("/fantasy-games", (req, res) => {
        let config = getConfigurations("SUPERTEAM", "fantasy", req);
        return renderAndCache(req, res, "/fantasy", {
          config,
        });
      });

      server.get("/fantasy", (req, res) => {
        return res.redirect(301, "/fantasy-games");
      });

      server.get("/ph-red", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "ph-red", req);
        return renderAndCache(req, res, "/ph-red", {
          config,
        });
      });

      server.get("/stocks-fantasy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "stocks-fantasy", req);
        return renderAndCache(req, res, "/stocks-fantasy", {
          config,
        });
      });

      server.get("/testfootball", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "testfootball", req);
        return renderAndCache(req, res, "/testfootball", {
          config,
        });
      });

      ////////////////////////////////////////////////////////

      server.get("/download/:referralCode/:flag", (req, res) => {
        let config = getConfigurations("REFERRAL", "referral", req);
        if (req.params.referralCode && req.params.flag === "t") {
          res.redirect(
            301,
            "https://play.google.com/store/apps/details?id=com.vpl.androidapp.ps"
          );
        } else {
          return renderAndCache(req, res, "/download", {
            config,
          });
        }
      });
      /////////////////////////////////////Tournament Page///////////////////////////////////////////////////
      // TO DO - ASK  Tarun
      server.get("/tournament/:id", (req, res) => {
        let config = getConfigurations("HOME", "tournament", req);
        switch (req.query.at) {
          case "ps":
            // res.redirect(
            //   301,
            //   "https://play.google.com/store/apps/details?id=com.vpl.androidapp.ps"
            // );
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;
          case "ios":
            res.redirect(
              301,
              "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
            );
            break;
          case "pro":
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;

          default:
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;
        }
      });
      ////////////////////////////////////////////////Battle Page//////////////////////////////////////////////
      // TO DO - ASK  Tarun
      server.get("/battle/:id", (req, res) => {
        // return app.render(req, res, "/tournament", {
        //   id: req.params.id,
        //   config
        // });
        let config = getConfigurations("HOME", "battle", req);
        switch (req.query.at) {
          case "ps":
            // res.redirect(
            //   301,
            //   "https://play.google.com/store/apps/details?id=com.vpl.androidapp.ps"
            // );
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;
          case "ios":
            res.redirect(
              301,
              "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
            );
            break;
          case "pro":
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;

          default:
            return renderAndCache(req, res, "/tournament", {
              config,
            });
            break;
        }
      });

      /////////////////////////////////////Superteam Page///////////////////////////////////////////////////
      // TO DO - ASK Tarun
      server.get("/superteam/:id", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/fantasy");
        let pageName = "SUPERTEAM";
        let config = getConfigurations(pageName, "superteam", req);

        switch (req.query.at) {
          case "ps":
            // res.redirect(
            //   301,
            //   "https://play.google.com/store/apps/details?id=com.vpl.androidapp.ps"
            // );

            return renderAndCache(req, res, `/superteam`, {
              config,
            });

            break;
          case "ios":
            res.redirect(
              301,
              "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8"
            );
            break;
          case "pro":
            return renderAndCache(req, res, `/superteam`, {
              config,
            });

            break;

          default:
            return renderAndCache(req, res, `/superteam`, {
              config,
            });

            break;
        }
      });
      /////////////////////////////////////Tournament Page///////////////////////////////////////////////////
      server.get("/tournament", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "tournament", req);
        return renderAndCache(req, res, "/tournament", {
          config,
        });
      });
      /////////////////////////////// Battle///////////////////////////
      server.get("/battle", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "battle", req);
        return renderAndCache(req, res, "/tournament", {
          config,
        });
      });
      //////////////Indiavs Pak/////////////////////////////////////
      server.get("/indiavspak", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        res.redirect(301, `https://vpl.live/match/indvspak`);
      });
      //////////////////////Snapchat/////////////////////////////////
      server.get("/snapchat", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "snapchat", req);
        return renderAndCache(req, res, "/snapchat", {
          config,
        });
      });
      //////////////////////Blue page/////////////////////////////////
      server.get("/bl", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "bl", req);
        return renderAndCache(req, res, "/bl", {
          config,
        });
      });
      //////////////////////red page/////////////////////////////////
      server.get("/red", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/");
        // let config = getConfigurations("HOME", "red", req);
        // return renderAndCache(req, res, "/red", {
        //   config,
        // });
      });
      //////////////////////yellow page/////////////////////////////////
      server.get("/yl", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "red", req);
        return renderAndCache(req, res, "/yl", {
          config,
        });
      });
      //////////////////////purple page/////////////////////////////////
      server.get("/pl", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "pl", req);
        return renderAndCache(req, res, "/pl", {
          config,
        });
      });

      //////////////////////Balla Ghuma/////////////////////////////////
      server.get("/ballaghuma", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "ballaghuma", req);
        return renderAndCache(req, res, "/ballaghuma", {
          config,
        });
      });
      //////////////////////Balla Hindi/////////////////////////////////
      server.get("/ballaghuma/hi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "ballaghuma-hi", req);
        return renderAndCache(req, res, "/ballaghuma-hi", {
          config,
        });
      });

      server.get("/ballaghuma-hi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "ballaghuma-hi", req);
        return renderAndCache(req, res, "/ballaghuma-hi", {
          config,
        });
      });
      //////////////////////Blue page/////////////////////////////////
      server.get("/blg", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "blg", req);
        return renderAndCache(req, res, "/blg", {
          config,
        });
      });

      //////////////////////VK PLAIN/////////////////////////////////
      server.get("/p", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "vk-plain", req);
        return renderAndCache(req, res, "/vk-plain", {
          config,
        });
      });

      server.get("/vk-plain", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "vk-plain", req);
        return renderAndCache(req, res, "/vk-plain", {
          config,
        });
      });

      //////////////////////refer and earn page/////////////////////////////////
      server.get("/refer", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "refer", req);
        return renderAndCache(req, res, "/refer", {
          config,
        });
      });
      // -------------------- KABADDI --------------------  //

      server.get("/kabaddi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "kabaddi-pink", req);
        return renderAndCache(req, res, "/kabaddi-pink", {
          config,
        });
      });

      server.get("/audio-show", (req, res) => {
        let config = getConfigurations("HOME", "audio-show", req);
        return renderAndCache(req, res, "/audio-show", {
          config,
        });
      });

      server.get("/kabaddi/fantasy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "kabaddi-fantasy", req);
        return renderAndCache(req, res, "/kabaddi-fantasy", {
          config,
        });
      });

      server.get("/kabaddi-fantasy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "kabaddi-fantasy", req);
        return renderAndCache(req, res, "/kabaddi-fantasy", {
          config,
        });
      });

      server.get("/indvswi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "indvswi", req);
        return renderAndCache(req, res, "/indvswi", {
          config,
        });
      });

      //////////////////////////////////////////////////////
      server.get("/tiktok", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "snapchat", req);
        return renderAndCache(req, res, "/snapchat", {
          config,
        });
      });
      //////////////////Fantasy-winner////////////////////////////////

      // TO DO :- deleted fantasywinner for now
      // server.get("/fantasywinner", (req, res) => {
      //   let config = getConfigurations("SUPERTEAM");
      //   return renderAndCache(req, res, "/indiavspak", {
      //     config
      //   });
      // });
      // server.get("/indiavspak", (req, res) => {
      //   let config = getConfigurations("SUPERTEAM");
      //   return renderAndCache(req, res, "/indiavspak", {
      //     config
      //   });
      // });

      /////////////////////?ELvis Page///////////////////////////////
      server.get("/elvis-promo", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "elvis", req);
        config.APP_URL =
          "https://akedge.vpl.live/pb/static/app/20190718/vpl-pro-v64-elvis.apk";
        return renderAndCache(req, res, "/elvis", {
          config,
        });
      });

      server.get("/elvis", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "elvis", req);
        config.APP_URL =
          "https://akedge.vpl.live/pb/static/app/20190718/vpl-pro-v64-elvis.apk";
        return renderAndCache(req, res, "/elvis", {
          config,
        });
      });

      /////////////////////////////KYC Flow/////////////////////////////

      server.get("/kyc", (req, res) => {
        if (req.query.vplve) {
          let { vplve } = { ...req.query };
          logger.info(`Email Verify Code: ${vplve}`);
          axios
            .get("https://api.vpl.live/kyc/vplve/" + vplve)
            .then((verifyRes) => {
              logger.info(
                `Email Verify Message: ${JSON.stringify(
                  verifyRes.data.payload.message
                )}`
              );
              return app.render(req, res, "/kyc", {
                emailRes: verifyRes.data.payload.message,
              });
            })
            .catch((err) => {
              logger.info(`Email Verify Error: ${JSON.stringify(err)}`);
              return app.render(req, res, "/kyc", {
                emailRes: "SERVER_ERROR",
              });
            });
        } else {
          return app.render(req, res, "/kyc", { emailRes: "LINK_INVALID" });
        }
      });
      /////////////////////////////////Video Service URL///////////////////////////////////////////////////////////

      // server.get("/video", (req, res) => {
      //   let config = getConfigurations("HOME");
      //   return app.render(req, res, "/index", {
      //     config
      //   });
      // });

      ////////////////////////////////////////////////////////////////////////////////////////////////

      // server.get("/game/:game", (req, res) => {
      //   let config = getConfigurations(`${req.params.game.toUpperCase()}_GAME`);
      //  // if (req.query.utm_source) {
      //   //   createBranchLink(req, config, "CAMPAIGN", updatedConfig => {
      //   //     return app.render(req, res, `/getapp/${req.params.ln}`, {
      //   //       config: updatedConfig
      //   //     });
      //   //   });
      //   // } else {
      //     //debugger;

      //  config.game = req.params.game;
      //   getGameAssets(config, updateconfig => {
      //     return app.render(req, res, `/game`, {
      //       config: updateconfig
      //     });
      //   });

      //   // }
      // });

      server.get("/game/:game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          `${req.params.game.toUpperCase()}_GAME`,
          "game",
          req
        );
        config.game = req.params.game;
        var gameAssets = {};
        gameAssets.DESKTOP_BG = `/static/game/${config.game}/BG.png`;
        gameAssets.MOBILE_BG = `/static/game/${config.game}/BG.png`;
        gameAssets.GAME_IMG = `/static/game/${config.game}/Logo.png`;
        gameAssets.USER_IMG = `/static/game/Virat.png`;
        config.gameAssets = gameAssets;
        return renderAndCache(req, res, "/game", {
          config,
        });
      });

      ////////////////////////////////////////////////////////////////////////////////////////////////

      ///////////////////////////////////////ABout site redirects/////////////////////////////
      server.get("/match", (req, res) => {
        res.redirect(301, `/`);
      });

      server.get("/match/:match", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(`SUPERTEAM`, "match", req);
        config.match = req.params.match;
        getMatchAssets(config, (updateconfig) => {
          return app.render(req, res, `/match`, {
            config: updateconfig,
          });
        });
      });

      /////////////////////////////////Video Service URL///////////////////////////////////////////////////////////

      server.get("/allgames", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "allgames", req);
        try {
          teClient.getAllGamesV2({ combined: true }, (err, teRes) => {
            return app.renderAndCache(req, res, "/allgames", {
              config,
            });
          });
        } catch (error) {
          let config = getConfigurations("HOME", "home", req);
          return renderAndCache(req, res, "/index", {
            config,
          });
        }
      });

      ////////////////////////////////Home Page///////////////////////////////////////////////

      server.get("/", (req, res) => {
        let APK = "HOME";
        let config = getConfigurations(APK, "home", req);
        return renderAndCache(req, res, "/", {
          config,
        });
      });

      ////////////////////////////////Fantasy League///////////////////////////////////////////////

      server.get("/fantasy-football", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "fantasy-football", req);
        return renderAndCache(req, res, "/fantasy-football", {
          config,
        });
      });

      server.get("/fantasy-kabaddi", (req, res) => {
        return res.redirect(301, "/");
      });

      server.get("/fantasy-football-bengali", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "SUPERTEAM",
          "fantasy-football-bengali",
          req
        );
        return renderAndCache(req, res, "/fantasy-football-bengali", {
          config,
        });
      });

      server.get("/fantasy-cricket", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "fantasy-cricket", req);
        return renderAndCache(req, res, "/fantasy-cricket", {
          config,
        });
      });

      server.get("/lp/fantasy-cricket", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "lp/fantasy-cricket", req);
        return renderAndCache(req, res, "/lp/fantasy-cricket", {
          config,
        });
      });

      server.get("/lp/fantasy-cricket-hindi", (req, res) => {
        res
          .status(200)
          .sendFile("/html/fantasy-cricket-hindi.html", faviconOptions);
      });

      server.get("/lp/evergreen-indian-fantasy-cricket", (req, res) => {
        res
          .status(200)
          .sendFile(
            "/html/evergreen-indian-fantasy-cricket.html",
            faviconOptions
          );
      });

      server.get("/lp/hotstar_ipl", (req, res) => {
        res
          .status(200)
          .sendFile(
            "/html/hotstar_ipl.html",
            faviconOptions
          );
      });

      server.get("/lp/poker-new", (req, res) => {
        const ua = req.headers["user-agent"];
        let device = "android";
        if (ua) {
          device = isMobile.default(ua).apple.device
            ? "ios"
            : isMobile.default(ua).android.device
              ? "android"
              : "desktop";
        }
        if (device === "ios") {
          res
            .status(200)
            .sendFile("/html/evergreen-poker-ios.html", faviconOptions);
        } else {
          res
            .status(200)
            .sendFile("/html/evergreen-poker-android.html", faviconOptions);
        }
      });

      server.get("/lp/playnow-new", (req, res) => {
        const ua = req.headers["user-agent"];
        let device = "android";
        if (ua) {
          device = isMobile.default(ua).apple.device
            ? "ios"
            : isMobile.default(ua).android.device
              ? "android"
              : "desktop";
        }
        if (device === "ios") {
          res
            .status(200)
            .sendFile("/html/evergreen-poker-ios-google.html", faviconOptions);
        } else {
          res
            .status(200)
            .sendFile(
              "/html/evergreen-poker-android-google.html",
              faviconOptions
            );
        }
      });

      server.get("/lp/rummy-new", (req, res) => {
        res.status(200).sendFile("/html/evergreen-rummy.html", faviconOptions);
      });

      server.get("/lp/fantasy-cricket-bengali", (req, res) => {
        res
          .status(200)
          .sendFile("/html/fantasy-cricket-bengali.html", faviconOptions);
      });
      server.get("/lp/fantasy-cricket-marathi", (req, res) => {
        res
          .status(200)
          .sendFile("/html/fantasy-cricket-marathi.html", faviconOptions);
      });

      server.get("/lp/fantasy-cricket-tamil", (req, res) => {
        res
          .status(200)
          .sendFile("/html/fantasy-cricket-tamil.html", faviconOptions);
      });

      server.get("/lp/vpl-games-generic", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/vpl-games-generic", req);
        return renderAndCache(req, res, "/lp/vpl-games-generic", {
          config,
        });
      });

      server.get("/lp/vpl-games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/vpl-games", req);
        return renderAndCache(req, res, "/lp/vpl-games", {
          config,
        });
      });

      server.get("/apk-download", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "apk-download", req);
        return renderAndCache(req, res, "/apk-download", {
          config,
        });
      });

      server.get("/fantasy-cricket/tips-and-tricks", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "SUPERTEAM",
          "fantasy-cricket/tips-and-tricks",
          req
        );
        return renderAndCache(req, res, "/fantasy-cricket/tips-and-tricks", {
          config,
        });
      });

      server.get("/fantasy-cricket/app", (req, res) => {
        return res.redirect(301, "/fantasy-cricket");
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "fantasy-cricket/app", req);
        return renderAndCache(req, res, "/fantasy-cricket/app", {
          config,
        });
      });

      server.get("/fantasysports", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "fantasysports", req);
        return renderAndCache(req, res, "/fantasysports", {
          config,
        });
      });

      ////////////////////////////////Games///////////////////////////////////////////////

      server.get("/games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "games", req);
        return renderAndCache(req, res, "/games", {
          config,
        });
      });

      server.get("/football", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "football", req);
        return renderAndCache(req, res, "/football", {
          config,
        });
      });

      server.get("/pool", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("8POOL", "pool", req);
        return renderAndCache(req, res, "/pool", {
          config,
        });
      });

      server.get("/lp/pool", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("8POOL", "lp/pool", req);
        return renderAndCache(req, res, "/lp/pool", {
          config,
        });
      });

      server.get("/chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "chess", req);
        return renderAndCache(req, res, "/chess", {
          config,
        });
      });

      server.get("/chess/rules-of-chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "chess/rules-of-chess", req);
        return renderAndCache(req, res, "/chess/rules-of-chess", {
          config,
        });
      });

      server.get("/chess/tips-to-play-chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "chess/tips-to-play-chess", req);
        return renderAndCache(req, res, "/chess/tips-to-play-chess", {
          config,
        });
      });

      server.get("/chess/how-to-play-chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/chess/rules-of-chess");
        // let config = getConfigurations("HOME", "chess/how-to-play-chess", req);
        // return renderAndCache(req, res, "/chess/how-to-play-chess", {
        //   config,
        // });
      });

      server.get("/lp/chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/chess", req);
        return renderAndCache(req, res, "/lp/chess", {
          config,
        });
      });

      server.get("/virat-games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "virat-games", req);
        return renderAndCache(req, res, "/virat-games", {
          config,
        });
      });

      server.get("/winner-games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "winner-games", req);
        return renderAndCache(req, res, "/winner-games", {
          config,
        });
      });

      server.get("/esports/cpl-leaderboard", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "esports/cpl-leaderboard", req);
        return app.render(req, res, "/esports/cpl-leaderboard", {
          config,
        });
      });

      server.get("/esports", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("CORPORATE_TOURNAMENTS", "esports", req);
        return app.render(req, res, "/esports", {
          config,
        });
      });

      server.get("/esports/winners-details", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "esports/winners-details", req);
        return renderAndCache(req, res, "/esports/winners-details", {
          config,
        });
      });

      server.get("/esports/arena", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/arena",
          req
        );
        return renderAndCache(req, res, `/esports/arena`, {
          config,
        });
      });

      server.get("/esports/dailyseries", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/dailyseries",
          req
        );
        return renderAndCache(req, res, `/esports/dailyseries`, {
          config,
        });
      });

      server.get("/exams", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("EXAMS", "exams", req);
        return renderAndCache(req, res, "/exams", {
          config,
        });
      });

      server.get("/quiz", (req, res) => {
        return res.redirect(301, "/sudoku");
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("QUIZ", "quiz", req);
        return renderAndCache(req, res, "/quiz", {
          config,
        });
      });

      server.get("/lp/quiz", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("QUIZ", "lp/quiz", req);
        return renderAndCache(req, res, "/lp/quiz", {
          config,
        });
      });

      server.get("/quiz-old", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "quiz", req);
        return renderAndCache(req, res, "/quiz", {
          config,
        });
      });

      server.get("/fantasy-basketball", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("SUPERTEAM", "fantasy-basketball", req);
        return renderAndCache(req, res, "/fantasy-basketball", {
          config,
        });
      });

      server.get("/playstore", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "playstore", req);
        return renderAndCache(req, res, "/playstore", {
          config,
        });
      });

      server.get("/diwali", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "diwali", req);
        return renderAndCache(req, res, "/diwali", {
          config,
        });
      });

      server.get("/diwali-tamil", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "diwali-tamil", req);
        return renderAndCache(req, res, "/diwali-tamil", {
          config,
        });
      });

      server.get("/diwali-hindi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "diwali-hindi", req);
        return renderAndCache(req, res, "/diwali-hindi", {
          config,
        });
      });

      server.get("/home-diwali", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home-diwali", req);
        return renderAndCache(req, res, "/home-diwali", {
          config,
        });
      });

      server.get("/rummy-genacq1", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-genacq1", req);
        return renderAndCache(req, res, "/rummy-genacq1", {
          config,
        });
      });

      server.get("/rummy-geo-Telugu", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-geo-Telugu", req);
        return renderAndCache(req, res, "/rummy-geo-Telugu", {
          config,
        });
      });

      server.get("/rummy-geo-Tamil", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-geo-Tamil", req);
        return renderAndCache(req, res, "/rummy-geo-Tamil", {
          config,
        });
      });
      server.get("/lp/allvplgames", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/allvplgames", req);
        return renderAndCache(req, res, "/lp/allvplgames", {
          config,
        });
      });
      server.get("/rummy-geo-Eng", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-geo-Eng", req);
        return renderAndCache(req, res, "/rummy-geo-Eng", {
          config,
        });
      });

      server.get("/rummy-winmoment", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-winmoment", req);
        return renderAndCache(req, res, "/rummy-winmoment", {
          config,
        });
      });

      server.get("/carrom", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("CARROM", "carrom", req);
        return renderAndCache(req, res, "/carrom", {
          config,
        });
      });

      server.get("/carrom/how-to-play-carrom", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/carrom/rules-of-carrom");
        // let config = getConfigurations(
        //   "CARROM",
        //   "carrom/how-to-play-carrom",
        //   req
        // );
        // return renderAndCache(req, res, "/carrom/how-to-play-carrom", {
        //   config,
        // });
      });

      server.get("/carrom/tips-to-play-carrom", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CARROM",
          "carrom/tips-to-play-carrom",
          req
        );
        return renderAndCache(req, res, "/carrom/tips-to-play-carrom", {
          config,
        });
      });

      server.get("/carrom/rules-of-carrom", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("CARROM", "carrom/rules-of-carrom", req);
        return renderAndCache(req, res, "/carrom/rules-of-carrom", {
          config,
        });
      });

      server.get("/fruit-chop", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "fruitchop", req);
        return renderAndCache(req, res, "/fruit-chop", {
          config,
        });
      });

      server.get("/auto-raja-game", (req, res) => {
        return res.redirect(301, "/");
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "auto-raja-game", req);
        return renderAndCache(req, res, "/autoraja", {
          config,
        });
      });

      server.get("/rogue-heist-shooter-game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/bubble-shooter");
      });

      server.get("/lp/fruit-chop", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/fruitchop", req);
        return renderAndCache(req, res, "/lp/fruit-chop", {
          config,
        });
      });

      server.get("/bubble-shooter", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "bubble-shooter", req);
        return renderAndCache(req, res, "/bubble-shooter", {
          config,
        });
      });

      server.get("/lp/fantasy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          let config = getConfigurations("SUPERTEAM", "lp/fantasy", req);
          return renderAndCache(req, res, "/lp/fantasy", {
            config,
          });
        } else {
          let config = getConfigurations("SUPERTEAM", "fantasy", req);
          return renderAndCache(req, res, "/lp/fantasy", {
            config,
          });
        }
      });

      server.get("/lp/bubble-shooter", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "lp/bubble-shooter", req);
        return renderAndCache(req, res, "/lp/bubble-shooter", {
          config,
        });
      });

      server.get("/monster-truck", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "monster-truck", req);
        return renderAndCache(req, res, "/monster-truck", {
          config,
        });
      });

      server.get("/build-up-game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "build-up-game", req);
        return renderAndCache(req, res, "/build-up-game", {
          config,
        });
      });

      server.get("/runner-no1", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUNNER_NO1", "runnerno1", req);
        return renderAndCache(req, res, "/runner-no1", {
          config,
        });
      });

      server.get("/runout", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "runout", req);
        return renderAndCache(req, res, "/runout", {
          config,
        });
      });

      server.get("/space-breaker", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "space-breaker", req);
        return renderAndCache(req, res, "/space-breaker", {
          config,
        });
      });

      server.get("/fruit-slice", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "fruitslice", req);
        return renderAndCache(req, res, "/fruit-slice", {
          config,
        });
      });

      server.get("/go-ride", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "go-ride", req);
        return renderAndCache(req, res, "/go-ride", {
          config,
        });
      });

      server.get("/more-games", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "more-games", req);
        return renderAndCache(req, res, "/more-games", {
          config,
        });
      });
      server.get("/more-games-new", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "more-games", req);
        return renderAndCache(req, res, "/more-games-new", {
          config,
        });
      });

      server.get("/cricket-clash", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("CRICKET_CLASH", "cricket-clash", req);
        return renderAndCache(req, res, "/cricket-clash", {
          config,
        });
      });

      server.get("/cricket-predictor", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "cricket-predictor", req);
        return renderAndCache(req, res, "/cricket-predictor", {
          config,
        });
      });

      server.get("/testimonialvikas", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "testimonialvikas", req);
        return renderAndCache(req, res, "/testimonialvikas", {
          config,
        });
      });

      server.get("/rummy-diwali19", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy-diwali19", req);
        return renderAndCache(req, res, "/rummy-diwali19", {
          config,
        });
      });

      server.get("/returns", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "returns", req);
        return renderAndCache(req, res, "/returns", {
          config,
        });
      });

      server.get("/downloading", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "downloading", req);
        return renderAndCache(req, res, "/downloading", {
          config,
        });
      });

      server.get("/download", (req, res) => {
        if (req.query.referralCode) {
          referralFlow(req, res);
        } else {
          let config = getConfigurations("HOME", "home", req);
          return res.redirect(301, "/rd");
        }
      });

      //////////////////////////////// Hero Adda ///////////////////////////////////////////////
      server.get("/heroadda", (req, res) => {
        let config = getConfigurations("HEROADDA", "home", req);

        return renderAndCache(req, res, "/index", {
          config,
        });
      });
      //////////////////////////////// Hero ///////////////////////////////////////////////
      server.get("/hero", (req, res) => {
        let config = getConfigurations("HERO", "hero", req);
        return renderAndCache(req, res, "/hero", {
          config,
        });
      });
      //////////////////////////
      server.get("/g-ad-pro", (req, res) => {
        let config = getConfigurations("GOOGLE_CAMPAIGN", "home", req);
        return renderAndCache(req, res, "/index", {
          config,
        });
      });
      /////////////////////get App////////////////////////////////////////////////////////////////

      // server.get("/getapp/:ln", (req, res) => {

      //   let config = getConfigurations("DEFAULT");
      //   // if (req.query.utm_source) {
      //   //   createBranchLink(req, config, "CAMPAIGN", updatedConfig => {
      //   //     return app.render(req, res, `/getapp/${req.params.ln}`, {
      //   //       config: updatedConfig
      //   //     });
      //   //   });
      //   // } else {
      //   return renderAndCache(req, res, `/getapp/${req.params.ln}`, {
      //     config
      //   });
      //   // }
      // });
      server.get("/tambola/how-to-play", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let pageName = "HOME";
        let config = getConfigurations(pageName, "tambola/how-to-play", req);

        return renderAndCache(req, res, `/tambola/how-to-play`, {
          config,
        });
      });

      server.get("/getapp/hi", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          let config = getConfigurations("DEFAULT", "getapp/en", req);
          return renderAndCache(req, res, `/getapp/en`, {
            config,
          });
        }
        let config = getConfigurations("DEFAULT", "getapp/hi", req);
        return renderAndCache(req, res, `/getapp/hi`, {
          config,
        });
      });
      server.get("/getapp/en", (req, res) => {
        let config = getConfigurations("DEFAULT", "getapp/en", req);
        return renderAndCache(req, res, `/getapp/en`, {
          config,
        });
      });
      server.get("/getapp/kn", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          let config = getConfigurations("DEFAULT", "getapp/en", req);
          return renderAndCache(req, res, `/getapp/en`, {
            config,
          });
        }
        let config = getConfigurations("DEFAULT", "getapp/kn", req);
        return renderAndCache(req, res, `/getapp/kn`, {
          config,
        });
      });

      server.get("/getapp/ta", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          let config = getConfigurations("DEFAULT", "getapp/en", req);
          return renderAndCache(req, res, `/getapp/en`, {
            config,
          });
        }
        let config = getConfigurations("DEFAULT", "/getapp/ta", req);
        return renderAndCache(req, res, `/getapp/ta`, {
          config,
        });
      });

      server.get("/getapp", (req, res) => {
        let config = getConfigurations("DEFAULT", "/getapp/en", req);
        return renderAndCache(req, res, `/getapp/en`, {
          config,
        });
      });

      server.get("/college-esports", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("ESPORTS", "college-esports", req);
        return renderAndCache(req, res, `/college-esports/college-esports`, {
          config,
        });
      });

      server.get("/college-esports/bengaluru", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "ESPORTS",
          "college-esports/bengaluru",
          req
        );
        return renderAndCache(
          req,
          res,
          `/college-esports/bengaluru/bengaluru`,
          {
            config,
          }
        );
      });
      server.get("/college-esports/bengaluru/leaderboard", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "ESPORTS",
          "college-esports/bengaluru/leaderboard",
          req
        );
        return renderAndCache(
          req,
          res,
          `/college-esports/bengaluru/leaderboard/leaderboard`,
          {
            config,
          }
        );
      });
      server.get("/esports/ce/bangalore/registration-success", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "ESPORTS",
          "ce-registration-success",
          req
        );

        return renderAndCache(
          req,
          res,
          `/college-esports/bengaluru/registration-success`,
          {
            config,
          }
        );
      });

      server.get("/esports/ce", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("ESPORTS", "esports/ce", req);

        return renderAndCache(req, res, `/esports/ce`, {
          config,
        });
      });

      server.get("/esports/cpl/finalelivestream", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "HOME",
          "esports/cpl/finalelivestream",
          req
        );
        return renderAndCache(req, res, `/esports/cpl/finalelivestream`, {
          config,
        });
      });

      server.get("/esports/cpl", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/cpl",
          req
        );
        return renderAndCache(req, res, `/esports/cpl`, {
          config,
        });
      });

      server.get("/rummy/types-of-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy/types-of-rummy", req);
        return renderAndCache(req, res, `/rummy/types-of-rummy`, {
          config,
        });
      });



      server.get("/rummy/types-of-rummy/pool-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/pool-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/pool-rummy`, {
          config,
        });
      });

      server.get("/rummy/types-of-rummy/13-card-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/13-card-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/13-card-rummy`, {
          config,
        });
      });
      server.get("/rummy/types-of-rummy/21-card-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/21-card-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/21-card-rummy`, {
          config,
        });
      });

      server.get("/rummy/types-of-rummy/cash-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/cash-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/cash-rummy`, {
          config,
        });
      });

      server.get("/rummy/types-of-rummy/indian-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/indian-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/indian-rummy`, {
          config,
        });
      });

      server.get("/rummy/how-to-play-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        return res.redirect(301, "/rummy/rules-of-rummy");
        // let config = getConfigurations("RUMMY", "rummy/how-to-play-rummy", req);
        // return renderAndCache(req, res, `/rummy/how-to-play-rummy`, {
        //   config,
        // });
      });

      server.get("/rummy/rules-of-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("RUMMY", "rummy/rules-of-rummy", req);
        return renderAndCache(req, res, `/rummy/rules-of-rummy`, {
          config,
        });
      });

      server.get("/rummy/tips-to-play-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/tips-to-play-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/tips-to-play-rummy`, {
          config,
        });
      });

      server.get("/rummy/types-of-rummy/points-rummy", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "RUMMY",
          "rummy/types-of-rummy/points-rummy",
          req
        );
        return renderAndCache(req, res, `/rummy/types-of-rummy/points-rummy`, {
          config,
        });
      });

      server.get("/block-puzzle", (req, res) => {
        let config = getConfigurations("BLOCK_PUZZLE", "block-puzzle", req);
        return renderAndCache(req, res, `/block-puzzle`, {
          config,
        });
      });

      server.get("/support/vip", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("HOME", "support/vip", req);
        return renderAndCache(req, res, `/support/vip`, {
          config,
        });
      });

      server.get(
        "/esports/anarock-corp-speed-chess-knockout-tournament",
        (req, res) => {
          if (process.env.SITE_LANG === "id") {
            return renderAndCache(req, res, "/404");
          }
          let config = getConfigurations(
            "CORPORATE_TOURNAMENTS",
            "esports/anarock-corp-speed-chess-knockout-tournament",
            req
          );
          return renderAndCache(
            req,
            res,
            `/esports/anarock-corp-speed-chess-knockout-tournament`,
            {
              config,
            }
          );
        }
      );

      server.get("/esports/points-distribution", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/points-distribution",
          req
        );
        return renderAndCache(req, res, `/esports/points-distribution`, {
          config,
        });
      });

      server.get("/esports/league-format", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/league-format",
          req
        );
        return renderAndCache(req, res, `/esports/league-format`, {
          config,
        });
      });

      server.get("/esports/league-rules", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/league-rules",
          req
        );
        return renderAndCache(req, res, `/esports/league-rules`, {
          config,
        });
      });

      server.get("/esports/league-rules-faqs", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/league-rules-faqs",
          req
        );
        return renderAndCache(req, res, `/esports/league-rules-faqs`, {
          config,
        });
      });

      server.get("/esports/prize-distribution", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/prize-distribution",
          req
        );
        return renderAndCache(req, res, `/esports/prize-distribution`, {
          config,
        });
      });

      server.get("/esports/prize-distribution-chess", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/prize-distribution-chess",
          req
        );
        return renderAndCache(req, res, `/esports/prize-distribution-chess`, {
          config,
        });
      });

      server.get("/esports/prize-distribution-wcc", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/prize-distribution-wcc",
          req
        );
        return renderAndCache(req, res, `/esports/prize-distribution-wcc`, {
          config,
        });
      });

      server.get("/esports/prize-distribution-pool", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/prize-distribution-pool",
          req
        );
        return renderAndCache(req, res, `/esports/prize-distribution-pool`, {
          config,
        });
      });

      server.get("/esports/prize-distribution-rogue-heist", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations(
          "CORPORATE_TOURNAMENTS",
          "esports/prize-distribution-rogue-heist",
          req
        );
        return renderAndCache(
          req,
          res,
          `/esports/prize-distribution-rogue-heist`,
          {
            config,
          }
        );
      });

      server.get("/support/vip", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }

        let config = getConfigurations("HOME", "support/vip", req);
        return renderAndCache(req, res, `/support/vip`, {
          config,
        });
      });

      // OUSTIDE URL - redirect to home page

      server.get("/support/*", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);
        return renderAndCache(req, res, "/", {
          config,
        });
      });

      server.get("/stories", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        // let config = getConfigurations("HOME", "stories/stories", req);
        // return app.render(req, res, "/stories/stories", {
        //   config,
        // });
        return res.redirect(301, "/");
      });

      // home page - hindi

      // server.get("/hindi-index", (req, res) => {
      //   let config = getConfigurations("HOME", "hindi-index", req);

      //   return renderAndCache(req, res, "/hindi-index", {
      //     config,
      //   });
      // });

      server.get("/restricted-states", (req, res) => {
        let config = getConfigurations("HOME", "restricted-states", req);
        return renderAndCache(req, res, "/restricted-states", {
          config,
        });
      });

      server.get("/fairplay", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "fairplay", req);
        return renderAndCache(req, res, "/fairplay", {
          config,
        });
      });

      server.get("/lp/offer", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        //SIGNUPOFFER_RUMMY_ABC.
        //FB_TEST_SIGNUPOFFER_RUMMY_ABC_EXAvplE
        let compaignGame = "home";
        let compaignName = "";

        if (req.query.c) {
          compaignName = req.query.c.toLowerCase();
          if (compaignName.indexOf("signupoffer") > -1) {
            let arraySignupOfferIndex = compaignName
              .split("_")
              .indexOf("signupoffer");
            compaignName = compaignName
              .split("_")
              .slice(arraySignupOfferIndex, arraySignupOfferIndex + 3)
              .join("_");
            if (compaignName.split("_").length > 2)
              compaignGame = compaignName.split("_")[1].toLowerCase();
          }
        }

        let config = getConfigurations(
          compaignGame.toUpperCase(),
          compaignGame,
          req
        );
        return app.render(req, res, "/lp/offer", {
          config,
        });
      });

      server.get("/lp/redeem-vi-coupon", (req, res) => {
        return res.redirect(301, "/");
      });

      server.get("/poker-affiliate", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("POKER", "poker-affiliate", req);
        return renderAndCache(req, res, "/poker-affiliate", {
          config,
        });
      });

      server.get("/status-check", (req, res) => {
        let config = getConfigurations("DEFAULT", "status-check", req);
        return app.render(req, res, "/status-check", {
          config,
        });
      });

      ///////////////////////////INDO URLS//////////////////////////////////////

      ////////////////Coupon Page///////////////////

      server.get("/earntokens/:code", (req, res) => {
        if (process.env.SITE_LANG === "en") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);
        return app.render(req, res, "/index", {
          config,
        });
      });
      server.get("/coupons/:code", (req, res) => {
        if (process.env.SITE_LANG === "en") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);
        return app.render(req, res, "/index", {
          config,
        });
      });
      server.get("/EarnTokens/:code", (req, res) => {
        if (process.env.SITE_LANG === "en") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);
        return app.render(req, res, "/index", {
          config,
        });
      });

      server.get("/pialapresiden2020", (req, res) => {
        if (process.env.SITE_LANG === "en") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);

        return app.render(req, res, "/pialapresiden2020", {
          config,
        });
      });

      // send sms - google form
      server.post("/api-sms", (req, res) => {
        console.log(
          `ENG - SMS Request for Mobile: ${JSON.stringify(req.body)}`
        );
        let VAR1 = global.zooData.SMS_LINK_DEFAULT;
        const To = req.body.mobile;
        // if (VAR1 !== "DEFAULT") {
        //   VAR1 = global.zooData.SMS_LINKS[VAR1 - 1];
        // } else {
        //   VAR1 = global.zooData.SMS_LINK_DEFAULT;
        // }
        // VAR1 = "https://vpl.onelink.me/xNXA/v82";
        sms.send_AppLink({ To, VAR1 }, (val) => {
          if (val.status === 200) {
            logger.info(
              `ENG - SMS Response for Mobile: ${JSON.stringify(req.body)}`
            );
          }

          res.json({ status: res.status });
        });
      });

      // Get vpl default apk link - blog
      server.get("/api/getAPKLink", (req, res) => {
        let config = { ...global.zooData };
        config.APP_URL = config.DOWNLOAD_LINK.DEFAULT;
        res.json(config.APP_URL);
      });

      server.get("/fruit-dart-game", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("FRUITDART", "fruit-dart-game", req);
        return renderAndCache(req, res, "/fruit-dart-game", {
          config,
        });
      });

      server.get("/vip-programme-benefits", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "vip-programme-benefits", req);
        return renderAndCache(req, res, "/vip-programme-benefits", {
          config,
        });
      });

      server.get("/vpl-vip", (req, res) => {
        return res.redirect(301, "/");
      });

      ///////////////////////Stories Data//////////////////////

      server.get("/sudoku", (req, res) => {
        let config = getConfigurations("HOME", "sudoku", req);
        return renderAndCache(req, res, "/sudoku", {
          config,
        });
      });

      server.get("/api/stories", (req, res) => {
        storyClient.getStarStories({}, (err, storyRes) => {
          if (!err) {
            if (storyRes) {
              res.json(storyRes);
            } else {
              res.json(storyRes);
            }
          } else {
            console.log(storyRes);
          }
        });
      });

      server.get("/api/storiesWebTrendingTags", (req, res) => {
        //console.log('vvvvvvvv');
        storyClient.getWebTrendingTags({}, (err, storyRes) => {
          if (!err) {
            if (storyRes) {
              res.json(storyRes);
            } else {
              res.json(storyRes);
            }
          } else {
            console.log(storyRes);
          }
        });
      });

      server.post("/api/esports-leaderboard", (req, res) => {
        console.log("esports-api-call");
        console.log(req.body);

        // caller("172.31.22.27:50011", Esports_PROTO, "GamePlayService");

        //    consul.getServiceUrlWithoutCountryCode('service-stories',config.CONSUL_URL ,function (URL) {
        //     // caller("172.31.9.204:50073", Stories_PROTO, "StoryService");
        //       storyClient = caller(
        //        URL,
        //        Stories_PROTO,
        //        'StoryService'
        //      );
        //  });

        // esportsLeaderBoardClient = caller("172.31.22.27:50011", Esports_PROTO, "GamePlayService");

        config = { ...global.zooData };
        console.log("esports-console-url");
        console.log(config.CONSUL_URL);

        consul.getServiceUrlWithoutCountryCode(
          "service-tournament-gameplay",
          config.CONSUL_URL,
          function (URL) {
            esportsLeaderBoardClient = caller(
              URL,
              Esports_PROTO,
              "GamePlayService"
            );
            esportsLeaderBoardClient.getStageLeaderboardByType(
              {
                leagueGameId: 1893,
                stageId: req.body.stageId,
                requestType: "LEADERBOARD",
                vplUserId: 10,
              },
              (err, response) => {
                if (!err) {
                  if (leaderBoardRes) {
                    res.json(leaderBoardRes);
                  } else {
                    res.json(leaderBoardRes);
                  }
                } else {
                  console.log(leaderBoardRes);
                }
              }
            );
          }
        );

        // esportsLeaderBoardClient.getStageLeaderboardByType(
        //   {
        //     "leagueGameId": 1893,
        //     "stageId": req.body.stageId,
        //     "requestType": "LEADERBOARD",
        //     "vplUserId": 10
        //   }, (err, leaderBoardRes) => {
        //   console.log('response-leaderboard');
        //   console.log(leaderBoardRes);
        //   if (!err) {
        //     if (leaderBoardRes) {
        //       res.json(leaderBoardRes);
        //     } else {
        //       res.json(leaderBoardRes);
        //     }
        //   } else {
        //     console.log(leaderBoardRes);
        //   }
        // });
      });

      // router.get('/api/stories', async (req, res, next) => {
      //   try {
      //      const starStories = await storyClient.getStarStories();
      //      const trendingStories = await storyClient.getWebTrendingTags();
      //      return starStories;
      //   } catch (e) {
      //     //this will eventually be handled by your error handling middleware
      //     next(e)
      //   }
      // })

      /////////////////////////////////////////////////////////////

      // support schedule call back post api
      // server.post("/vip/schedule-callback", (req, res) => {
      //  const data = req.body;
      //  try {
      //     axios
      //       .post(callBackApiUrl, data)
      //       .then((data) => {
      //         res.status(200).send(data.data);
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //         res.send(err);
      //       });
      //   } catch (err) {
      //     console.error("err:", err);
      //   }
      // });

      /////////////////////////////////////////////////////////////////

      // this is for preflight request
      server.options("/api/applink", cors(corsOptionsvplWebsites));

      server.post(
        "/api/applink",
        cors(corsOptionsvplWebsites),
        smsApiLimiter,
        (req, res) => {
          var { To, VAR1, pageName } = { ...req.body };

          if (process.env.SITE_LANG === "id") {
            console.log(
              `INDO - SMS Request for Mobile: ${JSON.stringify(req.body)}`
            );
            let config = getConfigurations("HOME", "home", req);
            let SMS_TEvplATE = config.SMS_TEvplATE;
            if (pageName === "tiktok") {
              const ind = SMS_TEvplATE.indexOf("https");
              SMS_TEvplATE =
                SMS_TEvplATE.substring(0, ind) +
                "" +
                config.SMS_ONE_LINK_TIKTOK;
            }
            sms.send_AppLink_Indo({ To, VAR1: SMS_TEvplATE }, (val) => {
              if (val.status === 200) {
                logger.info(
                  `INDO SMS Response for Mobile: ${JSON.stringify(req.body)}`
                );
              }
              res.json({ status: val.status });
            });
          } else {
            console.log(
              `ENG - SMS Request for Mobile: ${JSON.stringify(req.body)}`
            );

            if (VAR1 !== "DEFAULT") {
              VAR1 = global.zooData.SMS_LINKS[VAR1 - 1];
            } else {
              VAR1 = global.zooData.SMS_LINK_DEFAULT;
            }

            if (pageName === "overlay") {
              VAR1 =
                "https://akedge.vpl.live/pb/static/app/20201016/vpl-pro-v110-superteam-50.apk";
            }

            if (pageName === "overlay") {
              VAR1 =
                "https://akedge.vpl.live/pb/static/app/20201016/vpl-pro-v110-superteam-50.apk";
            }

            sms.send_AppLink({ To, VAR1 }, (val) => {
              if (val.status === 200) {
                logger.info(
                  `ENG - SMS Response for Mobile: ${JSON.stringify(req.body)}`
                );
              }

              res.json({ status: val.status });
              return;
            });
          }
        }
      );

      // big boss apis
      server.get("/lp/bigboss", (req, res) => {
        if (process.env.SITE_LANG === "id") {
          return renderAndCache(req, res, "/404");
        }
        let config = getConfigurations("HOME", "home", req);
        return app.render(req, res, "/lp/bigboss", {
          config,
        });
      });

      server.post("/api/big-boss", smsApiLimiter, async (req, res) => {
        try {
          const data = req.body;
          const doc = new GoogleSpreadsheet(
            "1GpZl-Iuj9bQrQAesAeyW2k45s8Z153c2DzBdXVkFB7I"
          );
          await doc.useServiceAccountAuth(creds);
          await doc.loadInfo();
          const sheet = doc.sheetsByIndex[0];
          const rowData = [
            ...data,
            new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }),
          ];

          const addedRow = await sheet.addRow(rowData);
          res.json({ status: 200, rowData });
          return;
        } catch (error) {
          res.status({
            status: 400,
            message: "somthing went wrong please try again",
          });
          return;
        }
      });
      //send-email
      // server.post("/api/send-email",(req,res) =>{
      //   console.log('server send -email' + req.body.Email);
      //   try{
      //  email(req.body.Email);
      //   }
      //   catch(err){
      //     console.log('send email error ' + err);
      //   }

      // })
      ///////////////////////Banner Data//////////////////////

      server.get("/api/banners", (req, res) => {
        var bannersData = {
          banners: [
            {
              imageUrl: "/static/banners/003.png",
            },
            {
              imageUrl: "/static/banners/002.png",
            },
            {
              imageUrl: "/static/banners/001.png",
            },
            {
              imageUrl: "/static/banners/004.png",
            },
            {
              imageUrl: "/static/banners/005.png",
            },
          ],
        };

        res.json(bannersData);
      });
      ///////////////////////////////////////ABout site redirects/////////////////////////////
      server.get("/terms", (req, res) => {
        res.redirect(301, `https://about.vpl.live/terms`);
      });
      server.get("/termsandconditions", (req, res) => {
        res.redirect(301, `https://about.vpl.live/terms-and-conditions/`);
      });
      server.get("/gamesofskill", (req, res) => {
        res.redirect(301, `https://about.vpl.live/game-of-skill/`);
      });
      server.get("/skillgames", (req, res) => {
        res.redirect(301, `https://about.vpl.live/gamesofskill/`);
      });
      server.get("/privacy", (req, res) => {
        res.redirect(301, `https://about.vpl.live/privacy/`);
      });
      server.get("/privacypolicy", (req, res) => {
        res.redirect(301, `https://about.vpl.live/privacy-policy/`);
      });
      server.get("/about", (req, res) => {
        res.redirect(301, `https://about.vpl.live/`);
      });
      server.get("/disclaimer", (req, res) => {
        res.redirect(301, `https://about.vpl.live/disclaimer`);
      });
      server.get("/tc/in", (req, res) => {
        res.redirect(301, `https://about.vpl.live/terms-and-conditions/`);
      });
      server.get("/privacy/in", (req, res) => {
        res.redirect(301, `https://about.vpl.live/privacy-policy/`);
      });
      server.get("/faq/in", (req, res) => {
        res.redirect(301, `https://help.vpl.live/faq/`);
      });
      server.get("/tc/id", (req, res) => {
        res.redirect(
          301,
          `https://tentang.vpl.live/syarat-dan-ketentuan-penggunaan/`
        );
      });
      server.get("/privacy/id", (req, res) => {
        res.redirect(301, `https://tentang.vpl.live/kebijakan-privasi/`);
      });
      server.get("/faq/id", (req, res) => {
        res.redirect(301, `https://bantuan.vpl.live/faq/`);
      });
      /////////////////////////////////////////////////////////////////////////////////////////
      server.get("*", (req, res) => {
        // logger.info('node *');
        // logger.info('NextJS Server Handle : ' + req.url);
        // logger.info(`${JSON.stringify(req.headers)}`);
        return handle(req, res);
      });

      server.listen(port, (err) => {
        //console.log('port localhost');
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
        // process.send("ready");
      });
    });
  } catch (err) {
    logger.error(err);
  }
};

// function getGameAssets(config, cb) {

//   var gameAssets = {};
//   gameAssets.DESKTOP_BG = `/static/game/${config.game}/BG.png`;
//   gameAssets.MOBILE_BG = `/static/game/${config.game}/BG.png`;
//   gameAssets.GAME_IMG = `/static/game/${config.game}/Logo.png`;
//   gameAssets.USER_IMG = `/static/game/Virat.png`;
//   config.gameAssets = gameAssets;
//  cb(config);
// }

function getMatchAssets(config, cb) {
  var matchAssets = {};
  let match = config.match.toUpperCase();
  matchAssets.team1 = match.slice(0, 3);
  matchAssets.team2 = match.slice(5, match.length);

  matchAssets.DESKTOP_BG = `/static/match/BG_DESKTOP.png`;
  matchAssets.TEAM1_MOBILE = `/static/match/${config.match}/Mobile/${matchAssets.team1}.png`;
  matchAssets.TEAM2_MOBILE = `/static/match/${config.match}/Mobile/${matchAssets.team2}.png`;
  matchAssets.TEAM1_DESKTOP = `/static/match/${config.match}/Desktop/${matchAssets.team1}.png`;
  matchAssets.TEAM2_DESKTOP = `/static/match/${config.match}/Desktop/${matchAssets.team2}.png`;
  matchAssets.MOBILE_BG = `/static/match/BG_MOBILE.png`;
  config.matchAssets = matchAssets;
  cb(config);
}



function createBranchLink(req, config, pageName, cb) {
  cb(config);
}

function getCacheKey(req) {
  //TODO clean-up, standardize an url to maximize cache hits

  const logger = Winlogger.getInstance();
  const ua = req.headers["user-agent"];
  let device = "android";
  if (ua) {
    device = isMobile.default(ua).apple.device
      ? "ios"
      : isMobile.default(ua).android.device
        ? "android"
        : "desktop";
  }
  const browser = detect(ua);
  const browserName = browser == null ? "unknown" : browser.name;

  // logger.info(`Device type :-  ${device}`);

  var url = require("url");
  var url_parts = url.parse(req.url, true);
  // debugger;

  if (req.url.indexOf("/download") > -1)
    return "/download/" + device + browserName;
  else if (req.url.indexOf("/game") > -1)
    return url_parts.pathname + "/" + device + browserName;
  else if (req.url.indexOf("/download") > -1)
    return "/download" + "/" + device + browserName;
  else if (req.url.indexOf("/superteam") > -1)
    return "/superteam/" + device + browserName;
  else if (
    req.url.indexOf("/battle") > -1 ||
    req.url.indexOf("/tournament") > -1
  )
    return "/tournament/" + device + browserName;
  else if (req.url.indexOf("/match") > -1)
    return "/match/" + device + browserName;
  else return req.route.path + device + browserName;
}

async function renderAndCache(req, res, pagePath, queryParams) {
  const logger = Winlogger.getInstance();
  //TODO add a way to purge cache for a specific url
  //logger.info(`Page URL :-  ${req.url}`);

  let key;
  if (typeof req.route !== "undefined" && typeof req.route.path !== "undefined")
    key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (key && ssrCache.has(key)) {
    res.setHeader("x-cache", "HIT");
    res.send(ssrCache.get(key));
    // logger.info(`served by: cache`);
    return;
  }

  // No cache present for specific key? let's try to render and cache
  try {
    const html = await app.renderToHTML(req, res, pagePath, queryParams);
    // If something is wrong with the request, let's not cache
    // Send the generated content as is for further inspection

    if (dev || process.env.APP_ENV === "stage" || res.statusCode !== 200) {
      res.setHeader("x-cache", "SKIP");
      // logger.info(`dev env || error in page cache miss`);
      res.send(html);
      return;
    }

    // Everything seems OK... let's cache
    ssrCache.set(key, html);
    res.setHeader("x-cache", "MISS");
    // logger.info('renderAndCache : CACHE MISS : ' + req.url)
    res.send(html);
  } catch (err) {
    // logger.error(err);
    app.renderError(err, req, res, pagePath, queryParams);
  }
}
