import {isEmpty} from "../../config/validation"
import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const AndroidInstallSteps =(props)=>{
    useEffect(() => {
        lazyImage();
      });
    
    if(props.device!=="android")
        return<div></div>;
    return (<section id="android-steps-block"className="background__color">
         <div className="container">
            {isEmpty(props.header) &&<h2 className="header--large text-align-center trim-SemiBold capitialise">
                {props.header}
            </h2>}
            {isEmpty(props.info) && <p className="info__text trim-Regular m-0 mt-4">{props.info}</p>}
            {props.imgList && props.imgList.map((img,key)=> img.imgUrl && <img key={key}  alt={img.alt}  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" data-src={img.imgUrl.png}  className="img__css lazy-image"/>)}


             
         </div>
         <style jsx>{`

            .background__color{
                background: #F4F3F4;
                margin-bottom:72px;
            }
            .container{
                padding:42px 0;
            }
            .img__css{
                width:370px;
                height:248px;
                margin: auto;
                display: block;
                margin-top:40px;
            }
            .info__text{
                font-size: 14px;
                line-height: 20px;
                text-align: center;
                color: #230046;
            }
            #android-steps-block{
                padding-top:20px;
            }
            @media screen and (max-width: 411px) {
                .img__css{
                    width:100%;
                }
            }
         `}</style>
    </section>)
}