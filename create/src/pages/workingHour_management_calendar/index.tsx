import { Icon, Badge, Card, Form, message, Calendar, Row, Col, Select, Button } from 'antd';
import React, { Component /*, Fragment */ } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
//import moment from 'moment';
import { WHStateType } from './model';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
//import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
// import EditableTable from './components/EditableTable/EditableTable';
//import UpdateForm, { FormValsType } from './components/UpdateForm';
// import { WHListItem, WHListComments/*WHListPagenation, WHListData,WHListParams */} from './data.d';
// import LinesEllipsis from 'react-lines-ellipsis';
// import styles from './style.less';
import { Member, MemberSelect, DatetypeMapping } from './data.d';
import moment from 'moment';
// import { WHListItem } from '../workingHour_management/data';
// import { WHListDataByDay } from './data';

const { Option } = Select;

interface WHListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  //listTableList: StateType;
  dateProjectList: WHStateType;
  //curDateProjectList: WHModelStateType;
}

interface WHListState {
  modalVisible: boolean;
  //updateModalVisible: boolean;
  //expandForm: boolean;
  //selectedRows: TableListItem[];
  // formValues: { [key: string]: string };
  //stepFormValues: Partial<TableListItem>;
  // curSelDate: any;
  // mode: any;
  dateProjectList: WHStateType;
  curSelDate: any;
  curDateProjectList: any;
  curDatetypeMapping: any;
  // memberList: MemberSelect[];
  curSelMemId: any;
}

let curSelYear = moment().format('YYYY');
let curSelMon = moment().format('MM');
let defMode = 'month';

const overtimeColorMap = {
  0: '#fffffe',
  1: '#ffd2d2',
  2: '#ffb5b5',
  3: '#ff9797',
  4: '#ff7575',
  5: '#ff5151',
  6: '#ff2d2d',
};

@connect(
  ({
    dateProjectList,
    loading,
  }: {
    dateProjectList: WHStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    dateProjectList,
    loading: loading.models,
  }),
)
class WHList extends Component<WHListProps, WHListState> {
  state: WHListState = {
    // memberList:[],
    modalVisible: false,
    //updateModalVisible: false,
    //expandForm: false,
    //selectedRows: [],
    // formValues: {},
    //stepFormValues: {},
    curSelDate: moment().format('YYYY-MM'),
    // mode: "month"
    curSelMemId: localStorage.getItem('userId'),

    dateProjectList: {
      data: {
        dateProjectList: [],
        dateProjectListByDay: {},
        monthProjectList: [],
        monthProjectListByMon: {},
        result: -1,
        resMsg: '',
        memberList: [],
        dateTypeList: [],
        dateTypeMappingList: [],
      },
    },
    curDateProjectList: [],
    curDatetypeMapping: {},
  };

