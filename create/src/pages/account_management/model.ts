import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addAccount, queryAccount, removeAccount, updateAccount } from './service';

import { AccountTableListData } from './data.d';

export interface StateType {
  data: AccountTableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'actTableList',
  state: {
    data: {
      list: [],
      pagination: {},
      result: -1,
      resultMessage: '',
      fiscalYearList: [],
      accountNameList: [],
      accountTypeList: [],
      apcList: [],
      bdList: [],
      pssList: [],
      salesList: [],
    },
  },
  //处理异步操作
  effects: {
    *fetch({ payload, callback }, { call, put }) {
      debugger;
      const response = yield call(queryAccount, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addAccount, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeAccount, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateAccount, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  //处理同步操作
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
