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
  Input,
  // InputNumber,
  //Menu,
  Row,
  Select,
  message,
  Popconfirm
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
import { MemberTableListItem, MemberTableListPagination, MemberTableListParams,/*ExportItem*/Role,Group,Post} from './data.d';

//import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './style.less';
//import ExportJsonExcel from "js-export-excel";
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';
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
  memTableList: StateType;
}

interface AccountTableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: MemberTableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<MemberTableListItem>;
  groupList:Group[];
  postList:Post[];
  roleList:Role[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    memTableList,
    loading,
  }: {
    memTableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    memTableList,
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
    // fiscalYearList: [],
    // accountNameList: [],
    // accountTypeList:[],
    groupList:[],
    postList:[],
    roleList:[],
  };

  columns: StandardTableColumnProps[] = [
    // {
    //    title: <FormattedMessage id="Account.TableColumn.Index" />,
    //    dataIndex: 'account_id',
    // },
    {
      title: <FormattedMessage id="Member.Table.Column.ChineaseName" />,
      dataIndex: 'member_name',
    },
    {
      title: <FormattedMessage id="Member.Table.Column.EnglishName" />,
      dataIndex: 'member_name_en',
    },
    // {
    //   title: "Family Name",
    //   dataIndex: 'family_name',
    // },
    // {
    //   title: "Given Name",
    //   dataIndex: 'given_name',
    // },
    {
      title: <FormattedMessage id="Member.Table.Column.Group" />,
      dataIndex: 'group_name',
    },
    {
      title: <FormattedMessage id="Member.Table.Column.Role" />,
      dataIndex: 'role_name',
    },
    // {
    //   title: "Post",
    //   dataIndex: 'post_name',
    // },
    {
      title: <FormattedMessage id="Member.Table.Column.Orgnization" />,
      dataIndex: 'org_name',
    },
    // {
    //   title: <FormattedMessage id="customer.CustomerColumnType" />,
    //   dataIndex: 'customer_type',
    // },
    {
      title: <FormattedMessage id="Account.TableColumn.Operation" />,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}><FormattedMessage id="customer.CustomerColumnOperation.Modify" /></a>
          <Divider type="vertical" />
          <Popconfirm
            title={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop' })}
            onConfirm = {() => this.onDelete(record)}
            onCancel={this.removeCancel}
            okText={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop.Confim' })}
            cancelText={formatMessage({ id: 'customer.CustomerColumnOperation.RemovePop.Cancel' })}
          >
          <a href="#"><FormattedMessage id="customer.CustomerColumnOperation.Remove" /></a>

          </Popconfirm>
          
        </Fragment>
      ),
    },
  ];

  onDelete=(record)=>{
    message.success(formatMessage({ id: 'customer.CustomerOnDeleteTips' }));
    this.handleRemove(record);
  }
  
  removeCancel(e) {
    message.error(formatMessage({ id: 'customer.CustomerRemoveCancel' }));
  }

  componentDidMount() {
    
    const { dispatch } = this.props;
    const today = new Date();
    const year = today.getFullYear();

    dispatch({
      type: 'memTableList/fetch',
      // payload: {
      //   fiscal_year:year,
      // },
      callback: () => {

        const {
          memTableList: { data },
        } = this.props;

        this.setState({
          roleList:data.roleList,
          postList:data.postList,
          groupList:data.groupList,
        });
        
      },
    });
  }

  handleStandardTableChange = (
    pagination: Partial<MemberTableListPagination>,
    filtersArg: Record<keyof MemberTableListItem, string[]>,
    sorter: SorterResult<MemberTableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<MemberTableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'memTableList/fetch',
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
      type: 'memTableList/fetch',
      payload: {},
    });
  };

  handleRemove = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'memTableList/remove',
      payload: {
        member_id: fields.member_id,
        // account_name: fields.member_name,
        // fiscal_year: fields.member_name_en,
        // budget: fields.g_id,
      },
      callback: () => {
        const {
          memTableList: { data },
        } = this.props;

        if(data.result == 1){
          message.success(formatMessage({ id: 'customer.CustomerOnDeleteSuccessTips' }));
        }else{
          message.error(formatMessage({ id: 'customer.CustomerOnDeleteFailedTips' }));
        }
      },
    });

    this.handleUpdateModalVisible();
  };
  
  handleNotDeveloped = () =>{
    message.warn(formatMessage({ id: 'customer.CustomerSelectedBatch' }));
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  handleSelectRows = (rows: MemberTableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };
//点击查询按钮触发
  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {debugger
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'memTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {//debugger
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: FormValsType) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'memTableList/add',
      payload: {
        member_name:fields.member_name,
        member_name_en:fields.member_name_en,
        family_name:fields.family_name,
        given_name:fields.given_name,
        role_id:fields.role_id,
        role_name:fields.role_name,
        post_id:fields.post_id,
        post_name:fields.post_name,
        group_id:fields.group_id,
        group_name:fields.group_name,
        branch_id:fields.branch_id,
        branch_name:fields.branch_name,
        g_id:fields.g_id,
        mobile:fields.mobile,
        org_name:fields.org_name,
        email:fields.email,
      },
      callback: () => {
        const {
          memTableList: { data },
        } = this.props;

        if(data.result == 1){
          message.success(formatMessage({ id: 'customer.CustomerOnCreateSuccessTips' }));
          
        }else{
          message.error(formatMessage({ id: 'customer.CustomerOnCreateFailedTips' }));
        }
      },
    });

    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    // debugger
    const { 
      dispatch,
      } = this.props;
    dispatch({
      type: 'memTableList/update',
      payload: {
        member_id:fields.member_id,
        member_name:fields.member_name,
        member_name_en:fields.member_name_en,
        family_name:fields.family_name,
        given_name:fields.given_name,
        role_id:fields.role_id,
        role_name:fields.role_name,
        post_id:fields.post_id,
        post_name:fields.post_name,
        group_id:fields.group_id,
        group_name:fields.group_name,
        branch_id:fields.branch_id,
        branch_name:fields.branch_name,
        g_id:fields.g_id,
        mobile:fields.mobile,
        org_name:fields.org_name,
        email:fields.email,
      },
      callback: () => {
        const {
          memTableList: { data },
        } = this.props;

        if(data.result == 1){
          message.success(formatMessage({ id: 'customer.CustomerOnModifySuccessTips' }));
        }else{
          message.error(formatMessage({ id: 'customer.CustomerOnModifyFailedTips' }));
        }
      },
    });

    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const groupOptions = typeof(this.state.groupList)=="undefined"?[]:this.state.groupList.map(d => <Option key={d.group_id}>{d.group_name}</Option>);
    const roleOptions = typeof(this.state.roleList)=="undefined"?[]:this.state.roleList.map(d => <Option key={d.role_id}>{d.role_name}</Option>);
    const postOptions = typeof(this.state.postList)=="undefined"?[]:this.state.postList.map(d => <Option key={d.post_id}>{d.post_name}</Option>);
    
    const { getFieldDecorator } = form;
    const today = new Date();
    const year = today.getFullYear();

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 4, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label={formatMessage({ id: 'Member.SearchForm.Column.Name' })}>
              {getFieldDecorator('member_name')(
                <Input style={{width:"100%"}} placeholder={"Please input"}/>,
              )}
            </FormItem>
          </Col>         
          <Col md={4} sm={24}>
            <FormItem label={formatMessage({ id: 'Member.SearchForm.Column.Group' })}>
              {getFieldDecorator('group_id')(
                 <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} notFoundContent={"No Data"} allowClear={true} style={{width: '100%' }}>
                 {groupOptions}
                  </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label={formatMessage({ id: 'Member.SearchForm.Column.Role' })}>
              {getFieldDecorator('role_id')(
                 <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} notFoundContent={"No Data"} allowClear={true} style={{width: '100%' }}>
                 {roleOptions}
                  </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label={formatMessage({ id: 'Member.SearchForm.Column.Post' })}>
              {getFieldDecorator('post_id')(
                 <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} notFoundContent={"No Data"} allowClear={true} style={{width: '100%' }}>
                 {postOptions}
                  </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="customer.CustomerButtonSearch" />
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                <FormattedMessage id="customer.CustomerButtonReset" />
              </Button>
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
      memTableList: { data },
      loading,
    } = this.props;
    //const newData = typeof(data)== "undefined" ? '':{};
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,roleList,postList,groupList } = this.state;
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
              {/* <FormattedMessage id="Account.SearchItem.BtnNewCreateAccount" /> */}
                    {formatMessage({ id: 'Member.SearchForm.Button.Create' })}
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
              //expandedRowRender={record => <p style={{ margin: 0 }}>{record.comments}</p>}
            /> 
          </div>
        </Card>
        <CreateForm 
          {...parentMethods} 
          groupList={groupList} 
          roleList={roleList} 
          postList={postList} 
          modalVisible={modalVisible} 
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            // fiscalYearList={fiscalYearList}
            // accountTypeList={accountTypeList}
            groupList={groupList} roleList={roleList} postList={postList}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<AccountTableListProps>()(AccountTableList);
