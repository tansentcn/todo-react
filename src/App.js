import React from 'react';
// import logo from './logo.svg';
import './App.css';

import { Button, Card, Layout, Input, List, Modal, Timeline } from 'antd';
// 布局
const { Content, Sider } = Layout;
// 文本域、多行文本
const { TextArea } = Input;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crudList: [],
      msg: "",
      visible: false,
      editIndex: -1
    };
    this.handleChange = this.handleChange.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.finishItem = this.finishItem.bind(this)
    this.editItemMsg = this.editItemMsg.bind(this)
  }


  handleChange(e) {
    console.log(e);
    // 输入框中数据绑定
    this.setState({
      msg: e.target.value
    })
  }
  addItem() {
    // 创建新列表
    let newList = this.state.crudList
    // 添加新数据
    newList.push({
      time: Date.now(),
      msg: this.state.msg,
      finish: false
    })
    // 替换(更新)数据列表
    this.setState({
      crudList: newList,
      // 清空输入框
      msg: ""
    })
  }
  // 修改待办项
  editItem(item) {
    // 获取项目
    // console.log(item);

    // 获取当前下标索引
    const index = this.state.crudList.indexOf(item);

    // 将事件msg放入输入框
    this.setState({
      msg: item.msg,
      editIndex: index,
      // 打开修改框
      visible: true,
    })
  }

  editItemMsg() {
    let newList = this.state.crudList

    // 修改事件信息msg
    newList[this.state.editIndex].msg = this.state.msg

    this.setState({
      // 更新数据
      crudList: newList,
      // 初始化数据
      visible: false,
      editIndex: -1,
      msg: ""
    });
  }
  finishItem(item) {
    let newList = this.state.crudList
    // 获取当前下标索引
    const index = this.state.crudList.indexOf(item)
    if (newList[index].finish === false) {
      // 修改状态
      newList[index].finish = true
      this.setState({
        // 更新数据
        crudList: newList
      });
    } else {
      // 删除已经完成的
      newList.splice(index, 1)
      this.setState({
        // 更新数据
        crudList: newList
      });
    }



  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };




  // 生命周期函数
  // 加载前获取本地数据
  componentWillMount() {
    if (localStorage.getItem("crudList") != null) {
      // 获取本地存储
      const localList = JSON.parse(localStorage.getItem("crudList"));

      // 更新数据
      this.setState({
        crudList: localList
      })
    }
  }

  // 每次更新前进行数据本地保存
  componentWillUpdate() {
    localStorage.setItem("crudList", JSON.stringify(this.state.crudList));
  }

  render() {
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider width="400" theme="light" style={{ paddingTop: 20 }}>
            {/* 左侧添加待办项 */}
            <Card title="添加新的待办项" >
              <TextArea autoSize={{ minRows: 4, maxRows: 10 }} value={this.state.msg} onChange={this.handleChange} onPressEnter={this.handleChange} />
              <Button type="primary" style={{ marginTop: 20 }} size="large" onClick={this.addItem}>添加</Button>
            </Card>
            <Card title="说明" >
              <Timeline style={{ textAlign: 'left' }}>
                <Timeline.Item>添加：左侧输入后点击添加</Timeline.Item>
                <Timeline.Item>修改：鼠标移入列表中，点击右侧修改按钮，在弹出的对话框中修改内容，并且点击确定修改按钮。</Timeline.Item>
                <Timeline.Item>完成：鼠标移入列表中，点击右侧完成按钮</Timeline.Item>
                <Timeline.Item>删除：再次点击完成按钮即可删除</Timeline.Item>
                <Timeline.Item>数据持久化：在每次视图更新（数据更改）时，将会在本地进行数据存储/更新。刷新/下次打开时数据仍然存在。</Timeline.Item>
              </Timeline>
            </Card>
          </Sider>
          <Layout>

            <Content style={{ margin: '0 16px' }} >
              <List
                style={{ width: '90%', minHeight: '100%', margin: '0 auto', backgroundColor: '#ffffff' }}
                bordered
                itemLayout="vertical"
                header={<h1>待办事项</h1>}
                dataSource={this.state.crudList}
                renderItem={item => (
                  <List.Item
                    className="item"
                    extra={
                      <div className="itemBtn">
                        <Button type="primary" style={{ marginRight: 20 }} size="large" onClick={() => this.editItem(item)}>修改</Button>
                        <Button size="large" style={{ backgroundColor: '#67C23A', color: '#fff' }} onClick={() => this.finishItem(item)}>完成</Button>
                      </div>
                    }
                  >
                    <List.Item.Meta
                      title={<div className="listTime">创建时间：{new Date(item.time).toLocaleString()}</div>}
                      description={<div className={`listMsg ${item.finish ? 'finishItem' : ''}`} >{item.msg}</div>}
                    />
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Layout>

        <Modal
          title="修改待办项"
          visible={this.state.visible}
          onOk={() => this.editItemMsg()}
          okText="确认修改"
          onCancel={this.handleCancel}
          cancelText="取消"
          maskClosable={false}
        >
          <TextArea autoSize={{ minRows: 4, maxRows: 10 }} value={this.state.msg} onChange={this.handleChange} onPressEnter={this.handleChange} />
        </Modal>
      </div>
    )
  }
}

export default App;
