import {
  /*Button, DatePicker,*/ Form,
  Input,
  Modal,
  InputNumber,
  /*Radio,*/ Select /*, Steps*/,
} from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { AccountTableListItem } from '../data';
import { FiscalYear, AccountType, MemberSelect } from '../data.d';

import { formatMessage /*(FormattedMessage*/ } from 'umi-plugin-react/locale';

const { TextArea } = Input;

export interface FormValsType extends Partial<AccountTableListItem> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleUpdate: (values: FormValsType) => void;
  fiscalYearList: FiscalYear[];
  accountTypeList: AccountType[];
  apcList: MemberSelect[];
  bdList: MemberSelect[];
  pssList: MemberSelect[];
  salesList: MemberSelect[];
  updateModalVisible: boolean;
  values: Partial<AccountTableListItem>;
}
//定义控件
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

export interface UpdateFormState {
  formVals: FormValsType;
  //currentStep: number;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor(props: UpdateFormProps) {
    super(props);
    debugger;
    this.state = {
      formVals: {
        account_id: props.values.account_id,
        member_id: props.values.member_id,
        member_name: props.values.member_name,
        member_name_en: props.values.member_name_en,
        account_name: props.values.account_name,
        account_type_id: props.values.account_type_id,
        fiscal_year: props.values.fiscal_year,
        budget: props.values.budget,
        sap_order: props.values.sap_order,
        comments: props.values.comments,
      },
      // currentStep: 0,
    };
  }

  renderContent = (formVals: FormValsType) => {
    //console.log(formVals);
    const {
      form,
      fiscalYearList,
      accountTypeList,
      apcList,
      bdList,
      pssList,
      salesList,
    } = this.props;
    let fisInitialVal = -1;
    fiscalYearList.forEach(item => {
      if (item.fiscal_year == formVals.fiscal_year) {
        fisInitialVal = item.fiscal_id;
      }
    });

    let accountTypeInitiaVal = -1;
    // accountTypeList.forEach((item)=>{
    //   if(item.type_name == formVals.account_type){
    //     accountTypeInitiaVal = item.type_id;
    //   }
    // });
    const fiscalYearOptions = fiscalYearList.map(d => (
      <Option key={d.fiscal_id}>{d.fiscal_year}</Option>
    ));
    const accountTypeOptions = accountTypeList.map(d => (
      <Option key={d.type_id}>{d.type_name}</Option>
    ));
    // debugger
    const apcOptions = apcList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const bdOptions = bdList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const pssOptions = pssList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const salesOptions = salesList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    return [
      <FormItem
        key="account_id"
        {...this.formLayout}
        label={formatMessage({ id: 'project.NewCreateForm.Column.ProjectNo' })}
        style={{ display: 'none' }}
      >
        {form.getFieldDecorator('account_id', {
          initialValue: formVals.account_id,
        })(<Input prefix={'NO.'} disabled={true} style={{ textAlign: 'center' }} />)}
      </FormItem>,
      <FormItem
        key="account_name"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.ModifyModel.Column.AccountName' })}
      >
        {form.getFieldDecorator('account_name', {
          // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }) , min: 1}],
          initialValue: formVals.account_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="account_type_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.ModifyModel.Column.AccountType' })}
      >
        {form.getFieldDecorator('account_type_id', {
          // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }) , min: 1}],
          initialValue: formVals.account_type_id + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            style={{ width: '100%' }}
          >
            {accountTypeOptions}
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="member_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.ModifyModel.Column.AccountOwner' })}
      >
        {form.getFieldDecorator('member_id', {
          // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }) , min: 1}],
          initialValue: formVals.member_id + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            style={{ width: '100%' }}
          >
            <OptGroup label={formatMessage({ id: 'project.ColumnSales' })}>{salesOptions}</OptGroup>
            <OptGroup label={formatMessage({ id: 'project.ColumnBd' })}>{bdOptions}</OptGroup>
            <OptGroup label={formatMessage({ id: 'project.ColumnPss' })}>{pssOptions}</OptGroup>
            <OptGroup label={formatMessage({ id: 'project.ColumnApc' })}>{apcOptions}</OptGroup>
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="fiscal_year"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.ModifyModel.Column.FiscalYear' })}
      >
        {form.getFieldDecorator('fiscal_year', {
          // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
          initialValue: fisInitialVal + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            disabled
            style={{ width: '100%' }}
          >
            {fiscalYearOptions}
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="budget"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.CreateModel.Column.Budget' })}
      >
        {form.getFieldDecorator('budget', { initialValue: formVals.budget })(
          <InputNumber
            style={{ width: '100%' }}
            // defaultValue={0}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            step={500}
            min={0}
            // parser={value => value.replace(/\$\s?|(,*)/g, '')}
            // onChange={onChange}
          />,
        )}
      </FormItem>,
      <FormItem
        key="sap_order"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.CreateModel.Column.SAPOrder' })}
      >
        {form.getFieldDecorator('sap_order', { initialValue: formVals.sap_order })(
          <Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />,
        )}
      </FormItem>,
      <FormItem
        key="comments"
        {...this.formLayout}
        label={formatMessage({ id: 'Account.CreateModel.Column.Comments' })}
      >
        {form.getFieldDecorator('comments', { initialValue: formVals.comments })(
          <TextArea rows={12} />,
        )}
      </FormItem>,
    ];
  };

  render() {
    const { form, handleUpdate, updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;
    //console.log(formVals);
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={formatMessage({ id: 'customer.UpdateCustomer.Title' })}
        visible={updateModalVisible}
        onOk={okHandle}
        // footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
