import React from 'react';
import { connect } from "dva";
import { Button , Modal ,Progress } from "antd";
class FileUpLoad extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            // 0表示没有上传 ，1正在上传，2 上传完成
            upstep:0,
            // 上传的进度
            percent:0,
            // 上传的文件名字
            filename:"",
            // 文件名字
            real:"",
            // 文件的拓展名
            ext:""
        }
    }
    //上树之后
    componentDidMount() {
        var self = this;
        $(this.refs.fileBtn).bind("change",function(){
            self.setState({
                upstep:1,
                filename:this.files[0].name
            });

            // 执行上传
            let formData = new FormData();
            formData.append("carfiles",this.files[0]);
            // 调用一个上传的函数
            uploadFile(formData);
        });

        // 上传的函数
        function uploadFile(formData){
            var xhr = new XMLHttpRequest();
            // 进度
            xhr.upload.onprogress = function(event){
                var percent = 100 * event.loaded /event.total;
                self.setState({
                    percent
                })
            };
            // 上传完毕做的事
            xhr.onload = function(){
                // 这里回来的回调信息
                var base = JSON.parse(xhr.responseText).base;
                var ext = JSON.parse(xhr.responseText).ext;
                self.setState({
                    upstep:2,
                    ext,
                    real:base
                })
            }
            // 配置请求的类型、地址、是否异步
            xhr.open("POST","http://127.0.0.1:3000/uploadcarfiles",true);
            // 发送
            xhr.send(formData);
        }
    }
    render() {
        // 图标的地址
        const getImageUrl = (ext)=>{
            if(ext == ".pdf"){
                return "/images/pdf.png"
            }else if(ext == ".zip" || ext == ".rar"){
                return "/images/zip.png"
            }else if(ext == ".docx"){
                return "/images/docx.png"
            }
        }

        return (
            <div>
                <h2>点击下方按钮上传文件</h2>
                <Button onClick={()=>{
                    $(this.refs.fileBtn).trigger('click');
                }}>上传文件</Button>

                <input type="file" ref="fileBtn" hidden/>

                <Modal
                    title="正在上传"
                     footer={null}
                    visible={this.state.upstep == 1}
                >
                    <div>
                        <Progress percent={this.state.percent} status="active" />
                    </div>
                </Modal>
                <Modal
                    title="请确认文件名字"
                    visible={this.state.upstep == 2}
                    destroyOnClose={true}
                    onOk={()=>{
                        this.setState({
                            upstep:0
                        })
                        // 派遣一个动作
                        this.props.dispatch({"type":"bucket/syncAddFile","fileinfo":{
                            "real":this.state.real,
                            "filename":this.state.filename,
                            "ext":this.state.ext

                        }})
                    }}
                >
                    <div>
                        <div style={{"textAlign":"center"}}>
                            <img width="200" src={getImageUrl(this.state.ext)} alt="" />
                            <input type="text" defaultValue={this.state.filename} readOnly />
                        </div>
                    </div>
                </Modal>

                <div className="filebox">
                    <ul>
                        {
                            this.props.currentFile.map(item=>{
                                return <li key={item.real}>
                                    <img src={getImageUrl(item.ext)} alt="" width="40" />
                                    {item.filename}
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}
export default connect(
    ({bucket:{currentFile}})=>{
        return {
            currentFile
        }
    }


)(FileUpLoad);