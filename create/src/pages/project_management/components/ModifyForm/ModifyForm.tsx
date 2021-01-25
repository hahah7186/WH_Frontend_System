import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  /*Radio,*/ Select /*, Steps*/,
  InputNumber,
  Row,
  Col,
  Icon,
  Divider,
  message,
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';

import {
  ListItemDataType /*,MemberSelect*/,
  CustomerSelect,
  Member,
  AccountExportItem,
  FiscalYearItem,
  supportType,
  projectRunStatus,
} from '../../data.d';

import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
const { TextArea } = Input;

export interface FormValsType extends Partial<ListItemDataType> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface ModifyFormProps extends FormComponentProps {
  handleModifyModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleModify: (values: FormValsType) => void;

  modifyModalVisible: boolean;
  values: Partial<ListItemDataType>;
  apcList: Member[];
  bdList: Member[];
  pssList: Member[];
  salesList: Member[];
  accountList: AccountExportItem[];
  fiscalList: FiscalYearItem[];
  customerList: CustomerSelect[];
  supportTypeList: supportType[];
  projectRunStatusList: projectRunStatus[];
}
//定义控件
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

let itemId = 0;

export interface ModifyState {
  formVals: FormValsType;
  sonoDisable: boolean;
  arrPercentage: number[];
  planBudget: number;
  arrAccountVol: number[];
  arrAccountName: number[];
  arrFiscalYear: number[];
}

class ModifyForm extends Component<ModifyFormProps, ModifyState> {
  static defaultProps = {
    handleModify: () => {},
    handleModifyModalVisible: () => {},
    values: {},
    apcList: [],
    bdList: [],
    pssList: [],
    salesList: [],
    customerList: [],
    accountList: [],
    fiscalList: [],
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: ModifyFormProps) {
    super(props);

    itemId = typeof props.values.accounts == 'undefined' ? 0 : props.values.accounts.keys.length;

    const tempPlanBudget =
      (typeof props.values.plan_working_hours == 'undefined'
        ? 0
        : props.values.plan_working_hours) *
      (typeof props.values.hour_rate == 'undefined' ? 0 : props.values.hour_rate);

    const planBudgetInitial = props.values.plan_budget;
    const arrAccountVol =
      typeof props.values.accounts == 'undefined' ? [] : props.values.accounts.accountVol;
    const arrPercentage = this.getPercentageArrInitial(arrAccountVol, planBudgetInitial);
    const arrAccountName =
      typeof props.values.accounts == 'undefined' ? [] : props.values.accounts.accountName;
    const arrFiscalYear =
      typeof props.values.accounts == 'undefined' ? [] : props.values.accounts.fiscalYear;
    this.state = {
      formVals: {
        project_id: props.values.project_id,
        customer_name: props.values.customer_name,
        customer_id: props.values.customer_id,
        project_name: props.values.project_name,
        project_code: props.values.project_code,
        project_run_status_id: props.values.project_run_status_id,
        project_run_status_name: props.values.project_run_status_name,
        owner: props.values.owner,
        owner_id: props.values.owner_id,
        status_id: props.values.status_id,
        status_name: props.values.status_name,
        engineer: props.values.engineer,
        hour_rate: props.values.hour_rate,
        plan_budget: props.values.plan_budget,
        plan_working_hours: props.values.plan_working_hours,
        support_type: props.values.support_type,
        support_type_id: props.values.support_type_id,
        support_reason: props.values.support_reason,
        start_time: props.values.start_time,
        end_time: props.values.end_time,
        update_time: props.values.update_time,
        // status_id: props.values.status_id,

        sales_order_volume: props.values.sales_order_volume,
        comments: props.values.comments,
        engineers: props.values.engineers,
        bd: props.values.bd,
        pss: props.values.pss,
        sales: props.values.sales,
        actual_running_time: props.values.actual_running_time,
        member: props.values.member,
        accounts: {
          keys: props.values.accounts == null ? [] : props.values.accounts.keys,
          accountName: props.values.accounts == null ? [] : props.values.accounts.accountName,
          fiscalYear: props.values.accounts == null ? [] : props.values.accounts.fiscalYear,
          accountVol: props.values.accounts == null ? [] : props.values.accounts.accountVol,
        },
      },
      sonoDisable: true,
      arrPercentage: arrPercentage,
      planBudget: tempPlanBudget,
      arrAccountVol: arrAccountVol,
      arrAccountName: arrAccountName,
      arrFiscalYear: arrFiscalYear,
    };
  }

