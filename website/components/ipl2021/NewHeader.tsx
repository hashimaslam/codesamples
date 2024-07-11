import React, { Component } from "react";
import "../../styles/new-header.scss";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
export default class extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      showMenu: false,
      showLogo: false,
    };
  }

  toggleClass(linkname) {
    this.setState({
      showMenu: !this.state.showMenu,
    });
    if (!this.state.showMenu) {
      if (
        window.location.pathname === "/esports/arena" ||
        window.location.pathname === "/esports/dailyseries"
      ) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event:
            linkname === "hamburgermenu"
              ? "HamburgerClicked"
              : "vpl_Games_clicked",
          ButtonName: linkname,
          LocationOfAction:
            linkname === "hamburgermenu" ? "hamburger_menu" : "Hamburger_menu",
          Game: linkname,
        });
      }
      document.getElementsByTagName("body")[0].style.height = "100%";
      document.getElementsByTagName("html")[0].style.height = "100%";
      document.getElementsByTagName("body")[0].position = "fixed";
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      document.getElementById("__next").style.overflow = "hidden";
    } else {
      document.getElementsByTagName("body")[0].style.height = "auto";
      document.getElementsByTagName("body")[0].position = "relative";
      document.getElementsByTagName("body")[0].style.overflow = "initial";
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 50) {
      this.setState({
        showLogo: true,
      });
    } else {
      this.setState({
        showLogo: false,
      });
    }
  };

  linkClicked = (linkname) => {
    if (
      window.location.pathname === "/esports/arena" ||
      window.location.pathname === "/esports/dailyseries"
    ) {
      window.dataLayer = window.dataLayer || [];
      let eventName = "";
      switch (linkname.toLowerCase()) {
        case "vpl esports":
          eventName = "vpl_Esports_clicked";
          break;
        case "about":
          eventName = "About_clicked";
          break;
        case "blog":
          eventName = "Blog_clicked";
          break;
        case "faqs":
          eventName = "FAQs_clicked";
          break;
        case "help":
          eventName = "Help_clicked";
          break;
      }

      window.dataLayer.push({
        event: eventName,
        ButtonName: linkname,
        LocationOfAction: "Hamburger_menu",
        Game: "",
      });
    }
  };

  render() {
    return (
      <header
        id="top-header"
        className={+this.props.page + " " + this.props.cssClasses}
      >
        <div>
          {/* <div onClick={this.toggleClass} id="side-menu">
                        <div
                        id="menu-icon"
                        className={this.state.showMenu ? "change" : ""}
                        >
                        <div className="bar1" />
                        <div className="bar2" />
                        <div className="bar3" />
                        </div>
                </div>
                <div className="header-logo__container">
                    <a href="/" className={"header-logo show-logo"}>
                        <img
                        src={this.props.logoImageurl.png}
                        alt={this.props.logoAlt}
                        className="vpl-logo"
                        />
                    </a>
                </div> */}
          {this.props.device !== "desktop" && (
            <div className="mobile--header--logo">
              <div className="header-logo__container">
                <a href="/" className={"header-logo show-logo"}>
                  <img
                    src={this.props.logoImageurl.png}
                    alt={this.props.logoAlt}
                    className="vpl-logo"
                  />
                </a>
              </div>
              <div
                onClick={() => this.toggleClass("hamburgermenu")}
                id="side-menu"
              >
                <div
                  id="menu-icon"
                  className={this.state.showMenu ? "change" : ""}
                >
                  <div className="bar1" />
                  <div className="bar2" />
                  <div className="bar3" />
                </div>
              </div>
            </div>
          )}
          {this.props.device === "desktop" && (
            <div className="logo--link--wrapper">
              <div className="header-logo__container">
                <a href="/" className={"header-logo show-logo"}>
                  <img
                    src={this.props.logoImageurl.png}
                    alt={this.props.logoAlt}
                    className="vpl-logo"
                  />
                </a>
              </div>
              <div className="right--links">
                {this.props.desktopHeaderLinks &&
                  this.props.desktopHeaderLinks.map((link, key) => {
                    return (
                      <div key={key}>
                        {link.link != undefined && link.link === false && (
                          <div
                            className={" " + link.css}
                            onClick={() => this.toggleClass(link.name)}
                          >
                            <div>{link.name ? link.name : ""}</div>
                            <div
                              className={`arrow ${
                                this.state.showMenu ? "up" : "down"
                              }`}
                            ></div>
                          </div>
                        )}
                        {link.link && link.link === true && (
                          <div className={" " + link.css}>
                            <a
                              href={link.url}
                              onClick={() => this.linkClicked(link.name)}
                            >
                              {link.imgUrl && link.imgUrl.png && (
                                <img
                                  src={link.imgUrl.png}
                                  alt={link.imgUrl.alt}
                                />
                              )}
                              {link.name ? link.name : ""}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          {this.state.showMenu && (
            <div className={"header--menu" + " " + this.props.cssClasses}>
              {this.props.device !== "desktop" && (
                <div className="mobile--header">
                  <MobileHeader
                    menuList={this.props.menuListMobile}
                    cssClasses={this.props.cssClasses}
                  />
                </div>
              )}
              {this.props.device === "desktop" && (
                <div className="desktop--header">
                  <DesktopHeader
                    menuList={this.props.menuListDesktop}
                    cssClasses={this.props.cssClasses}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          #header-menu ::-webkit-scrollbar {
            width: 4px;
            background: transparent;
          }

          /* Track */
          #header-menu ::-webkit-scrollbar-track-piece {
            background-color: transparent;
          }

          #header-menu ::-webkit-scrollbar-corner {
            background: transparent;
          }

          /* Handle */
          #header-menu ::-webkit-scrollbar-thumb {
            background: #4a4a4a;
            border-radius: 4px;
          }

          /* Handle on hover */
          #header-menu ::-webkit-scrollbar-thumb:hover {
            background: #4a4a4a;
            border-radius: 4px;
          }

          header {
            background-color: #ffffff;
            z-index: 1001;
            position: fixed;
            width: 100vw;
            top: 0;
            min-height: 56px;
            > div {
              max-width: 100%;
              display: flex;
              justify-content: flex-start;
              margin: 12px auto;
              align-items: center;
              display: flex;
              #side-menu {
                z-index: 100;
              }
            }
          }
          .bar1,
          .bar2,
          .bar3 {
            width: 25px;
            height: 3px;
            background-color: #ff1e46;
            margin: 5px 0;
            transition: 0.4s;
          }
          .change .bar1 {
            -webkit-transform: rotate(-45deg) translate(-9px, 6px);
            transform: rotate(-45deg) translate(-5px, 6px);
          }

          .change .bar2 {
            opacity: 0;
          }

          .change .bar3 {
            -webkit-transform: rotate(45deg) translate(-9px, -6px);
            transform: rotate(45deg) translate(-5px, -6px);
          }

          .hide {
            display: none;
          }
          .show-menu {
            display: flex;
          }
          .header-logo {
            img {
              width: 60px;
              height: 20px;
            }
          }
          @media (min-width: 768px) {
          }
          .header-logo {
            display: flex;
            align-items: center;
          }
          .header--menu {
            background: #ffffff;
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            margin-top: 56px;
            overflow-y: auto;
            flex-direction: column;
          }
          .mobile--header {
            padding-bottom: 70px;
          }
          .hide-logo {
            display: none;
          }

          .show-logo {
            display: block;
          }
          .header-logo__container {
            // margin-left: 24px;
          }
          .mobile--header--logo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0 24px;
          }
          .right--links {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 117px;
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
            width: 906px;
            color: #230046;
          }
          .old--page {
            .right--links {
              font-family: "Roboto";
              font-weight: 500;
              font-size: 20px;
              line-height: 24px;
              width: 906px;
            }
          }
          .logo--link--wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .menu--button {
            padding: 10px;
            background: #33ff66;
            border-radius: 4px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .show--more {
            padding: 10px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .help--button {
            a {
              display: flex;
              align-items: center;
              background: #ffffff;
              border: 1px solid rgba(25, 10, 40, 0.15);
              box-sizing: border-box;
              border-radius: 4px;
              padding: 12px 32px;
              font-size: 20px;
              line-height: 24px;
              color: #e91051;
            }
            img {
              width: 20px;
              height: 20px;
              margin-right: 12px;
            }
          }
          .normal--link a {
            font-size: 20px;
            line-height: 24px;
            color: #230046;
          }
          .arrow {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-top: 2px solid #230046;
            border-left: 2px solid #230046;
            -webkit-transition: all 250ms ease-in-out;
            transition: all 250ms ease-in-out;
            color: transparent;
            margin-left: 16px;
            margin-right: 8px;
          }
          .arrow.up {
            transform: rotate(45deg);
            margin-top: 4px;
          }

          .arrow.down {
            transform: rotate(-135deg);
            margin-top: -2px;
          }

          @media (min-width: 1200px) {
            .header-logo-text {
              font-size: 27px;
            }
            #shade {
              display: none;
            }
            #top-header nav {
              overflow-y: unset;
            }
            .header-logo__container {
              margin-left: 117px;
            }
            .header--menu {
              margin-top: 72px;
            }
            .show-logo {
              display: flex;
            }
            .header--wrapper {
              padding: 0px 16px;
              padding-top: 16px;
            }

            header > div {
              height: 48px;
              padding: 0;
              #header-menu .header--wrapper {
                overflow-y: scroll;
                padding: 0px;
                padding-top: 16px;
                margin-right: 16px;
              }
            }
            .header-logo > img {
              width: 101px;
              height: 32px;
            }
          }
        `}</style>
      </header>
    );
  }
}