  componentDidMount() {
    // debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'dateProjectList/fetch',
      payload: {
        curSelYear: curSelYear,
        curSelMon: curSelMon,
        defMode: defMode,
        //初始只查询当前用户的userId
        userId: localStorage.getItem('userId'),
        curSelMemId: this.state.curSelMemId,
      },
      callback: () => {
        const {
          dateProjectList: { data },
        } = this.props;

        this.setState({
          dateProjectList: {
            data: {
              dateProjectList: data.dateProjectList,
              dateProjectListByDay: data.dateProjectListByDay,
              monthProjectList: data.monthProjectList,
              monthProjectListByMon: data.monthProjectListByMon,
              result: data.result,
              resMsg: data.resMsg,
              memberList: data.memberList,
              dateTypeList: data.dateTypeList,
              dateTypeMappingList: data.dateTypeMappingList,
            },
          },
        });
      },
    });
  }

  handleSearch = (memberId: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dateProjectList/fetch',
      payload: {
        curSelYear: curSelYear,
        curSelMon: curSelMon,
        defMode: defMode,
        //初始只查询当前用户的userId
        userId: localStorage.getItem('userId'),
        curSelMemId: memberId,
      },
      callback: () => {
        const {
          dateProjectList: { data },
        } = this.props;

        this.setState({
          dateProjectList: {
            data: {
              dateProjectList: data.dateProjectList,
              dateProjectListByDay: data.dateProjectListByDay,
              monthProjectList: data.monthProjectList,
              monthProjectListByMon: data.monthProjectListByMon,
              result: data.result,
              resMsg: data.resMsg,
              memberList: data.memberList,
              dateTypeList: data.dateTypeList,
              dateTypeMappingList: data.dateTypeMappingList,
            },
          },
        });
      },
    });
  };

  handleModify = (curDateProjectList: any[], dateType: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dateProjectList/update',
      payload: {
        curDateProjectList: JSON.stringify({ curDateProjectList: curDateProjectList }),
        defMode: defMode,
        dateType: dateType,
        curSelMemId: this.state.curSelMemId,
        curSelDate: this.state.curSelDate,
      },
      callback: () => {
        const {
          dateProjectList: { data },
        } = this.props;

        this.setState({
          dateProjectList: {
            data: {
              dateProjectList: data.dateProjectList,
              dateProjectListByDay: data.dateProjectListByDay,
              monthProjectList: data.monthProjectList,
              monthProjectListByMon: data.monthProjectListByMon,
              result: data.result,
              resMsg: data.resMsg,
              memberList: data.memberList,
              dateTypeList: data.dateTypeList,
              dateTypeMappingList: data.dateTypeMappingList,
            },
          },
        });
      },
    });
  };

  handleExport = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'dateProjectList/export',
    //   payload: {
    //     year: curSelYear,
    //     month: curSelMon,
    //   },
    //   callback: () => {},
    // });

    const values = {
      year: curSelYear,
      month: curSelMon,
      userId: localStorage.getItem('userId'),
    };

    var selDate = this.state.curSelDate;

    var oReq = new XMLHttpRequest();
    oReq.open('POST', '/api/project/ExportMemberWorkingHourCalendar', true);
    oReq.responseType = 'blob';
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.onload = function(oEvent) {
      var content = oReq.response;
      var elink = document.createElement('a');
      elink.download = 'WorkingHourRecords.xls'; //xls   因为后台输入是csv'格式，用xls显示的不理想
      elink.style.display = 'none';
      var blob = new Blob([content]);
      //var blob = new Blob([content], { type: 'application/vnd.ms-excel'});//text/csv,charset=GBK
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
    };
    oReq.send(JSON.stringify(values));
  };

  //切换日/月面板触发
  handlePanelChange() {
    // debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'dateProjectList/fetch',
      payload: {
        curSelYear: curSelYear,
        curSelMon: curSelMon,
        defMode: defMode,
        //初始只查询当前用户的userId
        userId: localStorage.getItem('userId'),
        curSelMemId: this.state.curSelMemId,
      },
      callback: () => {
        const {
          dateProjectList: { data },
        } = this.props;

        this.setState({
          dateProjectList: {
            data: {
              dateProjectList: data.dateProjectList,
              dateProjectListByDay: data.dateProjectListByDay,
              monthProjectList: data.monthProjectList,
              monthProjectListByMon: data.monthProjectListByMon,
              result: data.result,
              resMsg: data.resMsg,
              memberList: data.memberList,
              dateTypeList: data.dateTypeList,
              dateTypeMappingList: data.dateTypeMappingList,
            },
          },
        });
      },
    });
  }

  handleSelDateChange(selDate: any) {
    // debugger
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'dateProjectList/fetchByDay',
    //   payload: {
    //     selDate:selDate.format("YYYY-MM-DD"),
    //     //初始只查询当前用户的userId
    //     userId: localStorage.getItem("userId")
    //    },
    //   callback: () => {
    //     const {
    //       dateProjectList: { data },
    //     } = this.props;
    //     this.setState({
    //       dateProjectList:{
    //         data:{
    //           dateProjectList: this.state.dateProjectList.data.dateProjectList,
    //           dateProjectListByDay: data.dateProjectListByDay,
    //           result:data.result,
    //           resMsg:data.resMsg,
    //         }
    //       }
    //     })
    //   },
    // });
  }

  dateCellRender = (value: any) => {
    const listData: any[] = this.getListData(value);
    debugger;
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  width: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                {item.dateInfoId == 1 ||
                item.dateInfoId == 2 ||
                item.dateInfoId == 3 ||
                item.dateInfoId == 4 ||
                item.dateInfoId == 5 ||
                item.dateInfoId == 6
                  ? item.content
                  : item.dateInfoName}
              </div>
              {/* <div style={{float:"left"}}> */}
              {/* <Badge status={item.type} text={<LinesEllipsis text={item.content} maxLine='1' ellipsis='...' trimRight basedOn='letters'/>} /> */}
              {/* </div> */}
              {/* <Icon type="message" style={{ fontSize: '16px', color: '#08c' }} theme="twoTone" /> */}
              {/* <div style={{float:"right"}}> */}
              {item.dateInfoId == 1 ||
              item.dateInfoId == 2 ||
              item.dateInfoId == 3 ||
              item.dateInfoId == 4 ||
              item.dateInfoId == 5 ||
              item.dateInfoId == 6 ? (
                <div style={{ display: 'inline-block' }}>
                  <Badge
                    count={item.workingHour + ' h'}
                    style={{ backgroundColor: '#3498db', float: 'right' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'inline-block' }}></div>
              )}

              {/* </div> */}
              {/* <div style={{float:"right"}}> */}
              {(item.dateInfoId == 1 ||
                item.dateInfoId == 2 ||
                item.dateInfoId == 3 ||
                item.dateInfoId == 4 ||
                item.dateInfoId == 5 ||
                item.dateInfoId == 6) &&
              item.overtimeHour !== 0 ? (
                <div style={{ display: 'inline-block' }}>
                  <Badge
                    count={item.overtimeHour + ' h'}
                    style={{ backgroundColor: overtimeColorMap[item.overtimeHour], float: 'right' }}
                  />
                </div>
              ) : (
                <div style={{ display: 'inline-block' }}></div>
              )}
              {/* </div> */}
            </div>
          </li>
        ))}
      </ul>
    );
    // }
  };

  getListData = (value: any) => {
    const renderDate = value.format('YYYY-MM-DD');

    let listData: any = [];

    // const srcList = this.props.dateProjectList.data.dateProjectList;

    const srcList = this.state.dateProjectList.data.dateProjectList;
    const dateTypeMappingList = this.state.dateProjectList.data.dateTypeMappingList;

    // if (typeof srcList != 'undefined') {
    //   srcList.map(d => {
    //     if (d.date == renderDate && d.workingHour != 0) {
    //       listData.push({
    //         type: d.type,
    //         content: d.projectName /*.length>8?d.projectName.substring(0,8)+"...":d.projectName*/,
    //         workingHour: d.workingHour,
    //         overtimeHour: d.overtimeHour,
    //       });
    //     }
    //   });
    // }

    if (typeof srcList != 'undefined' && typeof dateTypeMappingList != 'undefined') {
      dateTypeMappingList.map(d => {
        if (
          d.date == renderDate &&
          d.dateTypeId != 1 &&
          d.dateTypeId != 2 &&
          d.dateTypeId != 3 &&
          d.dateTypeId != 4 &&
          d.dateTypeId != 5 &&
          d.dateTypeId != 6
        ) {
          //非工作日
          listData.push({
            dateInfoId: d.dateTypeId,
            dateInfoName: d.dateTypeName,
            type: d.type,
            content: '',
            workingHour: 0,
            overtimeHour: 0,
          });
        } else if (
          d.date == renderDate &&
          (d.dateTypeId == 1 ||
            d.dateTypeId == 2 ||
            d.dateTypeId == 3 ||
            d.dateTypeId == 4 ||
            d.dateTypeId == 5 ||
            d.dateTypeId == 6)
        ) {
          //工作日
          srcList.map(s => {
            if (s.date == renderDate && (s.workingHour != 0 || s.overtimeHour != 0)) {
              listData.push({
                dateInfoId: d.dateTypeId,
                dateInfoName: d.dateTypeName,
                type: s.type,
                content:
                  s.projectName /*.length>8?d.projectName.substring(0,8)+"...":d.projectName*/,
                workingHour: s.workingHour,
                overtimeHour: s.overtimeHour,
              });
            }
          });
        }
      });
    }

    return listData || [];
  };

  handleModalVisible = (
    curSelDate?: any,
    curDateProjectList?: any,
    curDatetypeMapping?: any,
    flag?: boolean,
  ) => {
    this.setState({
      modalVisible: !!flag,
      curDatetypeMapping: curDatetypeMapping,
      curSelDate: curSelDate,
      curDateProjectList: curDateProjectList,
    });
  };

  onExportBtnClick = event => {
    this.handleExport();
  };

  onMemberSelect = (memberId: any) => {
    this.setState({
      curSelMemId: memberId,
    });
    this.handleSearch(memberId);
  };

  onSelect = (date: any) => {
    const curSelDate = date.format('YYYY-MM-DD');
    const curDateProjectList = this.state.dateProjectList.data.dateProjectListByDay[curSelDate];

    const dateTypeMappingList = this.state.dateProjectList.data.dateTypeMappingList;
    const curDatetypeMapping: DatetypeMapping = {
      date: '',
      dateTypeId: 0,
      dateTypeName: '',
      memberId: 0,
      memberName: '',
      memberNameEn: '',
    };

    dateTypeMappingList.map(d => {
      if (d.date == curSelDate) {
        curDatetypeMapping.date = d.date;
        curDatetypeMapping.dateTypeId = d.dateTypeId;
        curDatetypeMapping.dateTypeName = d.dateTypeName;
        curDatetypeMapping.memberId = d.memberId;
        curDatetypeMapping.memberName = d.memberName;
        curDatetypeMapping.memberNameEn = d.memberNameEn;
      }
    });

    // this.setState({
    //   curSelDate: curSelDate,
    //   curDateProjectList: curDateProjectList,
    //   curDatetypeMapping: curDatetypeMapping,
    // });

    if (date.format('YYYY') == curSelYear && date.format('MM') == curSelMon) {
      this.handleModalVisible(curSelDate, curDateProjectList, curDatetypeMapping, true);
    }
  };

  onChange = (date: any) => {
    const selDate: moment.Moment = date;
    curSelYear = selDate.format('YYYY');
    curSelMon = selDate.format('MM');
  };

  onPanelChange = (date: any, mode: any) => {
    const selDate: moment.Moment = date;
    curSelYear = selDate.format('YYYY');
    curSelMon = selDate.format('MM');
    defMode = mode;

    this.handlePanelChange();
  };

  getMonthData = (value: any) => {
    // if (value.month() === 8) {
    //   return 1394;
    // }
    const renderDate = value.format('YYYY-MM');

    let listData: any = [];
    const srcList = this.state.dateProjectList.data.monthProjectListByMon;
    // debugger
    if (typeof srcList != 'undefined') {
      srcList.map(d => {
        if (d.Month == renderDate && d.workingHour != 0) {
          listData.push({
            content: d.projectName,
            workingHour: d.workingHour,
            overtimeHour: d.overtimeHour,
          });
        }
      });
    }
    return listData || [];
  };

  monthCellRender = (value: any) => {
    const listData: any[] = this.getMonthData(value);
    // return num ? (
    //   <div className="notes-month">
    //     <section>{num}</section>
    //     <span>Backlog number</span>
    //   </div>
    // ) : null;
    return (
      <ul className="events">
        {listData.map(item => (
          <li key={item.content}>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  width: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                {item.content}
              </div>
              {/* <div style={{float:"left"}}> */}
              {/* <Badge status={item.type} text={<LinesEllipsis text={item.content} maxLine='1' ellipsis='...' trimRight basedOn='letters'/>} /> */}
              {/* </div> */}
              {/* <Icon type="message" style={{ fontSize: '16px', color: '#08c' }} theme="twoTone" /> */}
              {/* <div style={{float:"right"}}> */}
              <div style={{ float: 'right', marginRight: '10%' }}>
                <div style={{ display: 'inline-block' }}>
                  <Badge
                    count={item.workingHour + ' h'}
                    style={{ backgroundColor: '#3498db', float: 'right' }}
                  />
                </div>

                {/* </div> */}
                {/* <div style={{float:"right"}}> */}
                {item.overtimeHour !== 0 ? (
                  <div style={{ display: 'inline-block' }}>
                    <Badge
                      count={item.overtimeHour + ' h'}
                      style={{
                        backgroundColor: overtimeColorMap[item.overtimeHour],
                        float: 'right',
                        opacity: '1',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'inline-block' }}></div>
                )}
              </div>
              {/* </div> */}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const {
      modalVisible,
      dateProjectList,
      curSelDate,
      curDateProjectList,
      curDatetypeMapping,
    } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleModify: this.handleModify,
    };

    const options =
      typeof dateProjectList.data.memberList != 'undefined'
        ? dateProjectList.data.memberList.map(d => <Option key={d.value}>{d.text}</Option>)
        : '';
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={24}>
              <Select
                notFoundContent={'No Data'}
                style={{ width: '100%' }}
                defaultValue={localStorage.getItem('userId') + ''}
                onSelect={this.onMemberSelect}
              >
                {options}
              </Select>
            </Col>
            {/* <Col md={5} sm={24}></Col> */}
            <Col md={8} sm={24}>
              <Button icon="export" onClick={this.onExportBtnClick}>
                Export
              </Button>
            </Col>
          </Row>
        </Card>
        <Card bordered={false} style={{ marginBottom: '20px' }}>
          <Calendar
            //validRange = {[moment().startOf('month'),moment().endOf('month')]}
            dateCellRender={this.dateCellRender}
            monthCellRender={this.monthCellRender}
            onChange={this.onChange}
            onPanelChange={this.onPanelChange}
            onSelect={this.onSelect}
          />
        </Card>
        {curDatetypeMapping && Object.keys(curDatetypeMapping).length ? (
          <UpdateForm
            {...parentMethods}
            modalVisible={modalVisible}
            curDateProjectList={curDateProjectList}
            curDatetypeMapping={curDatetypeMapping}
            curSelDate={curSelDate}
            dateTypeList={this.state.dateProjectList.data.dateTypeList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<WHListProps>()(WHList);
