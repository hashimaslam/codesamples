import React, { Component } from "react";

import { DownloadStateConsumer } from "../DownloadState";

export default class extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      showMenu: false,
      hideLogo: props.hideLogo,
      hideDownloadButton: props.hideDownloadButton,
    };
  }

  toggleClass() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
    if (!this.state.showMenu) {
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
    if (this.props.device !== "desktop")
      window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    if (this.props.device !== "desktop")
      window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    if (this.props.hideLogo) {
      if (window.scrollY > 50) {
        this.setState({
          hideLogo: false,
        });
      } else {
        this.setState({
          hideLogo: true,
        });
      }
    }
  };

  render() {
    const touchEvent = (e) => {};
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <header id="top-header" className={this.props.page}>
            <div className="header-container">
              <div
                className={
                  this.state.hideLogo && this.props.device !== "desktop"
                    ? "header-logo__container hidden"
                    : " header-logo__container  show-menu"
                }
              >
                {this.props.page !== "vpl-games" &&
                !this.props.disableLogoURL ? (
                  <a href="/" className="header-logo">
                    <img
                      src={this.props.logoImageurl.png}
                      alt={this.props.logoAlt}
                      className="vpl-logo"
                    />
                  </a>
                ) : (
                  <span className="header-logo">
                    <img
                      src={this.props.logoImageurl.png}
                      alt={this.props.logoAlt}
                      className="vpl-logo"
                    />
                  </span>
                )}
              </div>

              <div id="header-app">
                {this.props.page == "vpl-games-generic" ||
                (config.config.LANG_CODE === "id" &&
                  this.props.device === "ios") ? (
                  ""
                ) : (
                  <>
                    <>
                      {config && this.props.device !== "desktop" ? (
                        !currentState && config.config ? (
                          <a
                            onClick={() => changeState("Top")}
                            className={
                              !this.props.hideDownloadButton
                                ? "header--small show-menu"
                                : "header--small hidden"
                            }
                          >
                            {this.props.headerDownloadbtnLabel}
                          </a>
                        ) : (
                          <a
                            className={
                              !this.props.hideDownloadButton
                                ? "show-menu"
                                : "hidden"
                            }
                          >
                            {this.props.headerDownloadingbtnLabel}
                          </a>
                        )
                      ) : (
                        ""
                      )}
                    </>
                  </>
                )}
                {this.props.hideSideMenu && this.props.hideSideMenu === true ? (
                  <></>
                ) : (
                  <div onClick={this.toggleClass} id="side-menu">
                    <div
                      id="menu-icon"
                      className={this.state.showMenu ? "change" : ""}
                    >
                      <div className="bar1" />
                      <div className="bar2" />
                      <div className="bar3" />
                    </div>
                  </div>
                )}
              </div>
              <div
                onTouchEnd={touchEvent}
                onTouchStart={touchEvent}
                id="header-menu"
                className={this.state.showMenu ? "show-menu" : "hide"}
              >
                <div className="header--wrapper">
                  <nav style={{ height: "90vh" }}>
                    {this.props.menuList &&
                      this.props.menuList.map((navLink, index) => (
                        <div key={index}>
                          <a href={navLink.link} className="label">
                            {navLink.text}
                          </a>
                        </div>
                      ))}
                  </nav>
                </div>
              </div>
            </div>
            <style jsx>{`
              .header-logo {
                display: flex;
                align-items: center;
              }

              .header-container {
                max-width: 1200px;

                padding: 0 3.8vh 0 3.5vh;
                justify-content: space-between;
                margin: 12px auto;
                align-items: center;
                display: flex;
              }
              #top-header nav {
                overflow-y: auto;
              }

              .mobile {
                width: 60vw !important;
                margin-left: 20vw !important;
              }
              .header-logo__container {
                display: flex;
                align-items: center;
                &.hidden {
                  visibility: hidden;
                }
              }
              .gopay-logo {
                display: flex;
                flex-direction: column;
                text-align: left;
                border-left: solid 1px rgba(128, 128, 128, 0.3);
                margin: 0 0 0 1.1em;
                padding: 0 0 0 1.1em;
                justify-content: space-between;
                @media (min-width: 768px) {
                  justify-content: space-around;
                }
                .gopay-logo__text {
                  font-size: calc(
                    5.5px + (26 - 5.5) * ((100vw - 300px) / (1600 - 300))
                  );
                  @media (min-width: 481px) {
                    font-size: calc(
                      7px + (26 - 7) * ((100vw - 300px) / (1600 - 300))
                    );
                  }
                  @media (min-width: 768px) {
                    font-size: 0.85em;
                  }
                  color: rgba(128, 128, 128, 0.8);
                }
                .gopay-logo__img {
                  width: 11vw;
                  @media (min-width: 481px) {
                    width: 9vw;
                  }
                  @media (min-width: 768px) {
                    width: 8vw;
                  }

                  @media (min-width: 1025px) {
                    width: 5vw;
                  }
                }
              }

              #header-app {
                display: flex;
                > a {
                  margin: 0 20px;
                  padding: 0 10px;
                  display: flex;
                  font-weight: bold;
                  text-transform: uppercase;
                  color: #19be00;
                  border: 1px solid #19be00;
                  border-radius: 2px;
                  font-size: 14px;
                  text-decoration: none;
                  align-items: center;
                  line-height: 30px;
                }
                .hidden {
                  visibility: hidden;
                }
              }

              .header-logo-text {
                color: #ffffff;
                opacity: 0.8;
                font-size: 18px;
                margin-left: 5px;
              }

              /* rummy sign up compaign */
              .signup-offer {
                #header-app {
                  align-items: center;
                  a {
                    font-style: normal;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 14px;
                    text-transform: capitalize;
                    padding: 4px 8px;
                    box-sizing: border-box;
                    height: fit-content;
                    border: 1px solid #828282;
                  }
                }
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
              }
            `}</style>
          </header>
        )}
      </DownloadStateConsumer>
    );
  }
}
