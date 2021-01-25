import {
  Avatar,
  Icon,
  Menu,
  Spin,
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  message,
} from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser, StateType } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { Dispatch } from 'redux';

export interface GlobalHeaderRightProps extends ConnectProps {
  dispatch: Dispatch<any>;
  currentUser?: CurrentUser;
  menu?: boolean;
  changeResult: StateType;
}

export interface ListState {
  modalVisible: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  state: ListState = {
    modalVisible: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    } else if (key === 'changePassword') {
      this.setState({
        modalVisible: true,
      });
      return;
    }
    router.push(`/account/${key}`);
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  checkPassword = () => {
    if (this.state.newPassword != this.state.confirmPassword) {
      message.error(
        'Can not submit. Because the new password and confirm password are not the same.',
      );
      return;
    }
  };

  submitPassword = () => {
    const { dispatch } = this.props;

    this.checkPassword();

    dispatch({
      type: 'user/changePassword',
      payload: {
        user_id: localStorage.getItem('userId'),
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword,
        confirm_password: this.state.confirmPassword,
      },
      callback: () => {
        // const {
        //   changeResult: { result },
        // } = this.props;

        // if(result == 0){
        message.success('Your password has been modified successfully!');
        // }else{
        //   message.error("Failed! Please check your confirm password!");
        // }
      },
    });
  };

  onOriginalPasswordChange = e => {
    this.setState({
      oldPassword: e.target.value,
    });
  };

  onNewPasswordChange = e => {
    this.setState({
      newPassword: e.target.value,
    });
  };

  onConfirmPasswordChange = e => {
    this.setState({
      confirmPassword: e.target.value,
    });
  };

  render(): React.ReactNode {
    const { currentUser = {}, menu } = this.props;
    // if (!menu) {
    //   return (
    //     <span className={`${styles.action} ${styles.account}`}>
    //       <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
    //       <span className={styles.name}>{currentUser.name}</span>
    //     </span>
    //   );
    // }
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="changePassword">
          <SettingOutlined />
          修改密码
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );

    const cancelHandle = () => {
      this.handleModalVisible(false);
    };

    const okHandle = () => {
      this.submitPassword();
      this.handleModalVisible(false);
    };

    return currentUser && currentUser.name ? (
      <div>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
            <span className={styles.name}>{currentUser.name}</span>
          </span>
        </HeaderDropdown>
        ,
        <Modal
          width={400}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title={''}
          visible={this.state.modalVisible}
          onOk={okHandle}
          keyboard={true}
          onCancel={cancelHandle}
          // afterClose={() => handleCreateModalVisible()}
          centered={true}
        >
          <Row gutter={[8, 24]}>
            <Col span={24}>
              <span style={{ marginBottom: '10px' }}>Please input the original password:</span>
              <Input.Password
                style={{ marginTop: '10px' }}
                placeholder="input original password"
                onChange={value => {
                  this.onOriginalPasswordChange(value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={[8, 24]}>
            <Col span={24}>
              <span style={{ marginBottom: '10px' }}>Please input the new password:</span>
              <Input.Password
                style={{ marginTop: '10px' }}
                placeholder="input new password"
                onChange={value => {
                  this.onNewPasswordChange(value);
                }}
              />
            </Col>
          </Row>
          <Row gutter={[8, 24]}>
            <Col span={24}>
              <span style={{ marginBottom: '10px' }}>Please confirm the new password:</span>
              <Input.Password
                style={{ marginTop: '10px' }}
                placeholder="confirm new password"
                onChange={value => {
                  this.onConfirmPasswordChange(value);
                }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
