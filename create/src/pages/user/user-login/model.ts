import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { accountLogin /*, getFakeCaptcha*/ } from './service';
import { getPageQuery, setAuthority } from './utils/utils';
// import router from 'umi/router';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    //getCaptcha: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();

        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/project_management'));

        //首先清除本地内存
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser_branchId');
        localStorage.removeItem('currentUser_branchName');
        localStorage.removeItem('currentUser_email');
        localStorage.removeItem('currentUser_gId');
        localStorage.removeItem('currentUser_groupId');
        localStorage.removeItem('currentUser_groupName');
        localStorage.removeItem('currentUser_mobile');
        localStorage.removeItem('currentUser_name');
        localStorage.removeItem('currentUser_nameEn');
        localStorage.removeItem('currentUser_roleId');
        localStorage.removeItem('currentUser_roleName');
        localStorage.removeItem('currentUser_avatar');
        localStorage.removeItem('currentUser_postId');
        localStorage.removeItem('currentUser_postName');
        //查询得当前用户信息，存入内存
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('currentUser_branchId', response.user.branch.value);
        localStorage.setItem('currentUser_branchName', response.user.branch.text);
        localStorage.setItem('currentUser_email', response.user.email);
        localStorage.setItem('currentUser_gId', response.user.gId);
        localStorage.setItem('currentUser_groupId', response.user.group.value);
        localStorage.setItem('currentUser_groupName', response.user.group.text);
        localStorage.setItem('currentUser_mobile', response.user.mobile);
        localStorage.setItem('currentUser_name', response.user.name);
        localStorage.setItem('currentUser_nameEn', response.user.name_en);
        localStorage.setItem('currentUser_roleId', response.user.role.value);
        localStorage.setItem('currentUser_roleName', response.user.role.text);
        localStorage.setItem('currentUser_avatar', response.user.avatar);
        localStorage.setItem('currentUser_postId', response.user.post.value);
        localStorage.setItem('currentUser_postName', response.user.post.text);
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
