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
import { TableListItem, TableListPagination, TableListParams,ExportItem,Branch,CustomerType } from './data.d';

//import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
// import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi/locale';
import styles from './style.less';
import ExportJsonExcel from "js-export-excel";
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';
const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

//type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
//const statusMap = ['default', 'processing', 'success', 'error'];
//const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  tableList: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  branchList:Branch[];
  customerTypeList:CustomerType[];
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    tableList,
    loading,
  }: {
    tableList: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    tableList,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    branchList:[],
    customerTypeList:[],
  };

  columns: StandardTableColumnProps[] = [
    // {
    //   title: <FormattedMessage id="customer.CustomerColumnIndex" />,
    //   dataIndex: 'id',
    // },
    {
      title: <FormattedMessage id="customer.CustomerNo" />,
      dataIndex: 'customer_no',
    },
    {
      title: <FormattedMessage id="customer.CustomerNameSearchZH" />,
      dataIndex: 'customer_name',
    },
    {
      title: <FormattedMessage id="customer.CustomerNameSearchEN" />,
      dataIndex: 'customer_name_en',
    },
    {
      title: <FormattedMessage id="customer.CustomerBranch" />,
      dataIndex: 'branch',
    },
    // {
    //   title: <FormattedMessage id="customer.CustomerColumnAddr" />,
    //   dataIndex: 'province',
    // },
    {
      title: <FormattedMessage id="customer.CustomerColumnType" />,
      dataIndex: 'customer_type',
    },
    {
      title: <FormattedMessage id="customer.CustomerColumnOperation" />,
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
  
  removeCancel() {
    message.error(formatMessage({ id: 'customer.CustomerRemoveCancel' }));
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/fetch',
      callback: () => {
        const {
          tableList: { data },
        } = this.props;

        this.setState({
          branchList:data.branchList,
          customerTypeList:data.customerTypeList,
        });

      },
    });
  }

  handleExport = () => {//debugger
    const selectData = this.state.selectedRows;
    const sheetData:any = [];
    const sheetFilter:any = [];
    const sheetHeader:any = [];
    const columnWidths:any = [];
    const ignoreRow:any= [];
    var option = {
      fileName:'',
      datas:[
        {
          sheetData:sheetData,
          sheetName:'',
          sheetFilter:sheetFilter,
          sheetHeader:sheetHeader,
          columnWidths:columnWidths,
          ignoreRow:ignoreRow,
        }
      ],
    };
    option.fileName = 'CustomerList';

    let dataTable :[ExportItem] ;
    
    dataTable = [
      {
        id:0,
        branch:'',
        city: '',
        customer_name: '',
        customer_name_en: '',
        customer_type: '',
        cnoc: '',
        province: '',
        region: '',
      }
    ];
    if(selectData){
      for (let i in selectData) {
         let obj = {
            id: selectData[i].id,
            branch: selectData[i].branch,
            city: selectData[i].city,
            customer_name: selectData[i].customer_name,
            customer_name_en: selectData[i].customer_name_en,
            customer_type: selectData[i].customer_type,
            cnoc: selectData[i].cnoc,
            province: selectData[i].province,
            region: selectData[i].region,
          }
          
          dataTable.push(obj);
      }
    }
    dataTable.splice(0,1);
    option.datas=[
      {
        sheetData:dataTable,
        sheetName:'sheet',
        sheetFilter:['id','branch','city','customer_name','customer_name_en','customer_type','cnoc','province','region'],
        sheetHeader:['id','branch','city','customer name','customer english name','customer type','cnoc','province','region'],
        columnWidths:['5','8','8','15','15','10','10','8','5'],
        ignoreRow:['0','1'],
      }
    ];

    var toExcel = new ExportJsonExcel(option); 
    
    toExcel.saveExcel();        
  };


  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'tableList/fetch',
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
      type: 'tableList/fetch',
      payload: {},
    });
  };

  handleRemove = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tableList/remove',
      payload: {
        id: fields.id,
        customer_name: fields.customer_name,
        customer_name_en: fields.customer_name_en,
        customer_type: fields.customer_type,
        branch: fields.branch,
        cnoc: fields.cnoc,
      },
      callback: () => {
        const {
          tableList: { data },
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

  // handleMenuClick = (e: { key: string }) => {
  //   const { dispatch } = this.props;
  //   const { selectedRows } = this.state;

  //   if (!selectedRows) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'tableList/remove',
  //         payload: {
  //           key: selectedRows.map(row => row.id),
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: [],
  //           });
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };
//点击查询按钮触发
  handleSearch = (e: React.FormEvent) => {
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
        type: 'tableList/fetch',
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
      type: 'tableList/add',
      payload: {
        customer_no: fields.customer_no,
        customer_name: fields.customer_name,
        customer_name_en: fields.customer_name_en,
        customer_type: fields.customer_type,
        branch: fields.branch,
        cnoc: fields.cnoc,
      },
      callback: () => {
        const {
          tableList: { data },
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
      type: 'tableList/update',
      payload: {
        id: fields.id,
        customer_no:fields.customer_no,
        customer_name: fields.customer_name,
        customer_name_en: fields.customer_name_en,
        customer_type: fields.customer_type,
        branch: fields.branch,
        cnoc: fields.cnoc,
        //currentPage:this.state.pagination.current, 
        //pageSize:this.state.pagination.pageSize,
      },
      callback: () => {
        const {
          tableList: { data },
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
    
    const { getFieldDecorator } = form;

    const branchOption = typeof(this.state.branchList)=="undefined"?[]:this.state.branchList.map(d=><Option key={d.branch_id}>{d.branch_name}</Option>);

    //const branchOption = this.state.branchList.map(d=><Option key={d.branch_id}>{d.branch_name}</Option>);

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'customer.CustomerNameSearchZH' })}>
              {getFieldDecorator('customer_name')(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'customer.CustomerNameSearchEN' })}>
              {getFieldDecorator('customer_name_en')(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label={formatMessage({ id: 'customer.CustomerBranch' })}>
              {getFieldDecorator('branch')(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                  {branchOption}
                  {/* <Option value="1">Converting</Option>
                  <Option value="2">Metalforming</Option>
                  <Option value="3">Printing</Option>
                  <Option value="4">Packaging</Option>
                  <Option value="5">Rubber</Option>
                  <Option value="6">Textile</Option>
                  <Option value="7">Tire</Option>
                  <Option value="8">Wood</Option>
                  <Option value="9">Glass</Option>
                  <Option value="10">Handling</Option>
                  <Option value="11">Solar</Option> */}
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

  // renderAdvancedForm() {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="规则名称">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status')(
  //               <Select placeholder="请选择" style={{ width: '100%' }}>
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="调用次数">
  //             {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="更新日期">
  //             {getFieldDecorator('date')(
  //               <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status3')(
  //               <Select placeholder="请选择" style={{ width: '100%' }}>
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="使用状态">
  //             {getFieldDecorator('status4')(
  //               <Select placeholder="请选择" style={{ width: '100%' }}>
  //                 <Option value="0">关闭</Option>
  //                 <Option value="1">运行中</Option>
  //               </Select>,
  //             )}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <div style={{ overflow: 'hidden' }}>
  //         <div style={{ float: 'right', marginBottom: 24 }}>
  //           <Button type="primary" htmlType="submit">
  //             查询
  //           </Button>
  //           <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //             重置
  //           </Button>
  //           <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //             收起 <Icon type="up" />
  //           </a>
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // }

  renderForm() {
    //const { expandForm } = this.state;
    //return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }

  render() {
    const {
      tableList: { data },
      loading,
    } = this.props;
    // debugger

// debugger
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,branchList,customerTypeList } = this.state;
    /* const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    ); */
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
              <FormattedMessage id="customer.CustomerButtonNewCreate" />
              </Button>
              {/* <textarea>12312</textarea> */}
              {selectedRows.length > 0 && (
                <span>
                  <Button icon="delete" onClick={() => this.handleNotDeveloped()}>
                    {formatMessage({ id: 'customer.CustomerButtonBatchDeletion' })}
                  </Button>
                  <Button icon="export" onClick={() => this.handleExport()}>
                    {formatMessage({ id: 'customer.CustomerButtonExportExcel' })}
                  </Button>
                  {/* <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
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
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} branchList={branchList} customerTypeList={customerTypeList}/>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            branchList={branchList} 
            customerTypeList={customerTypeList}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
