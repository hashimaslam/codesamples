import React, { Component } from "react";
import * as txt from "../configs/footer_data";
import "../styles/header.scss";
export default class extends Component {
  constructor(props) {
    super(props);
    this.toggleClass = this.toggleClass.bind(this);
    this.state = {
      showMenu: false,
      downloading: true,
      config: props.config,
      osType: props.osType,
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
  showDownload = () => {
    setTimeout(() => {
      this.setState({ downloading: false });
    }, 200);
  };
  render() {
    const touchEvent = (e) => {
      // e.preventDefault();
      // alert("som ");
    };
    return (
      <header id="top-header">
        <div>
          <a href="/" className="header-logo">
            <img src={this.props.logo} alt="vpl Logo" className="vpl-logo" />
          </a>

          <div id="header-app">
            {this.props.osType ? (
              this.props.osType !== "desktop" ? (
                this.state.config && this.state.downloading ? (
                  <a
                    href={
                      this.props.osType === "android"
                        ? this.state.config.DOWNLOAD_LINK.DEFAULT
                        : this.state.config.IOS_APP_URL
                    }
                  >
                    <div onClick={this.showDownload}>Download App</div>
                  </a>
                ) : (
                  <a>Downloading ...</a>
                )
              ) : (
                ""
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
            <nav style={{ height: "90vh", overflowY: "auto" }}>
              <div id="play-vpl" className="vpl vpl-header">
                <a href={this.props.redirect}>
                  PLAY <span>{this.props.firstNav}</span>{" "}
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
        <style jsx>{`
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
          }
        `}</style>
      </header>
    );
  }
}
