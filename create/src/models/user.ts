import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  id?:number;
  name?: string;
  name_en?: string;
  email?:string;
  gId?:string;
  group?: userGroup;
  role?:userRole;
  branch?:userBranch;
  mobile?:string;
}

export interface userGroup{
    text:string;
    value:number;
}
export interface userRole{
  text:string;
  value:number;
}
export interface userBranch{
  text:string;
  value:number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent({payload}, { call, put }) {
      const response = yield call(queryCurrent,payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      debugger
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          //notifyCount: action.payload.totalCount,
          //unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
