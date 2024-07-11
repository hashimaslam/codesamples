import React, { useEffect } from "react";
import { lazyImage } from "../../configs/util";

export const TestimonialIPL = (props) => {
  useEffect(() => {
    lazyImage();
  });
  return (
    <section
      className={`user-testimonial-container scrollable-section  ${props.cssClassList} ${props.device} ${props.page}`}
    >
      <div className="user-testimonial-tile">
        <img
          data-src="/static/banners/user_epicenter-satish.png"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          width="144"
          height="144"
          className="lazy-image"
        />
        <div className="header">Satish Kumar</div>
        <div className="sub-header">Faridabad, Haryana</div>
        <div className="amount-win">Won ₹11 Lakh!</div>
        <p className="user-comments">
          vpl is like a lucky bank balance for me. It gave a once in a lifetime
          opportunity to meet Virat Kohli. The platform lets me earn money using
          my expertise and rich knowledge in Cricket and other sports.
        </p>
      </div>
      <div className="user-testimonial-tile">
        <img
          data-src="/static/banners/user_epicenter.png"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          width="144"
          height="144"
          className="lazy-image"
        />
        <div className="header">Kuldeep Tomar</div>
        <div className="sub-header">Baghpat, UP</div>
        <div className="amount-win">Won ₹63 Lakh</div>
        <p className="user-comments">
          My friend told me about vpl. It has lots of games. I started playing
          Fruit Chop and rummy. Within a year I won Four lakh while having fun
          playing games. vpl helped me, solve my financial problems. I paid for
          my kid's school fees. Recently I also bought an iPhone to play on vpl.
        </p>
      </div>
      <div className="user-testimonial-tile">
        <img
          data-src="/static/banners/user_epicenter-akash.png"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
          width="144"
          height="144"
          className="lazy-image"
        />
        <div className="header">Akash Saitab</div>
        <div className="sub-header">Darbangha, Bihar</div>
        <div className="amount-win">Won ₹35 Lakh</div>
        <p className="user-comments">
          vpl has a great collection of fun games that gives you a chance to
          earn money as well. I've won around ₹8 Lakh playing Fruit Dart, Runner
          and various other games.
        </p>
      </div>

      <style jsx>
        {`
          .user-testimonial-container {
            display: flex;
            margin-left: 12px;
            margin-right: 12px;
          }

          .user-testimonial-tile {
            background: #f5e6f9;
            height: 407px;
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
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;
            text-align: center;
            text-transform: uppercase;
            color: #9c00c3;
          }

          .sub-header {
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
            margin: 0 0 12px 0;
          }

          .amount-win {
            font-style: normal;
            font-weight: bold;
            font-size: 28px;
            line-height: 34px;
            text-align: center;
            text-transform: uppercase;
            color: #e91051;
          }

          .user-comments {
            font-style: normal;
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
              height: 584px;
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
};
