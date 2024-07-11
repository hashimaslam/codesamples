export const BackButton = (props) => {
   
    const goBack = () => {
        // window.location.href = props.backButtonUrl;
        window.history.back()
      };
return (
  <div
    className={`back-button-section  ${
      props.cssClassList ? props.cssClassList.join(" ") : ""
    } ${props.device} ${props.page}`}
  >
    <div className="back-button-container">
      <div onClick={goBack} >
        {" "}
        <img src={props.backButtonImageurl.png} />{" "}
      </div>
      <div className="info-icon">
        {" "}
        <img src={props.infoIconImageurl.png} />{" "}
      </div>
      <div className="heading">
        {" "}
        <h1>{props.infoTitle}</h1>{" "}
      </div>
    </div>

    <style jsx>
      {`
        .top-back-button {
          margin-top: 56px;
          padding: 16px;
          h1 {
            font-size: 16px;
            line-height: 24px;
            font-style: normal;
            font-weight: 500;
          }
          .back-button-container {
            display: flex;
            align-items: center;
            div {
              margin-left: 16px;
            }
            .info-icon{
                width:44px;
            }
          }
      }
      @media screen and (min-width: 1224px) {
        .top-back-button{
        h1{
         font-size: 23px;
         margin-top:22px;
       }
       .heading{
         width:100%;
         text-align:center;

       }
      }
      }
      `}
    </style>
  </div>
)};
