import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";
import {isEmpty} from "../../config/validation"

export const Sponsor=(props)=>{

    useEffect(() => {
        lazyImage();
      });

    return (
    <section className="background__style">
        <div className="container">
            { isEmpty(props.header) &&<h2 className="header--large text-align-center trim-SemiBold capitialise margin-top" style={{color:"#FFFFFF"}}>
                {props.header}
            </h2>}
            { props.imgList && <div className="img-list--block">
                {props.imgList.map((img,key)=> img.imgUrl && <img key={key} data-src={img.imgUrl.png} alt={img.alt} className="img__css lazy-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" />)} 
            </div>} 

        </div>
        <style jsx>{`
            .background__style{
                background: #230046;
                margin-bottom:72px;
            }
            .container{
                padding:24px 0;
            }
            .img-list--block{
                display: flex;
                justify-content: center;
            }   
            .img__css{
                width:158px;
                height:160px;
            }
        `}</style>
    </section>
    );
}