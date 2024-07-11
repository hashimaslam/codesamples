import React, { useState, useEffect } from "react";
import { Text } from "./Text";
import { CustomImageLazy } from "./CustomImageLazy";
import { lazyImage } from "../../configs/util";

export const StepsWithImageLeft = (props) => {
  useEffect(() => {
    lazyImage();
  }, []);

  return (
    <div
      className={`${props.cssClasses ? props.cssClasses : ""} `}
    >
      {props.contentList &&
        props.contentList.map((content, i) => {
          return (
            <div
              key={i}
              className={`${
                content.cssClasses ? content.cssClasses : ""
              } `}
            >
              <div className="image-container">
              <CustomImageLazy {...{'imageurl' : content.imagurl,'class':'steps-icon'}}/> 
              </div>
              <div className="text-container">
                <Text {...content.header} />
                <Text {...content.subHeader} />
              </div>
            </div>
          );
        })}
        <style jsx >
          {`
            .steps{
              img{
                width:198px;
                height:96px;
              }
            }
          
          `}
        </style>
    </div>
  );
};
