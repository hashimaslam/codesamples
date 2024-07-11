import React, { useEffect } from 'react';
import { lazyImage } from '../../configs/util';

export const TestimonialDynamic = (props) => {
  useEffect(() => {
    lazyImage();
  });
  return (
    <section  className={`user-testimonial-container scrollable-section  ${
      props.cssClassList 
    } ${props.device} ${props.page}` } >

   
     {props.contentList &&
              props.contentList.map((content, i) => {
                return (
                    <div className="user-testimonial-tile" key={i}>
                    <img src={content.imageUrl.png}   width= "144" height="144" className="lazy-image" />
                <div className="header">{content.name}</div>
                <div className="sub-header">{content.address}</div>
                <div className="amount-win">{content.amountInfo}</div>
                <p className="user-comments">{content.comments}</p>
                 </div>
                );
              })}

    <style jsx>
      {`
        .user-testimonial-container {
          display: flex;
          margin-left:12px;
          margin-right:12px;
        }

        .user-testimonial-tile {
          background: #f5e6f9;
          // height: 407px;
          min-width: 244px;
          padding: 24px 16px;
          border-radius: 16px;
          margin-right: 12px;
          img {
            margin-bottom: 16px;
            width: 144px;
            height: auto;
          }
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header {
          font-weight: 600;
          font-size: 16px;
          line-height: 19px;
          text-align: center;
          text-transform: uppercase;
          color: #9c00c3;
        }

        .sub-header {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          color: rgba(25, 10, 40, 0.6);
          margin: 0 0 12px 0;
        }

        .amount-win {
          font-weight: bold;
          font-size: 28px;
          line-height: 34px;
          text-align: center;
          text-transform: uppercase;
          color: #e91051;
        }

        .user-comments {
          font-weight: normal;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
          color: rgba(25, 10, 40, 0.6);
        }

        @media screen and (min-width: 1224px) {
          .user-testimonial-container {
            justify-content: center;
          }

          .user-testimonial-tile {
            width: 320px;
            // height: 584px;
            img {
              width: 180px;
              height: 180px;
            }
          }

          .header {
            font-size: 24px;
            line-height: 28px;
          }

          .sub-header {
            font-size: 20px;
            line-height: 24px;
          }

          .amount-win {
            font-size: 32px;
            line-height: 36px;
          }

          .user-comments {
            font-size: 20px;
            line-height: 24px;
          }

          .user-testimonial-tile {
            margin-right: 24px;
          }
        }
      `}
    </style>
  </section>
  );
}
