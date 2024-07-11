import React, { Component } from "react";
import '../styles/testimonials.scss';
import { lazyImage } from '../configs/util';
import * as imgRef from '../configs/images';

class Testimonials extends Component {
  constructor (props) {
    super(props);
   // const imgRef = require("../configs/images")(undefined);
   
    this.sliderInterval;
    this.slidesToShift=this.props.content.contentList.length-1;
    this.testimonialSection = React.createRef();
    this.state={ 
                  addTransition:false,
                  slideWidth:244,
                  margin:12 ,
                  offsetX:0,
                  transletX:0,
                  currentSlide:0,
                  prevTransletX:0,
                  pausedSlider:false,
                  slideToLeft:true
              };
  }
  slideAutomaticallyToRight =() =>{
    if(this.state.currentSlide===0){
      this.setState({slideToLeft:true},() => this.slideAutomaticallyToLeft());
      return;
    }
      
      const transletX = -(this.state.slideLeftArr[this.state.currentSlide-1]-this.state.leftMargin);
      this.setState({transletX,currentSlide:this.state.currentSlide-1,prevTransletX:this.state.transletX,addTransition:true});
  }
  slideAutomaticallyToLeft = () =>{
    if(this.state.currentSlide===this.slidesToShift){
      const transletX = 0;
      this.setState({transletX,currentSlide:0,prevTransletX:0,addTransition:true});
      //this.setState({slideToLeft:false});
      //this.slideAutomaticallyToRight();
      return;
    }
    // else if(!this.state.slideToLeft){
    //   this.slideAutomaticallyToRight();
    //   return;
    // } 
      const transletX = -(this.state.slideLeftArr[this.state.currentSlide+1]-this.state.leftMargin);
      this.setState({transletX,currentSlide:this.state.currentSlide+1,prevTransletX:this.state.transletX,addTransition:true});
  }
  componentDidMount() {
    let marginLeft;
    const sectionWidth = this.testimonialSection.current.getBoundingClientRect().width;
    
    if(sectionWidth<604 && (this.props.content.contentList.length-1)>0){
        marginLeft = (sectionWidth-244)/2;
        this.slidesToShift=this.props.content.contentList.length-1;
    }
      
    else if(sectionWidth<860 && (this.props.content.contentList.length-2)>0){
      marginLeft = (sectionWidth-(244*2+12))/2;
      this.slidesToShift=this.props.content.contentList.length-2;
    }
    else if(sectionWidth<1120 && (this.props.content.contentList.length-3)>0){
      marginLeft = (sectionWidth-(244*3+24))/2;
      this.slidesToShift=this.props.content.contentList.length-3;
  }
  else if((this.props.content.contentList.length-4)>0){
    const width = sectionWidth < 1280 ? sectionWidth : 1280;
    marginLeft = (width -(244*4+36))/2;
    this.slidesToShift=this.props.content.contentList.length-4;
  }
  else{
    const width = sectionWidth < 1280 ? sectionWidth : 1280;
    marginLeft = (width-244*(this.props.content.contentList.length)+12*(this.props.content.contentList.length-1))/2;
    this.slidesToShift=0;
  }
    const slideLeftArr = [];
    for(let i=0;i<this.props.content.contentList.length;i++){
      slideLeftArr[i] = marginLeft+this.state.slideWidth*i+this.state.margin*i;
    }
    this.setState({mounted:true,slideLeftArr,leftMargin:marginLeft});
    if(this.slidesToShift)
        this.sliderInterval = setInterval(this.slideAutomaticallyToLeft,6000);
  }
  touchStart = e => {
    if(!this.slidesToShift)
        return;
    if(this.sliderInterval){
      clearInterval(this.sliderInterval);
      this.sliderInterval=undefined;
    }
    this.setState({offsetX:e.targetTouches[0].clientX,prevTransletX:this.state.transletX,addTransition:false})
  }
  touchMove = e =>{
    if(!this.slidesToShift)
        return;
    const diff = this.state.offsetX-e.targetTouches[0].clientX;
    const move = this.state.prevTransletX - diff;
    this.setState({transletX:move,diff:-diff});
  }
  touchEnd = e => {
    if(!this.slidesToShift)
        return;
    if(this.state.currentSlide!=this.slidesToShift && this.state.diff < -49 && this.state.diff < 0 ){
        const transletX = -(this.state.slideLeftArr[this.state.currentSlide+1]-this.state.leftMargin);
        this.setState({transletX,currentSlide:this.state.currentSlide+1,addTransition:true});
    }
    else if(this.state.currentSlide!=0 && this.state.diff > 50 && this.state.diff > 0 ){
      const transletX = -(this.state.slideLeftArr[this.state.currentSlide-1]-this.state.leftMargin);
      this.setState({transletX,currentSlide:this.state.currentSlide-1,addTransition:true});
    }
    else{
        this.setState({transletX:this.state.prevTransletX,addTransition:true});
    }
    this.sliderInterval = setInterval(this.slideAutomaticallyToLeft, 6000);
  } 

