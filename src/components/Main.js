require('normalize.css/normalize.css');
require('styles/App.css');
var React = require('react');
var ReactDOM = require('react-dom');
// import React from 'react';
//获取图片相关信息
var imageDatas = require('json!../data/imageDatas.json');
//立即执行函数获取图片的路径
imageDatas = (function getImageUrl(imageDatasArr){
	for (var i = 0, j = imageDatasArr.length;i<j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageUrl =require('../images/'+singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);
//构建每一张图片
var ImgFigure = React.createClass({
  handleClick: function(e){
    if(this.props.arrange.iscenter){
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  },
	render: function(){
    //如果props中定义了图片的位置，则使用
    console.log('render1');
    var styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
   //如果props中定义了旋转角度并且不为0，则使用
    if(this.props.arrange.rotate){
      styleObj['transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
     // ['-moz-','-webkit-','-ms-',''].forEach(function(value){
     //  styleObj[value + 'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
     // }.bind(this))
    }
    if(this.props.arrange.iscenter){
      styleObj.zIndex = 11;
    } 
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.inverse ? ' is-inverse' : '';
    return (
				<figure className={imgFigureClassName} style={styleObj}  onClick={this.handleClick}>
					<img src={this.props.data.imageUrl} title={this.props.data.title}/>
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
					  <div className="img-back" onClick={this.handleClick}>
              <p>this.props.data.desc</p>
            </div>
          </figcaption>
				</figure>
			);
	}
})
/**
 * [getRangeRandom 获取区间内的一个随机值]
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 * @return {[type]}      [description]
 */
function getRangeRandom (low,high){
	return Math.ceil(Math.random() * (high - low) + low);
}
/**
 * [get30degRandom 获取-30deg到30deg之间的任意值]
 * @return {[type]} [description]
 */
function get30degRandom(){
  return (Math.random() > 0.5 ? '' : '-')+Math.ceil(Math.random()*30);
}
//构建图片舞台
var PicComponent = React.createClass ({
  Constant: {
  	centerPos: {
  		left: 0,
  		top: 0
  	},
  	hPosRange: {//水平方向的取值范围
  		leftSecX: [0,0],
  		rightSecX: [0,0],
  		y:[0,0]
  	},
  	vPosRange: {//垂直方向的取值范围
  		x: [0,0],
  		topY: [0,0]
  	}
  },
  /**
   * [rearrange 重新布局所有图片]
   * @param  {[type]} cenerIndex [指定居中排布哪张图片]
   * @return {[type]}            [description]
   */
  rearrange: function(centerIndex){
  	var imgsArrangeArr = this.state.imgsArrangeArr,
  	Constant = this.Constant,
  	centerPos = Constant.centerPos,
  	hPosRange = Constant.hPosRange,
  	vPosRange = Constant.vPosRange,
  	hPosRangeLeftSecX = hPosRange.leftSecX,
  	hPosRangeRightSecX = hPosRange.rightSecX,
  	hPosRangeY = hPosRange.y,
  	vPosRangeX = vPosRange.x,
  	vPosRangeTopY = vPosRange.topY,

  	imgsArrangeTopArr = [],
  	topImgNum = Math.ceil(Math.random() * 2), //顶部图片取一个或者不取
  	topImgSpliceIndex = 0,
  	//布局位于中间的图片,中间图片不旋转
  	imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
  	imgsArrangeCenterArr[0] = {
      pos : centerPos,
      rotate: 0,
      iscenter: true
    }
  	//布局位于上侧的图片
  	topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
  	imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
  	imgsArrangeTopArr.forEach(function(item,index){
  		imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate: get30degRandom(),
        iscenter: false
      }
  	})

  	//布局左右两侧的图片
  	for (var i = 0, j = imgsArrangeArr.length,k = j / 2; i < j ; i++) {
  		var hPosRangeLORX = null;
      if(i < k) {//左侧图片
        hPosRangeLORX = hPosRangeLeftSecX;
      } else { //右侧图片
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate: get30degRandom(),
        iscenter: false
      }
  	}
  	
    //将变换后的合并在一起
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  },
  inverse: function(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].inverse = !imgsArrangeArr[index].inverse
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  },
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },
  getInitialState: function(){
    console.log('init');
  	return {
  		imgsArrangeArr: [
  			// {
  			// 	pos: {
  			// 		left: 0,
  			// 		top: 0
  			// 	},
        //  rotate: 0,
        //  inverse: false,
        //  iscenter: false
  			// }
  		]
  	}
  },
  //组件加载以后，为每张图片计算其位置范围
  componentDidMount: function(){
    console.log('didMount');
  	//首先拿到舞台的大小
  	var stageDom = ReactDOM.findDOMNode(this.refs.stage),
  		stageW = stageDom.scrollWidth,
  		stageH = stageDom.scrollHeight,
  		halfStageW = Math.ceil(stageW / 2),
  		halfStageH = Math.ceil(stageH / 2),
  	//拿到一个imageFigure的大小
  		imgDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
  		
      imgW = imgDom.offsetWidth,
  		imgH = imgDom.offsetHeight,
  		halfImgW = Math.ceil(imgW / 2),
  		halfImgH = Math.ceil(imgH / 2);
  	//计算中心图片的位置点
  		this.Constant.centerPos = {
  			left: halfStageW - halfImgW,
  			top: halfStageH - halfImgH

  		};
  	//计算左侧右侧区域图片排布位置的取值范围
  		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  		this.Constant.hPosRange.leftSecX[1] = halfStageW -halfImgW * 3;
  		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  		this.Constant.hPosRange.y[0] = - halfImgH;
  		this.Constant.hPosRange.y[1] = stageH - halfImgH;
  	//计算上侧区域图片排布位置的取值范围
  		this.Constant.vPosRange.topY[0] = -halfImgH;
  		this.Constant.vPosRange.topY[1] = halfStageH -halfImgH * 3;
  		this.Constant.vPosRange.x[0] = halfStageW - imgW;
  		this.Constant.vPosRange.x[1] = halfStageW;

  	  this.rearrange(0);

  },
  render: function() {
    console.log('render');
  	var controllerUnits = [],
        imgFigures = [];
  	imageDatas.forEach(function(value,index){
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index] = {
  				pos: {
  					left: 0,
  					top: 0
  				},
          state: 0,
          inverse: false,
          iscenter: false
  			}
      }
      //必须加key
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));
  	return (
  		<section className="stage" ref="stage">
  			<section className="img-sec">
  				{imgFigures}
  			</section>
  			<nav className="controller-nav">
  				{controllerUnits}
  			</nav>
  		</section>
  	)
  }
});

module.exports = PicComponent;