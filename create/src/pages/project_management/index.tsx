import {
  Avatar,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  List,
  Menu,
  Row,
  Select,
  Tooltip,
  Button,
  Input,
  Pagination,
  DatePicker,
  message,
  Popconfirm,
  Switch,
  Divider /*Tag,*/,
} from 'antd';
import React, { Component, Fragment } from 'react';
// import moment from "moment";
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
//import numeral from 'numeral';
import { StateType } from './model';
import {
  ListItemData,
  ListItemDataType,
  /*MemberSelect,*/ CustomerSelect,
  /*, ListItemParams*/ ListPagination,
  FiscalYearItem,
  Member,
  AccountExportItem,
  supportType,
  projectRunStatus,
} from './data.d';
//import StandardFormRow from './components/StandardFormRow';
//import TagSelect from './components/TagSelect';
import styles from './style.less';
//import ProportionSales from '../main_page/components/ProportionSales';
import { /*UpdateForm,*/ FormValsType } from './components/UpdateForm/UpdateForm';
import ModifyForm from './components/ModifyForm/ModifyForm';
import CreateForm from './components/CreateForm/CreateForm';
import moment from 'moment';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

// 2020/07/13 huzhonghao
// export interface StateType {
//   data: ListItemData;
// }

// interface ListItemDataState {
//   formValues: { [key: string]: string };
// }

const { Option } = Select;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

// let apcList : MemberSelect[] = [];
export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          h
        </span>
      </span>
    );
  }
  return result;
}

interface ListState {
  updateModalVisible: boolean;
  modifyModalVisible: boolean;
  createModalVisible: boolean;

  tableListVisible: boolean;
  cardListVisible: boolean;

  expandForm: boolean;
  //formValues: { [key: string]: string };
  stepFormValues: Partial<ListItemDataType>;
  apcList: Member[];
  bdList: Member[];
  pssList: Member[];
  salesList: Member[];
  accountList: AccountExportItem[];
  fiscalList: FiscalYearItem[];
  customerList: CustomerSelect[];
  supportTypeList: supportType[];
  projectRunStatusList: projectRunStatus[];
  pagination: ListPagination;
}

interface SearchListApplicationsProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  searchListApplications: StateType;
  loading: boolean;
  //memberSearch:MemberSearch;
}

class SearchListApplications extends Component<SearchListApplicationsProps> {
  state: ListState = {
    modifyModalVisible: false,
    updateModalVisible: false,
    createModalVisible: false,

    tableListVisible: false,
    cardListVisible: true,

    expandForm: false,
    //formValues: {},f
    stepFormValues: {},
    apcList: [],
    bdList: [],
    pssList: [],
    salesList: [],
    customerList: [],
    accountList: [],
    fiscalList: [],
    supportTypeList: [],
    projectRunStatusList: [],
    //初始化分页
    pagination: {
      total: 1,
      pageSize: 10,
      current: 1,
    },
  };

