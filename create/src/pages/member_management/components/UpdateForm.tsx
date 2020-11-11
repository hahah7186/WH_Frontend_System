import {
  /*Button, DatePicker,*/ Form,
  Input,
  Modal,
  InputNumber,
  /*Radio,*/ Select /*, Steps*/,
} from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { MemberTableListItem } from '../data';
import { Role, Post, Group } from '../data.d';

import { formatMessage /*(FormattedMessage*/ } from 'umi-plugin-react/locale';

const { TextArea } = Input;

export interface FormValsType extends Partial<MemberTableListItem> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleUpdate: (values: FormValsType) => void;
  roleList: Role[];
  postList: Post[];
  groupList: Group[];
  updateModalVisible: boolean;
  values: Partial<MemberTableListItem>;
}
//定义控件
const FormItem = Form.Item;
const { Option } = Select;

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
        member_id: props.values.member_id,
        member_name: props.values.member_name,
        member_name_en: props.values.member_name_en,
        family_name: props.values.family_name,
        given_name: props.values.given_name,
        role_id: props.values.role_id,
        role_name: props.values.role_name,
        post_id: props.values.post_id,
        post_name: props.values.post_name,
        group_id: props.values.group_id,
        group_name: props.values.group_name,
        branch_id: props.values.branch_id,
        branch_name: props.values.branch_name,
        g_id: props.values.g_id,
        mobile: props.values.mobile,
        org_name: props.values.org_name,
        email: props.values.email,
      },
      // currentStep: 0,
    };
  }

  renderContent = (formVals: FormValsType) => {
    //console.log(formVals);
    const { form, roleList, groupList, postList } = this.props;
    // let fisInitialVal = -1;
    // roleList.forEach((item)=>{
    //   if(item.fiscal_year == formVals){
    //     fisInitialVal = item.fiscal_id;
    //   }
    // });

    // let accountTypeInitiaVal = -1;
    // accountTypeList.forEach((item)=>{
    //   if(item.type_name == formVals.account_type){
    //     accountTypeInitiaVal = item.type_id;
    //   }
    // });
    const groupOptions = groupList.map(d => <Option key={d.group_id}>{d.group_name}</Option>);
    const roleOptions = roleList.map(d => <Option key={d.role_id}>{d.role_name}</Option>);
    const postOptions = postList.map(d => <Option key={d.post_id}>{d.post_name}</Option>);

    const prefixSelector = form.getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="010">010</Option>
      </Select>,
    );

    return [
      <FormItem
        key="member_id"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 13 }}
        label={'Name'}
        style={{ display: 'none' }}
      >
        {form.getFieldDecorator('member_id', {
          initialValue: formVals.member_id,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="member_name"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.ChineaseName' })}
      >
        {form.getFieldDecorator('member_name', {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.ChineaseName.ValidationMessage',
              }),
              min: 1,
            },
          ],
          initialValue: formVals.member_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="member_name_en"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.EnglishName' })}
      >
        {form.getFieldDecorator('member_name_en', {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.EnglishName.ValidationMessage',
              }),
              min: 1,
            },
          ],
          initialValue: formVals.member_name_en,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="family_name"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.FamilyName' })}
      >
        {form.getFieldDecorator('family_name', {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.FamilyName.ValidationMessage',
              }),
              min: 1,
            },
          ],
          initialValue: formVals.family_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="given_name"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.GivenName' })}
      >
        {form.getFieldDecorator('given_name', {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.GivenName.ValidationMessage',
              }),
              min: 1,
            },
          ],
          initialValue: formVals.given_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="group_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.Group' })}
      >
        {form.getFieldDecorator('group_id', {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'Member.CreateForm.Column.Group.ValidationMessage' }),
            },
          ],
          initialValue: formVals.group_id + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            style={{ width: '100%' }}
          >
            {groupOptions}
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="role_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.Role' })}
      >
        {form.getFieldDecorator('role_id', {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'Member.CreateForm.Column.Role.ValidationMessage' }),
            },
          ],
          initialValue: formVals.role_id + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            style={{ width: '100%' }}
          >
            {roleOptions}
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="post_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.Post' })}
      >
        {form.getFieldDecorator('post_id', {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'Member.CreateForm.Column.Post.ValidationMessage' }),
            },
          ],
          initialValue: formVals.post_id + '',
        })(
          <Select
            placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })}
            style={{ width: '100%' }}
          >
            {postOptions}
          </Select>,
        )}
      </FormItem>,
      <FormItem
        key="org_name"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.Orgnization' })}
      >
        {form.getFieldDecorator('org_name', {
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.ChineaseName.ValidationMessage',
              }),
              min: 1,
            },
          ],
          initialValue: formVals.org_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="email"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.Email' })}
      >
        {form.getFieldDecorator('email', {
          initialValue: formVals.email,
          rules: [
            {
              type: 'email',
              message: formatMessage({
                id: 'Member.CreateForm.Column.Email.ValidationMessage.Type',
              }),
            },
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.Email.ValidationMessage.Null',
              }),
            },
          ],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem
        key="sap_order"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.PhoneNumber' })}
      >
        {form.getFieldDecorator('phone', {
          initialValue: formVals.mobile,
          rules: [
            {
              required: true,
              message: formatMessage({
                id: 'Member.CreateForm.Column.PhoneNumber.ValidationMessage',
              }),
            },
          ],
        })(
          <Input
            placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}
            addonBefore={prefixSelector}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>,
      <FormItem
        key="g_id"
        {...this.formLayout}
        label={formatMessage({ id: 'Member.CreateForm.Column.GID' })}
      >
        {form.getFieldDecorator('g_id', {
          initialValue: formVals.g_id,
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'Member.CreateForm.Column.GID.ValidationMessage' }),
              min: 1,
            },
          ],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
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
