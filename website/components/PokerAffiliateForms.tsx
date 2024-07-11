import React, { useState, useEffect, useRef } from "react";
import ClevertapReact from "clevertap-react";
import Modal from "react-modal";

import { Dropdown } from "../components/Dropdown";

export const PokerAffiliateForms = (props) => {
  const formsRef = useRef(null);
  const [phone, setPhone] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    ClevertapReact.initialize(props.config.config.CLAVERTAP_KEY);
  }, []);
  const myChangeHandler = (event) => {
    let nam = event.target.name;
    if (event.target.name === "Name") {
      if (!event.target.value) setInvalidName(true);
      else setInvalidName(false);
    }
    if (event.target.name === "Email") {
      if (!validateEmail(event.target.value)) setInvalidEmail(true);
      else setInvalidEmail(false);
    }
    let val = event.target.value;

    setFormData((prev) => ({ ...prev, [nam]: val }));
  };

  const setPhoneNo = (phoneno, isvalidphone) => {
    if (isvalidphone) {
      setInvalidPhone(false);
      setPhone(phoneno);
      setFormData((prev) => ({ ...prev, Phone: phoneno }));
    } else {
      setInvalidPhone(true);
    }
  };

  const closeSucessModal = () => {
    setDataSubmitted(false);
  };

  const mySubmitHandler = (event) => {
    event.preventDefault();
    if (Object.keys(formData).length == 0) {
      setInvalidName(true);
      setInvalidPhone(true);
      setInvalidEmail(true);
      return false;
    }
    for (var key of Object.keys(formData)) {
      if (key != "message" && formData[key].trim() == "") {
        if (key === "Name") {
          setInvalidName(true);
          return false;
        }
        if (key === "Phone") {
          setInvalidPhone(true);
          return false;
        }
        if (key === "Email") {
          setInvalidEmail(true);
          return false;
        }
      }
    }
    
    ClevertapReact.event("Poker Affiliate User data", formData);
    setDataSubmitted(true);
    setFormData({});
    event.target.reset();
    
    setTimeout(() => {
        setDataSubmitted(false);
      }, 3000);
  };

  const validateEmail = (email) => {
    const email_regex = /\S+@\S+\.\S+/;
    console.log("check email " + email_regex.test(email));
    return email_regex.test(email);
  };

  return (
    <section className={`poker-affiliate-forms ${props.page} ${props.device} `}>
      <div className="container">
        <div className="section-layout page-info-layout">
          <div className="row">
            <form onSubmit={mySubmitHandler} ref={formsRef}>
              <div className="form-control text">
                <input
                  type="text"
                  name="Name"
                  onChange={myChangeHandler}
                  placeholder={"Name"}
                  className={`text ${invalidName ? "error" : ""}`}
                  maxLength={100}
                  required
                />
              </div>
              <div className="form-control text">
                <input
                  type="email"
                  name="Email"
                  onChange={myChangeHandler}
                  placeholder={"Email ID"}
                  className={`text ${invalidEmail ? "error" : ""}`}
                  required
                />
              </div>
              <div className="form-control">
                <Dropdown setPhoneNo={setPhoneNo} />
              </div>
             
              <div className="form-control">
                <input
                  type="submit"
                  value="Sign Up"
                  className={`submit ${
                    invalidName || invalidPhone || invalidEmail ? "disable" : ""
                  }`}
                />
              </div>
            </form>
          </div>
        </div>
        <Modal
          isOpen={dataSubmitted}
          contentLabel="Sucess Modal"
          onRequestClose={closeSucessModal}
          ariaHideApp={false}
          style={{
            overlay: {
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 10000,
            },

            content: {
              padding: "32px",
              top: "54%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "64%",
              color: "red",
            },
          }}
        >
          <div className="sucess-message">
            {" "}
            <img src="/static/2x/call_schedule_success.png" />
             {[props.sucessMessage]}
          </div>
        </Modal>
      </div>
      <style jsx global>
        {``}
      </style>
      <style jsx>
        {`
          .poker-affiliate-forms {
            background: #f0f0f0;
            .row {
              flex-direction: column;
            }
            .form-control {
              margin: 0 0 12px 0;

              .text {
                padding: 12px 0px 12px 12px;
                // width: 720px;
                width: 100%;
                height: 40px;
                border: none;
                box-sizing: border-box;
                border-radius: 4px;
                font-size: 12px;
                line-height: 16px;
              }
              .dropdown {
                padding: 12px 0px 12px 12px;
                //width: 720px;
                width: 100%;
                height: 40px;
              }
              .submit {
                background: #19be00;
                border-radius: 4px;
                //width: 720px;
                width: 100%;
                height: 44px;
                color: #fff;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                border: none;
              }
              .disable {
                cursor: not-allowed;
                pointer-events: none;
                color: #c0c0c0;
                background-color: #ffffff;
              }
            }
          }
          .error {
            border: solid 1px #ff0000 !important;
          }

          .sucess-message {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.6) !important;
            display: flex;
            align-items: center;
            img {
              width: 27px;
              margin-right: 11px;
            }
          }

          @media screen and (min-width: 1224px) {
            .poker-affiliate-forms {
              .form-control {
                margin: 0 0 64px 0;
                .text {
                  width: 720px;
                }
                .dropdown {
                  width: 720px;
                }
                .submit {
                  width: 720px;
                  height: 40px;
                }
              }
            }
          }
        `}
      </style>
    </section>
  );
};
