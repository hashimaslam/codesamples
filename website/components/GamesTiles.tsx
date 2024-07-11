import React, { Component } from "react";
import osType from "../configs/detectOs";
import * as imgRef from "../configs/images";

export default class extends Component {
  extNav = (pageName) => {};
  constructor() {
    super();
  }
  componentDidMount() {
    // const imgRef = require('../configs/images');
    this.setState({
      osType: osType(),
    });
  }
  render() {
    return (
      <div
        id="game-tiles"
        className=""
        style={
          this.props.page === "home"
            ? {
                backgroundImage: "linear-gradient(#f0f0f0, #fff)",
                textAlign: "center",
              }
            : {
                backgroundImage: "linear-gradient( #fff,#f0f0f0)",
                textAlign: "center",
              }
        }
      >
        <div className="head">
          <h2>PLAY 30+ GAMES ON vpl</h2>
          <p>Play Fruit Chop, Runner, Pool, Ludo, Cricket and many more...</p>
        </div>
        <div>
          <img
            src={
              this.state && this.state.osType !== "desktop"
                ? imgRef.GAMES_TILE_MOBILE
                : imgRef.GAMES_TILE_DESKTOP
            }
            alt=""
          />
        </div>
        {/* <p id="more-games">and many more</p> */}
        <style jsx>{`
          #game-tiles {
            /* #more-games {
              margin-top: 20px;
            } */
            /* background-color: #f0f0f0; */
            /* background-image: linear-gradient(#f0f0f0, #fff); */
            padding: 40px 0;
            img {
              width: 85%;
            }
            h2 {
              font-size: 24px;
              /* margin-bottom: 40px; */
            }
            p {
              margin-top: 10px;
              margin-bottom: 20px;
            }
          }

          @media (min-width: 1200px) {
            #game-tiles {
              padding: 100px;
              > div {
                max-width: 1200px;
                margin: auto;
              }

              img {
                width: 64%;
                margin-top: 40px;
              }
              h2 {
                font-size: 40px;
                /* margin-bottom: 90px; */
              }
              p {
                margin-top: 20px;
                margin-bottom: 20px;
                font-size: 24px;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
