export const ImageCard = (props) => {
  return (
    <>
    {props.actionLink && 
          <a href={props.actionLink.navigateTo} className="action-link" target={props.actionLink.target}> {props.actionLink.text} </a>
        }
      <div className= {`image-card-container ${props.cssClassList ? props.cssClassList.join(" ") : ""}`}>
        
        {props.imageList
          ? props.imageList.map((para, key) => (
            <>
            {para.navigateTo ?
            <a href={para.navigateTo}>
              <div className="image-card-caption">
              <div
                className={`card ${
                  para.cssClassList ? para.cssClassList.join(" ") : ""
                }`}
                style={{ background: para.cssBackground }}
              >
                {para.cardContent &&
                <div className="tournament-info">
                    <div className="tournament-name">
                    {para.cardContent.header}
                    </div>
                    <div className="tournament-date"> {para.cardContent.content}</div>
                   {!para.isDisable &&  <a href={para.navigateTo} className="leaderBoard-link">LeaderBoard > </a>}
                    {para.isLive && <span className="live-text">Live</span>}
                </div>
            }  
              

                <picture>
                  <source srcSet={para.imageurl.webp} type="image/webp" />
                  <source srcSet={para.imageurl.png} type="image/png" />

                  <img
                    src={para.imageurl.png}
                    alt={para.imageurl.alt}
                    className="image"
                  />
                </picture>
              </div>
              {para.cardCaption &&
                 <div className="card-caption">{para.cardCaption}</div>
              }
              </div>
              </a>
              :
              <div className="image-card-caption">
              <div
                className={`card ${
                  para.cssClassList ? para.cssClassList.join(" ") : ""
                }`}
                style={{ background: para.cssBackground }}
              >
                {para.cardContent &&
                <div className="tournament-info">
                    <div className="tournament-name">
                    {para.cardContent.header}
                    </div>
                    <div className="tournament-date"> {para.cardContent.content}</div>
                </div>
            }
                <picture>
                  <source srcSet={para.imageurl.webp} type="image/webp" />
                  <source srcSet={para.imageurl.png} type="image/png" />

                  <img
                    src={para.imageurl.png}
                    alt={para.imageurl.alt}
                    className="image"
                  />
                </picture>
              </div>
              {para.cardCaption &&
                 <div className="card-caption">{para.cardCaption}</div>
              }
              </div>
}
           </>


            ))
          : ""}
      </div>
      <style jsx>
        {`
          .image-card-container {
            display: flex;
            flex-wrap: wrap;
            padding: 24px 16px;
            justify-content: center;
            &.scrollable-section{
                flex-wrap:nowrap;
                overflow-x:scroll;
                justify-content: unset;
                scroll-behavior: smooth;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  
                padding-top:16px;
                padding-bottom:0;
            }
            &.scrollable-section::-webkit-scrollbar{
                display: none;
            }
            .image {
              border-radius: 8px;
              
            }
            .image-card-caption{
              margin-bottom:15px;
             
            }
            .card {
              position: relative;
              margin:0 8px 8px 0;
            }
          }
          .image-card{
              display:flex;
          }
          .card-caption{
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
            text-align:left;
          }
          div[class$="-card"] {
            flex-shrink: 0;
            width: 152px;
            height: 124px;
            border-radius: 8px;
           
            .image {
              position: absolute;
              bottom: 0;
              right: 0;
            }
          }
          .tournament-info {
              padding:16px 12px 0 12px;
              color: #FFFFFF;
              text-align:left;
              .tournament-name{
                font-weight: bold;
                font-size: 16px;
                line-height: 20px;
                margin:0 0 8px 0;
              }
              .tournament-date{
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
              }
          }

          .action-link{
            color: #E91051;
            font-size: 12px;
            line-height: 16px;
            font-weight: normal;
    text-decoration: underline;
          }

          @media screen and (min-width: 700px) {
            .image-card-container {
              &.scrollable-section{
                justify-content: center;
              }
            }
          }

          @media screen and (min-width: 1224px) {
          .image-card-container {
            &.scrollable-section{
              justify-content: center;
            }
            .card-caption {
              font-size:15px;
            }
            .image-card-caption{
             
              margin-left: 10px;
            }
          }
         
          .action-link {
            margin-bottom: 20px;
           display: inline-block;
           font-size: 16px;
          }
         }
         .leaderBoard-link{
          color: rgba(255, 255, 255, 0.6);
          font-size: 10px;
          line-height: 14px;
          text-decoration: underline;
    margin-top: 10px;
    display: inline-block;
    position: absolute;
    bottom: 12px;
         }
         .live-text{
          background: #FFFFFF;
          color: #E91051;
          width: 33px;
height: 18px;
 position: absolute;
    bottom: 10px;
    right: 22px;
    border-radius: 2px;
    text-align: center;
    line-height:18px;
         }
          
        `}
      </style>
    </>
  );
};
