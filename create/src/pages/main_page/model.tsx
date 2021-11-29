import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AnalysisData } from './data.d';
import {
  fakeChartData,
  queryChartData,
  queryLineChartData,
  queryTableData,
  queryChartDataWithDate,
} from './service';

// export interface StateType {
//   data: AnalysisData;
// }

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AnalysisData) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: AnalysisData;
  effects: {
    fetch: Effect;
    fetchWithDate: Effect;
    fetchSalesData: Effect;
    fetchTableData: Effect;
  };
  reducers: {
    save: Reducer<AnalysisData>;
    clear: Reducer<AnalysisData>;
  };
}

const initState = {
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
  teamInfo: {
    apcNumber: 0,
    bdNumber: 0,
    pssNumber: 0,
    salesNumber: 0,
    ratio: 0,
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
};

const Model: ModelType = {
  namespace: 'analysis',

  state: initState,

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryChartData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchWithDate({ payload, callback }, { call, put }) {
      const response = yield call(queryChartDataWithDate, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchSalesData({ payload, callback }, { call, put }) {
      const response = yield call(queryLineChartData, payload);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
          salesVolume: response.salesVolume,
        },
      });
      if (callback) callback();
    },
    *fetchTableData({ payload, callback }, { call, put }) {
      const response = yield call(queryTableData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return initState;
    },
  },
};

export default Model;
