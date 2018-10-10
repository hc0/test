import React from 'react';
import { Divider , Button, Modal, Form, Input, Radio ,Drawer ,Menu, Dropdown, Icon, message ,Col,Row } from 'antd';
import PicUpLoad from "../components/PicUpLoad.js";
import FileUpLoad from "../components/FileUpLoad.js";
import ShowTable from "../components/ShowTable.js";
const FormItem = Form.Item;
import { connect } from "dva";
const CollectionCreateForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="创建一个新的存储对象"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="名称">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </FormItem>
            <FormItem className="collection-create-form_last-form-item">
              {getFieldDecorator('modifier', {
                initialValue: 'public',
              })(
                <Radio.Group>
                  <Radio value="public">公共</Radio>
                  <Radio value="private">私有</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);
class Buckets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible1: false,
            visible2: false,
            choosebuckets:{},
            chooseurl:""
        };

        props.dispatch({"type":"bucket/init"});
    }
    showModal(){
        this.setState({ visible1: true });
    }

    handleCancel(){
        this.setState({ visible1: false });
    }

    showDrawer(){
        this.setState({
          visible2: true,
        });
    };

    onClose(){
        this.setState({
          visible2: false,
        });
    };
    handleCreate(){
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          this.props.dispatch({"type":"bucket/changeCollectionCreatebucket",values})
          form.resetFields();
          this.setState({ visible2: false });
        });
    }

    saveFormRef(formRef){
        this.formRef = formRef;
    }
    handleButtonClick(e){
      // message.info('Click on left button.');
      // console.log('click left button', e);
    }

    handleMenuClick(e){
      this.setState({
         choosebuckets:{
            id:e.key,
            title:e.item.props.title
         }
      })
    }
    render() {
        const menu = (
          <Menu onClick={this.handleMenuClick.bind(this)}>
                {
                    this.props.allBucket.map((item)=>{
                        return <Menu.Item key={item.id} title={item.title}><Icon type="user" />
                            {item.id} -- {item.title}
                        </Menu.Item>
                    })
                }
          </Menu>
        );
        return (
            <div>
                <div>
                    <Button type="primary" onClick={this.showModal.bind(this)}>创建存储</Button>
                    <CollectionCreateForm
                      wrappedComponentRef={this.saveFormRef.bind(this)}
                      visible={this.state.visible1}
                      onCancel={this.handleCancel.bind(this)}
                      onCreate={this.handleCreate.bind(this)}
                    />
                    {"  "}
                    <Button type="primary" onClick={this.showDrawer.bind(this)}>
                        上传图片或文件
                    </Button>
                    <Drawer
                         title="上传图片或文件"
                         width="60%"
                         placement="right"
                         onClose={this.onClose.bind(this)}
                         maskClosable={false}
                         visible={this.state.visible2}
                         style={{
                           height: 'calc(100% - 55px)',
                           overflow: 'auto',
                           paddingBottom: 53,
                         }}
                    >
                    <Row>
                        <Col span={6}>
                            <Dropdown.Button onClick={this.handleButtonClick.bind(this)} overlay={menu}>
                                  {this.state.choosebuckets.title || "选择要存储的库"}
                            </Dropdown.Button>
                        </Col>
                        <Col span={7} offset={1}>
                            <Input placeholder="输入要存储的库的文件夹" value={this.state.chooseurl} onChange={(e)=>{

                                this.setState({
                                    chooseurl:e.target.value
                                })
                            }}/>
                        </Col>
                        <Col span={6} offset={1}>
                            {" "}
                            <Button type="primary" onClick={()=>{
                                this.props.dispatch({"type":"bucket/sendSaveInfo","choosebuckets":this.state.choosebuckets,"chooseurl":this.state.chooseurl})
                            }} >确定</Button>
                        </Col>
                    </Row>
                    {
                        this.props.isShow
                        ?
                        <div>
                            <PicUpLoad choosebuckets={this.props.choosebuckets} chooseurl={this.props.chooseurl}></PicUpLoad>
                            <Divider></Divider>
                            <FileUpLoad></FileUpLoad>
                        </div>
                        :
                        null
                    }
                    <Divider></Divider>
                    <Button
                      style={{
                        marginRight: 8,
                      }}
                      onClick={this.onClose.bind(this)}
                    >
                    不做持久保存
                    </Button>
                    <Button onClick={()=>{
                        this.props.dispatch({"type":"bucket/getALlData"})
                        this.onClose.bind(this);
                    }} type="primary">将上传的图片和文件持久到数据库</Button>
                    </Drawer>
                  </div>
                <Divider></Divider>
                已创建存储列表：
                <ShowTable allData={this.props.allData}></ShowTable>
            </div>
        );
    }
}
export default connect(
    ({bucket:{collectionCreatebucket,choosebuckets,chooseurl,isShow,allData}})=>{
        return {
            allBucket:collectionCreatebucket,
            choosebuckets,
            chooseurl,
            isShow,
            allData
        }
    }
)(Buckets);