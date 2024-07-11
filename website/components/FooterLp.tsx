import React, { Component } from "react";
import Disclaimer from "./DisclaimerStatic";
import * as imgRef from "../configs/images";
import * as txt from "../configs/footer_data";
// import "../styles/footer.scss";

export default class extends Component {
  componentDidMount() {
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
      t.defer = "defer";
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
      <footer className="footer">
        <div className="footer-nav">
          <div className="container">
            <div className="section-layout">
              <div className="row">
                <h2 className="section-header section-header--large">
                  {txt.FOOTER_HEADING}
                </h2>
              </div>
              <div className="row">
                <div id="social-links" className="footer__social-links">
                  <a href="https://www.facebook.com/Playvpl/" target="blank">
                    <img
                      src={imgRef.FB_SOCIAL}
                      alt="Facebook Page"
                      className="section-tile-image"
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UCIBT5MyVgwAvcZZa1e8O-sw"
                    target="blank"
                  >
                    <img
                      src={imgRef.YT_SOCIAL}
                      alt="YouTube Page"
                      className="section-tile-image"
                    />
                  </a>
                  <a href="https://twitter.com/Playvpl" target="blank">
                    <img
                      src={imgRef.TW_SOCIAL}
                      alt="Twitter Page"
                      className="section-tile-image"
                    />
                  </a>
                  <a href="https://www.instagram.com/playvpl/" target="blank">
                    <img
                      src={imgRef.IG_SOCIAL}
                      alt="Instagram Page"
                      className="section-tile-image"
                    />
                  </a>
                </div>
              </div>
              <div className="row">
                <nav className="footer__internal-links">
                  <ul>
                    {txt.UPDATED_FOOTER_LINKS_LP.map((navLink, index) =>
                      navLink.ext ? (
                        <li key={index}>
                          <a href={navLink.link}>{navLink.txt}</a>
                        </li>
                      ) : (
                        <li key={index}>
                          <a href={navLink.link}>{navLink.txt}</a>
                        </li>
                      )
                    )}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <Disclaimer osType={this.props.osType} />

        <style jsx>{`
          .footer-nav {
            background: #ffffff;
          }

          .footer__social-links {
            margin-bottom: 24px;

            a {
              display: inline-block;
              margin: 10px 30px 10px 0;
            }
          }

          .footer__internal-links {
            ul {
              display: flex;
              flex-wrap: wrap;

              li {
                width: 50%;
              }
              a {
                color: #eb002b;
                text-transform: capitalize;
                line-height: 2.5;
                font-size: 12px;
                display: inline-block;
                margin-bottom: 14px;
                line-height: 16px;
                font-weight: bold;
              }
            }
          }

          @media screen and (min-width: 768px) {
            .footer__social-links {
              margin-bottom: 60px;
              margin-right: 0px;
              a {
                margin: 0 50px;
              }
            }

            .footer__internal-links {
              ul {
                justify-content: center;
                li {
                  width: 23%;
                }
                a {
                  font-size: 13px;
                  line-height: 28px;
                  margin-bottom: 24px;
                }
              }
            }
          }

          @media screen and (min-width: 1224px) {
            .footer__social-links {
              a {
                margin: 0 24px;
              }
            }
            .footer__internal-links {
              ul {
                li {
                  width: 20%;
                }
                a {
                  font-size: 20px;
                  font-weight: 500;
                }
              }
            }
          }
        `}</style>
      </footer>
    );
  }
}
