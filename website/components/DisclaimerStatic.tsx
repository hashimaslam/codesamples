import * as txt from "../configs/footer_data";
const DisclaimerFooter = (props) => (
  <div className="footer-disclaimer">
    <div className="container">
      <div className="footer-disclaimer-layout section-layout">
        <div className="row">
          <div className="footer-disclaimer__detail">
            <h3 className="disclaimer-header">
              {txt.DISCLAIMER_BLOCK.HEADING}
            </h3>
            {txt.DISCLAIMER_BLOCK.TXT.map((txt, index) => (
              <p className="disclaimer-paragraph" key={index}>{txt}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      .footer-disclaimer {
        background-color: #4a4a4a;
      }
      .footer-disclaimer-layout{
         &.section-layout{
          padding-bottom: 140px;
         }
        .footer-disclaimer__detail {
          text-align: left;
        }
        .disclaimer-header {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          text-align:center;
        }
        .disclaimer-paragraph{
          font-size: 12px;
          color:rgba(255, 255, 255, 0.3);
          font-weight:normal;
   }
      }

      @media screen and (min-width: 768px) {
        .footer-disclaimer-layout {
          &.section-layout{
            padding-bottom: 24px;
           }
          .disclaimer-header {
            font-size: 16px;
          }
          .disclaimer-paragraph{
            font-size:14px;
          }
        }
      }
    `}</style>
  </div>
);
export default DisclaimerFooter;
