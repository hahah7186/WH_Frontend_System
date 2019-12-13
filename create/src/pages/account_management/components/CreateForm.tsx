import { Form, Input, Modal,Select,InputNumber,Switch,Row,Col,Icon } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React,{ Component } from 'react';
import { FiscalYear,AccountType,MemberSelect } from '../data.d';
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';

import moment from 'moment';

const FormItem = Form.Item;
const { Option,OptGroup } = Select;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  fiscalYearList:FiscalYear[];
  accountTypeList:AccountType[];
  apcList:MemberSelect[];
  bdList:MemberSelect[];
  pssList:MemberSelect[];
  salesList:MemberSelect[];
  handleAdd: (
    fieldsValue: {
      id: number;
      account_name: string;
      fiscal_year: number;
      budget: number;
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

    const { modalVisible, form, handleAdd, handleModalVisible,fiscalYearList,accountTypeList,apcList,bdList,pssList,salesList } = this.props;

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
  
    const getFiscalYear = (fiscalYearList:FiscalYear[]) =>{
      let returnVal = -1;
      if(typeof(fiscalYearList)!="undefined"){
          fiscalYearList.forEach((item)=>{
          if(moment((item.fiscal_year-1)+"1001").isBefore(moment()) && moment(item.fiscal_year+"0930").isAfter(moment())){
              returnVal = item.fiscal_id;
          }
          });
      }
      return returnVal;
    };
  
    const initialFiscalYear = getFiscalYear(fiscalYearList);
    const fiscalYearOptions = typeof(fiscalYearList)=="undefined"?[]:fiscalYearList.map(d => <Option key={d.fiscal_id}>{d.fiscal_year}</Option>);
    const accountTypeOptions = typeof(accountTypeList)=="undefined"?[]:accountTypeList.map(d => <Option key={d.type_id}>{d.type_name}</Option>);

    const apcOptions = typeof(apcList)=="undefined"?[]:apcList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const bdOptions = typeof(bdList)=="undefined"?[]:bdList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const pssOptions = typeof(pssList)=="undefined"?[]:pssList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);
    const salesOptions = typeof(salesList)=="undefined"?[]:salesList.map(d => <Option key={d.member_id}>{d.member_name}</Option>);

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
          {/* <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={"Account No."}>
            {form.getFieldDecorator('id', {
              // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
            })(<Input disabled={true} placeholder={"### Automatically Generate ###"} style={{textAlign:"center"}}/>)}
          </FormItem> */}
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.AccountName' })}>
            {form.getFieldDecorator('account_name', {
              // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
            })(<Input/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.AccountOwner' })}>
            {form.getFieldDecorator('member_id', {
              // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
            })(              
            <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
              <OptGroup label={formatMessage({ id: 'project.ColumnSales' })}>
                {salesOptions}
                </OptGroup>
                <OptGroup label={formatMessage({ id: 'project.ColumnBd' })}>
                {bdOptions}
                </OptGroup>
                <OptGroup label={formatMessage({ id: 'project.ColumnPss' })}>
                {pssOptions}
                </OptGroup>
                <OptGroup label={formatMessage({ id: 'project.ColumnApc' })}>
                {apcOptions}
                </OptGroup>
            </Select>
          )}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.AccountType' })}>
            {form.getFieldDecorator('account_type_id', {
              // rules: [{ required: true, message: formatMessage({ id: 'customer.NewCreateCustomer.FormItem.ValidationTips' }), min: 1 }],
            })(
              <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
                {accountTypeOptions}
              </Select>
            )}
          </FormItem>
          {/* <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={"Account Owner"}>
            {form.getFieldDecorator('account_owner')(
              <Select placeholder={formatMessage({ id: 'customer.CustomerSelectTips' })} style={{width: '100%' }}>
               
              </Select>
            )}
          </FormItem> */}
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={"FY"} /*style={{border:"solid 1px #0f0"}}*/>
              <Row gutter={8}>
                <Col span={20}>
                  {form.getFieldDecorator('fiscal_year',{initialValue:initialFiscalYear+""})(
                    <Select style={{width: '100%' }}  disabled={this.state.fiscalYearDisable}>
                      {fiscalYearOptions}
                    </Select>,
                  )}
                  </Col>
                  <Col span={4}>
                    <Switch size={"default"} onChange={() => toggleFiscalYearDisable()} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />} defaultChecked/>
                  </Col>
                </Row>
          </FormItem>
          
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.Budget' })}>
              {form.getFieldDecorator('budget',
                  {initialValue:0}
              )(
                    <InputNumber
                    style={{width: '100%' }}
                    // defaultValue={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    step={500}
                    min={0}
                    // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    // onChange={onChange}
                  />
                  )}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.SAPOrder' })}>
            {form.getFieldDecorator('sap_order', {
            })(<Input/>)}
          </FormItem>
          <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 13 }} label={formatMessage({ id: 'Account.CreateModel.Column.Comments' })}>
            {form.getFieldDecorator('comments')(
              <TextArea rows={12}/>
            )}
          </FormItem> 
          
        </Modal>
      );
    }
}

export default Form.create<CreateFormProps>()(CreateForm);
