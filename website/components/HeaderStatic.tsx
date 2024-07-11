import React, { Component } from "react";
import * as txt from "../configs/footer_data";
import { DownloadStateConsumer } from "../components/DownloadState";
import "../styles/header.scss";
export default class extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      showMenu: false,
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
  render() {
    const touchEvent = (e) => {
      // e.preventDefault();
      // alert("som ");
    };
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <header id="top-header">
            <div>
              <a href="/" className="header-logo">
                <img
                  src={this.props.logo}
                  alt="vpl Logo"
                  className="vpl-logo"
                />
              </a>

              <div id="header-app">
                {config ? (
                  !currentState &&
                  config.config &&
                  config.config.HEADER_BUTTON ? (
                    <a onClick={() => changeState("Top")}>Download App</a>
                  ) : (
                    <a>Downloading ...</a>
                  )
                ) : (
                  ""
                )}
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
              </div>
              <div
                onTouchEnd={touchEvent}
                onTouchStart={touchEvent}
                id="header-menu"
                className={this.state.showMenu ? "show-menu" : "hide"}
              >
                <div className="header--wrapper">
                  <nav style={{ height: "90vh" }}>
                    <div>
                      <a href={this.props.redirect}>
                        Play <span>{this.props.firstNav}</span>{" "}
                      </a>
                      <div id="shade" className="mobile" />
                    </div>

                    {txt.FOOTER_LINK.map((navLink, index) =>
                      navLink.ext ? (
                        <div key={index}>
                          {" "}
                          <a href={navLink.link}>{navLink.txt}</a>
                        </div>
                      ) : (
                        <div key={index}>
                          <a href={navLink.link}>{navLink.txt}</a>
                        </div>
                      )
                    )}
                  </nav>
                </div>
              </div>
            </div>
            <style jsx>{`
              #top-header nav {
                overflow-y: auto;
              }

              .mobile {
                width: 60vw !important;
                margin-left: 20vw !important;
              }
              #header-app {
                display: flex;
                > a {
                  margin: 0 20px;
                  padding: 0 10px;
                  display: flex;
                  font-weight: bold;
                  text-transform: uppercase;
                  color: #4a4a4a;
                  border: 1px solid #4a4a4a;
                  border-radius: 6px;
                  font-size: 14px;
                  text-decoration: none;
                  align-items: center;
                }
              }
              @media (min-width: 1200px) {
                #shade {
                  display: none;
                }
                #top-header nav {
                  overflow-y: unset;
                }
                #header-app > a {
                  display: none !important;
                }
              }
            `}</style>
          </header>
        )}
      </DownloadStateConsumer>
    );
  }
}
