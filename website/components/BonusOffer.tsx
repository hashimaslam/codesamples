const BonusOffer = (props) => {
  return (
    <div className="bonus-ticket-container">
      <div className="bonus-ticket">
        <picture>
          <source srcSet={"/static/2x/bonus-offer.png"} type="image/webp" />
          <source srcSet={"/static/2x/bonus-offer.png"} type="image/png" />

          <img
            className="bonus-ticket-img"
            src={"/static/2x/bonus-offer.png"}
            alt={"/static/2x/bonus-offer.png"}
          />
        </picture>
        <div className="">
          <h1>₹{props.data.rewardAmount} Bonus Cash</h1>
        </div>
      </div>

      <style jsx>
        {`
          .bonus-ticket-container {
            width: 312px;
            height: 98px;
            position: relative;
            display: flex;
            align-items: center;
            padding: 17px 30px 17px 30px;
            box-sizing: border-box;
            margin: 0 0 20px 0;
            background: #FAFAFA;
            border-radius: 4px;
            
          }
          .bonus-ticket-background {
            width: auto;
            height: auto;
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .bonus-ticket {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
           justify-content: space-around;
            h1 {
              color: #222222;
              font-style: normal;
              font-weight: bold;
              font-size: 16px;
              line-height: 20px;
              margin: 0 0 4px 0;
            }
            p {
              color: rgba(255, 255, 255, 0.8);
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              margin: 0;
            }
          }
          .bonus-ticket-img {
            width: 87px;
            height: 59.61px;
          }

          @media screen and (min-width: 1224px) {
            .bonus-ticket-container {
              width: 488px;
              height: 175px;
              padding: 20px 27px 20px 42px;
              margin: 0;
            }
            .bonus-ticket-background {
              width: auto;
              height: auto;
            }
            .bonus-ticket {
            
              h1 {
                font-size: 31px;
                line-height: 40px;
              }
              p {
                font-size: 24px;
                line-height: 30px;
              }
            }

            .bonus-ticket-img {
              width: auto;
              height: auto;
              top: 7px;
              position:relative;
              z-index: 2;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BonusOffer;
