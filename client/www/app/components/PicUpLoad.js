import React from 'react';
import { connect } from "dva";
import { Row ,Col ,Button ,Divider} from "antd";
import CutBox from "./CutBox.js";
import "./PicUpLoad.less";
class PicUpLoad extends React.Component {

    constructor(props) {
        super(props);
        // 数量
        this.viewamount = 0;
        this.state = {
            isShowXuanfu:false,
            //图片的真实的尺寸
            realW:0,
            realH:0,
            //图片的显示的尺寸
            imgW:0,
            imgH:0,
            boxW:0,
            boxH:0,
            padding:0,
            picurl:""
            // choosebuckets:{},
            // chooseurl:""
        }
    }
    // 定义一个函数，设置显示弹出层
    openXuanfu(){
        this.setState({isShowXuanfu:true})
    }
    closeXuanfu(){
        this.setState({isShowXuanfu:false});
    }
    // 图片上传完毕之后的回调
    onUpDone(picurl,realW,realH){

        realW = parseInt(realW);
        realH = parseInt(realH);
        // 得到图片的宽高比
        var rate = realW / realH;
        // 定义一些常量
        const maxBoxWidth = 700;
        const minBoxWidth = 450;
        const maxBoxHeight = 500;
        const minBoxHeight = 350;
        const padding = 10;
        const rightPart = 180;
        // 计算图片要显示的宽度、高度
        var imgW = realW;
        var imgH = realH;
        // 盒子要显示的高度、宽度
        var boxW=null ,boxH=null;
        // 判断不符合标准的图片要被弹出层的最大值或最小值限制住。
        if( realW > maxBoxWidth - rightPart - 2*padding){
            imgW = maxBoxWidth - rightPart - 2*padding;
            // 让高度按比例变化
            imgH = imgW / rate;
        }
        if( imgH > maxBoxHeight - 2 * padding){

            imgH = maxBoxHeight - 2 * padding;
            // 让高度按比例变化
            imgW = imgH * rate;
        }
        // 决定显示盒子的尺寸
        boxW = imgW + 180 + 2 * padding;
        boxH = imgH + 2 * padding;
        // 验收最小值
        if( boxW < minBoxWidth){
            boxW = minBoxWidth;
        }
        if( boxH < minBoxHeight){
            boxH = minBoxHeight;
        }

        this.setState({
            realW,
            realH,
            imgW,
            imgH,
            boxW,
            boxH,
            padding,
            picurl
        })

    }
    // 组件上树之后
    componentDidMount() {
        var self = this;
        // 映射上传的对象的
        this.maps = {
            view:{},
            inner:{},
            engine:{},
            more:{}
        }
        var $dropzone = $(".dropzone");
        // HTML5拖放的API
        $dropzone.bind("dragover",function(event){
            // 阻止浏览器的默认事件
            event.preventDefault();
            $(this).addClass('over')
        });
        $dropzone.bind("dragleave",function(event){
            // 阻止浏览器的默认事件
            event.preventDefault();
            $(this).removeClass('over')
        });
        $dropzone.bind("drop",function(event){
            // 阻止浏览器的默认事件
            event.preventDefault();
            $(this).removeClass('over');
            var files = event.originalEvent.dataTransfer.files;
            createFileArrAndUploader(files,$(this).data("album"));
        });
        function createFileArrAndUploader(files,album){

            // 给当前的FormDate对象添加一个键值对
            for (var i = 0; i < files.length; i++) {
                let No = self.viewamount++;
                // html5新的对象，表单数据
                let formData = new FormData();
                // 追加项
                formData.append("viewpics",files[i]);
                // formData.append("saveBucket",self.state.choosebuckets);
                // formData.append("saveUrl",self.state.chooseurl);
                // 再调用一个函数，次函数是通过XML2.0 来发送formData对象到后台的。
                uploadeFile(formData,album,No)

                // html5新的对象，看可以读取文件
                let reader = new FileReader();
                // 读取图片的编码base64，让图片回显到页面上
                reader.readAsDataURL(files[i]);
                reader.onload = function(event){
                    var str = "previmgbox " + album;
                    $(".dropzone[data-album="+album+"]").append(
                            $('<div data-no='+No+' class="previmgbox" style="background-image:url('+event.target.result+')"><em></em></div>')
                        )
                    $(".previmgbox").addClass(album);
                }

                // 可以排序
                $(".dropzone").sortable();
            };
        }
        // 真正去发送文件的函数
        function uploadeFile(formData,album,No){
            // 使用原生的JS方法
            var xhr = new XMLHttpRequest();
            // 上传的进度
            xhr.upload.onprogress = function(event){
                // 获取当前图片上传的百分比
                var percent = 100 * event.loaded / event.total;
                // 文字标签
                var $em = $(".previmgbox." + album + "[data-no="+No+"]").find("em");

                $em.html("图片正在上传"+ parseInt(percent) + "%");
            }
            // load事件：传输成功完成
            xhr.onload = function(){
                var $em = $(".previmgbox." + album + "[data-no="+No+"]").find("em").hide();

                self.maps[album][No] = JSON.parse(xhr.responseText).base;
            }
            // 监听状态
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4){
                    if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                        const {base,size:{width,height}} = JSON.parse(xhr.responseText);
                        console.log(base,width,height);

                        $(".previmgbox." + album + "[data-no="+No+"]").attr({"picUrl":base,"w":width,"h":height})
                    }else{
                        console.log("failed");
                    }
                }
            };
            // 配置请求的类型，地址，是否是异步
            xhr.open("POST","http://127.0.0.1:3000/uploadcarimages",true);
            // 发送
            xhr.send(formData)

        };
        // 模拟事件vierfile的改变事件
        $(this.refs.viewfilebtn).click(function(){
            $(self.refs.viewfile).trigger('click');
        });
        //监听真正的file按钮
        this.refs.viewfile.onchange = function(event){
            createFileArrAndUploader(this.files,"view")
        }

        $(".dropzone").on("click",".previmgbox",function(){

            self.onUpDone($(this).attr("picUrl"),$(this).attr("w"),$(this).attr("h"));
            self.openXuanfu();
        })
    }
    // componentWillReceiveProps(nextProps) {

    //     this.setState({
    //         choosebuckets:nextProps.choosebuckets,
    //         chooseurl:nextProps.chooseurl
    //     })
    // }
    render() {

        return (
            <div>
                <Divider></Divider>
                <Row>
                    <Col span={20}>
                        <h2>上传图片【可以拖拽上传，也可以点击+号上传】</h2>
                    </Col>
                    <Col span={2}>
                        <input ref="viewfile" type="file" hidden multiple="multiple" />
                        <span ref="viewfilebtn" className="addBtn">+</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="dropzone" data-album="view"></div>
                    </Col>
                </Row>

                {
                    this.state.isShowXuanfu
                    ?
                    <div className="xuanfuceng">
                        <CutBox
                            realW={this.state.realW}
                            realH={this.state.realH}
                            imgW={this.state.imgW}
                            imgH={this.state.imgH}
                            boxW={this.state.boxW}
                            boxH={this.state.boxH}
                            padding={this.state.padding}
                            picurl={this.state.picurl}
                            closeXuanfu={this.closeXuanfu.bind(this)}
                        ></CutBox>
                    </div>
                    :
                    null
                }
            </div>
        );
    }
}
export default connect()(PicUpLoad)