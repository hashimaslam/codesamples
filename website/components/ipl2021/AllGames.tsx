
// import Image from 'next/image';
import React, { useState ,useEffect} from "react";
import {Text} from "./Text";
import {CustomImageLazy} from "./CustomImageLazy";
import {CustomImage} from "./CustomImage";
import ShowMoreText from "./ShowMoreText";

 import {lazyImage} from '../../configs/util';


export const AllGames = (props) => {
  useEffect(() => {
     lazyImage();
    }, [])
  
  return (
      <div className="all-games-container scrollable-section mb-80">
      <div className="all-games column-1">
  
   {props.contentList_1 && 
        props.contentList_1.map((content, i) => {
          return (
             
              <div key={i} className={`${content.cssClasses ? content.cssClasses:'' } `}>
                   <div>
                   <CustomImageLazy {...{'imageurl' : content.gameImagurl,'class':'round-corner mlr-16 game-icon'}}/> 
                   </div>
                   <div className="games-info">
                   <CustomImageLazy {...{'imageurl' : content.gameLogoImagurl,'class':'round-corner game-logo'}}/> 
                   <ShowMoreText {...content.viewMoreText}/>
                   </div>
             </div>
             
            
             );
        })
    
    }
    </div>
    <div className="all-games column-2">
      {props.contentList_2 && 
        props.contentList_2.map((content, i) => {
          return (
             
              <div key={i} className={`${content.cssClasses ? content.cssClasses:'' } `}>
                  <div>
                   <CustomImageLazy {...{'imageurl' : content.gameImagurl,'class':'round-corner mlr-16 game-icon'}}/> 
                   </div>
                   <div className="games-info">
                   <CustomImageLazy {...{'imageurl' : content.gameLogoImagurl,'class':'round-corner game-logo'}}/> 
                   <ShowMoreText {...content.viewMoreText}/>
                   </div>
             </div>
             
            
             );
        })
    
    }
    </div>
    <div className="all-games column-2">
     {props.contentList_3 && 
        props.contentList_2.map((content, i) => {
          return (
             
              <div key={i} className={`${content.cssClasses ? content.cssClasses:'' } `}>
                  <div>
                   <CustomImageLazy {...{'imageurl' : content.gameImagurl,'class':'round-corner mlr-16 game-icon'}}/> 
                   </div>
                   <div className="games-info">
                   <CustomImageLazy {...{'imageurl' : content.gameLogoImagurl,'class':'round-corner game-logo'}}/> 
                  <ShowMoreText {...content.viewMoreText}/>
                   </div>
             </div>
             
            
             );
        })
    
    }
    </div>
     <style jsx>
        {`
        .all-games-container{
           
            display:flex;
            flex-direction:row; 
            .all-games{
               width:350px;
            }
            .games-info{
              text-align:left;
              
            }
            .games{
              width:330px;
              justify-content: flex-start;
              align-items: flex-start;
            }
        }
        `}
        </style>
    </div>
   
  );
};