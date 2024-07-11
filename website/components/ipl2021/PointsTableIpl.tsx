import React, { Component } from 'react';
// import '../styles/points-table.scss';
import {getHTML ,lazyImage} from "../../configs/util";


const Pargraph =({showBlock,points}) =>{
    if(showBlock){
        return (
           <div className="rowWrapper" style={{display:'block'}}>
           
            {points && points.map( (row,key) =>(
                <div key={key} className="point-row">
                        <p className="regular--text trim-Regular m-0 content__color point__type " style={{textAlign:'left',marginRight:'4px'}}>{row.text}</p>
                        <div className="points">
                            <p style={{marginLeft:'4px'}}  className={row.points.toString().indexOf('-') > '-1' ?'negative-points regular--text trim-Regular m-0':'regular--text trim-Regular m-0 content__color' }>{row.points} Points</p>
                        </div> 
                </div>
            ))}
           
            </div>
       )
    }
    return "";
};
const PointsSystem = ({ matchTypeData,tabIds ,showTab,hideTab}) =>{
    if(!matchTypeData)
        return "";
        return matchTypeData.map((data ,key)=>(
            <div className="points-rectangle" key={key}>
                <div>
                    <div className="showBarItem" onClick={!tabIds.includes(key) ? () => showTab(key) : () => hideTab(key)}>
                        <div className="wrapperImgHeader">
                                <img 
                                    src={data.imageurl.png} 
                                    alt={data.title} 
                                    className="game-img lazy-image"
                                    // src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="

                                />
                                <h4 className="trim-Regular subheader--medium m-0 title--margin">{data.title}</h4>
                        </div>
                            {!tabIds.includes(key) ? <div className="arrow-row down"  ></div>:<div className="arrow-row up" ></div>}
                    </div>
                </div>

                <Pargraph showBlock={tabIds.includes(key) } points={data.points ? data.points:undefined}/>

            </div>
        ))
        
}
class PointsTableIpl extends Component {
    constructor () {
        super();
        this.state = { buttonId:0,tabIds:[],show: false ,text:"More"};
    }
    showTable = id =>{
        this.setState({buttonId:id,tabIds:[]});
    }
    showTab = id =>{
        this.setState(prevState => ({
            tabIds: [...prevState.tabIds,id]
          }));
    }
    hideTab = id =>{
        const arr = [...this.state.tabIds];
        const index =arr.indexOf(parseInt(id)); 
        arr.splice(index,1);
        this.setState({
            tabIds: [...arr]
          });
    }
    toggleParagraph = () => {
        let text="More";
      if(!this.state.show)
          text="Less"
      this.setState({
          show:!this.state.show,
          text
      });
    };
    componentDidMount() {
      lazyImage();
    }
    render() {
        const { gameNames,pointsSystem } = this.props;
        return (
            <section className={this.props.backgroundCss}>
                <div className="container">
                    <div className={this.props.cssClassList} >
                        {(this.props.showMore && !this.state.show) &&(
                            <div>
                                    <p className=" regular--text trim-Regular content__color m-0  text-align-center">{this.props.firstLineToshow}</p>
                            </div>
                        )}
                    {(!this.props.showMore || this.state.show) &&(
                        <>
                            <div className="">
                                <p className="trim-Regular m-0 subheader--medium  text-align-center padding--bottom ">{this.props.firstLineToshow}</p>
                                    {this.props.contentList &&
                                    this.props.contentList.map((para, key) => (
                                    <p className="regular--text trim-Regular m-0 content__color text-align-center padding-para--bottom" key={key}>
                                    {getHTML(para)}
                                    </p>
                                ))}
                                <p className="regular--text trim-semiBold m-0  text-align-center" style={{color:"#190A28",marginBottom:"16px"}}>POINT SYSTEM</p>
                            </div>
                        <div className="points__area">
                            <div className="button-wrapper">
                                {gameNames
                                ? gameNames.map((name, index) => (
                                    <div
                                        key={index}
                                        className={
                                        this.state.buttonId == index
                                            ? "button red"
                                            : "button grey content__color"
                                        }
                                        onClick={() => this.showTable(index)}
                                    >
                                        <h4 className="regular--text trim-Regular m-0 text-align-center">{name}</h4>
                                    </div>
                                    ))
                                : ""}
                            </div>
                            <div className="point-table-layout">
                                <PointsSystem
                                matchTypeData={
                                    pointsSystem
                                    ? pointsSystem[this.state.buttonId]
                                    : ""
                                }
                                tabIds={this.state.tabIds}
                                showTab={this.showTab}
                                hideTab={this.hideTab}
                                />
                            </div>
                        </div>
                        </>
                    )}

                    {this.props.showMore  &&(
                        <div className="show-more--area" onClick={this.toggleParagraph}>
                                <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                                <p className="trim-Medium regular--text m-0 show-more">{this.state.text}</p>
                        </div>
                    )}
                    </div>
                </div>
                
                <style jsx global>{`
                
                    .padding--bottom{
                        padding-bottom:32px;
                    }
                    .padding-para--bottom{
                        padding-bottom:16px;
                    }
                    .button{
                        min-width: 72px;
                        max-width: calc(calc(100%-24) / 4);
                        cursor: pointer;
                        border-radius: 4px;
                        padding: 8px 16px;
                    }
                    .red{
                        background: #E91051;
                        color:#fff;
                    }
                    .grey{
                        background: rgba(25, 10, 40, 0.05);
                    }
                    .content__color{
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .button-wrapper{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom:8px;
                    }
                    .game-img{
                        width:32px;
                        height:32px;
                    }
                    .title--margin{
                        margin-left:12px;
                    }
                   .wrapperImgHeader {
                        display: flex;
                        align-items: center;
                    }
                    .arrow {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-top: 1px solid #E91051;
                        border-left: 1px solid #E91051;
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-right:8px;
                      }

                      .arrow-row {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-top: 2px solid rgba(25, 10, 40, 0.6);;
                        border-left: 2px solid rgba(25, 10, 40, 0.6);;
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-right:8px;
                      }

                      .arrow.up ,.arrow-row.up {
                        transform: rotate(45deg);
                        margin-top: 4px;
                      }
                      
                      .arrow.down,.arrow-row.down {
                        transform: rotate(-135deg);
                        margin-top: -2px;
                      }
                      
                      .show-more--area{
                          display:flex;
                          justify-content:center;
                          align-items: center;
                          padding-top:8px;
                          cursor:pointer;
                      }
                      .show-more{
                          color:#E91051;
                      }
                      .showBarItem{
                        justify-content: space-between;
                        display: flex;
                        align-items: center;
                      }
                      .points-rectangle {
                        padding: 12px;
                        background:#F4F3F4;
                        border-radius: 8px;
                        margin: 8px 0;
                    }
                    .negative-points{
                        color:#E91051;
                    }
                    .point-row{
                        display: flex;
                        flex-direction: row;
                        padding: 16px 8px;
                        justify-content: space-between;
                    }
                    .rowWrapper {
                        margin-top: 16px;
                    }
                    .point__type{
                        width:75%;
                    }
                    @media screen and (min-width: 1224px) {
                        .points__area{
                            width:600px;
                            margin:auto;
                        }
                        .title--margin{
                            color:#4A4A4A;
                            margin-left:16px;
                        }
                        .game-img{
                            width:36px;
                            height:36px;
                        }
                        .button{
                            min-width: 80px;
                            border-radius: 8px;
                            padding: 8px 16px;
                            margin: 0 8px;
                        }
                        .button-wrapper{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-bottom:24px;
                        }
                        .points-rectangle {
                            padding: 24px;
                            background:#fff;
                            border: 1px solid #e6e6e6;
                        }
                        .arrow {
                            width: 8px;
                            height: 8px;
                            border-top: 2px solid #E91051;
                            border-left: 2px solid #E91051;
                          }
    
                          .arrow-row {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            border-top: 4px solid rgba(25, 10, 40, 0.6);;
                            border-left: 4px solid rgba(25, 10, 40, 0.6);;
                          }
                          .show-more--area{
                            padding-top:36px;
                        }
                    }
                `}</style>
            </section>
        );
    }
}

export default PointsTableIpl;