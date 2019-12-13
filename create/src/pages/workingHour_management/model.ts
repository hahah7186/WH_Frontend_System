import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addProjectDateMapping, queryProjectDateMapping, removeProjectDateMapping, updateProjectDateMapping,queryMember } from './service';

import { WHListData,MemberSearch } from './data.d';


export interface WHStateType {
  data: WHListData;
  member:MemberSearch;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: WHStateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: WHStateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    fetchMember: Effect;
  };
  reducers: {
    save: Reducer<WHStateType>;
    //saveMember: Reducer<MemberSearch>;
  };
}

const Model: ModelType = {
  namespace: 'listTableList',

  state: {
    data: {
      list: [],
      pagination: {},
      result:-1,
      columns:[],
      comments:[],
    },
    member:{
      list:[],
      count:-1,
    },
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      // debugger
      const response = yield call(queryProjectDateMapping, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *fetchMember({ payload,callback }, { call, put }) {
       
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
      // debugger
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
      return {
        ...state,
        data: action.payload,
        member: action.payload,
        
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
