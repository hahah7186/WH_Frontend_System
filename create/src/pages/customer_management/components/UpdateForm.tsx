import { /*Button, DatePicker,*/ Form, Input, Modal, /*Radio,*/ Select/*, Steps*/ } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data';
import { Branch,CustomerType } from '../data.d';
import { formatMessage,/*(FormattedMessage*/ } from 'umi-plugin-react/locale';

export interface FormValsType extends Partial<TableListItem> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleUpdate: (values: FormValsType) => void;
  
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  branchList:Branch[];
  customerTypeList:CustomerType[];
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

    this.state = {
      formVals: {
        id:props.values.id,
        customer_no:props.values.customer_no,
        customer_name: props.values.customer_name,
        customer_name_en: props.values.customer_name_en,
        customer_type_id:props.values.customer_type_id,
        customer_type: props.values.customer_type,
        branch_id:props.values.branch_id,
        branch: props.values.branch,
        cnoc: props.values.cnoc,
      },
      // currentStep: 0,
    };
  }

  renderContent = ( formVals: FormValsType) => {debugger
    //console.log(formVals);
    const { form,branchList,customerTypeList } = this.props;
  //   let branch ;
  //    switch(formVals.branch){
  //      case "Converting":
  //         branch = "1"; 
  //         break;
  //      case "Metalforming":
  //         branch = "2"; 
  //         break;
  //      case "Printing":
  //         branch = "3"; 
  //         break;
  //      case "Packaging":
  //         branch = "4"; 
  //         break;
  //      case "Rubber":
  //         branch = "5"; 
  //         break;  
  //      case "Textile":
  //         branch = "6"; 
  //         break;   
  //      case "Tire":
  //         branch = "7"; 
  //         break;   
  //      case "Wood":
  //         branch = "8"; 
  //         break;               
  //      case "Glass":
  //         branch = "9"; 
  //         break;   
  //      case "Handling":
  //         branch = "10"; 
  //         break;   
  //      case "Solar":
  //         branch = "11"; 
  //         break;           
  //   }
    
  //   let customerType;
  //   switch(formVals.customer_type){
  //     case "PMA account":
  //        customerType = "1"; 
  //        break;
  //     case "none PMA account":
  //        customerType = "2"; 
  //        break;
  //  }

   const branchOption = branchList.map(d=><Option key={d.branch_id}>{d.branch_name}</Option>);
   const customerTypeOption = customerTypeList.map(d=><Option key={d.customerType_id}>{d.customerType_name}</Option>);

    return [
      <FormItem key="id" {...this.formLayout} label="id" style={{display:"none"}}>
      {form.getFieldDecorator('id', {
        initialValue: formVals.id,
      })(<Input prefix={"NO."} disabled={true} placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} style={{textAlign:"center"}}/>)}
      </FormItem>,
      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNoLabel' })}>
            {form.getFieldDecorator('customer_no', {
              initialValue: formVals.customer_no,
              rules: [{ required: true, message: "Customer No. can't be empty!", min: 1 }],
            })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
       </FormItem>,
      <FormItem key="customer_name" {...this.formLayout} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNameZHLabel' })}>
        {form.getFieldDecorator('customer_name', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }) , min: 1}],
          initialValue: formVals.customer_name,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })} />)}
      </FormItem>,
      <FormItem key="customer_name_en" {...this.formLayout} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerNameENLabel' })}>
        {form.getFieldDecorator('customer_name_en', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
          initialValue: formVals.customer_name_en,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}  />)}
      </FormItem>,
      <FormItem key="customer_type" {...this.formLayout} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerTypeLabel' })}>
          {form.getFieldDecorator('customer_type' , {initialValue: this.state.formVals.customer_type_id +"",})(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                  {customerTypeOption}
                </Select>,
              )}
      </FormItem>,
      <FormItem key="branch" {...this.formLayout} label={formatMessage({ id: 'customer.NewCreateCustomer.FormItem.CustomerBranchLabel' })}>
          {form.getFieldDecorator('branch' , {initialValue: this.state.formVals.branch_id+"",rules: [{ required: true }]})(
                <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                  {branchOption}
                </Select>,
              )}
      </FormItem>,
      <FormItem key="cnoc" {...this.formLayout} label="CNOC">
        {form.getFieldDecorator('cnoc', {
          rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
          initialValue: formVals.cnoc,
        })(<Input placeholder={formatMessage({ id: 'customer.CustomerInputTips' })}  />)}
      </FormItem>,
    ];
  };

 

  render() {
    
    const { form,handleUpdate,updateModalVisible, handleUpdateModalVisible, values } = this.props;
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
        title= {formatMessage({ id: 'customer.UpdateCustomer.Title' })}
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
