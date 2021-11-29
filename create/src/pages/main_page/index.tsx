import { Col, Dropdown, Icon, Menu, Row } from 'antd';
import React, { Component, Suspense } from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { RadioChangeEvent } from 'antd/es/radio';
import { RangePickerValue } from 'antd/es/date-picker/interface';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
// import { getTimeDistance } from './utils/utils';
import { AnalysisData } from './data.d';
import styles from './style.less';
// import { StateType } from './model';
import moment from 'moment';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const ProportionSupport = React.lazy(() => import('./components/ProportionSupport'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

interface analysisProps {
  analysis: AnalysisData;
  dispatch: Dispatch<any>;
  loading: boolean;
  // searchListApplications: StateType;
}

interface analysisState {
  analysis: AnalysisData;
  salesType: 'branchCustomerNumber' | 'branchProjectNumber' | 'branchProjectCostNumber';
  supportType: 'supportProjectNumber' | 'supportProjectCostNumber';
  currentTabKey: string;
  rangePickerValue: RangePickerValue;
  searchInterval: string;
}

@connect(
  ({
    analysis,
    loading,
  }: {
    analysis: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    analysis,
    loading: loading.effects['analysis/fetch'],
  }),
)
class Analysis extends Component<analysisProps, analysisState> {
  state: analysisState = {
    analysis: {
      totalWorkingHour: {
        totalHour: 0,
        normalHour: 0,
        overtimeHour: 0,
        totalMoney: 0,
      },
      projectFiscalYear: {
        projectNumber: 0,
        totalProjectNumber: 0,
      },
      // teamInfo:{
      //   apcNumber:0,
      //   bdNumber:0,
      //   pssNumber:0,
      //   salesNumber:0,
      //   ratio:0
      // },
      customerInfo: {
        customerNumber: 0,
        customerNumberForSupport: 0,
      },
      totalWorkingHourFiscalYear: {
        totalWorkingHourFiscalYear: 0,
        totalFiscalYearVolume: 0,
      },
      branchProjectNumber: [],
      branchProjectCostNumber: [],
      branchCustomerNumber: [],
      supportProjectNumber: [],
      supportProjectCostNumber: [],
      rankingListData: [],
      rankingListVolume: [],
      visitData: [],
      visitData2: [],
      salesData: [],
      salesVolume: [],
      searchData: [],
      offlineData: [],
      offlineChartData: [],
      salesTypeData: [],
      salesTypeDataOnline: [],
      salesTypeDataOffline: [],
      radarData: [],
    },
    salesType: 'branchCustomerNumber',
    supportType: 'supportProjectNumber',
    currentTabKey: '1',
    rangePickerValue: this.getTimeDistance('year'),
    searchInterval: 'month',
  };

  reqRef: number = 0;

  timeoutId: number = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'analysis/fetch',
        callback: () => {
          const analysis = this.props.analysis;
          this.setState({
            analysis: {
              totalWorkingHour: analysis.totalWorkingHour,
              projectFiscalYear: analysis.projectFiscalYear,
              // teamInfo: analysis.teamInfo,
              customerInfo: analysis.customerInfo,
              branchProjectNumber: analysis.branchCustomerNumber,
              branchProjectCostNumber: analysis.branchProjectCostNumber,
              branchCustomerNumber: analysis.branchCustomerNumber,
              supportProjectNumber: analysis.supportProjectNumber,
              supportProjectCostNumber: analysis.supportProjectCostNumber,
              rankingListData: analysis.rankingListData,
              rankingListVolume: analysis.rankingListVolume,
              visitData: analysis.visitData,
              totalWorkingHourFiscalYear: analysis.totalWorkingHourFiscalYear,
              visitData2: [],
              salesData: [],
              salesVolume: [],
              searchData: [],
              offlineData: analysis.offlineData,
              offlineChartData: analysis.offlineChartData,
              salesTypeData: [],
              salesTypeDataOnline: [],
              salesTypeDataOffline: [],
              radarData: [],
            },
          });
        },
      });
    });
    // debugger
    // this.handleTabChange(this.state.currentTabKey)
    this.selectDate('year');
  }

  componentWillUnmount() {
    // debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = (e: RadioChangeEvent) => {
    this.setState({
      salesType: e.target.value,
    });
  };
  handleChangeSupportType = (e: RadioChangeEvent) => {
    this.setState({
      supportType: e.target.value,
    });
  };
  handleSwitchView = (checked: boolean) => {
    //月-true,日-false
    if (checked) {
      this.setState({
        searchInterval: 'month',
      });
    } else {
      this.setState({
        searchInterval: 'day',
      });
    }
  };

  handleTabChange = (key: string) => {
    this.setState({
      currentTabKey: key,
    });

    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'analysis/fetchTableData',
        payload: {
          customerId: key,
        },
        callback: () => {
          // const analysis = this.props.analysis;
          // // this.setState({
          // //   analysis:{
          // //     searchData: [],
          // //   }
          // // });
        },
      });
    });
  };

  handleRangePickerChange = (rangePickerValue: RangePickerValue) => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'analysis/fetchSalesData',
      payload: {
        type: 'custom',
        startTime: rangePickerValue[0],
        endTime: rangePickerValue[1],
        searchInterval: this.state.searchInterval,
      },
    });

    dispatch({
      type: 'analysis/fetchWithDate',
      payload: {
        startTime: rangePickerValue[0],
        endTime: rangePickerValue[1],
      },
      callback: () => {
        const analysis = this.props.analysis;
        this.setState({
          analysis: {
            totalWorkingHour: analysis.totalWorkingHour,
            projectFiscalYear: analysis.projectFiscalYear,
            // teamInfo: analysis.teamInfo,
            customerInfo: analysis.customerInfo,
            branchProjectNumber: analysis.branchCustomerNumber,
            branchProjectCostNumber: analysis.branchProjectCostNumber,
            branchCustomerNumber: analysis.branchCustomerNumber,
            supportProjectNumber: analysis.supportProjectNumber,
            supportProjectCostNumber: analysis.supportProjectCostNumber,
            rankingListData: analysis.rankingListData,
            rankingListVolume: analysis.rankingListVolume,
            visitData: analysis.visitData,
            totalWorkingHourFiscalYear: analysis.totalWorkingHourFiscalYear,
            visitData2: [],
            salesData: [],
            salesVolume: [],
            searchData: [],
            offlineData: analysis.offlineData,
            offlineChartData: analysis.offlineChartData,
            salesTypeData: [],
            salesTypeDataOnline: [],
            salesTypeDataOffline: [],
            radarData: [],
          },
        });
      },
    });
  };

  selectDate = (type: 'today' | 'week' | 'month' | 'year') => {
    const { dispatch } = this.props;
    const dateArr = this.getTimeDistance(type);

    this.setState({
      rangePickerValue: this.getTimeDistance(type),
    });

    dispatch({
      type: 'analysis/fetchSalesData',
      payload: {
        type: type,
        startTime: dateArr[0],
        endTime: dateArr[1],
      },
      callback: () => {
        // console.log(this.props);
        // const {
        //   searchListApplications: { analysis },
        // } = this.props;
        // const analysis = this.props.analysis;
        // this.setState({
        //   analysis:{
        //     totalWorkingHour: analysis.totalWorkingHour,
        //     branchProjectNumber: analysis.branchCustomerNumber,
        //     branchProjectCostNumber: analysis.branchProjectCostNumber,
        //     branchCustomerNumber: analysis.branchCustomerNumber,
        //     visitData: [],
        //     visitData2: [],
        //     salesData: [],
        //     searchData: [],
        //     offlineData: [],
        //     offlineChartData: [],
        //     salesTypeData: [],
        //     salesTypeDataOnline: [],
        //     salesTypeDataOffline: [],
        //     radarData: [],
        //   }
        // });
      },
    });
  };

  getTimeDistance(type: 'today' | 'week' | 'month' | 'year'): RangePickerValue {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
      let day = now.getDay();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);

      if (day === 0) {
        day = 6;
      } else {
        day -= 1;
      }

      const beginTime = now.getTime() - day * oneDay;

      return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }
    const year = now.getFullYear();

    if (type === 'month') {
      const month = now.getMonth();
      const nextDate = moment(now).add(1, 'months');
      const nextYear = nextDate.year();
      const nextMonth = nextDate.month();

      return [
        moment(`${year}-${(month + 1) * 1 < 10 ? `0${month + 1}` : month + 1}-01 00:00:00`),
        moment(
          moment(
            `${nextYear}-${
              (nextMonth + 1) * 1 < 10 ? `0${nextMonth + 1}` : nextMonth + 1
            }-01 00:00:00`,
          ).valueOf() - 1000,
        ),
      ];
    }

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }

  isActive = (type: 'today' | 'week' | 'month' | 'year') => {
    const { rangePickerValue } = this.state;
    const value = this.getTimeDistance(type);
    // if (!rangePickerValue[0] || !rangePickerValue[1]) {
    //   return '';
    // }
    // if (
    //   rangePickerValue[0].isSame(value[0], 'day') &&
    //   rangePickerValue[1].isSame(value[1], 'day')
    // ) {
    //   return styles.currentDate;
    // }
    return '';
  };

  render() {
    const { rangePickerValue, salesType, supportType, currentTabKey } = this.state;
    const { analysis, loading } = this.props;
    const {
      branchCustomerNumber,
      branchProjectNumber,
      branchProjectCostNumber,
      supportProjectNumber,
      supportProjectCostNumber,
      visitData,
      visitData2,
      salesData,
      salesVolume,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeDataOffline,
    } = analysis;

    let salesPieData;
    let supportPieData;

    if (salesType === 'branchCustomerNumber') {
      salesPieData = branchCustomerNumber;
    } else {
      salesPieData =
        salesType === 'branchProjectNumber' ? branchProjectNumber : branchProjectCostNumber;
    }

    if (supportType === 'supportProjectNumber') {
      supportPieData = supportProjectNumber;
    } else {
      supportPieData = supportProjectCostNumber;
    }

    // const searchData = offlineChartData.find(item=> item.id='1').searchData

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].id);

    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow
              loading={loading}
              visitData={visitData} /*teamInfo={this.state.analysis.teamInfo}*/
              customerInfo={this.state.analysis.customerInfo}
              projectFiscalYear={this.state.analysis.projectFiscalYear}
              totalWorkingHour={this.state.analysis.totalWorkingHour}
              totalWorkingHourFiscalYear={this.state.analysis.totalWorkingHourFiscalYear}
            />
          </Suspense>
          <Suspense fallback={null}>
            <SalesCard
              rangePickerValue={rangePickerValue}
              salesData={salesData}
              salesVolume={salesVolume}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              handleSwitchView={this.handleSwitchView}
              loading={loading}
              selectDate={this.selectDate}
              rankingListData={this.state.analysis.rankingListData}
              rankingListVolume={this.state.analysis.rankingListVolume}
            />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
              minHeight: '60vh',
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                {/* <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                /> */}
                <ProportionSupport
                  dropdownGroup={dropdownGroup}
                  supportType={supportType}
                  loading={loading}
                  supportPieData={supportPieData}
                  handleChangeSupportType={this.handleChangeSupportType}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              searchData={searchData}
              // offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
