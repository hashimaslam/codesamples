import React, { Component } from 'react';

class TernaryComponentTabularData extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false ,text:"More"};
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
      
    render() {
        return (
            <section style={this.props.backgroundCss}>
                <div className="container">
                    <div className={`${this.props.cssClassList ? this.props.cssClassList.join(" ") : ""}`} >
                        <div className="content__wrapper" onClick={this.toggleParagraph}>
                            <div className="show--bar">
                                    <h4 className="m-0 heading--css trim-Medium">{this.props.header}</h4>
                                    <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                            </div>
                        </div>

                         {(this.state.show) &&(<div className="content">
                            {this.props.description && this.props.description.map((con,key)=>(
                                <div className="row__data" key={key}>
                                    <p className="regular--text trim-Regular m-0 para--css">
                                        {con}
                                    </p>
                                </div>
                            ))}

                            {this.props.tabularData && this.props.tabularData.map((row,key)=>(
                                <div className="table__row" key={key} style={{background: key%2 ? "#F0F0F0":"#FFF"}}>
                                    <p className="regular--text trim-Regular para--css col1">
                                        {row.col1}
                                    </p>
                                    <p className="regular--text trim-Regular para--css col2" style={row.color}>
                                        {row.col2}
                                    </p>
                                </div>
                            ))}

                        </div>)}
                        
                    </div>
                </div>
                <style jsx>{`

                    .para--css{
                        color: rgba(25, 10, 40, 0.6);
                        margin-bottom:16px;
                    }
                    .col1{
                        margin:0;
                        width:50%;
                        padding-right:10px;
                    }
                    .col2{
                        margin:0;
                        width:50%;
                        padding-left:10px;
                        text-align: right;
                    }
                    .heading--css{
                        font-size: 14px;
                        line-height: 20px;
                        color: #230046;
                    }
                    .row__data{
                    }
                    .table__row{
                        display:flex;
                        padding:16px 8px;
                    }
                    .content{
                        margin-top:32px;
                    }
                    .show--bar{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .arrow {
                        display: inline-block;
                        width: 7px;
                        height: 7px;
                        border-top: 2px solid rgba(25, 10, 40, 0.6);;
                        border-left: 2px solid rgba(25, 10, 40, 0.6);;
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-right:8px;
                      }
                      .arrow.up {
                        transform: rotate(45deg);
                        margin-top: 4px;
                      }
                      
                      .arrow.down {
                        transform: rotate(-135deg);
                        margin-top: -2px;
                      }
                      
                `}</style>
            </section>
        );
    }
}

export default TernaryComponentTabularData;