  columns: StandardTableColumnProps[] = [
    {
      title: <FormattedMessage id="project.ColumnProjectCode" />,
      dataIndex: 'project_code',
    },
    {
      title: <FormattedMessage id="project.ColumnProjectName" />,
      dataIndex: 'project_name',
    },
    {
      title: <FormattedMessage id="project.ColumnCustomerName" />,
      dataIndex: 'customer_name',
    },
    {
      title: <FormattedMessage id="project.ColumnEngineers" />,
      dataIndex: 'engineers',
    },
    {
      title: 'BD',
      dataIndex: 'bd',
    },
    // {
    //   title: <FormattedMessage id="project.ColumnPss" />,
    //   dataIndex: 'pss',
    // },
    // {
    //   title: <FormattedMessage id="project.ColumnSales" />,
    //   dataIndex: 'sales',
    // },
    {
      title: <FormattedMessage id="project.ColumnPlanWorkingHours" />,
      dataIndex: 'plan_working_hours',
    },
    {
      title: <FormattedMessage id="project.ColumnActualWorkingHours" />,
      dataIndex: 'actual_running_time',
    },
    {
      title: <FormattedMessage id="project.ColumnOvertimeWorkingHours" />,
      dataIndex: 'overtime_running_time',
    },
    {
      title: <FormattedMessage id="project.ColumnSupportType" />,
      dataIndex: 'support_type_name',
    },
    // {
    //   title: <FormattedMessage id="project.ColumnSalesVolume" />,
    //   dataIndex: 'sales_order_volume',
    // },
    // {
    //   title: <FormattedMessage id="project.ColumnStartTime" />,
    //   dataIndex: 'str_start_time',
    // },
    // {
    //   title: <FormattedMessage id="project.ColumnEndTime" />,
    //   dataIndex: 'str_end_time',
    // },
    {
      title: <FormattedMessage id="project.ColumnUpdateTime" />,
      dataIndex: 'str_update_time',
    },
    {
      title: <FormattedMessage id="project.ColumnProjectStatus" />,
      dataIndex: 'run_status_name',
    },
    {
      title: <FormattedMessage id="project.ColumnOperation" />,
      render: (text, record) => (
        <Fragment>
          {parseInt(localStorage.getItem('currentUser_roleId') || '1') >= 3 ? (
            <div>
              <a onClick={() => this.handleModifyModalVisible(true, record)}>
                <FormattedMessage id="project.ColumnOperation.Modify" />
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title={formatMessage({ id: 'project.CardPopconfirm.Complete.Title' })}
                onConfirm={() => this.handleChangeStatus(record.id, 4, record.status_id)}
                onCancel={this.completeCancel}
                okText={formatMessage({ id: 'project.CardPopconfirm.Complete.OkText' })}
                cancelText={formatMessage({ id: 'project.CardPopconfirm.Complete.CancelText' })}
              >
                <a>
                  <FormattedMessage id="project.ColumnOperation.Complete" />
                </a>
              </Popconfirm>
              <Divider type="vertical" />

              <Dropdown key="ellipsis" overlay={this.listMenu(record)} trigger={['click']}>
                <Icon type="ellipsis" />
              </Dropdown>
            </div>
          ) : (
            <div>
              <a onClick={() => this.handleModifyModalVisible(true, record)}>View</a>
            </div>
          )}
        </Fragment>
      ),
    },
    {
      title: 'Operation Status',
      dataIndex: 'status_name',
    },
  ];
  //list view 的每行下来菜单
  listMenu = item => (
    <Menu /*onClick={onClickDropdownMenu.bind(this,item)}*/>
      <Menu.Item>
        <Popconfirm
          title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.Title' })}
          onConfirm={() => this.handleChangeStatus(item.id, 3, item.status_id)}
          onCancel={this.removeCancel}
          okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.OkText' })}
          cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.CancelText' })}
        >
          <a target="_blank" rel="noopener noreferrer">
            <FormattedMessage id="project.DropDownMenu.ApprovedText" />
          </a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.Title' })}
          onConfirm={() => this.handleChangeStatus(item.id, 1, item.status_id)}
          onCancel={this.removeCancel}
          okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.OkText' })}
          cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.CancelText' })}
        >
          <a target="_blank" rel="noopener noreferrer">
            <FormattedMessage id="project.DropDownMenu.AbandonedText" />
          </a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.Title' })}
          onConfirm={() => this.handleChangeStatus(item.id, 5, item.status_id)}
          onCancel={this.removeCancel}
          okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.OkText' })}
          cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.CancelText' })}
        >
          <a target="_blank" rel="noopener noreferrer">
            <FormattedMessage id="project.DropDownMenu.ArchivedText" />
          </a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchListApplications/fetch',
      payload: {
        currentUser: localStorage.getItem('userId'),
        //apc: localStorage.getItem("userId"),
      },
      callback: () => {
        const {
          searchListApplications: { data },
        } = this.props;
        this.setState({
          apcList: data.apcList,
          bdList: data.bdList,
          pssList: data.pssList,
          salesList: data.salesList,
          customerList: data.customerList,
          fiscalList: data.fiscalList,
          accountList: data.accountList,
          supportTypeList: data.supportTypeList,
          projectRunStatusList: data.projectRunStatusList,
          pagination: data.pagination,
        });
      },
    });
  }

  // 回调函数,下一页
  onPageChange = (page, pageSize) => {
    const { dispatch, form } = this.props;

    this.setState({
      pagination: {
        pageSize: pageSize,
        currentPage: page,
      },
    });

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/fetch',
          payload: {
            currentPage: page,
            pageSize: pageSize,
            customer_name: form.getFieldValue('customer_name'),
            project_name: form.getFieldValue('project_name'),
            support_type: form.getFieldValue('support_type'),
            status: form.getFieldValue('status'),
            sales: form.getFieldValue('sales'),
            apc: form.getFieldValue('apc'),
            start_time_1: start_time_1,
            start_time_2: start_time_2,
            end_time_1: end_time_1,
            end_time_2: end_time_2,
            currentUser: localStorage.getItem('userId'),
          },
        });
      }
    });
  };
  // 回调函数,每页显示多少条
  onShowSizeChange = (current, size) => {
    const { dispatch, form } = this.props;

    this.setState({
      pagination: {
        pageSize: size,
        currentPage: current,
      },
    });

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/fetch',
          payload: {
            currentPage: current,
            pageSize: size,
            customer_name: form.getFieldValue('customer_name'),
            project_name: form.getFieldValue('project_name'),
            support_type: form.getFieldValue('support_type'),
            status: form.getFieldValue('status'),
            sales: form.getFieldValue('sales'),
            apc: form.getFieldValue('apc'),
            start_time_1: start_time_1,
            start_time_2: start_time_2,
            end_time_1: end_time_1,
            end_time_2: end_time_2,
            currentUser: localStorage.getItem('userId'),
          },
        });
      }
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'searchListApplications/fetch',
      payload: {
        currentUser: localStorage.getItem('userId'),
        //apc: localStorage.getItem("userId"),
      },
      callback: () => {
        const {
          searchListApplications: { data },
        } = this.props;

        this.setState({
          apcList: data.apcList,
          bdList: data.bdList,
          pssList: data.pssList,
          salesList: data.salesList,
          customerList: data.customerList,
          accountList: data.accountList,
          fiscalList: data.fiscalList,
          pagination: data.pagination,
        });
      },
    });
  };
  //更新project状态
  handleUpdateModalVisible = (flag?: boolean, item?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: item || {},
    });
  };
  //修改project信息
  handleModifyModalVisible = (flag?: boolean, record?: FormValsType) => {
    //debugger

    this.setState({
      modifyModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  //新增project信息
  handleCreateModalVisible = (flag?: boolean) => {
    this.setState({
      createModalVisible: !!flag,
    });
  };

  handleUpdate = (fields: FormValsType) => {
    message.success(formatMessage({ id: 'project.HandleUpdateTips' }));
    this.handleUpdateModalVisible();
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  completeCancel(e) {
    message.warning(formatMessage({ id: 'project.CompleteCancelTips' }));
  }

  handleChangeStatus = (projectId: number, changeStatus: number, currentStatus: number) => {
    switch (currentStatus) {
      case 1: //废弃
        message.error(formatMessage({ id: 'project.AbandonedError' }));
        return;
      case 2: //新建
        if (changeStatus == 4 || changeStatus == 5) {
          message.error(formatMessage({ id: 'project.NewCreateError' }));
          return;
        }
        break;
      case 3: //审核通过
        if (changeStatus == 1) {
          message.error(formatMessage({ id: 'project.ApprovedError.ChangeAbandoned' }));
          return;
        } else if (changeStatus == 2) {
          message.error(formatMessage({ id: 'project.ApprovedError.ChangeNewCreate' }));
          return;
        } else if (changeStatus == 5) {
          message.error(formatMessage({ id: 'project.ApprovedError.ChangeArchived' }));
          return;
        }
        break;
      case 4: //完成
        if (changeStatus == 1) {
          message.error(formatMessage({ id: 'project.CompletedError.ChangeAbandoned' }));
          return;
        } else if (changeStatus == 2) {
          message.error(formatMessage({ id: 'project.CompletedError.ChangeNewCreate' }));
          return;
        } else if (changeStatus == 3) {
          message.error(formatMessage({ id: 'project.CompletedError.ChangeApproved' }));
          return;
        } else if (changeStatus == 4) {
          message.error(formatMessage({ id: 'project.CompletedError.ChangeCompleted' }));
          return;
        }
        break;
      case 5: //归档
        message.error(formatMessage({ id: 'project.ArchivedError' }));
        return;
    }

    const { dispatch, form } = this.props;

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/complete',
          payload: {
            project_id: projectId,
            changeStatus: changeStatus,
            currentPage: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            //for search 的 form values
            fs_customer_name: form.getFieldValue('customer_name'),
            fs_project_name: form.getFieldValue('project_name'),
            fs_support_type: form.getFieldValue('support_type'),
            fs_status: form.getFieldValue('status'),
            fs_sales: form.getFieldValue('sales'),
            fs_apc: form.getFieldValue('apc'),
            fs_start_time_1: start_time_1,
            fs_start_time_2: start_time_2,
            fs_end_time_1: end_time_1,
            fs_end_time_2: end_time_2,
          },
          callback: () => {
            const {
              searchListApplications: { data },
            } = this.props;
            if (data.result == 1) {
              message.success(formatMessage({ id: 'project.HandleChangeStatusTips.Successed' }));
            } else {
              message.error(formatMessage({ id: 'project.HandleChangeStatusTips.Failed' }));
            }
          },
        });
      }
    });
  };

  removeCancel(e) {
    message.warning(formatMessage({ id: 'project.RemoveCancelTips' }));
  }

  handleSwitchView = (checked: boolean) => {
    //列表-true,卡片-false
    // debugger
    if (checked) {
      this.setState({
        cardListVisible: true,
        tableListVisible: false,
      });
    } else {
      this.setState({
        cardListVisible: false,
        tableListVisible: true,
      });
    }
  };

  handleRemove = (projectId: number) => {
    message.warning('Not support now!');
    return;

    const { dispatch, form } = this.props;

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/remove',
          payload: {
            project_id: projectId,

            currentPage: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            //for search 的 form values
            fs_customer_name: form.getFieldValue('customer_name'),
            fs_project_name: form.getFieldValue('project_name'),
            fs_support_type: form.getFieldValue('support_type'),
            fs_status: form.getFieldValue('status'),
            fs_sales: form.getFieldValue('sales'),
            fs_apc: form.getFieldValue('apc'),
            fs_start_time_1: start_time_1,
            fs_start_time_2: start_time_2,
            fs_end_time_1: end_time_1,
            fs_end_time_2: end_time_2,
          },
          callback: () => {
            const {
              searchListApplications: { data },
            } = this.props;

            if (data.result == 1) {
              message.success(formatMessage({ id: 'project.HandleRemoveTips.Successed' }));
            } else {
              message.error(formatMessage({ id: 'project.HandleRemoveTips.Failed' }));
            }
          },
        });
      }
    });
  };

  handleCreate = (fields: FormValsType) => {
    const { dispatch, form } = this.props;

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');

    const currentPage = this.state.pagination.current;
    const pageSize = this.state.pagination.pageSize;
    // const total = this.state.pagination.total;

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/create',
          payload: {
            currentUser: localStorage.getItem('userId'),
            keys: fields.keys,
            accountName: fields.accountName,
            accountVol: fields.accountVol,
            fiscalYear: fields.fiscalYear,
            bd: fields.bd,
            sales: fields.sales,
            pss: fields.pss,
            engineers: fields.engineers,
            owner: fields.owner,
            hourRate: fields.hour_rate,
            planWorkingHours: fields.plan_working_hours,
            planBudget: fields.plan_budget,
            projectCode: fields.project_code,
            so_no: fields.so_no,
            currentPage: currentPage,
            pageSize: pageSize,
            id: fields.id,
            customer_id: fields.customer_id,
            end_time: moment(fields.end_time).format('YYYY-MM-DD HH:mm:ss'),
            plan_working_hours: fields.plan_working_hours,
            project_name: fields.project_name,
            sales_order_volume: fields.sales_order_volume,
            start_time: moment(fields.start_time).format('YYYY-MM-DD HH:mm:ss'),
            status: fields.status_id,
            support_type: fields.support_type,
            support_reason: fields.support_reason,
            update_time: moment(fields.update_time).format('YYYY-MM-DD HH:mm:ss'),
            update_user: localStorage.getItem('userId'),

            //for search 的 form values
            fs_customer_name: form.getFieldValue('customer_name'),
            fs_project_name: form.getFieldValue('project_name'),
            fs_support_type: form.getFieldValue('support_type'),
            fs_status: form.getFieldValue('status'),
            fs_sales: form.getFieldValue('sales'),
            fs_apc: form.getFieldValue('apc'),
            fs_start_time_1: start_time_1,
            fs_start_time_2: start_time_2,
            fs_end_time_1: end_time_1,
            fs_end_time_2: end_time_2,
            // currentUser: localStorage.getItem("userId"),
          },
          callback: () => {
            const {
              searchListApplications: { data },
            } = this.props;
            if (data.result == 1) {
              this.setState({
                pagination: data.pagination,
              });
              message.success(data.resultMessage);
            } else {
              message.error(data.resultMessage);
            }

            this.handleCreateModalVisible();
          },
        });
      }
    });
  };

  handleModify = (fields: FormValsType) => {
    //debugger

    const { dispatch, form } = this.props;

    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');

    const currentPage = this.state.pagination.current;
    const pageSize = this.state.pagination.pageSize;
    // debugger
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'searchListApplications/update',
          payload: {
            currentUser: localStorage.getItem('userId'),
            currentPage: currentPage,
            pageSize: pageSize,
            project_id: fields.project_id,
            keys: fields.keys,
            accountName: fields.accountName,
            accountVol: fields.accountVol,
            fiscalYear: fields.fiscalYear,
            customer_id: fields.customer_id,
            engineer: fields.engineer,
            bd: fields.bd,
            pss: fields.pss,
            sales: fields.sales,
            owner: fields.owner,
            hourRate: fields.hour_rate,
            planWorkingHours: fields.plan_working_hours,
            planBudget: fields.plan_budget,
            projectCode: fields.project_code,
            so_no: fields.so_no,
            end_time: moment(fields.end_time).format('YYYY-MM-DD HH:mm:ss'),
            plan_working_hours: fields.plan_working_hours,
            project_name: fields.project_name,
            sales_order_volume: fields.sales_order_volume,
            start_time: moment(fields.start_time).format('YYYY-MM-DD HH:mm:ss'),
            status: fields.status_id,
            project_run_status: fields.project_run_status_id,
            support_type: fields.support_type,
            support_reason: fields.support_reason,
            update_time: moment(fields.update_time).format('YYYY-MM-DD HH:mm:ss'),
            update_user: localStorage.getItem('userId'),
            //for search 的 form values
            fs_customer_name: form.getFieldValue('customer_name'),
            fs_project_name: form.getFieldValue('project_name'),
            fs_support_type: form.getFieldValue('support_type'),
            fs_status: form.getFieldValue('status'),
            fs_sales: form.getFieldValue('sales'),
            fs_apc: form.getFieldValue('apc'),
            fs_start_time_1: start_time_1,
            fs_start_time_2: start_time_2,
            fs_end_time_1: end_time_1,
            fs_end_time_2: end_time_2,
          },
          callback: () => {
            const {
              searchListApplications: { data },
            } = this.props;
            if (data.result == 1) {
              this.setState({
                pagination: data.pagination,
              });
              message.success(data.resultMessage);
            } else {
              message.error(data.resultMessage);
            }
            this.handleModifyModalVisible();
          },
        });
      }
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    // debugger
    const apcOptions =
      typeof this.state.apcList == 'undefined'
        ? []
        : this.state.apcList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const bdOptions =
      typeof this.state.bdList == 'undefined'
        ? []
        : this.state.bdList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const pssOptions =
      typeof this.state.pssList == 'undefined'
        ? []
        : this.state.pssList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const salesOptions =
      typeof this.state.salesList == 'undefined'
        ? []
        : this.state.salesList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const cusOptions =
      typeof this.state.customerList == 'undefined'
        ? []
        : this.state.customerList.map(d => <Option key={d.value}>{d.text}</Option>);

    // const currentUserId = localStorage.getItem("userId");
    // const currentRoleId = localStorage.getItem("currentUser_roleId");

    //const postId = localStorage.getItem('currentUser_postId');
    const postId = localStorage.getItem('currentUser_postId');
    let numPostId = 1;
    if (postId == null || postId.length == 0) {
      numPostId = 1;
    } else {
      numPostId = parseInt(postId);
    }

    return (
      <Form layout="inline">
        {/* 第一行 */}
        <Row gutter={0}>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemProjectName' })}>
              {getFieldDecorator('project_name')(
                <Input
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                  style={{ width: '15em' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemSupportType' })}>
              {getFieldDecorator('support_type')(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  style={{ width: '15em' }}
                >
                  <Option value="1">
                    <FormattedMessage id="project.SupportTypeOption.After" />
                  </Option>
                  <Option value="2">
                    <FormattedMessage id="project.SupportTypeOption.Before" />
                  </Option>
                  <Option value="3">
                    <FormattedMessage id="project.SupportTypeOption.Train" />
                  </Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemCustomer' })}>
              {getFieldDecorator(
                'customer_id',
                // {initialValue:1,}
              )(
                <Select
                  showSearch
                  style={{ width: '17em' }}
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  optionFilterProp="children"
                >
                  {cusOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemCurrentStatus' })}>
              {getFieldDecorator('status')(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  style={{ width: '15em' }}
                >
                  <Option value="1">
                    <FormattedMessage id="project.StatusOption.Abandoned" />
                  </Option>
                  <Option value="2">
                    <FormattedMessage id="project.StatusOption.NewCreate" />
                  </Option>
                  <Option value="3">
                    <FormattedMessage id="project.StatusOption.Approved" />
                  </Option>
                  <Option value="4">
                    <FormattedMessage id="project.StatusOption.Completed" />
                  </Option>
                  <Option value="5">
                    <FormattedMessage id="project.StatusOption.Archived" />
                  </Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        {/* 第二行 */}
        <Row gutter={0} style={{ display: 'none' }}>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemApcMember' })}>
              {getFieldDecorator('apc', {})(
                <Select showSearch mode="multiple" style={{ width: '15em' }}>
                  {apcOptions}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemBdMember' })}>
              {getFieldDecorator('bd', {})(
                <Select showSearch mode="multiple" style={{ width: '15em' }}>
                  {bdOptions}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemPssMember' })}>
              {getFieldDecorator('pss', {})(
                <Select showSearch mode="multiple" style={{ width: '15em' }}>
                  {pssOptions}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemSalesMember' })}>
              {getFieldDecorator('sales', {})(
                <Select showSearch mode="multiple" style={{ width: '15em' }}>
                  {salesOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        {/* 第三行 */}
        <Row gutter={0}>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemStartTime' })}>
              {getFieldDecorator('start_time')(
                <RangePicker
                  format="YYYY-MM-DD"
                  style={{ width: '15em' }} /*onChange={this.onDateChange}*/
                />,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label={formatMessage({ id: 'project.SearchItemEndTime' })}>
              {getFieldDecorator('end_time')(
                <RangePicker
                  format="YYYY-MM-DD"
                  style={{ width: '15em' }} /*onChange={onChange}*/
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <Button style={{ float: 'right', marginRight: '4em' }} onClick={this.handleFormReset}>
              <FormattedMessage id="customer.CustomerButtonReset" />
            </Button>
          </Col>

          {/* <Col span={3}></Col>
          <Col span={3}></Col> */}
        </Row>
        {/* 第四行 */}
        <Row gutter={0}>
          <Col span={6}>
            {numPostId >= 3 ? (
              <div className={styles.tableListOperator} style={{ marginTop: '2em' }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleCreateModalVisible(true)}
                >
                  <FormattedMessage id="project.ButtonNewCreate" />
                </Button>
                <Button
                  icon="export"
                  style={{ marginLeft: '2em' }}
                  onClick={() =>
                    message.warning(formatMessage({ id: 'project.ButtonExportProject.Tips' }))
                  }
                >
                  <FormattedMessage id="project.ButtonExportProject" />
                </Button>
              </div>
            ) : (
              <div className={styles.tableListOperator} style={{ marginTop: '2em' }}></div>
            )}
          </Col>
          <Col span={6}></Col>
          <Col span={6}></Col>
          <Col span={4}></Col>
          <Col span={2}>
            <div className={styles.tableListOperator} style={{ marginTop: '2.4em' }}>
              <label>{formatMessage({ id: 'project.Form.SwitchTips' })}</label>

              <Switch
                size="default"
                checkedChildren={formatMessage({ id: 'project.SwitchView.Card' })}
                unCheckedChildren={formatMessage({ id: 'project.SwitchView.List' })}
                onChange={checked => this.handleSwitchView(checked)}
                defaultChecked
              />
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      /*updateModalVisible,*/ createModalVisible,
      modifyModalVisible,
      stepFormValues,
      apcList,
      customerList,
      bdList,
      pssList,
      salesList,
      fiscalList,
      accountList,
      supportTypeList,
      projectRunStatusList,
    } = this.state;
    //debugger
    const modifyMethods = {
      handleModifyModalVisible: this.handleModifyModalVisible,
      handleModify: this.handleModify,
    };

    const createMethods = {
      handleCreateModalVisible: this.handleCreateModalVisible,
      handleCreate: this.handleCreate,
    };

    const {
      searchListApplications: { data },
      loading,
    } = this.props;

    const list = data.list;
    const pagination = data.pagination;

    const CardInfo: React.FC<{
      workingHour: React.ReactNode;
      currentStatus: React.ReactNode;
    }> = ({ workingHour, currentStatus }) => (
      <div className={styles.cardInfo}>
        <div>
          <p>
            <FormattedMessage id="project.CardInfo.WorkingHour" />
          </p>
          <p>{workingHour}h</p>
        </div>
        <div>
          <p>
            <FormattedMessage id="project.CardInfo.CurrentStatus" />
          </p>
          <p>{currentStatus}</p>
        </div>
      </div>
    );

    const post = localStorage.getItem('currentUser_postId');
    let dropdownMenuFlag = 'none';
    switch (post) {
      case '1':
        dropdownMenuFlag = 'none';
        break;
      case '2':
        dropdownMenuFlag = 'block';
        break;
      case '3':
        dropdownMenuFlag = 'block';
        break;
    }

    let cardVisible = 'none';
    switch (this.state.cardListVisible) {
      case true:
        cardVisible = 'none';
        break;
      case false:
        cardVisible = 'block';
        break;
    }

    // const menu = ({item}) => (
    //   // {console.log(item.status_id)}
    //   <Menu /*onClick={onClickDropdownMenu.bind(this,item)}*/>
    //     <Menu.Item>
    //       <Popconfirm
    //                 title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.Title' })}
    //                 onConfirm = {()=>this.handleChangeStatus(item.id,3,item.status_id)}
    //                 onCancel={this.removeCancel}
    //                 okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.OkText' })}
    //                 cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Approved.CancelText' })}
    //               >
    //       <a target="_blank" rel="noopener noreferrer" >
    //         <FormattedMessage id="project.DropDownMenu.ApprovedText" />
    //       </a>
    //       </Popconfirm>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <Popconfirm
    //                   title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.Title' })}
    //                   onConfirm = {()=>this.handleChangeStatus(item.id,1,item.status_id)}
    //                   onCancel={this.removeCancel}
    //                   okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.OkText' })}
    //                   cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Abandoned.CancelText' })}
    //                 >
    //       <a target="_blank" rel="noopener noreferrer" >
    //         <FormattedMessage id="project.DropDownMenu.AbandonedText" />
    //       </a>
    //       </Popconfirm>
    //     </Menu.Item>
    //     <Menu.Item>
    //     <Popconfirm
    //                   title={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.Title' })}
    //                   onConfirm = {()=>this.handleChangeStatus(item.id,5,item.status_id)}
    //                   onCancel={this.removeCancel}
    //                   okText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.OkText' })}
    //                   cancelText={formatMessage({ id: 'project.DropDownMenu.Popconfirm.Archived.CancelText' })}
    //                 >
    //       <a target="_blank" rel="noopener noreferrer" >
    //         <FormattedMessage id="project.DropDownMenu.ArchivedText" />
    //       </a>
    //       </Popconfirm>
    //     </Menu.Item>
    //   </Menu>
    // );
    // debugger
    return (
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <br />
        <div style={{ display: cardVisible }}>
          {/* card显示 */}
          <List<ListItemDataType>
            rowKey="id"
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            loading={loading}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card
                  hoverable={true}
                  //loading={true}
                  bodyStyle={{ paddingBottom: 20 }}
                  actions={[
                    <Tooltip
                      key="edit"
                      title={formatMessage({ id: 'project.CardTooltip.EditTitle' })}
                    >
                      <Icon type="edit" onClick={() => this.handleModifyModalVisible(true, item)} />
                    </Tooltip>,
                    <Popconfirm
                      title={formatMessage({ id: 'project.CardPopconfirm.Remove.Title' })}
                      onConfirm={() => this.handleRemove(item.id)}
                      onCancel={this.removeCancel}
                      okText={formatMessage({ id: 'project.CardPopconfirm.Remove.OkText' })}
                      cancelText={formatMessage({ id: 'project.CardPopconfirm.Remove.CancelText' })}
                    >
                      <Tooltip
                        key="delete"
                        title={formatMessage({ id: 'project.CardTooltip.RemoveTitle' })}
                      >
                        <Icon type="delete" />
                      </Tooltip>
                    </Popconfirm>,
                    <Popconfirm
                      title={formatMessage({ id: 'project.CardPopconfirm.Complete.Title' })}
                      onConfirm={() => this.handleChangeStatus(item.id, 4, item.status_id)}
                      onCancel={this.completeCancel}
                      okText={formatMessage({ id: 'project.CardPopconfirm.Complete.OkText' })}
                      cancelText={formatMessage({
                        id: 'project.CardPopconfirm.Complete.CancelText',
                      })}
                    >
                      <Tooltip
                        key="accomplish"
                        title={formatMessage({ id: 'project.CardTooltip.CompleteTitle' })}
                      >
                        <Icon type="file-done" />
                      </Tooltip>
                    </Popconfirm>,
                    <div style={{ display: dropdownMenuFlag }}>
                      <Dropdown
                        key="ellipsis"
                        overlay={this.listMenu({ item })}
                        trigger={['click']}
                      >
                        <Icon type="ellipsis" />
                      </Dropdown>
                    </div>,
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar size="small" src={item.avatar} />}
                    title={item.project_name}
                  />
                  <span>
                    {item.customer_name.length > 24
                      ? item.customer_name.substring(0, 23) + '...'
                      : item.customer_name}
                  </span>
                  <div className={styles.cardItemContent}>
                    <CardInfo
                      workingHour={item.plan_working_hours}
                      currentStatus={item.status_name}
                    />
                  </div>
                  <FormattedMessage id="project.CardMeta.StartTime" />
                  <span>{item.start_time.toString().substring(0, 10)}</span>
                  <br />
                  <FormattedMessage id="project.CardMeta.EndTime" />
                  <span>{item.end_time.toString().substring(0, 10)}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <FormattedMessage id="project.CardMeta.ActualTime" />
                  <span>{item.actual_running_time + ' h'}</span>
                </Card>
              </List.Item>
            )}
          />
        </div>
        <div>
          {' '}
          {/* table显示 */}
          <StandardTable
            //selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={this.columns}
            visible={this.state.tableListVisible}
          />
        </div>

        <div style={{ marginTop: '2em', textAlign: 'right' }}>
          {' '}
          {/* 分页 */}
          <Pagination
            showSizeChanger={true}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onPageChange}
            defaultCurrent={typeof pagination == 'undefined' ? 1 : pagination.current}
            total={typeof pagination == 'undefined' ? 0 : pagination.total}
            pageSize={typeof pagination.pageSize == 'undefined' ? 10 : pagination.pageSize}
            showQuickJumper={true}
            //hideOnSinglePage={true}/* 只有一页时，隐藏分页 */
          />
        </div>

        <CreateForm
          {...createMethods}
          createModalVisible={createModalVisible}
          values={stepFormValues}
          apcList={apcList}
          bdList={bdList}
          pssList={pssList}
          salesList={salesList}
          customerList={customerList}
          supportTypeList={supportTypeList}
          fiscalList={fiscalList}
          accountList={accountList}
        />

        {stepFormValues && Object.keys(stepFormValues).length ? (
          <ModifyForm
            {...modifyMethods}
            modifyModalVisible={modifyModalVisible}
            values={stepFormValues}
            apcList={apcList}
            bdList={bdList}
            pssList={pssList}
            salesList={salesList}
            customerList={customerList}
            fiscalList={fiscalList}
            accountList={accountList}
            supportTypeList={supportTypeList}
            projectRunStatusList={projectRunStatusList}
          />
        ) : null}
      </div>
    );
  }
}

const WarpForm = Form.create<SearchListApplicationsProps>({
  onFieldsChange({ form, dispatch }: SearchListApplicationsProps) {
    let start_time_1;
    let start_time_2;
    let end_time_1;
    let end_time_2;
    start_time_1 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[0].format('YYYY-MM-DD');
    start_time_2 =
      typeof form.getFieldValue('start_time') == 'undefined'
        ? ''
        : form.getFieldValue('start_time')[1].format('YYYY-MM-DD');
    end_time_1 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[0].format('YYYY-MM-DD');
    end_time_2 =
      typeof form.getFieldValue('end_time') == 'undefined'
        ? ''
        : form.getFieldValue('end_time')[1].format('YYYY-MM-DD');
    // 表单项变化时请求数据
    // 模拟查询表单生效
    dispatch({
      type: 'searchListApplications/fetch',
      payload: {
        customer_id: form.getFieldValue('customer_id'),
        project_name: form.getFieldValue('project_name'),
        support_type: form.getFieldValue('support_type'),
        status: form.getFieldValue('status'),
        sales: form.getFieldValue('sales'),
        apc: form.getFieldValue('apc'),
        pss: form.getFieldValue('pss'),
        bd: form.getFieldValue('bd'),
        start_time_1: start_time_1,
        start_time_2: start_time_2,
        end_time_1: end_time_1,
        end_time_2: end_time_2,
        currentUser: localStorage.getItem('userId'),
      },
    });
  },
})(SearchListApplications);

export default connect(
  ({
    searchListApplications,
    loading,
  }: {
    searchListApplications: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    searchListApplications,
    loading: loading.models.searchListApplications,
  }),
)(WarpForm);
