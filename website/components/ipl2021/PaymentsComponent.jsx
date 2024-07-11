import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const PaymentsComponent = (props) => {
    useEffect(() => {
        lazyImage();
    });

    return (
        <section>
            <div className="container">
                <div className={`${props.cssClassList ? props.cssClassList.join(" ") : ""}`}>
                    <div className={"payments--section "} style={props.wrapperCustomMarginsStyle}>
                        {props.content && props.content.map((con, key) => (
                            <div key={key} className="img-block" style={props.blockCustomMarginsStyle}>
                                <a className={props.boxName} href={con.link}>
                                    {con.imgUrl && (<img
                                        className="lazy-image img__css"
                                        data-src={con.imgUrl.png}
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                                        alt={con.imgUrl.alt}
                                    />)}
                                    {con.text && <p className="m-0 trim-Regular regular--text text--style">{con.text}</p>}
                                    {con.subText && <p className="m-0 trim-Regular small--text sub-text">{con.subText}</p>}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`

            .img-block{
                width:25%;
                margin-top:24px;
            }
            .data-block-90{
                width:90px;
                margin:auto;
                .img__css{
                    width:64px;
                    height:64px;
                    border-radius:8px;
                }
            }
            .block__margin{
                margin-top:24px;
            }
            .block__expi--css{
                width:85px;
            }  
            .payments--section{
                display: flex;
                justify-content: center;
                flex-wrap:wrap;
            }
            .text--style{
                margin-top:12px;
                text-align:center;
                color: #230046;
            }
            .sub-text{
                margin-top:2px;
                text-align:center;
                color: rgba(25, 10, 40, 0.6);
            }
            .img__css{
                display:block;
                margin:auto;
                width: 88px;
            }
            .top--games{

            }
            @media screen and (max-width: 359px) {
                .payments--section{
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                }
            }
            @media screen and (min-width: 1224px) {
                .payments--section{
              .img-block{
                  img{
                width: 120px;
                height: 120px;
              }
            }
                }
                .sub-text{
                    margin-top:8px;
                    text-align:center;
                    color: rgba(25, 10, 40, 0.6);
                }
                .payments,.great--expi,.vpl--is--member,.know--us{
                    width:784px;
                    margin-left:auto;
                    margin-right:auto;
                    .data-block-90{
                        width:120px;
                        margin:auto;
                    }
                    .img__css{
                        width:112px;
                        height:112px;
                        border-radius:8px;
                    }
                    .img-block{
                        margin-top:64px;
                    }
                }
                .top--games{
                    padding-top:16px;
                    .img-block{
                        margin-top:48px;
                    }
                    .img__css{
                        width:120px;
                        height:120px;
                        border-radius:16px;
                        margin:unset;
                        margin-right:16px;
                       
                    }
                }
                .great--expi,.know--us{
                    .img__css{
                        width:88px;
                        height:88px;
                        border-radius:0px;
                    }
                    .text--style{
                        margin-top:24px;
                        text-align:center;
                        color: #230046;
                    }
                }
            }
        `}</style>
        </section>
    );
}