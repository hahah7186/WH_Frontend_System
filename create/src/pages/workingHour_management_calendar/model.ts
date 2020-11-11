import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  addProjectDateMapping,
  queryProjectDateCalMapping,
  removeProjectDateMapping,
  updateProjectDateMapping,
  queryMember,
  // queryProjectDateCalMappingByDay,
  exportProjectDateCalMapping,
} from './service';

import { WHListData, MemberSearch } from './data.d';

export interface WHStateType {
  data: WHListData;
  //member:MemberSearch;
}

// export interface WHModelStateType {
//   data: WHListDataByDay;
//   //member:MemberSearch;
// }

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: WHStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: WHStateType;
  effects: {
    fetch: Effect;
    // fetchByDay: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    fetchMember: Effect;
    export: Effect;
  };
  reducers: {
    save: Reducer<WHStateType>;
    //saveMember: Reducer<MemberSearch>;
  };
}

const Model: ModelType = {
  namespace: 'dateProjectList',

  state: {
    data: {
      dateProjectListByDay: {},
      dateProjectList: [],
      monthProjectList: [],
      monthProjectListByMon: {},
      result: -1,
      resMsg: '',
      memberList: [],
      dateTypeList: [],
      dateTypeMappingList: [],
    },
    // member:{
    //   list:[],
    //   count:-1,
    // },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      // debugger
      const response = yield call(queryProjectDateCalMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *export({ payload, callback }, { call, put }) {
      // debugger
      const response = yield call(exportProjectDateCalMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    // *fetchByDay({ payload, callback }, { call, put }) {
    //   // debugger
    //   const response = yield call(queryProjectDateCalMappingByDay, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    *fetchMember({ payload, callback }, { call, put }) {
      const response = yield call(queryMember, payload);

      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      // debugger
      const response = yield call(addProjectDateMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      // debugger
      const response = yield call(removeProjectDateMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProjectDateMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      // debugger
      return {
        ...state,
        data: action.payload,
        // member: action.payload,
      };
    },
    // saveMember(state, action){
    //   return {
    //     ...state,
    //     data: action.payload,
    //   };
    // },
  },
};

export default Model;
