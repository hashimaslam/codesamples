import React, { useEffect, useCallback, useState } from "react";
import Modal from "react-modal";
import SendSMSIPL from "./ipl2021/SendSMSIPL";
import IconTextButton from "./ipl2021/IconTextButton";
const desktopCustomStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    zIndex: 10000,
    position: "fixed",
    left: "0",
    padding: "40px",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    animationName: "fadeIn",
    animationDuration: "0.4s",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "909px",
    height: "552px",
    marginRight: "-50%",
    background: "#FFFFFF",
    borderRadius: "16px",
    transform: "translate(-50%, -50%)",
  },
};

function BannerOverlayDesktop(props) {
  const { setIsAppInstalled, modalIsOpen, setIsOpen, contentDesktop } = props;

  function closeModal() {
    setIsOpen(false);
    window.localStorage.getItem("isAppInstalled") == "true" &&
      setIsAppInstalled("true");
    let date = new Date();
    window.localStorage.setItem("closedAt", JSON.stringify(date.getTime()));
  }
  const handleChange = (e) => {
    window.localStorage.setItem("isAppInstalled", e.target.checked);
  };
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={desktopCustomStyles}
        contentLabel="List Modal"
        ariaHideApp={false}
      >
        <div className="overlay_header">
          <span className="overlay_close" onClick={closeModal}>
            <img src="/static/3x/shape_cross.svg" />
          </span>
          <h2>
            Download <span>vpl APP</span>
          </h2>
          <h2>to Play Games & Win Cash</h2>
        </div>
        <div className="overlay_content">
          {contentDesktop?.map((item, index) => {
            return (
              <div key={index}>
                <img src={item.imgUrl} alt={item.alt} />
                <p>{item.title}</p>
              </div>
            );
          })}
        </div>
        <div className="overlay_download_btn">
          <SendSMSIPL
            {...props.smsData}
            langauge={props.config.config.LANG_CODE}
            tiktokClass="true"
          />
        </div>
        <div className="agree_wrapper">
          <input type="checkbox" onChange={handleChange} />
          <p>No thanks, I already have the app</p>
        </div>
      </Modal>
      <style jsx global>
        {`
          .overlay_header {
            text-align: center;

            h2 {
              font-size: 40px;
              line-height: 52px;
              color: #230046;
              span {
                color: #e91051;
              }
            }
          }
          .overlay_close {
            position: absolute;
            right: 40px;
            cursor: pointer;
          }
          .overlay_content {
            display: flex;
            margin-top: 40px;
            justify-content: space-between;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            img {
              margin: 0 auto;
            }
            p {
              font-size: 20px;
              line-height: 24px;
              color: #230046;
              text-align: center;
              margin: 16px 0px 0px 0px;
            }
          }
          .agree_wrapper {
            font-size: 16px;
            line-height: 20px;
            color: #230046;
            text-align: center;
            display: flex;
            margin-top: 16px;
            justify-content: center;
            p {
              margin: 0px 0px 0px 10px;
            }
            input {
              height: 15px;
              width: 15px;
            }
          }
          .overlay_download_btn {
            #sms-form form {
              display: flex !important;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
            }

            #sms-but.download-but {
              margin-top: 0;
              margin-left: 20px;
            }
          }
          .overlay_download_btn {
            display: flex;
            justify-content: center;
            margin-top: 22px;
            #sms-form form {
              display: flex !important;
              justify-content: flex-start;
              align-items: center;
              width: 100%;
            }
            #sms-msg {
              text-align: center;
            }
            #sms-but.download-but {
              margin-top: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
const mobileCustomStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    zIndex: 10000,
    position: "fixed",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    animationName: "fadeIn",
    animationDuration: "0.4s",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    padding: "0px",
    marginRight: "-50%",
    background: "transparent",
    border: "none",
    transform: "translate(-50%, -50%)",
  },
};

function BannerOverlayMobile(props) {
  const { setIsAppInstalled, modalIsOpen, setIsOpen, contentMobile } = props;

  function closeModal() {
    setIsOpen(false);
    window.localStorage.getItem("isAppInstalled") == "true" &&
      setIsAppInstalled("true");
    let date = new Date();
    window.localStorage.setItem("closedAt", JSON.stringify(date.getTime()));
  }
  const handleChange = (e) => {
    window.localStorage.setItem("isAppInstalled", e.target.checked);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={mobileCustomStyles}
        contentLabel="Overlay Banner Modal"
        ariaHideApp={false}
      >
        <div className="overlay_mob_container">
          <div className="overlay_header" onClick={closeModal}>
            <h2>
              Download <span>vpl APP</span>
            </h2>
            <h2>to Play Games & Win Cash</h2>
          </div>
          <div className="overlay_content">
            {contentMobile?.map((item, index) => {
              return (
                <div className="overlay_content_item" key={index}>
                  <img src={item.imgUrl} alt={item.alt} />
                  <div className="overlay_info">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overlay_download">
            <IconTextButton
              {...{
                iconImageButton: {
                  text: "DOWNLOAD TO PLAY",
                  imageUrl: "/static/download_24px.svg",
                  cssClasses: "download-btn-android  overlay_btn",
                  showDownload: true,
                  buttonPosition: "top",
                },
                linkImageIOSButton: {
                  href: "itms-apps://itunes.apple.com/us/app/vpl-mobile-premier-league/id1447849626?ls=1&mt=8",
                  cssClasses: "overlay_action-link--banner--ios",
                  imageUrl: "/static/3x/ios_donwload_btn.png",
                },
                osType: props.device,
              }}
            />
          </div>
          <div className="agree_wrapper">
            <input type="checkbox" onChange={handleChange} />
            <p>No thanks, I already have the app</p>
          </div>
        </div>
        <div className="overlay_close" onClick={closeModal}>
          close
        </div>
      </Modal>
      <style jsx>
        {`
          .overlay_mob_container {
            background: #fff;
            border-radius: 8px;
            padding: 24px 16px;
            width: 312px;
            height: 588px;

            margin-bottom: 24px;

            .overlay_header {
              text-align: center;

              h2 {
                font-size: 20px;
                line-height: 24px;
                color: #230046;
                span {
                  color: #e91051;
                }
              }
            }

            .overlay_content {
              display: flex;
              flex-direction: column;

              justify-content: space-between;
              &_item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 24px;
                img {
                  height: 74px;
                  width: 74px;
                }
                .overlay_info {
                  h4 {
                    font-size: 14px;
                    line-height: 20px;
                    margin: 0px;
                    font-weight: 400;
                    color: #230046;
                  }
                  p {
                    font-size: 12px;
                    line-height: 18px;
                    color: rgba(25, 10, 40, 0.6);
                    margin: 8px 0px 0px 0px;
                  }
                }
              }
            }
            .agree_wrapper {
              font-size: 12px;
              line-height: 18px;
              color: #230046;
              text-align: left;
              display: flex;
              margin-top: 16px;
              justify-content: flex-start;
              p {
                margin: 0px 0px 0px 10px;
              }
              input {
                height: 13px;
                width: 13px;
              }
            }
            .overlay_download {
              margin-top: 24px;
            }
          }
          .overlay_close {
            text-align: center;
            color: #fff;
          }

          @media screen and (max-width: 320px) {
            .overlay_mob_container {
              height: 490px;
              width: 300px;
              padding: 10px 10px;
              .overlay_content {
                display: flex;
                flex-direction: column;

                justify-content: space-between;
                &_item {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 10px;
                  img {
                    height: 70px;
                    width: 70px;
                  }
                  .overlay_info {
                    h4 {
                      font-size: 12px;
                      line-height: 16px;
                      margin: 0px;
                      font-weight: 400;
                      color: #230046;
                    }
                    p {
                      font-size: 10px;
                      line-height: 12px;
                      color: rgba(25, 10, 40, 0.6);
                      margin: 8px 0px 0px 0px;
                    }
                  }
                }
              }
              .agree_wrapper {
                font-size: 12px;
                line-height: 18px;
                color: #230046;
                text-align: left;
                display: flex;
                margin-top: 10px;
                justify-content: flex-start;
                p {
                  margin: 0px 0px 0px 10px;
                }
                input {
                  height: 13px;
                  width: 13px;
                }
              }
              .overlay_download {
                margin-top: 10px;
              }
            }
          }
        `}
      </style>
    </div>
  );
}
const BannerOverlay = (props) => {
  const { osType } = props;
  let timer1;
  let timer2;
  let startPos;
  const [isAppInstalled, setIsAppInstalled] = useState(undefined);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [currSeconds, setCurrSeconds] = useState(0);

  useEffect(() => {
    setIsAppInstalled(window.localStorage.getItem("isAppInstalled"));
    //checking for the isAppinstalled value to enable event listeners
    if (window.localStorage.getItem("isAppInstalled") == "true") {
      return;
    } else {
      timer1 = setTimeout(() => {
        if (osType !== "desktop") {
          window.addEventListener("touchstart", noteTouchStartPos);
          window.addEventListener("touchend", noteTouchEndPos);
        } else {
          window.addEventListener("mouseout", mouseEvent);
        }
        window.addEventListener("load", resetTimer);
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("mousedown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("keypress", resetTimer);
      }, 1000);
    }
    //removing listeners on component unmount
    return () => {
      window.removeEventListener("mouseout", mouseEvent);
      window.removeEventListener("load", resetTimer);
      window.removeEventListener("touchend", noteTouchEndPos);
      window.removeEventListener("touchstart", noteTouchStartPos);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, []);

  //checking if the user clicks already have the app and make the isAppinstalled to true and run the effect to remove the listeners
  //to avoid memory leakage
  useEffect(() => {
    if (isAppInstalled == "true") {
      window.removeEventListener("mouseout", mouseEvent);
      window.removeEventListener("load", resetTimer);
      window.removeEventListener("touchend", noteTouchEndPos);
      window.removeEventListener("touchstart", noteTouchStartPos);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  }, [isAppInstalled]);

  //idle timer logic resetting on any event happens
  const resetTimer = () => {
    clearInterval(timer2);
    setCurrSeconds(0);
    timer2 = setInterval(startIdleTimer, 1000);
  };

  //starting to count the idle time
  const startIdleTimer = () => {
    setCurrSeconds((seconds) => seconds + 1);
  };

  //opening overlay if the idle item reaches the threshold
  useEffect(() => {
    if (currSeconds > 60 * 10) {
      openModal();
    }
  }, [currSeconds]);

  //looking for touchevents callback on mobile deivces
  const mouseEvent = useCallback(
    (e) => {
      const shouldShowExitIntent =
        !e.toElement && !e.relatedTarget && e.clientY < 10;

      if (shouldShowExitIntent) {
        openModal();
      }
    },
    [isAppInstalled]
  );
  const noteTouchStartPos = useCallback(
    (e) => {
      startPos = e.changedTouches[0].screenY;
    },
    [isAppInstalled]
  );

  const noteTouchEndPos = useCallback((e) => {
    const endPos = e.changedTouches[0].screenY;
    if (endPos - startPos > 0) {
      openModal();
    }
  }, []);

  //open overlay function
  function openModal() {
    let closedAt = window.localStorage.getItem("closedAt");
    if (closedAt === null) {
      setIsOpen(true);
      return;
    }
    let current = new Date();

    const milliseconds = Math.abs(Number(closedAt) - Number(current.getTime()));
    const hours = milliseconds / 36e5;
    if (hours > props.n_hour) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  if (osType === undefined) return "";

  return (
    <>
      {isAppInstalled != "true" && (
        <>
          {osType === "desktop" ? (
            <BannerOverlayDesktop
              {...props}
              setIsAppInstalled={setIsAppInstalled}
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
            />
          ) : (
            <BannerOverlayMobile
              {...props}
              setIsAppInstalled={setIsAppInstalled}
              modalIsOpen={modalIsOpen}
              setIsOpen={setIsOpen}
            />
          )}
        </>
      )}
    </>
  );
};
export default BannerOverlay;
