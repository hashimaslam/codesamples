import React, { Component } from "react";
import Disclaimer from "./DisclaimerStatic";
import { TW_SOCIAL, YT_SOCIAL, IG_SOCIAL, FB_SOCIAL } from "../configs/images";
import * as txt from "../configs/footer_data";
import "../styles/footer.scss";

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
      <footer className="superteam-footer vpl-footer">
        <div>
          <h2>{txt.FOOTER_HEADING}</h2>
          <div id="social-links">
            <a href="https://www.facebook.com/Playvpl/" target="blank">
              <img src={FB_SOCIAL} alt="Facebook Page" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCIBT5MyVgwAvcZZa1e8O-sw"
              target="blank"
            >
              <img src={YT_SOCIAL} alt="YouTube Page" />
            </a>
            <a href="https://www.instagram.com/playvpl/" target="blank">
              <img src={IG_SOCIAL} alt="Instagram Page" />
            </a>
            <a href="https://twitter.com/Playvpl" target="blank">
              <img src={TW_SOCIAL} alt="Twitter Page" />
            </a>
          </div>
          <nav id="footer-nav" className="">
            {txt.FOOTER_LINK.map((navLink, index) =>
              navLink.ext ? (
                <a key={index} href={navLink.link}>
                  {navLink.txt}
                </a>
              ) : (
                <a key={index} href={navLink.link}>
                  {navLink.txt}
                </a>
              )
            )}
          </nav>

          <Disclaimer />
        </div>
        <div id="copyright">{txt.COPYRIGHT}</div>
        <style jsx>{`
          .superteam-footer {
            a {
              color: rgb(99, 171, 20) !important;
            }
          }
          @media (min-width: 1200px) {
          }
        `}</style>
      </footer>
    );
  }
}
