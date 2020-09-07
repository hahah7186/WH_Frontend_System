import {
  /*Button,*/ DatePicker,
  Form,
  Input,
  Modal,
  /*Radio,*/ Select /*, Steps*/,
  InputNumber,
  Row,
  Col,
  Slider,
  Divider,
  Icon,
  Button,
  message,
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { FormComponentProps } from 'antd/es/form';

import {
  ListItemDataType /*,MemberSelect*/,
  CustomerSelect,
  Member,
  supportType,
  AccountExportItem,
  FiscalYearItem,
} from '../../data.d';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

const { TextArea } = Input;

let itemId = 0;

export interface FormValsType extends Partial<ListItemDataType> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface CreateFormProps extends FormComponentProps {
  handleCreateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleCreate: (values: FormValsType) => void;

  createModalVisible: boolean;
  values: Partial<ListItemDataType>;
  apcList: Member[];
  bdList: Member[];
  pssList: Member[];
  salesList: Member[];
  supportTypeList: supportType[];
  customerList: CustomerSelect[];
  accountList: AccountExportItem[];
  fiscalList: FiscalYearItem[];
}
//定义控件
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

export interface CreateState {
  formVals: FormValsType;
  sonoDisable: boolean;
  arrPercentage: number[];
  planBudget: number;
  arrAccountVol: number[];
  //currentStep: number;
}

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 7 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 12 },
//     md: { span: 10 },
//   },
// };

class CreateForm extends Component<CreateFormProps, CreateState> {
  //20200715 huzhonghao
  // static defaultProps = {
  //   handleCreate: () => {},
  //   handleCreateModalVisible: () => {},
  //   values: {},
  //   apcList: [],
  //   customerList: [],
  // };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: CreateFormProps) {
    super(props);

