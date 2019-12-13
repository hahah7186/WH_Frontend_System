import { Form, Input, Modal,Select } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { Branch,CustomerType } from '../data.d';
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  branchList:Branch[];
  customerTypeList:CustomerType[];
  modalVisible: boolean;
  handleAdd: (
    fieldsValue: {
      customer_no:string;
      customer_name: string;
      customer_name_en: string;
      customer_type: string;
      branch: string;
      cnoc: string;
    },
  ) => void;
  handleModalVisible: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {

  
  const { modalVisible, form, handleAdd, handleModalVisible,branchList,customerTypeList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

const branchOption = typeof(branchList)=="undefined"?[]:branchList.map(d=><Option key={d.branch_id}>{d.branch_name}</Option>);
const customerTypeOption = typeof(customerTypeList)=="undefined"?[]:customerTypeList.map(d=><Option key={d.customerType_id}>{d.customerType_name}</Option>);
  return (
    <Modal
      destroyOnClose
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      title={formatMessage({ id: 'customer.NewCreateCustomer.Title' })}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNoLabel' })}>
        {form.getFieldDecorator('customer_no', {
          rules: [{ required: true, message: "Customer No. can't be empty!", min: 1 }],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNameZHLabel' })}>
        {form.getFieldDecorator('customer_name', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNameENLabel' })}>
        {form.getFieldDecorator('customer_name_en', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerTypeLabel' })}>
          {form.getFieldDecorator('customer_type')(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                  {customerTypeOption}
                </Select>,
              )}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerBranchLabel' })}>
          {form.getFieldDecorator('branch',{
          rules: [{ required: true }],
        })(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                   {branchOption} 
                </Select>,
              )}
      </FormItem>
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label="cnoc">
        {form.getFieldDecorator('cnoc', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 5 }],
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>
      
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
