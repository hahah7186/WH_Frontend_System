import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addCustomer, queryCustomer, removeCustomer, updateCustomer } from './service';

import { TableListData } from './data.d';

export interface StateType {
  data: TableListData;
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
  namespace: 'tableList',

  state: {
    data: {
      list: [],
      pagination: {},
      result: -100,
    },
  },
//处理异步操作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateCustomer, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
//处理同步操作
  reducers: {
    save(state, action) {debugger
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
