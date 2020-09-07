import {
  /*Button,*/ Card,
  DatePicker,
  Form,
  Input,
  Modal,
  /*Radio,*/ Select /*, Steps*/,
  List,
  InputNumber,
  Row,
  Col,
  Slider,
  Divider,
  Icon,
  Button,
  message,
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';
import { WHStateType } from '../model';
// import { ListItemDataType/*,MemberSelect*/,CustomerSelect,Member,supportType,AccountExportItem,FiscalYearItem } from '../../data.d';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { WHListItem } from '../data';

const { TextArea } = Input;

let itemId = 0;

let curDateProjectList: any[];

export interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  // dateProjectListByDay: WHListItem[];
  curDateProjectList: any[];
  curSelDate: any;
  handleModalVisible: () => void;
  handleModify: (curDateProjectList: any[]) => void;
}
//定义控件
// const FormItem = Form.Item;
// const { Option,OptGroup } = Select;

export interface CreateState {
  curDateProjectList: any;
}

class CreateForm extends Component<CreateFormProps, CreateState> {
  state = {
    curDateProjectList: this.props.curDateProjectList,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: CreateFormProps) {
    super(props);
    // this.setState({
    //   curDateProjectList:this.props.curDateProjectList
    // });
    // this.state = {
    //   curDateProjectList:this.props.curDateProjectList
    // };
  }

  onNormalChange = (value: any, projectId: any) => {
    curDateProjectList = this.props.curDateProjectList;
    curDateProjectList.map(item => {
      if (item.projectId === projectId) {
        item.workingHour = value;
      }
    });
  };

  onOvertimeChange = (value: any, projectId: any) => {
    curDateProjectList = this.props.curDateProjectList;
    curDateProjectList.map(item => {
      if (item.projectId === projectId) {
        item.overtimeHour = value;
      }
    });
  };

  onCommentChange = (projectId: any, event: any) => {
    debugger;
    const changedValue = event.target.value;
    curDateProjectList = this.props.curDateProjectList;
    curDateProjectList.map(item => {
      if (item.projectId === projectId) {
        item.comments = changedValue;
      }
    });
  };

  render() {
    const {
      modalVisible /*, form, */,
      handleModify,
      handleModalVisible,
      curDateProjectList,
      curSelDate,
    } = this.props;

    // let list:any[] = [];
    // list = curDateProjectList;
    // debugger
    const okHandle = () => {
      handleModify(curDateProjectList);
      handleModalVisible();
    };

    // const cancelHandle = () =>{
    //   form.resetFields();
    //   itemId = 0;
    //   this.setState({
    //     formVals:{
    //       sales_order_volume:0,
    //     },
    //     sonoDisable:true,
    //     arrPercentage:[],
    //     planBudget:0,
    //   });
    //   handleCreateModalVisible(false, values);
    // };

    return (
      <Modal
        width={950}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={'  Working Hour Inputs   ' + curSelDate}
        visible={modalVisible}
        onOk={okHandle}
        keyboard={true}
        onCancel={() => handleModalVisible()}
        centered={true}
      >
        <List
          grid={{ gutter: 10, column: 4 }}
          dataSource={curDateProjectList}
          renderItem={item => (
            <List.Item>
              <Card
                title={item.projectName}
                hoverable={true}
                headStyle={{ backgroundColor: '#A5E1E1' }}
              >
                <div>
                  <Icon
                    type="clock-circle"
                    style={{ fontSize: '16px', color: '#4BB9B9' }}
                    theme="outlined"
                  />
                  {'  Normal Working:'}
                  <InputNumber
                    size="large"
                    max={8}
                    min={0}
                    defaultValue={item.workingHour}
                    formatter={value =>
                      ` ${value}     (hours)`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    style={{ width: '100%', marginTop: '1%' }}
                    onChange={value => this.onNormalChange(value, item.projectId)}
                  />
                </div>
                <div style={{ marginTop: '4%' }}>
                  <Icon
                    type="plus-circle"
                    style={{ fontSize: '16px', color: '#4BB9B9' }}
                    theme="outlined"
                  />
                  {'  Overtime:'}
                  <InputNumber
                    size="large"
                    defaultValue={item.overtimeHour}
                    max={6}
                    min={0}
                    formatter={value =>
                      ` ${value}     (hours)`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    style={{ width: '100%', marginTop: '1%' }}
                    onChange={value => this.onOvertimeChange(value, item.projectId)}
                  />
                </div>
                <div style={{ marginTop: '4%' }}>
                  <Icon
                    type="profile"
                    style={{ fontSize: '16px', color: '#4BB9B9' }}
                    theme="outlined"
                  />
                  {'  Comments:'}
                  <TextArea
                    defaultValue={item.comments}
                    placeholder="Please input the comments for working hour"
                    style={{ height: '70px' }}
                    allowClear
                    onChange={this.onCommentChange.bind(this, item.projectId)}
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
        ,{/* {formItems} */}
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);
