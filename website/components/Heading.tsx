export const Heading = (props) => {
  return (
    <div className="header-container">
      {props.H1Header ? 
      <h1 className={props.cssClassList.join(" ")}>{props.title}</h1>
      :
      props.H2Header ? 
      <h2 className={props.cssClassList.join(" ")}>{props.title}</h2>
      : <div className={props.cssClassList.join(" ")}>{props.title}</div>
      }
      <style jsx>
        {`
          .header-container {
            background: #fff;
          }
          .section-header {
            font-weight: bold;
            font-size: 20px;
            line-height: 26px;
            color: #190a28;
            margin: 0 0 4px 0;
          }
          .section-sub-header {
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
            margin: 0 0 16px 0;
          }
          .poker-affiliate {
            background: #f0f0f0;
            padding-top: 32px;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 0;
          }
          
          .esports-league-rules.section-sub-header{
            font-size: 14px;
            color:#000;
          }
          .esports-cpl.section-sub-header {
            margin-bottom:7px;
            padding: 24px 24px 10px 24px;
          }
          
          .poker-tips-to-play.section-header {
           padding:24px 0 0 0;
          }
          .types-of-poker-games.section-header{
            font-size: 14px;
          }

          @media screen and (min-width: 1224px) {
            .poker-affiliate {
              padding-top: 64px;
              font-weight: bold;
              font-size: 28px;
              line-height: 36px;
            }
            .section-header.esports-cpl{
             font-size:28px;
             margin: 0 0 20px 0;
             text-align:center;
            }
            .section-sub-header.esports-cpl{
              font-size:21px;
              margin: 0 0 20px 0;
              text-align:center;
             }
             .poker-tips-to-play.section-header {
              font-size:36px;
             }

             .types-of-poker-games.section-header{
              font-size: 28px;
              line-height: 36px;
            }

            .types-of-poker-games.section-sub-header{
              font-size: 20px;
              line-height: 28px;
              margin-top:56px;
            }
          }
        `}
      </style>
    </div>
  );
};
