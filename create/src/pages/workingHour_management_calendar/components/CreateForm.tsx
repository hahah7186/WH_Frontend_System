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
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import { WHListItem } from '../data';
import { Label } from 'bizcharts';

const { TextArea } = Input;
const { Option, OptGroup } = Select;
let itemId = 0;

let curDateProjectList: any[];

export interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  // dateProjectListByDay: WHListItem[];
  curDateProjectList: any[];
  curSelDate: any;
  dateTypeList: any[];
  handleModalVisible: () => void;
  handleModify: (curDateProjectList: any[]) => void;
}
//定义控件
// const FormItem = Form.Item;
// const { Option,OptGroup } = Select;

export interface CreateState {
  curDateProjectList: any;
  projectListVisible: boolean;
}

class CreateForm extends Component<CreateFormProps, CreateState> {
  state = {
    curDateProjectList: this.props.curDateProjectList,
    projectListVisible: true,
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
    const changedValue = event.target.value;
    curDateProjectList = this.props.curDateProjectList;
    curDateProjectList.map(item => {
      if (item.projectId === projectId) {
        item.comments = changedValue;
      }
    });
  };

  handleDailyInformationChange = (value: any) => {
    switch (value) {
      case '1':
        this.setState({
          projectListVisible: true,
        });
        break;
      case '2':
        this.setState({
          projectListVisible: false,
        });
        break;
      case '3':
        debugger;
        this.setState({
          projectListVisible: false,
        });
        break;
      case '4':
        this.setState({
          projectListVisible: false,
        });
        break;
      case '5':
        this.setState({
          projectListVisible: false,
        });
        break;
    }
  };

  render() {
    const {
      modalVisible /*, form, */,
      handleModify,
      handleModalVisible,
      curDateProjectList,
      curSelDate,
      dateTypeList,
    } = this.props;
    const okHandle = () => {
      handleModify(curDateProjectList);
      this.setState({
        projectListVisible: true,
      });
      handleModalVisible();
    };

    const cancelHandle = () => {
      this.setState({
        projectListVisible: true,
      });
      handleModalVisible();
    };

    let displayDate = getDisplayDate(curSelDate);

    const dateTypeOptions =
      typeof dateTypeList == 'undefined'
        ? []
        : dateTypeList.map(d => <Option key={d.dateTypeId}>{d.dateTypeName}</Option>);
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
        title={displayDate}
        visible={modalVisible}
        onOk={okHandle}
        keyboard={true}
        onCancel={cancelHandle}
        centered={true}
      >
        <div>
          <label>Daily Information：</label>
          <Select
            defaultValue="1"
            style={{ width: 300 }}
            onChange={this.handleDailyInformationChange}
          >
            {/* <Option value="1">Work</Option>
                <Option value="2">Annual Leave</Option>
                <Option value="3">Sick Leave</Option>
                <Option value="4">Public Holiday</Option>
                <Option value="5">Others</Option> */}
            {dateTypeOptions}
          </Select>
        </div>
        <div
          style={{ marginTop: '30px', display: this.state.projectListVisible ? 'block' : 'none' }}
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
        </div>
        ,{/* {formItems} */}
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);

function getDisplayDate(curSelDate: any) {
  let displayDate = '';
  const locale = getLocale();
  switch (locale) {
    case 'en-US':
      let enDate = new Date(curSelDate.replace(/-/g, '/'));
      let enDateString = enDate.toDateString(); //"Tue, 01 Jan 2019 16:00:00 GMT"
      //注意：此处时间为中国时区，如果是全球项目，需要转成【协调世界时】（UTC）
      // let globalDate = date.toUTCString(); //"Wed Jan 02 2019"
      //之后的处理是一样的
      let enDateArray = enDateString.split(' '); //["Wed", "Jan", "02", "2019"]
      displayDate = `${enDateArray[1]} ${enDateArray[2]}, ${enDateArray[3]}  ${enDateArray[0]}`;
      break;
    case 'zh-CN':
      let cnDate = new Date(curSelDate.replace(/-/g, '/'));
      var dayOfWeek = cnDate.getDay();
      var days;
      switch (dayOfWeek) {
        case 1:
          days = '星期一';
          break;
        case 2:
          days = '星期二';
          break;
        case 3:
          days = '星期三';
          break;
        case 4:
          days = '星期四';
          break;
        case 5:
          days = '星期五';
          break;
        case 6:
          days = '星期六';
          break;
        case 0:
          days = '星期日';
          break;
      }
      // let cnDateString = cnDate.; //"Tue, 01 Jan 2019 16:00:00 GMT"
      displayDate = `${cnDate.getFullYear()}年${cnDate.getMonth() +
        1}月${cnDate.getDate()}日 ${days}`;
      break;
    case 'zh-TW':
      let cntrDate = new Date(curSelDate.replace(/-/g, '/'));
      var dayOfWeek = cntrDate.getDay();
      var days;
      switch (dayOfWeek) {
        case 1:
          days = '星期壹';
          break;
        case 2:
          days = '星期贰';
          break;
        case 3:
          days = '星期叁';
          break;
        case 4:
          days = '星期肆';
          break;
        case 5:
          days = '星期伍';
          break;
        case 6:
          days = '星期陆';
          break;
        case 0:
          days = '星期日';
          break;
      }
      // let cnDateString = cnDate.; //"Tue, 01 Jan 2019 16:00:00 GMT"
      displayDate = `${cntrDate.getFullYear()}年${cntrDate.getMonth() +
        1}月${cntrDate.getDate()}日 ${days}`;
      break;
  }
  return displayDate;
}
