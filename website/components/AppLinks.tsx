import React, { Component } from "react";
import { APP_STORE_ANDROID, APP_STORE_IOS } from "../configs/images";

export default class extends Component {
  componentDidMount() {
    // window.dataLayer = window.dataLayer || [];
    // function gtag() {
    //   dataLayer.push(arguments);
    // }
    // gtag("js", new Date());

    //  gtag("config", "UA-124531741-1");

    ///////////////////Facebook analytics///////////////////
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      window.location.href.indexOf("vpl.live/?trackers=false") == -1 &&
        s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    fbq("init", "295471477911153");
    fbq("track", "PageView");
  }

  render() {
    return (
      <div id="app-links" className="desktop">
        <h2>GET THE vpl APP</h2>
        <div>
          <a href="#landing">
            <img src={APP_STORE_ANDROID} alt="" />
          </a>
          <a href="itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8">
            <img src={APP_STORE_IOS} alt="" />
          </a>
        </div>
        <style jsx>{`
          #app-links {
            display: none;
          }
          @media (min-width: 1200px) {
            #app-links {
              background: #fff;
              width: 100%;
              margin: auto;
              text-align: center;
              h2 {
                margin-top: 0;
                /* padding-top: 160px; */
              }
              div > a {
                display: inline;
                margin: 0;
              }
              div > a > img {
                width: 200px;

                margin: 10px;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
