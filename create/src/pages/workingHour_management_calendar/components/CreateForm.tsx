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
import { WHListItem, DatetypeMapping } from '../data';
import { Label } from 'bizcharts';
import { any } from 'prop-types';

const { TextArea } = Input;
const { Option, OptGroup } = Select;
let itemId = 0;

let curDateProjectList: any[];
// let selDateType: any = -1;
// let projectListVisible: boolean = false;

export interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  // dateProjectListByDay: WHListItem[];
  curDateProjectList: any[];
  curDatetypeMapping: any;
  curSelDate: any;
  dateTypeList: any[];
  handleModalVisible: () => void;
  handleModify: (curDateProjectList: any[], dateType: any) => void;
}
//定义控件
// const FormItem = Form.Item;
// const { Option,OptGroup } = Select;

export interface CreateState {
  // modalKey: number;
  // curDateProjectList: any;
  projectListVisible: boolean;
  // // dateType: any;
  selDateType: number;
  curDatetypeMapping: DatetypeMapping;
}

class CreateForm extends Component<CreateFormProps, CreateState> {
  static defaultProps = {
    handleModify: () => {},
    handleModalVisible: () => {},
    curDatetypeMapping: {},
  };
  // state = {
  //   // curDateProjectList: this.props.curDateProjectList,
  //   projectListVisible: false,
  //   // // dateType: any,
  //   // selDateType: -1,
  // };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: CreateFormProps) {
    super(props);

    this.state = {
      projectListVisible: props.curDatetypeMapping.dateTypeId == 1 ? true : false,
      selDateType:
        props.curDatetypeMapping.dateTypeId == 0 ? 1 : props.curDatetypeMapping.dateTypeId,
      curDatetypeMapping: {
        date: props.curDatetypeMapping.date,
        dateTypeId: props.curDatetypeMapping.dateTypeId,
        dateTypeName: props.curDatetypeMapping.dateTypeName,
        memberId: props.curDatetypeMapping.memberId,
        memberName: props.curDatetypeMapping.memberName,
        memberNameEn: props.curDatetypeMapping.memberNameEn,
      },
    };
  }

  //   constructor(props: CreateFormProps) {
  //     super(props);
  // debugger
  //     this.state = {
  //       formVals: {
  //         member_id:props.values.member_id,
  //         member_name:props.values.member_name,
  //         member_name_en:props.values.member_name_en,
  //         family_name:props.values.family_name,
  //         given_name:props.values.given_name,
  //         role_id:props.values.role_id,
  //         role_name:props.values.role_name,
  //         post_id:props.values.post_id,
  //         post_name:props.values.post_name,
  //         group_id:props.values.group_id,
  //         group_name:props.values.group_name,
  //         branch_id:props.values.branch_id,
  //         branch_name:props.values.branch_name,
  //         g_id:props.values.g_id,
  //         mobile:props.values.mobile,
  //         org_name:props.values.org_name,
  //         email:props.values.email,
  //       },
  //       // currentStep: 0,
  //     };
  //   }

  // componentDidMount() {
  //   debugger
  //   this.setState({
  //     projectListVisible: this.props.curDatetypeMapping.dateTypeId == 1 ? true : false,
  //     selDateType: this.props.curDatetypeMapping.dateTypeId,
  //   });
  // }

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
    // selDateType = value;
    switch (value) {
      case '1':
        // projectListVisible = true;
        this.setState({
          projectListVisible: true,
          selDateType: value,
          // dateType:value,
        });
        break;
      case '2':
        // projectListVisible = false;
        this.setState({
          projectListVisible: false,
          selDateType: value,
          // dateType:value,
        });
        break;
      case '3':
        // projectListVisible = false;
        this.setState({
          projectListVisible: false,
          selDateType: value,
          // dateType:value,
        });
        break;
      case '4':
        // projectListVisible = false;
        this.setState({
          projectListVisible: false,
          selDateType: value,
          // dateType:value,
        });
        break;
      case '5':
        // projectListVisible = false;
        this.setState({
          projectListVisible: false,
          selDateType: value,
          // dateType:value,
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
      //curDatetypeMapping,
      curSelDate,
      dateTypeList,
    } = this.props;

    // const selDateType = this.props.curDatetypeMapping == 0? 1:this.props.curDatetypeMapping.dateTypeId;
    // projectListVisible = selDateType == 1 ? true : false;
    //const { curDatetypeMapping } = this.state;

    const okHandle = () => {
      handleModify(curDateProjectList, this.state.selDateType);
      // this.setState({
      //   //projectListVisible: true,
      //   modalKey: this.state.modalKey + 1,
      // });
      handleModalVisible();
    };

    // const cancelHandle = () => {
    //   // this.setState({
    //   //   //projectListVisible: true,
    //   //   modalKey: this.state.modalKey + 1,
    //   // });
    //   handleModalVisible();
    // };

    let displayDate = getDisplayDate(curSelDate);

    const dateTypeOptions =
      typeof dateTypeList == 'undefined'
        ? []
        : dateTypeList.map(d => <Option key={d.dateTypeId}>{d.dateTypeName}</Option>);

    return (
      <Modal
        width={950}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={displayDate}
        visible={modalVisible}
        onOk={okHandle}
        keyboard={true}
        onCancel={() => handleModalVisible()}
        centered={true}
        // key={this.state.modalKey}
      >
        <div>
          <label>Daily Information：</label>
          <Select
            defaultValue={this.state.selDateType + ''}
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

export default Form.create<CreateFormProps>()(CreateForm);
