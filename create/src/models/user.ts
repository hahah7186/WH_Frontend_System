import { Effect } from 'dva';
import { Reducer } from 'redux';

import { changePassword, queryCurrent, query as queryUsers } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  id?: number;
  name?: string;
  name_en?: string;
  email?: string;
  gId?: string;
  group?: userGroup;
  role?: userRole;
  branch?: userBranch;
  mobile?: string;
  result?: number;
}

export interface userGroup {
  text: string;
  value: number;
}
export interface userRole {
  text: string;
  value: number;
}
export interface userBranch {
  text: string;
  value: number;
}

export interface StateType {
  result: number;
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
    changePassword: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    modifyPassword: Reducer<StateType>;
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
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *changePassword({ payload, callback }, { call, put }) {
      const response = yield call(changePassword, payload);
      yield put({
        type: 'modifyPassword',
        payload: response,
      });
      if (callback) callback();
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
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          //notifyCount: action.payload.totalCount,
          //unreadCount: action.payload.unreadCount,
        },
      };
    },
    modifyPassword(state, action) {
      return {
        ...state,
        result: action.payload,
      };
    },
  },
};

export default UserModel;
