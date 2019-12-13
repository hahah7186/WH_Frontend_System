import { Form, Input, Modal,Select,InputNumber,Switch,Row,Col,Icon } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React,{ Component } from 'react';
import { Group,Role,Post } from '../data.d';
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';

import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  groupList:Group[];
  roleList:Role[];
  postList:Post[];
  handleAdd: (
    fieldsValue: {
      member_id:number;
      member_name:string;
      member_name_en:string;
      family_name:string;
      given_name:string;
      group_id:number;
      group_name:string;
      g_id:string;
      email:string;
      mobile:string;
      portrait_url:string;
      role_name:string;
      role_id:number;
      post_name:string;
      post_id:number;
      org_name:string;
      branch_id:number;
      branch_name:string;
    },
  ) => void;
  handleModalVisible: () => void;
}

 interface CreateFormState {
   fiscalYearDisable:boolean;
 }


class CreateForm extends Component<CreateFormProps, CreateFormState> {

  constructor(props: CreateFormProps) {
    super(props);

    this.state = {
      fiscalYearDisable: true,
      
      // currentStep: 0,
    };
  }
 
  render(){

    const { modalVisible, form, handleAdd, handleModalVisible,groupList,postList,roleList } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleAdd(fieldsValue);
      });
    };
  
    const toggleFiscalYearDisable = () =>{
        this.setState({
          fiscalYearDisable: !this.state.fiscalYearDisable,
        });
    };
  
    // const getFiscalYear = (roleList:Role[]) =>{
    //   let returnVal = -1;
    //   roleList.forEach((item)=>{
    //     if(moment((item.role_name-1)+"1001").isBefore(moment()) && moment(item.role_name+"0930").isAfter(moment())){
    //         returnVal = item.role_id;
    //     }
    //   });
    //   return returnVal;
    // };
  
    // const initialFiscalYear = getFiscalYear(roleList);
    const groupOptions = typeof(groupList)=="undefined"?[]:groupList.map(d => <Option key={d.group_id}>{d.group_name}</Option>);
    const roleOptions = typeof(roleList)=="undefined"?[]:roleList.map(d => <Option key={d.role_id}>{d.role_name}</Option>);
    const postOptions = typeof(postList)=="undefined"?[]:postList.map(d => <Option key={d.post_id}>{d.post_name}</Option>);
      
    const prefixSelector = form.getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="010">010</Option>
      </Select>,
    );

    return (
        <Modal
          destroyOnClose
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          title={formatMessage({ id: 'Account.CreateModel.Title' })}
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.ChineaseName' })}>
            {form.getFieldDecorator('member_name', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.ChineaseName.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.EnglishName' })}>
            {form.getFieldDecorator('member_name_en', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.EnglishName.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.FamilyName' })}>
            {form.getFieldDecorator('family_name', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.FamilyName.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.GivenName' })}>
            {form.getFieldDecorator('given_name', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.GivenName.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.Group' })}>
            {form.getFieldDecorator('group_id', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.Group.ValidationMessage' }) }],
            })(
              <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                {groupOptions}
              </Select>
            )}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.Role' })} /*style={{border:"solid 1px #0f0"}}*/>
                  {form.getFieldDecorator('role_id',{
                     rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.Role.ValidationMessage' }) }],
                  })(
                    <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                      {roleOptions}
                    </Select>,
                  )}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.Post' })}>
              {form.getFieldDecorator('post_id',{
                 rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.Post.ValidationMessage' }) }],
              })(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                    {postOptions}
              </Select>,
                  )}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.Orgnization' })}>
            {form.getFieldDecorator('org_name', {initialValue:"RC-CN DI FA", rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.ChineaseName.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.Email' })}>
              {form.getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: formatMessage({ id: 'Member.CreateForm.Column.Email.ValidationMessage.Type' }),
                  },
                  {
                    required: true,
                    message: formatMessage({ id: 'Member.CreateForm.Column.Email.ValidationMessage.Null' }),
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.PhoneNumber' })}>
            {form.getFieldDecorator('mobile', {
              rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.PhoneNumber.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} addonBefore={prefixSelector} style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Member.CreateForm.Column.GID' })}>
            {form.getFieldDecorator('g_id', {
               rules: [{ required: true, message: formatMessage({ id: 'Member.CreateForm.Column.GID.ValidationMessage' }) }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}/>)}
          </FormItem>
        </Modal>
      );
    }
}

export default Form.create<CreateFormProps>()(CreateForm);
