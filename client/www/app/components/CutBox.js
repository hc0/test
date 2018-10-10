import React from 'react';
import { Button } from "antd";
import { connect } from "dva";
class CutBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpDone :  false
        }
        this.cutFangLeft = 0;
        this.cutFangTop = 0;
        this.cutFangWidth = 100;
        this.cutFangHeight = 100;

    }
    // 组件上树
    componentDidMount() {
        var i = 0;
        var self = this;
        this.timer = setInterval(function(){
            i++;
            if(i>3) i = 0;
            $(self.refs.dindiandonghua).html(".".repeat(i))
        },400)
    }
    // 组件将要收到新的数据
    componentWillReceiveProps(nextProps) {

    }
    // 设置预览图
    setPreviews(){

        var self = this;
        // 遍历每一个预览图的框
        $(this.refs.previewZone).find(".pic").each(function(){
            // 框的宽度
            var w = $(this).data("w");
            $(this).find("img").css({
                width:self.props.imgW / self.cutFangWidth * w,
                top: -self.cutFangTop / self.cutFangHeight * w,
                left: -self.cutFangLeft / self.cutFangWidth * w
            })
        })
    }
    doCut(){
        // 准备好数据
        var rate = this.props.realW / this.props.imgW;
        var w = this.cutFangWidth * rate;
        var h = this.cutFangHeight * rate;
        var l = this.cutFangLeft * rate;
        var t = this.cutFangTop * rate;
        var self = this;
        // 发出Ajax请求，请求裁切
        $.post("http://127.0.0.1:3000/docut",{
            w,
            h,
            l,
            t,
            picurl:this.props.picurl
        },function(data){
            if(data.result == 1){
                self.props.closeXuanfu();
            }
        })
    }
    render() {
        // 发出图片的URL请求
        var img = new Image();
        img.src = "http://127.0.0.1:3000/"+this.props.chooseurl+"/" + this.props.picurl;
        // 备份this
        var self = this;
        // 监听图片加载完毕
        img.onload = function(){

            clearInterval(self.timer);
            self.setState({
                isUpDone:true
            })
            // 允许拖拽
            $(self.refs.cut_fang).draggable({
                // 限制容器
                containment:$(self.refs.imgBox_wrap),
                // 当用户拖拽的时候
                drag:function(event,ui){
                    self.cutFangLeft = ui.position.left;
                    self.cutFangTop = ui.position.top;

                    $(self.refs.maoni).css({
                        "left":-self.cutFangLeft,
                        "top":-self.cutFangTop
                    });
                    self.setPreviews();
                }
            })
            // 允许改变尺寸 ，一定在onLoad里面写
            $(self.refs.cut_fang).resizable({
                containment:$(self.refs.imgBox_wrap),
                // 等比拖拽
                aspectRatio:1/1,
                // 用户改变尺寸做的事情
                resize:function(event,ui){
                    self.cutFangHeight = ui.size.height;
                    self.cutFangWidth = ui.size.width;
                    self.setPreviews();
                }
            })
        };
        return (
            <div className="cutbox" style={{
                "width":this.props.boxW + "px",
                "height":this.props.boxH + "px",
                "padding":this.props.padding + "px"
            }}>
                {
                    !this.state.isUpDone
                    ?
                    <span>图片正在上传<em className="loadingTip" ref="dindiandonghua">...</em></span>
                    :
                    <div className="cutbox" style={{
                        "width":this.props.boxW + "px",
                        "height":this.props.boxH + "px",
                        "padding":this.props.padding + "px"
                    }}>
                        <div className="imgBox_wrap" ref="imgBox_wrap" style={{
                            "width":this.props.imgW + "px",
                            "height":this.props.imgH + "px"
                        }}>
                            <img src={`http://127.0.0.1:3000/${this.props.chooseurl}/${this.props.picurl}`} style={{
                                "width":this.props.imgW + "px",
                                "height":this.props.imgH + "px"
                            }} />
                            <div className="mask"></div>
                            <div className="cut_fang" ref="cut_fang">
                                <img src={`http://127.0.0.1:3000/${this.props.chooseurl}/${this.props.picurl}`} style={{
                                    "width":this.props.imgW + "px",
                                    "height":this.props.imgH + "px"
                                }} ref="maoni" />
                            </div>
                        </div>
                        <div className="previewZone" ref="previewZone">
                            <div className="big_p pic" data-w="140">
                                <img src={`http://127.0.0.1:3000/${this.props.chooseurl}/${this.props.picurl}`} />
                            </div>
                            <div className="mid_p pic" data-w="100">
                                <img src={`http://127.0.0.1:3000/${this.props.chooseurl}/${this.props.picurl}`} />
                            </div>
                            <div className="small_p pic" data-w="60">
                                <img src={`http://127.0.0.1:3000/${this.props.chooseurl}/${this.props.picurl}`} />
                            </div>

                            <Button type="primary" onClick={()=>{
                                this.doCut()
                            }}>确定</Button>
                            {" "}
                            <Button onClick={()=>{
                                this.props.closeXuanfu();
                            }}>取消</Button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
export default connect(
    ({bucket:{collectionCreatebucket,choosebuckets,chooseurl,isShow}})=>{
        return {
            allBucket:collectionCreatebucket,
            choosebuckets,
            chooseurl,
            isShow
        }
    }
)(CutBox);