import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addMember, queryMember, removeMember, updateMember } from './service';

import { MemberTableListData } from './data.d';

export interface StateType {
  data: MemberTableListData;
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
  namespace: 'memTableList',
  state: {
    data: {
      list: [],
      pagination: {},
      result: -1,
      // fiscalYearList:[],
      // accountNameList:[],
      groupList:[],
      roleList:[],
      postList:[],
    },
  },
//处理异步操作
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(queryMember, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMember, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeMember, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMember, payload);
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
