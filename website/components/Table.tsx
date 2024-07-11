import { getHTML } from "../configs/util";
export const Table = (props) => {
  return (
    <section
      className={`table-info-section ${props.page} ${props.device} ${
        props.cssClassList ? props.cssClassList.join(" ") : ""
      } `}
    >
      <div className="container">
        <div className="section-layout page-info-layout">
          <div className="row">
            <table className="table">
              {props.contentList &&
                props.contentList.map((para, key) => {
                  return (
                    <tr key={key} className={key%2===0 ?'point-row-white':'point-row-grey'}>
                      <td className="side__1">{para[0]}</td>
                      <td className="side__2">{para[1]}</td>
                    </tr>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
      <style jsx global>
        {`
          .page-info-section a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight: 500;
          }
        `}
      </style>
      <style jsx>
        {`
         .table tr {
            
         }
          .table tr td {
            color: #828282;
            font-size: 14px;
            line-height: 22px;
            border-collapse: collapse;
            padding: 10px 5px;
          }

          .point-row-white {
            display: flex;
            flex-direction: row;
            padding: 16px 8px;
            justify-content: space-between;
          
        }
          .point-row-grey {
            display: flex;
            flex-direction: row;
            padding: 16px 8px;
            background: #f0f0f0;
            justify-content: space-between;
        }
        table{
          width:100%;
        }
        .side__1{
          display: flex;
          align-items: center;
          width: 50%;
          justify-content: flex-start;
        }
        .side__2{
          width: 50%;
          justify-content: flex-end;
          align-items: center;
          display: flex;
        }
          @media screen and (min-width: 1224px) {
            .table {
                border: 1px solid #E6E6E6;
                border-radius:13px;
             }
             .table tr td {
              
              font-size: 18px;
              line-height: 22px;
              
              padding: 0px 5px;
            }
  
            .point-row-white {
                background:#fff;
            }
              .point-row-grey {
                background:#fff;
            }
          }
          .rules-of-rummy {
              .section-layout{
                  padding-top:0;
              }
          }
        `}
      </style>
    </section>
  );
};
