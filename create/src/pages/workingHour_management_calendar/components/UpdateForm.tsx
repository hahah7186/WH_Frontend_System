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

// export interface FormValsType extends Partial<TableListItem> {
//   target?: string;
//   template?: string;
//   type?: string;
//   time?: string;
//   frequency?: string;
// }

export interface UpdateFormProps extends FormComponentProps {
  handleModalVisible: (flag?: boolean) => void;
  handleModify: (curDateProjectList: any[], dateType: any) => void;
  modalVisible: boolean;
  // dateProjectListByDay: WHListItem[];
  curDateProjectList: any[];
  curDatetypeMapping: any;
  curSelDate: any;
  dateTypeList: any[];
}
// const FormItem = Form.Item;
// const { Step } = Steps;
// const { TextArea } = Input;
// const { Option } = Select;
// const RadioGroup = Radio.Group;

export interface UpdateFormState {
  // modalKey: number;
  // curDateProjectList: any;
  //projectListVisible: boolean;
  // // dateType: any;
  selDateType: number;
  curDatetypeMapping: DatetypeMapping;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleModify: () => {},
    handleModalVisible: () => {},
    curDatetypeMapping: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      // modalKey:0,
      //projectListVisible: props.curDatetypeMapping.dateTypeId == 1 ? true : false,
      selDateType:
        props.curDatetypeMapping.dateTypeId == 0 ? 0 : props.curDatetypeMapping.dateTypeId,
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

  // componentWillMount() {
  //   debugger
  //   this.setState({
  //     projectListVisible: this.props.curDatetypeMapping.dateTypeId == 1 ? true : false,
  //     selDateType: this.props.curDatetypeMapping.dateTypeId == 0 ? 1 : this.props.curDatetypeMapping.dateTypeId,
  //     curDatetypeMapping :{
  //       date: this.props.curDatetypeMapping.date,
  //       dateTypeId: this.props.curDatetypeMapping.dateTypeId,
  //       dateTypeName: this.props.curDatetypeMapping.dateTypeName,
  //       memberId: this.props.curDatetypeMapping.memberId,
  //       memberName: this.props.curDatetypeMapping.memberName,
  //       memberNameEn: this.props.curDatetypeMapping.memberNameEn,
  //     },
  //   })
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
    this.setState({
      selDateType: parseInt(value),
    });
    // selDateType = value;
    // switch (value) {
    //   case '1':
    //     // projectListVisible = true;
    //     this.setState({
    //       //projectListVisible: true,
    //       selDateType: parseInt(value),
    //       // dateType:value,
    //     });
    //     break;
    //   case '2':
    //     // projectListVisible = false;
    //     this.setState({
    //       //projectListVisible: false,
    //       selDateType: parseInt(value),
    //       // dateType:value,
    //     });
    //     break;
    //   case '3':
    //     // projectListVisible = false;
    //     this.setState({
    //       //projectListVisible: false,
    //       selDateType: parseInt(value),
    //       // dateType:value,
    //     });
    //     break;
    //   case '4':
    //     // projectListVisible = false;
    //     this.setState({
    //       //projectListVisible: false,
    //       selDateType: parseInt(value),
    //       // dateType:value,
    //     });
    //     break;
    //   case '5':
    //     // projectListVisible = false;
    //     this.setState({
    //       //projectListVisible: false,
    //       selDateType: parseInt(value),
    //       // dateType:value,
    //     });
    //     break;
    // }
  };

  getDisplayDate(curSelDate: any) {
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

  render() {
    const {
      modalVisible /*, form, */,
      handleModify,
      handleModalVisible,
      curDateProjectList,
      curDatetypeMapping,
      curSelDate,
      dateTypeList,
    } = this.props;

    const okHandle = () => {
      if (this.state.selDateType === 0) {
        message.error('You have not selected any date type options. Cannot submit.');
      } else {
        let sumWorkingHour = 0;
        curDateProjectList.map(item => (sumWorkingHour = sumWorkingHour + item.workingHour));
        if (sumWorkingHour > 8) {
          message.error(
            'The total working time of the day is more than 8 hours, please check again.',
          );
        } else {
          handleModify(curDateProjectList, this.state.selDateType);
          handleModalVisible();
        }
      }
    };

    const cancelHandle = () => {
      // this.setState({
      //   //projectListVisible: true,
      //   modalKey: this.state.modalKey + 1,
      // });
      handleModalVisible();
    };

    let displayDate = this.getDisplayDate(curSelDate);

    // dateTypeList.push({'dateTypeId':0,'dateTypeName':'Please select date type...'})
    dateTypeList.sort();
    const dateTypeOptions =
      typeof dateTypeList == 'undefined'
        ? []
        : dateTypeList.map(d => <Option key={d.dateTypeId}>{d.dateTypeName}</Option>);

    // dateTypeOptions.push(<Option key='0'>Please select...</Option>)

    return (
      <Modal
        width={950}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={displayDate}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
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
          style={{
            marginTop: '30px',
            display:
              this.state.selDateType == 1 ||
              this.state.selDateType == 2 ||
              this.state.selDateType == 3 ||
              this.state.selDateType == 4 ||
              this.state.selDateType == 5 ||
              this.state.selDateType == 6
                ? 'block'
                : 'none',
          }}
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
                      max={16}
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
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
