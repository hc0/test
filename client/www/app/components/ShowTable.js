import React from 'react';
import { Table , Divider} from "antd";
export default class ShowTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const dataSource = [{
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号'
        }, {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号'
        }];

        const piccolumns = [{
          title: '名称',
          dataIndex: 'base',
          key: 'base',
        }, {
          title: '地址',
          dataIndex: 'realpicdir',
          key: 'realpicdir',
        }, {
          title: '拓展名',
          dataIndex: 'realpicext',
          key: 'realpicext',
        },{
          title: '大小',
          dataIndex: 'realpicsize',
          key: 'realpicsize',
          render:function(text, record, index){
            return `${text}字节`
          }
        },{
          title: '尺寸',
          dataIndex: 'size',
          key: 'size',
          render:function(text, record, index){
            return `宽度是${text.width}px,高度是${text.height}px`
          }
        }];

        const filecolumns = [{
          title: '名称',
          dataIndex: 'realfilebase',
          key: 'realfilebase',
        }, {
          title: '地址',
          dataIndex: 'realfiledir',
          key: 'realfiledir',
        }, {
          title: '拓展名',
          dataIndex: 'realfileext',
          key: 'realfileext',
        },{
          title: '大小',
          dataIndex: 'realfilesize',
          key: 'realfilesize',
          render:function(text, record, index){
            return `${text}字节`
          }
        }];
            console.log(this.props.allData);
        return (
            <div>
                {
                    this.props.allData.map((item,index)=>{
                        return <div key={index}>
                            <h3 style={{"color":"#c00"}}>存储对象的ID：{item.id} , 存储对象的名称：{item.title} , 存储对象的描述：{item.description} ,存储对象的权限：{item.modifier == "public" ? "公共" : "私用"}</h3>
                            <Table dataSource={item.pics} columns={piccolumns} rowKey="realfilebase"/>
                            <Table dataSource={item.files} columns={filecolumns} rowKey="realfilebase"/>
                            <Divider></Divider>
                        </div>
                    })
                }


            </div>
        );
    }
};