import React, { Component } from 'react';
import '../styles/points-table.scss';
import {getHTML ,lazyImage} from "../configs/util";


const Pargraph =({showBlock,points}) =>{
    if(showBlock){
        return (
           <div className="rowWrapper" style={{display:'block'}}>
           
            {points && points.map( (row,key) =>(
                <div key={key} className={key%2===0 ?'point-row-white':'point-row-grey' }>
                        <h2 style={{textAlign:'left',marginRight:'4px'}}>{row.text}</h2>
                        <div className="points">
                            <h2 style={{marginLeft:'4px'}}  className={row.points.toString().indexOf('-') > '-1' ?'negative-points':'' }>{row.points} Points</h2>
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
                                    data-src={data.imageurl.png} 
                                    alt={data.title} 
                                    className="game-img lazy-image"
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="

                                />
                                <h2 className="points-title">{data.title}</h2>
                        </div>
                            {!tabIds.includes(key) ? <div className="plus"  ></div>:<div className="dash" ></div>}
                    </div>
                </div>

                <Pargraph showBlock={tabIds.includes(key) } points={data.points ? data.points:undefined}/>

            </div>
        ))
        
}
class PointsTable extends Component {
    constructor () {
        super();
        this.state = { buttonId:0,tabIds:[]};
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
    componentDidMount() {
      lazyImage();
    }
    render() {
        const { gameNames,pointsSystem } = this.props;
        return (
          <div className="point-table-background">
            <div className="container">
              <div className="section-layout">
                <div className="row paragraph-row">
                  <div className="point-table">
                    <div className="info-button-wrapper">
                    <h2>{this.props.header}</h2>
                      {this.props.contentList &&
                            this.props.contentList.map((para, key) => (
                               <p key={key}>
                                  {getHTML(para)}
                              </p>
                      ))}
                      <div className="point-table-layout">
                            <h2 className="points-sys-heading">{this.props.pointSystemName}</h2>
                      <div className="button-wrapper">
                        {gameNames
                          ? gameNames.map((name, index) => (
                              <div
                                key={index}
                                className={
                                  this.state.buttonId == index
                                    ? "button-red"
                                    : "button-white"
                                }
                                value={name}
                                onClick={() => this.showTable(index)}
                              >
                                <h2>{name}</h2>
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
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
                </div>
              </div>
            </div>
          </div>
        );
    }
}

export default PointsTable;