import React, { Component } from "react";
import {lazyImage } from "../configs/util";

// export const Membership = ({ membership }) => (
 export class Membership extends Component {
  componentDidMount() {
    lazyImage();
  }
    render() {
      const {header,membershipList } = this.props;
      return (
  <section className={`membership-section ${this.props.device} ${this.props.classList ? this.props.classList.join(' '): ''}`}>
    <div className="container">
      <div className="section-layout">
        <div className="row">
      
          {/* {membership && membership.heading ? ( */}
            <h2 className="section-header section-header--large">
              {" "}
              {header}{" "}
            </h2>
          {/* ) : (
            ""
          ) */}
          
        </div>
        <div className="row">
          { 
          // membership 
          // && membership.images ?
             membershipList.map((memeber, key) => (
                <div className="membership-tile" key={key}>
                  <img
                    data-src={memeber.imageurl.png}
                    alt={memeber.altText}
                    className="section-tile-image lazy-image"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                  ></img>
                </div>
              ))
            // : ""
            }
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .membership-section {
          background: #ffffff;
          .section-header{
            margin-bottom:16px;
          }
          .membership-tile {
            width: 20%;
            margin: 0px 6px 0px 6px;
            .section-tile-image {
              width:79px;
              height:36px;
              object-fit: cover;
            }
          }
        }

     @media screen and (min-width: 768px) {
           .membership-section { 
            .membership-tile {
              width: 22%;
              margin:0;
              .section-tile-image {
                width: auto;
                height:80px;
              }
            }
           }
        }

        @media screen and (min-width: 1224px) {
          .membership-section { 
           .membership-tile {
             width: 19%;
           
           }

           .section-header{
            margin-bottom:64px;
          }
          }
       }

     
     .membership-section.sponsers {
      background: #190A28;
      .section-layout {
      padding: 32px 24px;
      }
      .row {
        flex-wrap: nowrap;
      }
      h2{
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        color: #FFFFFF;
        margin-bottom:32px;
      }
      .membership-tile{
        width: auto;
        height: 96px;
        img{
          width: auto;
          height: 96px;
         
        }
      }
      @media screen and (min-width: 1224px) {
        .section-layout {
          padding: 88px 24px;
        }
        h2{
          font-size: 36px;
          margin-bottom: 64px;
        }
      }
     }

      `}
    </style>
  </section>
      )
  }
  }