    this.state = {
      formVals: {
        id: props.values.id,
        customer_name: '',
        customer_id: props.values.customer_id,
        project_name: props.values.project_name,
        project_code: props.values.project_code,
        support_type: props.values.support_type,
        support_type_id: props.values.support_type_id,
        support_reason: props.values.support_reason,
        start_time: props.values.start_time,
        end_time: props.values.end_time,
        update_time: props.values.update_time,
        status_id: props.values.status_id,
        plan_working_hours: 0,
        sales_order_volume: 0,
        comments: props.values.comments,
        engineers: props.values.engineers,
        actual_running_time: props.values.actual_running_time,
        hour_rate: 0,
      },
      sonoDisable: true,
      arrPercentage: [],
      planBudget: 0,
      // currentStep: 0,
      arrAccountVol: [],
    };
  }

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
      //如果有两个账户
      this.setState({
        arrAccountVol: arrAccountVol,
        arrPercentage: arrPercentage,
      });
    }
    itemId++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: newKeys,
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // 如果删除的是数组最小下标或者数组值小于1则返回
    if (keys.length === 1 || k === 0) {
      return;
    }

    //const accountName = getFieldValue('accountName');
    let accountName = [
      ...(this.props.values.accounts == null ? [] : this.props.values.accounts.accountName),
    ]; //form.getFieldValue('accountName');
    accountName.splice(k, 1);
    let fiscalYear = [
      ...(this.props.values.accounts == null ? [] : this.props.values.accounts.fiscalYear),
    ];
    fiscalYear.splice(k, 1);
    let accountVol = [
      ...(this.props.values.accounts == null ? [] : this.props.values.accounts.accountVol),
    ];
    accountVol.splice(k, 1);

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
      accountName: accountName,
      fiscalYear: fiscalYear,
      accountVol: accountVol,
    });
  };

  onSupportTypeChange = value => {
    if (value === '1') {
      this.setState({
        sonoDisable: false,
      });
    } else {
      this.setState({
        sonoDisable: true,
      });
    }
  };

  onPlanWorkingHourChange = event => {
    //const planWorkingHour = this.props.form.getFieldValue("plan_working_hours");
    const hourRate = this.props.form.getFieldValue('hour_rate');
    const planBudget = event.target.value * (typeof hourRate === 'undefined' ? 0 : hourRate);

    this.props.form.setFieldsValue({
      plan_budget: planBudget,
    });

    this.setState((prevState, props) => ({
      planBudget: planBudget,
    }));

    //  this.setState({
    //    planBudget:planBudget
    //  });

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

  onBudgetChange = (value, k) => {
    let arrAccountVol = this.props.form.getFieldValue('accountVol');
    arrAccountVol[k] = value;
    const arrPercentage = this.getPercentageArr(arrAccountVol);
    this.setState({
      arrAccountVol: arrAccountVol,
      arrPercentage: arrPercentage,
    });
  };

  renderContent = () => {
    const { form, apcList, customerList, bdList, pssList, salesList, supportTypeList } = this.props;
    const dateFormat = 'YYYY/MM/DD';
    const apcOptions =
      typeof apcList == 'undefined'
        ? []
        : apcList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const bdOptions =
      typeof bdList == 'undefined'
        ? []
        : bdList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const pssOptions =
      typeof pssList == 'undefined'
        ? []
        : pssList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const salesOptions =
      typeof salesList == 'undefined'
        ? []
        : salesList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);

    const cusOptions =
      typeof customerList == 'undefined'
        ? []
        : customerList.map(d => <Option key={d.value}>{d.text}</Option>);

    const supportTypeOprions =
      typeof supportTypeList == 'undefined'
        ? []
        : supportTypeList.map(d => <Option key={d.support_type_id}>{d.support_type_name}</Option>);

    const accountOptions =
      typeof this.props.accountList == 'undefined'
        ? []
        : this.props.accountList.map(d => <Option key={d.account_id}>{d.account_name}</Option>);
    const fiscalOptions =
      typeof this.props.fiscalList == 'undefined'
        ? []
        : this.props.fiscalList.map(d => <Option key={d.fiscal_id}>{d.fiscal_year}</Option>);
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator('keys', {
      initialValue: this.props.values.accounts == null ? [] : this.props.values.accounts.keys,
    });
    //  debugger
    let keys = getFieldValue('keys');

    const arrPercentage = this.state.arrPercentage;
    const arrAccountVol = this.state.arrAccountVol;

    const formItems = keys.map((k, index) => (
      <Row gutter={12}>
        <Col span={8}>
          <FormItem
            label={formatMessage({ id: 'project.ModifyForm.AccountBudget.AccountName' })}
            required={false}
            key={'aN_' + k}
          >
            {getFieldDecorator('accountName[' + k + ']', {})(
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
            {getFieldDecorator('fiscalYear[' + k + ']', {})(
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
              initialValue: typeof arrAccountVol[k] === 'undefined' ? 0 : arrAccountVol[k] + '',
            })(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
          >
            {getFieldDecorator('percentage[' + k + ']', {
              initialValue: typeof arrPercentage[k] === 'undefined' ? 0 : arrPercentage[k] + '',
            })(
              <InputNumber
                disabled={true}
                min={0}
                max={100}
                style={{ width: '100%' }}
                formatter={value => `${value}%`}
                parser={value => (typeof value === 'undefined' ? 0 : value.replace('%', ''))}
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
        <Divider>Project Information</Divider>
        {/* 第一行 */}
        <Row gutter={0}>
          <Col span={24} pull={3}>
            {/* 项目ID：默认不显示 */}
            <FormItem
              key="id"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.ProjectNo' })}
              style={{ display: 'none' }}
            >
              {form.getFieldDecorator('id', {
                // initialValue: formVals.id,
              })(
                <Input
                  prefix={'NO.'}
                  disabled={true}
                  placeholder={formatMessage({
                    id: 'project.NewCreateForm.Column.ProjectNo.placeholder',
                  })}
                  style={{ textAlign: 'center' }}
                />,
              )}
            </FormItem>
            {/* 项目名称 */}
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
                //initialValue: formVals.project_name,
              })(<Input placeholder={formatMessage({ id: 'project.SearchInputTips' })} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 第二行 */}
        <Row gutter={0}>
          <Col span={24} pull={3}>
            <FormItem
              key="customer_id"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.CustomerId' })}
            >
              {form.getFieldDecorator('customer_id', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.CustomerName.RulesMessage',
                    }),
                  },
                ],
                // initialValue: formVals.customer_id + "",
              })(
                <Select
                  showSearch
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  dropdownMatchSelectWidth={false}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                >
                  {cusOptions}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        {/* 第三行 */}
        <Row>
          <Col span={24} pull={3}>
            <FormItem
              key="project_code"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.ProjectCode' })}
            >
              {form.getFieldDecorator('project_code', {
                rules: [{ required: true }],
                initialValue:
                  '******************************Auto Generated******************************',
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 第四行 */}
        <Row gutter={0}>
          {/* 客户 */}
          <Col span={24} pull={3}>
            {/* 项目拥有人 */}
            <FormItem
              key="owner"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Owner' })}
            >
              {form.getFieldDecorator('owner', {
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
                  placeholder={'Please select project owner'}
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
        {/* 第五行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="engineers"
              {...this.formLayout}
              style={{ marginLeft: '26px' }}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Engineers' })}
            >
              {form.getFieldDecorator('engineers', {
                //initialValue: formVals.arrApcId,
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
              key="sales"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Sales' })}
            >
              {form.getFieldDecorator('sales', {
                //initialValue: formVals.sales + "",
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

        {/* 第六行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="bd"
              {...this.formLayout}
              style={{ marginLeft: '26px' }}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Bd' })}
            >
              {form.getFieldDecorator('bd', {
                //initialValue: formVals.bd + "",
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
          <Col span={12}>
            <FormItem
              key="pss"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Pss' })}
            >
              {form.getFieldDecorator('pss', {
                //initialValue: formVals.pss + "",
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
        </Row>

        {/* 第七行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="support_type"
              style={{ marginLeft: '26px' }}
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.SupportType' })}
            >
              {form.getFieldDecorator('support_type', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'project.NewCreateForm.Column.SupportType.RulesMessage',
                    }),
                  },
                ],
              })(
                <Select
                  placeholder={formatMessage({ id: 'project.SearchSelectTips' })}
                  onChange={this.onSupportTypeChange}
                  style={{ width: '100%' }}
                >
                  {supportTypeOprions}
                </Select>,
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
                initialValue: 300,
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
        {/* 第六行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="plan_working_hours"
              style={{ marginLeft: '26px' }}
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
              })(
                <Input
                  onChange={this.onPlanWorkingHourChange}
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                  suffix="H"
                  //value={this.state.formVals.plan_working_hours}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="plan_budget"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.PlanBudget' })}
            >
              {form.getFieldDecorator('plan_budget', {
                //rules: [{ required: true}],
                // initialValue: formVals.plan_working_hours,
              })(<Input style={{ width: '100%' }} disabled={true} suffix={'RMB'} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 第七行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="sales_order_volume"
              style={{ marginLeft: '26px' }}
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.SalesOrderVolume' })}
            >
              {form.getFieldDecorator('sales_order_volume', {
                rules: [{ required: true }],
                initialValue: 0,
              })(
                <InputNumber
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  step={500}
                  min={0}
                  // value={this.state.formVals.sales_order_volume}
                  //onChange={this.onSalesVolumeChange}
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem key="so_no" {...this.formLayout} label={'SO No.'}>
              {form.getFieldDecorator('so_no', {
                //rules: [{ required: true}],
              })(<Input style={{ width: '100%' }} disabled={this.state.sonoDisable} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 第八行 */}
        <Row gutter={0}>
          <Col span={12}>
            <FormItem
              key="start_time"
              style={{ marginLeft: '26px' }}
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.PlanStart' })}
            >
              {form.getFieldDecorator('start_time', {
                //  rules: [{ required: true, min: 1 }],
                initialValue: moment(),
              })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              key="end_time"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.PlanEnd' })}
            >
              {form.getFieldDecorator('end_time', {
                // rules: [{ required: true, min: 1 }],
                initialValue: moment(),
              })(<DatePicker format={dateFormat} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        {/* 第九行 */}
        <Row gutter={0}>
          <Col span={24} pull={3}>
            <FormItem
              key="support_reason"
              {...this.formLayout}
              label={formatMessage({ id: 'project.NewCreateForm.Column.Comments' })}
            >
              {form.getFieldDecorator('support_reason', {
                // initialValue: formVals.support_reason,
              })(
                <TextArea
                  rows={4}
                  cols={5}
                  placeholder={formatMessage({ id: 'project.SearchInputTips' })}
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Divider>{formatMessage({ id: 'project.NewCreateForm.Column.AccountBudget' })}</Divider>
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
                <Icon type="plus" />{' '}
                {formatMessage({ id: 'project.NewCreateForm.Column.LinkAccount' })}
              </Button>
            </FormItem>
          </Col>
        </Row>
        {formItems}
      </Form>
    );
  };

  render() {
    const { form, handleCreate, createModalVisible, handleCreateModalVisible, values } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleCreate(fieldsValue);
      });
    };

    const cancelHandle = () => {
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
      handleCreateModalVisible(false, values);
    };

    return (
      <Modal
        width={950}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={formatMessage({ id: 'project.NewCreateForm.Title' })}
        visible={createModalVisible}
        onOk={okHandle}
        keyboard={true}
        onCancel={cancelHandle}
        afterClose={() => handleCreateModalVisible()}
        centered={true}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default Form.create<CreateFormProps>()(CreateForm);
