import React, { useState, useEffect } from "react";
import { getHTML } from "../configs/util";
import Modal from "react-modal";
import "../styles/modal.scss";
import fetch from "isomorphic-unfetch";

const ListModal = (props) => {
  const [showModal, setShowModal] = useState(true);
  const [listType, setListType] = useState(props.type);
  const [regionSelected, setRegionSelected] = useState(null);
  const [zoneSelected, setZoneSelected] = useState(null);
  const [nationSelected, setNationSelected] = useState(null);
  const [showWinnerListZone, setshowWinnerListZone] = useState(false);
  const [showWinnerListCollege, setshowWinnerListCollege] = useState(false);
  const [winnerList, setWinnerList] = useState(null);
  const [wonUserProfilelist, setWonUserProfilelist] = useState([]);
  const [selectedFilterId, setSelectedFilterId] = useState(null);

  useEffect(() => {}, []);

  const regionList = [
    { regionid: 250, regionName: "Jaipur Region", id: 234 },
    { regionid: 242, regionName: "Chandigarh	Region", id: 236 },
    { regionid: 241, regionName: "UP	Region", id: 236 },
    { regionid: 243, regionName: "Punjab	Region", id: 236 },
    { regionid: 247, regionName: "Mangalore	Region", id: 235 },
    { regionid: 251, regionName: "Mumbai	Region", id: 234 },
    { regionid: 239, regionName: "Chattisgarh	Region", id: 233 },
    { regionid: 240, regionName: "West Bengal	Region", id: 233 },
    { regionid: 238, regionName: "Jharkhand	Region", id: 233 },
    { regionid: 248, regionName: "Kerala	Region", id: 235 },
    { regionid: 249, regionName: "Gujarat	Region", id: 234 },
    { regionid: 252, regionName: "Pune	Region", id: 234 },
    { regionid: 245, regionName: "Haryana	Region", id: 236 },
    { regionid: 237, regionName: "MP	Region", id: 233 },
    { regionid: 244, regionName: "Delhi NCR	Region", id: 236 },
    { regionid: 246, regionName: "Bengaluru	Region", id: 235 },
  ];
  const zonelList = [
    { zoneid: 236, zoneName: "North" },
    { zoneid: 235, zoneName: "South" },
    { zoneid: 234, zoneName: "West" },
    { zoneid: 233, zoneName: "East" },
  ];

  const nationalList = [{ countryid: 232, countryName: "India" }];

  useEffect(() => {
    return () => {
      const abortController = new AbortController();
      abortController.abort();
    };
  }, []);

  const renderRegion = () => {
    return regionList.map((region, i) => {
      return (
        <li
          onClick={() => selectRegion(region)}
          key={i}
          className={
            regionSelected && region.regionid === regionSelected.regionid
              ? "selected-list"
              : ""
          }
        >
          {region.regionName}
        </li>
      );
    });
  };

  const renderZone = () => {
    return zonelList.map((zone, i) => {
      return (
        <li
          onClick={() => selectZone(zone)}
          key={i}
          className={
            zoneSelected && zone.zoneid === zoneSelected.zoneid
              ? "selected-list"
              : ""
          }
        >
          {zone.zoneName}
        </li>
      );
    });
  };

  const renderNational = () => {
    return nationalList.map((national, i) => {
      return (
        <li
          onClick={() => selectNational(national)}
          key={i}
          className={
            nationSelected && national.countryid === nationSelected.countryid
              ? "selected-list"
              : ""
          }
        >
          {national.countryName}
        </li>
      );
    });
  };

  const selectRegion = (region) => {
    setRegionSelected(region);
  };
  const selectZone = (zone) => {
    setZoneSelected(zone);
  };
  const selectNational = (nationa) => {
    setNationSelected(nationa);
  };

  const showWinnerRegion = async (type) => {
    if (zoneSelected) {
      setshowWinnerListZone(true);
      setShowModal(false);
      // api for leaderboard
    }
  };

  const getWinnerList = async (type) => {
    let selectedOption =
      type == "regional"
        ? regionSelected.regionid
        : type == "zonal"
        ? zoneSelected.zoneid
        : nationSelected.countryid;

    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stageId: selectedOption }),
    };
    let fetchResponse = await fetch(`/api/esports-leaderboard`, settings);
    const data = await fetchResponse.json();
    console.log('esports-response');
    console.log(data);
    setWinnerList(data);
    if(data.stageLeaderboard.filters)
    {
    setSelectedFilterId(data.stageLeaderboard.filters[0].filterId);

    let wonUserList = data.stageLeaderboard.lbItems.filter(
      (item) => item.filterId === data.stageLeaderboard.filters[0].filterId
    );
    setWonUserProfilelist(wonUserList);
    console.log("data-getwinnerlist");
    console.log(data);
    }
  };

  const showWinners = (type) => {
    if(zoneSelected || regionSelected || nationSelected){
     setshowWinnerListCollege(true);
    setShowModal(false);
    getWinnerList(type);
    }
  };

  const goBack = () => {
    window.location.href = "/esports/cpl";
  };
  const navigateToHomePage = () => {
    
    setshowWinnerListCollege(false);
    setShowModal(true);
  };

  const openListModal = () => {};

  const selectGame = (filterid) => {
    setSelectedFilterId(filterid);
    let wonUserList = winnerList.stageLeaderboard.lbItems.filter(
      (item) => item.filterId === filterid
    );
    setWonUserProfilelist(wonUserList);
  };
  return (
    <>
      <div>
        <Modal
          isOpen={showModal}
          onRequestClose={openListModal}
          contentLabel="List Modal"
          ariaHideApp={false}
          style={{
            overlay: {
              background: "rgba(0, 0, 0, 0.5)",
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
              borderRadius: "16px 16px 0px 0px",
              position: "fixed",
              bottom: "0",
              width: "100%",
              animationName: "slideIn",
              animationDuration: "0.4s",
              padding: "32px",
              boxSizing: "border-box",
              top: "auto",
              left: "auto",
              right: "auto",
              overflow: "visible",
            },
          }}
        >
          <div className="list-container">
            {listType === "regional" ? (
              <>
                <h1>Select a Region</h1>
                <ul className="lists">{renderRegion()}</ul>
                <button onClick={() => showWinners("regional")}>
                  Show winners
                </button>
              </>
            ) : (
              <>
                {listType === "zonal" ? (
                  <>
                    <h1>Select a Zone</h1>
                    <ul className="lists zone-list">
                      {renderZone()}
                      <button onClick={() => showWinners("zonal")}>
                        Show winners
                      </button>
                    </ul>
                  </>
                ) : (
                  <div>
                    <h1>Select Country</h1>
                    <ul className="lists national-list">
                      {renderNational()}
                      <button onClick={() => showWinners("national")}>
                        Show winners
                      </button>
                    </ul>
                  </div>
                )}
              </>
            )}

            <style jsx global>
              {`
                .email-send-modal-close {
                  position: absolute;
                  right: 18px;
                  top: -60px;
                  background: rgba(255, 255, 255, 0.3);
                  padding: 14px 15px;
                  border-radius: 50%;
                }
                .list-container {
                  h1 {
                    font-size: 20px;
                    line-height: 26px;
                  }
                  button {
                    padding: 12px 16px;
                    background: #ff1e46;
                    border-radius: 4px;
                    color: #ffffff;
                    border: none;
                    width: 100%;
                    font-size: 14px;
                  }
                }
                .lists {
                  margin-bottom: 60px;
                  height: 400px;
                  overflow: scroll;
                  li {
                    padding: 12px 0px;
                    border-bottom: 1px solid #e6e6e6;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.8);
                    text-transform: capitalize;
                    cursor:pointer;
                  }
                  &.zone-list {
                    height: 217px
                    
                  }
                  &.national-list {
                    height: 80px;
                  }
                }
                .selected-list {
                  background-color: #e6e6e6;
                }
              `}
            </style>
          </div>
        </Modal>
      </div>
      {showWinnerListCollege && winnerList && (
        <div className="winner-list">
          <div className="header">
            <div style={{ padding: "3px 20px" }} onClick={goBack}>
              <img src="/static/2x/back-arrow.svg" />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
              onClick={navigateToHomePage}
            >
              <img src="/static/2x/location.svg" />
              <span style={{ marginLeft: "10px", marginTop: "10px" }}>
                Change{" "}
               {props.type === 'regional' ? 'Region' : 
                props.type.charAt(0).toUpperCase() +
                  props.type.substr(1).toLowerCase()}
              </span>{" "}
            </div>
          </div>
          <h1 className="title">{winnerList.stageLeaderboard.header}</h1>
          <span className="subtitle">
            {winnerList.stageLeaderboard.subHeader}
          </span>

          <div className="game-container scrollable-section">
            {Object.keys(winnerList).length > 0 && winnerList.stageLeaderboard.filters &&
              winnerList.stageLeaderboard.filters.map((game, key) => (
                <div
                  key={key}
                  className={`game-tile ${
                    selectedFilterId == game.filterId ? "selected-game" : ""
                  }`}
                  onClick={() => selectGame(game.filterId)}
                >
                  <div style={{'width':24,'marginRight':8}}><img src={JSON.parse(game.fitlerIcon).normalShortCut} /></div>
                  <div className="game-name">{game.filterName}</div>
                </div>
              ))}
          </div>

          <div className="winner-list-container">
            <ul>
              {wonUserProfilelist[0] && wonUserProfilelist[0].profiles ? (
                <>
                  {wonUserProfilelist[0].profiles.map((user, key) => (
                    <li key={key}>
                      <div className="winner-sequence">{user.profile.rank}</div>
                      <div className="winner-avatar">
                        <img
                          src={
                            user.profile.avatar
                              ? user.profile.avatar
                              : "/static/tournaments/cpl-winner.png"
                          }
                        />
                        <div className="winner-name">
                          <div className="name">{user.profile.name}</div>
                          <div className="college-name">
                            {user.college}, {user.city}
                          </div>{" "}
                        </div>
                      </div>
                      <div className="amount-container">
                        <div className="amount">
                          {" "}
                          {user.profile.reward.cash && "₹"}
                          {user.profile.reward.cash}
                        </div>
                        <div className="text">
                          {" "}
                          {user.profile.won ? "Won" : ""}
                        </div>
                      </div>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <li>
                    <p className="not-found-text">
                      <img src={"/static/2x/no-data-found.svg"} />
                      <h4>Results are not available</h4>
                      The results for this tournament are not available at the
                      moment. Results are declared after the tournament has
                      ended.
                    </p>
                  </li>
                </>
              )}
            </ul>
          </div>
          <style jsx>
            {`
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .winner-list {
                padding: 20px;
                .title {
                  font-size: 20px;
                  line-height: 26px;
                  text-align: left;
                }
                .subtitle {
                  color: rgba(25, 10, 40, 0.6);
                  font-size: 12px;
                  line-height: 16px;
                  text-align: left;
                  display: block;
                  margin-bottom: 22px;
                }
                .game-container {
                  display: flex;
                  margin-bottom: 32px;
                  &.scrollable-section{
                    flex-wrap:nowrap;
                    overflow-x:scroll;
                    justify-content: unset;
                    scroll-behavior: smooth;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  
                    padding-bottom:0;
                    
                }
                &.scrollable-section::-webkit-scrollbar{
                  display: none;
              }
                }
                .game-tile {
                  background: rgba(25, 10, 40, 0.05);
                  border-radius: 6px;
                  height: 36px;
                  margin-right: 8px;
                  padding: 6px 12px;
                  display: flex;
                  color: rgba(25, 10, 40, 0.6);
                  font-size: 12px;
                  line-height: 16px;
                  align-items: center;
                  cursor:pointer;
                  img {
                   
                   border-radius: 4px;
                  }
                  &.selected-game {
                    background: #e91051;
                    color: #ffffff;
                  }
                }
                .game-tile-selcted {
                  background: #e91051;
                  color: #ffffff;
                }
                .winner-avatar {
                  display: flex;
                  width: 70%;
                  img {
                    margin-right: 16px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                  }
                }
                .winner-list-container ul li {
                  display: flex;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 56px;
                  padding: 8px 10px;
                  box-sizing: border-box;
                  
                }
                .winner-name {
                  text-transform: capitalize;
                  font-size: 14px;
                  line-height: 18px;
                  text-align: left;
                  .name {
                    font-style: normal;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 18px;
                    margin-bottom: 2px;
                  }
                }
                .college-name {
                  color: rgba(25, 10, 40, 0.6);
                  font-weight: normal;
                  font-size: 12px;
                  line-height: 16px;
                }
              }
              .amount-container {
                display: flex;
                flex-direction: column;
                width:20%;
              }
              .amount {
                color: #190a28;
                font-weight: 500;
                font-size: 14px;
                line-height: 18px;
              }
              .text {
                font-size: 12px;
                line-height: 16px;
                color: rgba(25, 10, 40, 0.6);
                text-transform: capitalize;
              }
              .winner-sequence {
                font-size: 14px;
                line-height: 14px;
                color: rgba(25, 10, 40, 0.6);
                width: 10%;
                text-align: left;
              }
              .not-found-text {
                font-size: 12px;
                line-height: 16px;
                margin-top: 90px;
                text-transform:none;
                h4 {
                  font-size: 16px;
                  line-height: 24px;
                }
              }
              .game-name{
                white-space: nowrap;
              }


              @media screen and (min-width: 1224px) {
                .winner-list{
                  .title{
                    text-align:center;
                  }
                  .subtitle{
                    text-align:center;
                  }
                .game-container {
                  
                  &.scrollable-section{
                    justify-content: center;
                  }
                 
                }
                .winner-list-container ul li {
                  justify-content: center;
                   
                 }
              }
             
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default ListModal;
