import React, { useState } from "react";
import { DownloadStateConsumer } from "../components/DownloadState";
const options = [
  {
    countryName: "India",
    countryIcon: "/static/2x/India-Flag.svg",
    countryCode: "+91",
  },
  {
    countryName: "US",
    countryIcon: "/static/2x/us-flag-icon.svg",
    countryCode: "+1",
  },
  {
    countryName: "UK",
    countryIcon: "/static/2x/uk-flag-icon.svg",
    countryCode: "+44",
  },
  {
    countryName: "India",
    countryIcon: "/static/2x/India-Flag.svg",
    countryCode: "+91",
  },
];

export const  Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [errorPhone, setErrorPhone] = useState(false);

  const toggling = () => {
    setIsOpen(!isOpen);
  };

  const onOptionClicked = (value) => () => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  const blurevent = () => {
    setIsOpen(false);
  };

  const validateMobileNumber = (number) => {
    const phoneno_regex = /^[6-9][0-9]{9}$/;
    return phoneno_regex.test(number);
  };

  const handlePhone = (event) => {
   if ((!selectedOption || (selectedOption && selectedOption.countryName === "India"))  && !validateMobileNumber(event.target.value))
    {
        setErrorPhone(true);
        props.setPhoneNo('+91'+event.target.value,false);
    }
    else {
        setErrorPhone(false);
         props.setPhoneNo( selectedOption ? selectedOption.countryCode+ event.target.value :`+91${event.target.value}`,true);
    }
  };

  return (
     <DownloadStateConsumer>
        {({ currentState, changeState, config, pageJson }) => (
            <>
      <div className="dropdown-container">
        <div className="text-input-container">
          <div
            className="selected-option"
            onClick={toggling}
            tabIndex="0"
          >
            <span className="flag">
                {!selectedOption ?
              <img src={options[0].countryIcon} /> :
              <img src={selectedOption.countryIcon} />
                }
            </span>
            <span className="down-angular-bracket">
              {" "}
              <img src="/static/2x/down-angular-bracket.svg" />{" "}
            </span>
          </div>
          <input
            type="text"
            placeholder={"Phone number"}
            className={`phone-number ${errorPhone ? "error" : ""}`}
            onChange={handlePhone}
            name ="phone"
          />
        </div>
        {isOpen && (
          <div className="dropdown-option">
            <ul>
              {pageJson.body.components.filter(
      (comp) => comp.name === "dropDown"
    )[0].data.optionList.map((option, key) => (
                <li key={key} onClick={onOptionClicked(option)}  onBlur={blurevent}>
                  <span className="country-icon">
                    <img src={option.countryIcon} />
                  </span>
                  <span className="country-name">{option.countryName}</span>
                  <span className="country-code">{option.countryCode}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <style jsx>
        {`
          .dropdown-container {
            width:100%;
            margin: auto;
          }
          .country-icon {
            margin-right: 5px;
            width:20px;
            height:20px;
            img{
                width:20px;
            }
          }
          .country-name {
            font-size: 12px;
            line-height: 16px;
            text-transform: capitalize;
            color: rgba(0, 0, 0, 0.8);
            margin-right: 5px;
          }

          .country-code {
            font-size: 10px;
            line-height: 10px;
            color: rgba(25, 10, 40, 0.4);
            font-weight: bold;
          }

          .dropdown-option {
            background-color: #fff;
            overflow-y:scroll;
            height:100px;
            box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
            ul {
              margin: 0;
              li {
                padding: 7px 0 7px 12px;
              }
              li:hover {
                background: #f0f0f0;
              }
            }
          }

          .dropdown-container {
            height: 40px;
            box-sizing: border-box;
            border-radius: 4px;
            background-color: #fff;
            text-align: left;
            font-size: 12px;
            line-height: 16px;
          }
          .selected-option {
            padding-top: 6px;
            width: 62px;
            height: 40px;
            line-height: 40px;
            padding-left: 12px;
            background: #f0f0f0;
            border: solid 1px rgba(25, 10, 40, 0.1);
            border-right: none;
            box-sizing: border-box;
            padding-right: 12px;
            display: flex;
            align-items: center;

            .flag {
              margin-right: 6px;
               width: 17px;
            }
            .down-angular-bracket {
            }
            span {
              color: rgba(25, 10, 40, 0.3);
            }
          }

          .phone-number {
           // width: 660px;
           width:100%;
            //padding: 12px 0px 12px 12px;
            height: 40px;
            box-sizing: border-box;
            border-radius: 4px;
            background-color: #fff;
            text-align: left;
            font-size: 12px;
            line-height: 16px;
            border: none;
            border-bottom-left-radius: unset;
            border-bottom-right-radius: unset;
            padding-left: 5px;
            border-bottom: solid 1px rgba(25, 10, 40, 0.1);
          }

          .text-input-container {
            display: flex;
            align-items: center;
          }
          .error {
            border: solid 1px #FF0000;
          }

          @media screen and (min-width: 1224px) {
            .phone-number {
                width: 660px;
            }

             .dropdown-container {
                width: 720px;
                margin: auto;
              }

          }
        `}
      </style>
      </>
     )}
    
     </DownloadStateConsumer>
  );
}
