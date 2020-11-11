import {
  //Badge,
  Button,
  Card,
  Col,
  // DatePicker,
  Divider,
  //Dropdown,
  Form,
  // Icon,
  // Input,
  // InputNumber,
  //Menu,
  Row,
  Select,
  message,
  Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
//import moment from 'moment';
import { StateType } from './model';
import CreateForm from './components/CreateForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import {
  AccountTableListItem,
  AccountTableListPagination,
  AccountTableListParams,
  /*ExportItem*/ FiscalYear,
  AccountNameSel,
  AccountType,
  MemberSelect,
} from './data.d';

import moment from 'moment';
//import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './style.less';
//import ExportJsonExcel from "js-export-excel";
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
//const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

//type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
//const statusMap = ['default', 'processing', 'success', 'error'];
//const status = ['关闭', '运行中', '已上线', '异常'];

interface AccountTableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  actTableList: StateType;
}

interface AccountTableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: AccountTableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<AccountTableListItem>;
  fiscalYearList: FiscalYear[];
  accountNameList: AccountNameSel[];
  accountTypeList: AccountType[];
  apcList: MemberSelect[];
  bdList: MemberSelect[];
  pssList: MemberSelect[];
  salesList: MemberSelect[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    actTableList,
    loading,
  }: {
    actTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    actTableList,
    loading: loading.models.rule,
  }),
)
class AccountTableList extends Component<AccountTableListProps, AccountTableListState> {
  state: AccountTableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    fiscalYearList: [],
    accountNameList: [],
    accountTypeList: [],
    apcList: [],
    bdList: [],
    pssList: [],
    salesList: [],
  };

  columns: StandardTableColumnProps[] = [
    // {
    //    title: <FormattedMessage id="Account.TableColumn.Index" />,
    //    dataIndex: 'account_id',
    // },
    {
      title: <FormattedMessage id="Account.TableColumn.AccountName" />,
      dataIndex: 'account_name',
    },
    {
      title: <FormattedMessage id="Account.TableColumn.AccountType" />,
      dataIndex: 'account_type_name',
    },
    {
      title: <FormattedMessage id="Account.TableColumn.AccountOwner" />,
      dataIndex: 'member_name',
    },
    {
      title: <FormattedMessage id="Account.TableColumn.FiscalYear" />,
      dataIndex: 'fiscal_year',
    },
    {
      title: <FormattedMessage id="Account.TableColumn.Budget" />,
      dataIndex: 'budget',
    },
    // {
    //   title: <FormattedMessage id="Account.TableColumn.SAPOrder" />,
    //   dataIndex: 'sap_order',
    // },
    // {
    //   title: <FormattedMessage id="customer.CustomerColumnType" />,
    //   dataIndex: 'customer_type',
    // },
    {
      title: <FormattedMessage id="Account.TableColumn.Operation" />,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>
            <FormattedMessage id="customer.CustomerColumnOperation.Modify" />
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop' })}
            onConfirm={() => this.onDelete(record)}
            onCancel={this.removeCancel}
            okText={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop.Confim' })}
            cancelText={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop.Cancel' })}
          >
            <a href="#">
              <FormattedMessage id="customer.CustomerColumnOperation.Remove" />
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  onDelete = record => {
    // message.success("Removing a account is not allowed!");
    // return;
    this.handleRemove(record);
  };

  removeCancel(e) {
    message.error(formatMessage({ id: 'customer.CustomerRemoveCancel' }));
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const today = new Date();
    const year = today.getFullYear();

    dispatch({
      type: 'actTableList/fetch',
      // payload: {
      //   fiscal_year:year,
      // },
      callback: () => {
        const {
          actTableList: { data },
        } = this.props;

        this.setState({
          fiscalYearList: data.fiscalYearList,
          accountNameList: data.accountNameList,
          accountTypeList: data.accountTypeList,
          apcList: data.apcList,
          bdList: data.bdList,
          pssList: data.pssList,
          salesList: data.salesList,
        });
      },
    });
  }

  handleStandardTableChange = (
    pagination: Partial<AccountTableListPagination>,
    filtersArg: Record<keyof AccountTableListItem, string[]>,
    sorter: SorterResult<AccountTableListItem>,
  ) => {
    debugger;
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<AccountTableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'actTableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'actTableList/fetch',
      payload: {},
    });
  };

  handleRemove = (fields: FormValsType) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'actTableList/remove',
      payload: {
        account_id: fields.account_id,
        //用于返回搜索用
        fs_fiscal_year: form.getFieldValue('fiscal_year'),
      },
      callback: () => {
        const {
          actTableList: { data },
        } = this.props;

        if (data.result == 1) {
          message.success(data.resultMessage);
        } else {
          message.error(data.resultMessage);
        }
      },
    });

    this.handleUpdateModalVisible();
  };

  handleNotDeveloped = () => {
    message.warn(formatMessage({ id: 'customer.CustomerSelectedBatch' }));
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = (rows: AccountTableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };
  //点击查询按钮触发
  handleSearch = (e: React.FormEvent) => {
    // debugger
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'actTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: FormValsType) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'actTableList/add',
      payload: {
        // id: fields.id,
        account_name: fields.account_name,
        fiscal_year: fields.fiscal_year,
        budget: fields.budget,
        account_type_id: fields.account_type_id,
        member_id: fields.member_id,
        sap_order: fields.sap_order,
        comments: fields.comments,
      },
      callback: () => {
        const {
          actTableList: { data },
        } = this.props;

        if (data.result == 1) {
          message.success(data.resultMessage);
        } else {
          message.error(data.resultMessage);
        }
      },
    });

    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    // debugger
    const { dispatch } = this.props;
    dispatch({
      type: 'actTableList/update',
      payload: {
        account_id: fields.account_id,
        account_name: fields.account_name,
        account_type_id: fields.account_type_id,
        member_id: fields.member_id,
        fiscal_year: fields.fiscal_year,
        budget: fields.budget,
        sap_order: fields.sap_order,
        comments: fields.comments,
      },
      callback: () => {
        const {
          actTableList: { data },
        } = this.props;

        if (data.result == 1) {
          message.success(formatMessage({ id: 'customer.CustomerOnModifySuccessTips' }));
        } else {
          message.error(formatMessage({ id: 'customer.CustomerOnModifyFailedTips' }));
        }
      },
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const fislcalYearOptions =
      typeof this.state.fiscalYearList == 'undefined'
        ? []
        : this.state.fiscalYearList.map(d => <Option key={d.fiscal_id}>{d.fiscal_year}</Option>);
    const accountNameOptions =
      typeof this.state.accountNameList == 'undefined'
        ? []
        : this.state.accountNameList.map(d => <Option key={d.account_id}>{d.account_name}</Option>);

    const { getFieldDecorator } = form;
    const today = new Date();
    //const year = today.getFullYear();

    const getFiscalYear = (fiscalYearList: FiscalYear[]) => {
      let returnVal = -1;
      if (typeof fiscalYearList != 'undefined') {
        fiscalYearList.forEach(item => {
          if (
            moment(item.fiscal_year - 1 + '1001').isBefore(moment()) &&
            moment(item.fiscal_year + '0930').isAfter(moment())
          ) {
            returnVal = item.fiscal_id;
          }
        });
      }
      return returnVal;
    };

    const initialFiscalYear = getFiscalYear(this.state.fiscalYearList);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'Account.SearchItem.AccountName.Title' })}>
              {getFieldDecorator('account_name')(
                <Select
                  placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
                  notFoundContent={'No Data'}
                  allowClear={true}
                  style={{ width: '100%' }}
                >
                  {accountNameOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          {/*           <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'customer.CustomerNameSearchEN' })}>
              {getFieldDecorator('customer_name_en')(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
            </FormItem>
          </Col> */}
          <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'Account.SearchItem.FiscalYear.Title' })}>
              {getFieldDecorator('fiscal_year', {
                initialValue: initialFiscalYear + '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
                  notFoundContent={'No Data'}
                  allowClear={true}
                  style={{ width: '100%' }}
                >
                  {fislcalYearOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="customer.CustomerButtonSearch" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="customer.CustomerButtonReset" />
              </Button>
              {/* <a style={{ marginLeft: 12 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    //const { expandForm } = this.state;
    //return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }

  render() {
    const {
      actTableList: { data },
      loading,
    } = this.props;
    //const newData = typeof(data)== "undefined" ? '':{};
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      fiscalYearList,
      accountTypeList,
      apcList,
      bdList,
      pssList,
      salesList,
    } = this.state;
    // debugger
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                <FormattedMessage id="Account.SearchItem.BtnNewCreateAccount" />
              </Button>
              {/* <textarea>12312</textarea> */}
              {selectedRows.length > 0 && (
                <span>
                  <Button icon="delete" onClick={() => this.handleNotDeveloped()}>
                    {formatMessage({ id: 'customer.CustomerButtonBatchDeletion' })}
                  </Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              expandedRowRender={record => <p style={{ margin: 0 }}>{record.comments}</p>}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          fiscalYearList={fiscalYearList}
          apcList={apcList}
          bdList={bdList}
          pssList={pssList}
          salesList={salesList}
          accountTypeList={accountTypeList}
          modalVisible={modalVisible}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            fiscalYearList={fiscalYearList}
            accountTypeList={accountTypeList}
            apcList={apcList}
            bdList={bdList}
            pssList={pssList}
            salesList={salesList}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<AccountTableListProps>()(AccountTableList);
