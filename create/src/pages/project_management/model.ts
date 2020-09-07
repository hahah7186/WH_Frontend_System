import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { ListItemData } from './data.d';
import {
  queryProjectList,
  updateProject,
  removeProject,
  completeProject,
  createProject,
} from './service';

export interface StateType {
  data: ListItemData;
  // member:MemberSearch;
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
    // fetchMember: Effect;
    update: Effect;
    remove: Effect;
    complete: Effect;
    create: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    //queryMember: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'searchListApplications',

  state: {
    data: {
      list: [],
      pagination: {},
      result: -1,
      resultMessage: '',
      apcList: [],
      bdList: [],
      pssList: [],
      salesList: [],
      customerList: [],
      accountList: [],
      fiscalList: [],
      supportTypeList: [],
      projectRunStatusList: [],
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryProjectList, payload);
      yield put({
        type: 'queryList',
        //payload: Array.isArray(response) ? response : [],
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProject, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      if (callback) callback();
    },
    *create({ payload, callback }, { call, put }) {
      debugger;
      const response = yield call(createProject, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeProject, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      if (callback) callback();
    },
    *complete({ payload, callback }, { call, put }) {
      const response = yield call(completeProject, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
        // member: action.payload,
      };
    },
    // queryMember(state, action) {
    //   return {
    //     ...state,
    //     data: action.payload,
    //     member: action.payload,
    //   };
    // },
  },
};

export default Model;