  getPercentageArrInitial = (arr, planBudget) => {
    let sum = planBudget;

    let arrPercentage: number[] = [];

    arr.forEach(item => {
      const temp = Math.round(((item * 100) / sum) * 100) / 100;
      arrPercentage.push(temp);
    });
    return arrPercentage;
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const newKeys = keys.concat(itemId);

    if (newKeys.length > 3) {
      //不能超过三个账户，如果超过，则系统给提示
      message.error(formatMessage({ id: 'project.NewCreateForm.AddItemError' }));
      return;
    } else if (newKeys.length == 1) {
      //如果只有一个账户，那么获取plan Budget的数据，填充到新增格子里面，percentage也相应改为100%
      const planBudget = form.getFieldValue('plan_budget');
      this.setState({
        arrPercentage: [100],
        arrAccountVol: [planBudget],
      });
    } else if (newKeys.length == 2 || newKeys.length == 3) {
      //获取总的budget值
      const planBudget = form.getFieldValue('plan_budget');
      //获取已填写的budget值
      let arrAccountVol = this.state.arrAccountVol;
      const tempSum = this.getAccountVolSum(arrAccountVol);
      const newVol = planBudget - tempSum;
      arrAccountVol.push(newVol);
      const arrPercentage = this.getPercentageArr(arrAccountVol);
      //获取原accountName和fiscalYear
      const arrAccountName = this.state.arrAccountName;
      arrAccountName.push(1);
      const arrFiscalYear = this.state.arrFiscalYear;
      arrFiscalYear.push(1);
      //如果有两个账户
      this.setState({
        arrAccountVol: arrAccountVol,
        arrPercentage: arrPercentage,
        arrAccountName: arrAccountName,
        arrFiscalYear: arrFiscalYear,
      });
    }
    itemId++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: newKeys,
    });
  };

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // 如果删除的是数组最小下标或者数组值小于1则返回
    if (keys.length === 1 || k === 0) {
      return;
    }

    const arrAccountName = this.state.arrAccountName;
    arrAccountName.splice(k, 1);
    const arrFiscalYear = this.state.arrFiscalYear;
    arrFiscalYear.splice(k, 1);
    const arrAccountVol = this.state.arrAccountVol;
    arrAccountVol.splice(k, 1);

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
      accountName: arrAccountName + '',
      fiscalYear: arrFiscalYear + '',
      accountVol: arrAccountVol,
    });
  };

  getAccountVolSum = arr => {
    let sum = 0;
    arr.forEach(item => {
      sum = sum + item;
    });
    return sum;
  };

  getPercentageArr = arr => {
    let sum = this.state.planBudget;

    let arrPercentage: number[] = [];

    arr.forEach(item => {
      const temp = Math.round(((item * 100) / sum) * 100) / 100;
      arrPercentage.push(temp);
    });
    return arrPercentage;
  };

  onPlanWorkingHourChange = event => {
    //debugger
    //const planWorkingHour = this.props.form.getFieldValue("plan_working_hours");
    const hourRate = this.props.form.getFieldValue('hour_rate');
    const planBudget = event.target.value * (typeof hourRate === 'undefined' ? 0 : hourRate);

    this.props.form.setFieldsValue({
      plan_budget: planBudget,
    });

    this.setState((prevState, props) => ({
      planBudget: planBudget,
    }));

    const arrPercentage = this.getPercentageArr(this.state.arrAccountVol);

    this.setState({
      arrPercentage: arrPercentage,
    });
  };

  onHourRateChange = value => {
    //debugger
    const planWorkingHour = this.props.form.getFieldValue('plan_working_hours');
    //const hourRate = this.props.form.getFieldValue("hour_rate");
    const planBudget = (typeof planWorkingHour === 'undefined' ? 0 : planWorkingHour) * value;
    this.props.form.setFieldsValue({
      plan_budget: planBudget,
    });

    this.setState({
      planBudget: planBudget,
    });
  };

  stateFunction() {
    console.log('Execute now!', this.state.arrPercentage);
  }

  onBudgetChange = (value, k) => {
    //debugger
    const { form } = this.props;
    let arrAccountVol = form.getFieldValue('accountVol');
    arrAccountVol[k] = value;
    const arrPercentage = this.getPercentageArr(arrAccountVol);
    this.setState(
      {
        arrAccountVol: arrAccountVol,
        arrPercentage: arrPercentage,
      },
      function() {
        console.log('Execute now!');
      },
    );
  };

  renderContent = (formVals: FormValsType) => {
    //debugger
    const {
      form,
      apcList,
      customerList,
      bdList,
      pssList,
      salesList,
      supportTypeList,
      projectRunStatusList,
    } = this.props;
    const dateFormat = 'YYYY/MM/DD';

    const apcOptions = apcList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const bdOptions = bdList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const pssOptions = pssList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const salesOptions = salesList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const cusOptions = customerList.map(d => <Option key={d.value}>{d.text}</Option>);
    //初始化人员下拉框选项
    formVals.arrEngineerId = [];
    formVals.arrBdId = [];
    formVals.arrPssId = [];
    formVals.arrSalesId = [];

    const prjMembers = formVals.member;
    if (typeof prjMembers != 'undefined') {
      prjMembers.forEach(mem => {
        switch (mem.role_id) {
          case 1: //apc
            if (typeof formVals.arrApcId != 'undefined') {
              formVals.arrApcId.push(mem.member_id.toString());
            }

            break;
          case 2: //bd
            if (typeof formVals.arrBdId != 'undefined') {
              formVals.arrBdId.push(mem.member_id.toString());
            }
            break;
          case 3: //pss
            if (typeof formVals.arrPssId != 'undefined') {
              formVals.arrPssId.push(mem.member_id.toString());
            }
            break;
          case 4: //sales
            if (typeof formVals.arrSalesId != 'undefined') {
              formVals.arrSalesId.push(mem.member_id.toString());
            }

            break;
        }
      });
    }
    const prjEngineer = formVals.engineer;

    if (typeof prjEngineer != 'undefined') {
      prjEngineer.forEach(eng => {
        if (typeof formVals.arrEngineerId != 'undefined') {
          formVals.arrEngineerId.push(eng.member_id.toString());
        }
      });
    }

    const formItemLayout = {
      labelCol: {
        span: 4,
        offset: 4,
      },
      wrapperCol: {
        span: 8,
        offset: 0,
      },
    };
    const accountOptions = this.props.accountList.map(d => (
      <Option key={d.account_id}>{d.account_name}</Option>
    ));
    const fiscalOptions = this.props.fiscalList.map(d => (
      <Option key={d.fiscal_id}>{d.fiscal_year}</Option>
    ));
    const supportTypeOptions = this.props.supportTypeList.map(d => (
      <Option key={d.support_type_id}>{d.support_type_name}</Option>
    ));
    //debugger
    const projectRunStatusOptions = this.props.projectRunStatusList.map(d => (
      <Option key={d.project_run_status_id}>{d.project_run_status_name}</Option>
    ));

    const { getFieldDecorator, getFieldValue } = this.props.form;
    //debugger
    getFieldDecorator('keys', {
      initialValue: this.props.values.accounts == null ? [] : this.props.values.accounts.keys,
    });

    let keys = getFieldValue('keys');
    const accountName = this.state.arrAccountName; //this.props.values.accounts==null?[]:this.props.values.accounts.accountName;
    const fiscalYear = this.state.arrFiscalYear; //this.props.values.accounts==null?[]:this.props.values.accounts.fiscalYear;
    const accountVol = this.state.arrAccountVol; //this.props.values.accounts==null?[]:this.props.values.accounts.accountVol;
    const percentage = this.state.arrPercentage;
    const formItems = keys.map((k, index) => (
      <Row gutter={12}>
        <Col span={8}>
          <FormItem
            label={formatMessage({ id: 'project.ModifyForm.AccountBudget.AccountName' })}
            required={false}
            key={'aN_' + k}
            //style={{border:'solid 1px #f00'}}
          >
            {getFieldDecorator('accountName[' + k + ']', {
              initialValue: accountName[k] + '',
              //validateTrigger: ['onChange', 'onBlur'],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={formatMessage({
                  id: 'project.ModifyForm.AccountBudget.AccountName.PlaceHolder',
                })} /*style={{width: '100%',border:'solid 1px #000' }}*/
              >
                {accountOptions}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            label={formatMessage({ id: 'project.ModifyForm.AccountBudget.FiscalYear' })}
            required={false}
            key={'fY_' + k}
          >
            {getFieldDecorator('fiscalYear[' + k + ']', {
              initialValue: fiscalYear[k] + '',
            })(
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={formatMessage({
                  id: 'project.ModifyForm.AccountBudget.FiscalYear.PlaceHolder',
                })} /*style={{width: '100%',border:'solid 1px #000' }}*/
              >
                {fiscalOptions}
              </Select>,
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem
            label={formatMessage({ id: 'project.ModifyForm.AccountBudget.Budget' })}
            required={false}
            key={'aV_' + k}
          >
            {getFieldDecorator('accountVol[' + k + ']', {
              initialValue: accountVol[k] + '',
            })(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                step={500}
                min={0}
                onChange={value => {
                  this.onBudgetChange(value, k);
                }}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem
            label={formatMessage({ id: 'project.ModifyForm.AccountBudget.Percentage' })}
            required={false}
            key={'aP_' + k}
            //style={{border:'solid 1px #f00'}}
          >
            {getFieldDecorator('percentage[' + k + ']', {
              initialValue: percentage[k] + '',
            })(
              <InputNumber
                disabled={true}
                min={0}
                max={100}
                style={{ width: '100%' }}
                formatter={value => `${value}%`}
                parser={value => (typeof value === 'undefined' ? 0 : value.replace('%', ''))}
                // onChange={onChange}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
              style={{ marginTop: '50px' }}
            />
          ) : null}
        </Col>
      </Row>
    ));

    return (
      <Form>
        <Divider>{formatMessage({ id: 'project.ModifyForm.Divider.ProjectDetails' })}</Divider>
        <Row gutter={0}>
          <Col span={0}>
            <FormItem
              key="project_id"
              {...this.formLayout}
              label={'Project Id'}
              style={{ display: 'none' }}
            >
              {form.getFieldDecorator('project_id', {
                initialValue: formVals.project_id,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="project_code"
              {...this.formLayout}
              label={formatMessage({
                id: 'project.NewCreateForm.Column.ProjectCode',
              })} /*style={{display:"none"}}*/
            >
              {form.getFieldDecorator('project_code', {
                initialValue: formVals.project_code,
              })(
                <Input
                  prefix={'NO.'}
                  disabled={true}
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                  style={{ textAlign: 'center' }}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="project_name"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.ProjectName' })}
            >
              {form.getFieldDecorator('project_name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.ProjectName.RulesMessage',
                    }),
                    min: 1,
                  },
                ],
                initialValue: formVals.project_name,
              })(<Input placeholder={formatMessage({ id: 'project.SearchInputTips' })} />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="customer_id"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.CustomerId' })}
            >
              {form.getFieldDecorator('customer_id', {
                initialValue: formVals.customer_id + '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.CustomerName.RulesMessage',
                    }),
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {cusOptions}
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              key="owner"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Owner' })}
            >
              {form.getFieldDecorator('owner', {
                initialValue: formVals.owner_id + '',
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.Owner.RulesMessage',
                    }),
                  },
                ],
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  <OptGroup label="Sales">{salesOptions}</OptGroup>
                  <OptGroup label="BD">{bdOptions}</OptGroup>
                  <OptGroup label="PSS">{pssOptions}</OptGroup>
                  <OptGroup label="APC">{apcOptions}</OptGroup>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="status"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Status' })}
            >
              {form.getFieldDecorator('status', { initialValue: formVals.status_id + '' })(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  disabled={true}
                  style={{ width: '100%' }}
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
          <Col span={12}>
            <FormItem
              key="support_type"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.SupportType' })}
            >
              {form.getFieldDecorator('support_type', {
                initialValue: formVals.support_type_id + '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  style={{ width: '100%' }}
                >
                  {supportTypeOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="plan_working_hours"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.PlanWorkingHours' })}
            >
              {form.getFieldDecorator('plan_working_hours', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.AddItem.PlanWorkingHour.ValidationEmpty',
                    }),
                  },
                  {
                    pattern: /^[0-9]*[1-9][0-9]*$/,
                    message: formatMessage({
                      id: 'project.NewCreateForm.AddItem.PlanWorkingHour.ValidationPositive',
                    }),
                  },
                ],
                initialValue: formVals.plan_working_hours,
              })(
                <Input
                  onChange={this.onPlanWorkingHourChange}
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                  suffix="H"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="hour_rate"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.RMBPerHour' })}
            >
              {form.getFieldDecorator('hour_rate', {
                rules: [{ required: true }],
                initialValue: formVals.hour_rate,
              })(
                <InputNumber
                  min={300}
                  max={600}
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  style={{ width: '100%' }}
                  step={150}
                  onChange={this.onHourRateChange}
                  // value={this.state.formVals.hour_rate}
                />,
              )}
              {/* <label>  per hour</label> */}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="plan_budget"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.PlanBudget' })}
            >
              {form.getFieldDecorator('plan_budget', {
                //rules: [{ required: true}],
                initialValue: formVals.plan_budget,
              })(<Input style={{ width: '100%' }} disabled={true} suffix={'RMB'} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="sales_order_volume"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.SalesOrderVolume' })}
            >
              {form.getFieldDecorator('sales_order_volume', {
                rules: [{ required: true }],
                initialValue: formVals.sales_order_volume,
              })(
                <InputNumber
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  step={500}
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="project_run_status"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.ProjectStatus' })}
            >
              {form.getFieldDecorator('project_run_status', {
                initialValue: formVals.project_run_status_id + '',
              })(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  style={{ width: '100%' }}
                >
                  {projectRunStatusOptions}
                  {/* <Option value="1">{formatMessage({ id: 'project.SupportTypeOption.After' })}</Option>
                            <Option value="2">{formatMessage({ id: 'project.SupportTypeOption.Before' })}</Option>
                            <Option value="3">{formatMessage({ id: 'project.SupportTypeOption.Train' })}</Option> */}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="start_time"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.StartTime' })}
            >
              {form.getFieldDecorator('start_time', {
                //  rules: [{ required: true, min: 1 }],
                initialValue: moment(formVals.start_time),
              })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="end_time"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.EndTime' })}
            >
              {form.getFieldDecorator('end_time', {
                // rules: [{ required: true, min: 1 }],
                initialValue: moment(formVals.end_time),
              })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="update_time"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.UpdateTime' })}
            >
              {form.getFieldDecorator('update_time', {
                //  rules: [{ required: true, min: 1 }],
                initialValue: moment(formVals.update_time),
              })(<DatePicker disabled={true} format={dateFormat} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={0}>
          <Col span={24} pull={0}>
            <FormItem key="support_reason" {...this.formLayout} label={'Comments'}>
              {form.getFieldDecorator('support_reason', {
                initialValue: formVals.support_reason,
              })(
                <TextArea
                  rows={2}
                  autosize={{ minRows: 2, maxRows: 4 }}
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Divider>{formatMessage({ id: 'project.ModifyForm.Divider.ResponsiblePerson' })}</Divider>
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="engineer"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Engineers' })}
            >
              {form.getFieldDecorator('engineer', {
                initialValue: formVals.arrEngineerId,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.Engineers.RulesMessage',
                    }),
                  },
                ],
              })(
                <Select
                  showSearch
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'project.NewCreateForm.Column.Apc.placeholder',
                  })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  <OptGroup label="Sales">{salesOptions}</OptGroup>
                  <OptGroup label="BD">{bdOptions}</OptGroup>
                  <OptGroup label="PSS">{pssOptions}</OptGroup>
                  <OptGroup label="APC">{apcOptions}</OptGroup>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="bd"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Bd' })}
            >
              {form.getFieldDecorator('bd', {
                initialValue: formVals.arrBdId,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'project.NewCreateForm.Column.Bd.RulesMessage' }),
                  },
                ],
              })(
                <Select
                  showSearch
                  mode="multiple"
                  placeholder={formatMessage({ id: 'project.NewCreateForm.Column.Bd.placeholder' })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {bdOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="pss"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Pss' })}
            >
              {form.getFieldDecorator('pss', {
                initialValue: formVals.arrPssId,
              })(
                <Select
                  showSearch
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'project.NewCreateForm.Column.Pss.placeholder',
                  })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {pssOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="sales"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Sales' })}
            >
              {form.getFieldDecorator('sales', {
                initialValue: formVals.arrSalesId,
              })(
                <Select
                  showSearch
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'project.NewCreateForm.Column.Sales.placeholder',
                  })}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {salesOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>

        <Divider>{formatMessage({ id: 'project.ModifyForm.Divider.AccountBudget' })}</Divider>
        <Row gutter={0} /*style={{border:"solid 1px #000"}}*/>
          <Col span={24} /*style={{border:"solid 1px #f00"}}*/>
            <FormItem
              {...this
                .formLayout} /*label={formatMessage({ id: 'project.NewCreateForm.Column.Partner' })}*/
            >
              <Button
                type="dashed"
                onClick={this.add}
                style={{ width: '100%', marginLeft: '40%', backgroundColor: '#A5E1E1' }}
              >
                <Icon type="plus" /> {'Link a Account'}
              </Button>
            </FormItem>
          </Col>
        </Row>
        {formItems}
      </Form>
    );
  };

  render() {
    const { form, handleModify, modifyModalVisible, handleModifyModalVisible, values } = this.props;
    const { formVals } = this.state;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        handleModify(fieldsValue);
        form.resetFields();
        itemId = 0;
      });
    };

    const cancelHandle = () => {
      //debugger
      form.resetFields();
      itemId = 0;
      this.setState({
        formVals: {
          sales_order_volume: 0,
        },
        sonoDisable: true,
        arrPercentage: [],
        planBudget: 0,
      });
      //debugger
      handleModifyModalVisible(false, values);
    };

    return (
      <Modal
        width={950}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={formatMessage({ id: 'project.ModifyForm.Title' })}
        visible={modifyModalVisible}
        onOk={okHandle}
        keyboard={true}
        onCancel={() => cancelHandle()}
        afterClose={() => handleModifyModalVisible()}
        centered={true}
        // footer={
        //   [
        //     <Button key="back" onClick={cancelHandle}>
        //       Cancel
        //     </Button>,
        //     <Button key="submit" type="primary" onClick={okHandle}>
        //       OK
        //     </Button>,
        //   ]
        // }
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default Form.create<ModifyFormProps>()(ModifyForm);