  componentDidUpdate()
  {
    lazyImage()
  }
  render() {
    if(!this.state.mounted)
      return  <section ref={this.testimonialSection} className="carousel_shimmer"></section>;
    return (
      <section className="carousel__container">
            <h2 className="section-header section-header--large" >{this.props.content.heading}</h2>
          <div className="carousel__wrapper"
              onTouchStart={this.touchStart}
              onTouchMove={this.touchMove}
              onTouchEnd ={this.touchEnd}
          >
            {this.props.content.contentList.map((testimonial,key)=>(
               <div key={key} className="carousel__frame" style={{left:this.state.slideLeftArr[key]+'px',transform:`translateX( ${this.state.transletX}px)`,transition: this.state.addTransition ? 'transform 250ms ease-in': 'none'}}>
               {/* <img  src={testimonial.mobileImageurl.png} alt="testimonial image"></img> */}
               <img
                          data-src={testimonial.mobileImageurl.png}
                          className="lazy-image"
                          alt={testimonial.mobileImageurl.alt}
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                        />               
               <div className="carousel__frame-content">
                   <div  className="carousel__frame--winner">
                        <h3>{testimonial.userName}</h3>
                        <h4>{testimonial.location}</h4>
                   </div>
                   <div className="carousel__frame--chat">
                       <div className="carousel__frame--upper-quote">
                         <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M43.864 6.368L42.616 0.319996C31.192 0.511999 24.856 5.6 24.856 18.272V31.232H40.408V15.872H34.456C33.976 10.4 37.24 7.04 43.864 6.368ZM19.48 6.368L18.232 0.319996C6.808 0.511999 0.472 5.6 0.472 18.272V31.232H16.024V15.872H10.072C9.592 10.4 12.856 7.04 19.48 6.368Z" fill="#E6E6E6"/>
                         </svg>
                       </div>
                       <div className="carousel__frame--bottem-quote">
                         <svg fill="none" height="32" viewBox="0 0 45 32" width="45" xmlns="http://www.w3.org/2000/svg">
                             <path d="m25.36 25.664 1.248 6.048c11.424-.192 17.76-5.28 17.76-17.952v-12.960005h-15.552v15.360005h5.952c.48 5.472-2.784 8.832-9.408 9.504zm-24.384 0 1.248 6.048c11.424-.192 17.76-5.28 17.76-17.952v-12.960005h-15.552v15.360005h5.952c.48 5.472-2.784 8.832-9.408 9.504z" fill="#e6e6e6"/>
                         </svg>
                       </div>
                      <h3>{testimonial.prizeWon}</h3>
                      <p>{testimonial.summary}</p>                    
                   </div>
               </div>
             </div>
            ))}
          </div>
          {/* <div className="carousel__tabs">
            {this.slidesToShift > 0 ? <p style={{background: this.state.currentSlide===0 ? '#FF1E46':'#E6E6E6'}}></p>:'' }
            {this.slidesToShift > 0 ? <p style={{background: this.state.currentSlide===1 ? '#FF1E46':'#E6E6E6'}}></p>:'' }
            {this.slidesToShift > 1 ? <p style={{background: this.state.currentSlide===2 ? '#FF1E46':'#E6E6E6'}}></p>:'' }
            {this.slidesToShift > 2 ? <p style={{background: this.state.currentSlide===3 ? '#FF1E46':'#E6E6E6'}}></p>:'' }
          </div> */}
      </section>
    );
  }
}

export default Testimonials;
