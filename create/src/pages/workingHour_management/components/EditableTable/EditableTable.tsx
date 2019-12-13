import { Row, Col, Select, Table, /*Popconfirm,*/ Button, Form ,InputNumber,Input,DatePicker,message,Statistic,} from 'antd';
import { FormComponentProps } from 'antd/es/form';
//import * as React from 'react';
import React, { Component } from 'react';
import { WHListItem,MemberSearch,WHListColumns,WHListComments } from '../../data.d';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { WHStateType } from '../../model';
import moment from 'moment';
// import RcTable from 'rc-table';
import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';

const { MonthPicker} = DatePicker;
const { Option } = Select;
// const {ColumnProps} = RcTable;
const { TextArea } = Input;

// export interface WHListColumns extends Partial<ColumnProps> {
//   title: string;
//   dataIndex: string;
//   key: string,
//   width: string,
//   editable: boolean,
//   fixed: string,
// }

export interface FormValsType extends Partial<WHListItem> {
  //target?: string;
  //template?: string;
  //type?: string;
  //time?: string;
  //frequency?: string;
}

export interface WHListProps extends FormComponentProps {
  // handleUpdateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  // handleUpdate: (values: FormValsType) => void;
  handleBatchAdd: (values: WHListItem[],comments:WHListComments[],userId:string) => void;
  //editable:boolean;
  //values: Partial<WHListItem>;
  dispatch: Dispatch<any>;
  listTableList:WHStateType;
 // memberList:MemberSearch;
}

export interface WHListState {
  //formValues: FormValsType;
  //currentStep: number;
  // columns:
  editing:boolean;
  currentSelectMemberId:number;
  dataSource:WHListItem[];
  count:number;
  member:MemberSearch;
  columns:WHListColumns[];
  trueColumns:any[];
  comments:WHListComments[];
  commentShow:{
    prjId:string,
    key:string,
    content:string,
  };
  totalWorkingHour:number;

}
const FormItem = Form.Item;
const EditableContext = React.createContext({});

const EditableRow = ({ form, index, ...props }: any) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component<any, any> {

  public constructor(props: any) {
    super(props);
    //JSON.parse('{"name":"bob","age":34,"created":"2016-03-19T18:15:12.710Z"}')

    // const JsonStr = localStorage.getItem("comments");
    // const commentsJson = JSON.parse(JsonStr+'');

    this.state = {
      editing:false,
      //comments:commentsJson,
    }
  }

  // public state = {
  //   editing: false,
  //   comments: [],
  // }
  public editable: any;
  public input: any;
  public cell: any;
  public form: any;

  public componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
    //message.info("componentDidMount");
  }

  public componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
    //message.info("componentWillUnmount");
  }

  public handleOnClick = (e:any) =>{
    const { handleClearComments }: any = this.props;
    handleClearComments();
    this.toggleEdit();
  }

  public toggleEdit = () => {
    // debugger
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });

    //message.info("toggleEdit");
  }

  public handleClickOutside = (e: any) => {
    // debugger
    const { editing } = this.state;
    
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      //改变注释
      this.save();
    }
    //message.info("handleClickOutside");
  }

  // public changeComments = () => {
  //   // debugger
  //   const { handleComments,record }: any = this.props;
  //   this.form.validateFields((error: any, values: any) => {
  //     if (error) {
  //       return;
  //     }
  //     // debugger
  //     handleComments(values,record.prj_id);
  //   });
  // }

  public save = () => {
    
    const { record, handleSave }: any = this.props;
    this.form.validateFields((error: any, values: any) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values },values,record.prj_id);
    });
  }

  public render() {

    const { editing,
    } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      handleClearComments,
      ...restProps
    }: any = this.props;

    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {this.form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <InputNumber
                        min={0} max={12}
                        ref={node => (this.input = node)}
                        // onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.handleOnClick}
                    >
                      {restProps.children}
                    </div>
                  )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}


/* eslint react/no-multi-comp:0 */
@connect(
  ({
    listTableList,
    loading,
  }: {
    listTableList: WHStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    listTableList,
    loading: loading.models,
  }),
)
export class EditableTable extends Component<WHListProps, WHListState> {
  public dataSource: any;
  public trueColumns: any;

  static defaultProps = {
    handleBatchAdd: () => {},
  };
  

  public constructor(props: WHListProps) {
    super(props);
    this.state = {
      currentSelectMemberId:0,
      dataSource: [],
      editing:true,
      count:1,
      member:{
        list:[],
        count:0,
      },
      columns:[],
      trueColumns:[],
      comments:[],
      commentShow:{
        prjId:"",
        key:"",
        content:"",
      },
      totalWorkingHour:0,
    };
     this.trueColumns = [];
  }

  public handleDelete = (key: any) => {
    
    const { dataSource }: any = { ...this.state };
    this.setState({ dataSource: dataSource.filter((item: any) => item.key !== key) });

  }

  componentDidMount() {
    
  const { dispatch/*,form*/ } = this.props;

//1.获取member list
    dispatch({
      type: 'listTableList/fetchMember',
      payload: {
        userId: localStorage.getItem("userId"),        
      },
      callback: () => {
// debugger
        const {
          listTableList: { member },
        } = this.props;
        this.setState({
          member: member,
        });
      },
    });
  }


  
//点击查询按钮触发
handleSearch = (e: React.FormEvent) => {
   
  e.preventDefault();

  const { dispatch, form } = this.props;

  form.validateFields((err, fieldsValue) => {
    if (err) return;

    let values = {
      ...fieldsValue,
      updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
    };

    const time = values.year_month.format('YYYY-MM');
    values.year_month = time;
// debugger
    const currentSelectMemberId = fieldsValue.member_name;

    dispatch({
      type: 'listTableList/fetch',
      payload: values,
      callback: () => {
        const {
          listTableList: { data },
        } = this.props;
        //  debugger
        if(data.result == 1){

            this.setState({
              dataSource: data.list,
              columns: data.columns,
              comments: data.comments,
              //commentShow: typeof(data.comments[0])== "undefined" ? '无':data.comments[0].first,
            });
           
            let workingHour = 0;

            this.state.dataSource.forEach((item)=>{
              workingHour = workingHour + item.sum;
            });

           this.setState({
             totalWorkingHour:workingHour,
             trueColumns:this.state.columns,
             currentSelectMemberId:currentSelectMemberId,
            //commentShow:typeof(this.state.comments[0])== "undefined" ? '无':this.state.comments[0].first
           });
           
        }else{
          message.error('查询失败！请重新尝试');
        }
      },
    });
  });
};

  public handleClearComments = () => {
    // debugger
    // message.info("handleClearComments");
    this.setState({
      commentShow:{
        prjId:'-1',
        key:'-1',
        content:'',
      }
    },()=>{
      // console.log("handleClearComments");
      // console.log(this.state);
      // this.props.form.setFieldsValue({
      //   comments:this.state.commentShow.content,
      // });
    });
    this.props.form.setFieldsValue({
      comments:"",
    });
  }

  public handleSetComment = (e:any) =>{
      //debugger
      const projectId = this.state.commentShow.prjId;
      const curKey = this.state.commentShow.key;

      let comments = this.state.comments;

      comments.map(u=>{
          if(u.key == projectId.toString()){
            u[curKey] = e.target.value.toString();
          }
      });

      this.setState({
        comments:comments,
      },()=>{
        // console.log("handleSetComment");
        // console.log(this.state);
      });
  }

  public handleSave = (row: WHListItem, values: any, projectId: number) => {
    // debugger
    //获取子组件传过来的，修改值的key
    let comKey = Object.keys(values);
    let comVal = "";
    this.state.comments.map(u=>{
      if(u.key == projectId.toString()){
        comVal = u[comKey[0]];
      }
    });
    this.props.form.setFieldsValue({
      comments:comVal,
    });
    this.setState({
      commentShow:{
        prjId:projectId.toString(),
        key:comKey[0],
        content:comVal,
      }
    });

    //获取原sum值
    const sumOld = row.sum;
    let sumNew = 0;
      Object.keys(row).map(key => {
        if(key!='key' && key!='prj_name' && key!='prj_id' && key!='month' && key!='year' && key!='comments' && key!='sum'){
          sumNew += row[key];
        }
      });
    row.sum = sumNew;

    //算更改后的差值
    const diff = sumNew - sumOld;

    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item: any) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
       ...row,
    });
    const totalWorkingHour = this.state.totalWorkingHour;

    this.setState({
      dataSource: newData,
      totalWorkingHour: totalWorkingHour + diff,
    });
    
  }

  public render() {
    const { form } = this.props;
    
    const { getFieldDecorator } = form;

    const { handleBatchAdd } = this.props;
   
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
      //totalWorkingHour:0,
    };
    
    const okHandle = () => {
      
      const currentSelectMemberId = this.state.currentSelectMemberId;

      const userId = localStorage.getItem("userId");

      if(userId != currentSelectMemberId.toString()){
        message.error(formatMessage({ id: 'WorkingHour.EditableTable.SaveErroMessage' }));
        return;
      }

      handleBatchAdd(this.state.dataSource,this.state.comments,userId);
      this.setState({
        commentShow:{
          prjId:'',
          key:'',
          content:'',
        }
      });
    };

    const columns = this.state.trueColumns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          handleClearComments: this.handleClearComments,
          //totalworkinghour: this.state.totalWorkingHour,
        }),
      };
    });

    //月份选择器的默认格式
    const monthFormat = 'YYYY/MM';
    //当前年月
    const date = new Date();
    const thisMonth = date.getFullYear()+'/'+(date.getMonth()+1);
    const memberList = typeof(this.state.member.list)=="undefined"?[]:this.state.member.list;
    const options = memberList.map(d => <Option key={d.value}>{d.text}</Option>);

    return (
      <div>
        <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <Form.Item label={formatMessage({ id: 'WorkingHour.EditableTable.FormItem.YearMonth' })} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} required={false}>
            {getFieldDecorator('year_month',{initialValue:moment(thisMonth, monthFormat)})(
              <MonthPicker placeholder={formatMessage({ id: 'WorkingHour.EditableTable.FormItem.MonthPicker.Placeholder' })} style={{width: '15em' }}/>)}
            </Form.Item>
          </Col>
          <Col md={5} sm={24}>
            <Form.Item label={formatMessage({ id: 'WorkingHour.EditableTable.FormItem.ProjectName' })} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} required={false}>
            {getFieldDecorator('prj_name')(<Input placeholder={formatMessage({ id: 'WorkingHour.EditableTable.FormItem.ProjectName.Placeholder' })} style={{width: '15em' }}/>)}
              
            </Form.Item>
          </Col>   
          <Col md={5} sm={24}>
            <Form.Item label={formatMessage({ id: 'WorkingHour.EditableTable.FormItem.MemberSelection' })} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} required={false}>
            {getFieldDecorator('member_name',{
              initialValue: localStorage.getItem("userId"),
            })(
                <Select
                showSearch
                optionFilterProp="children"
                style={{width: '15em' }}
                >
                {options}
              </Select>
            )}
              
            </Form.Item>
          </Col>  

          <Col md={5} sm={24}>
            {/* <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right',marginRight:'2em'}}> */}
                <Button type="primary" htmlType="submit">
                  <FormattedMessage id="WorkingHour.EditableTable.ButtonSearch" />
                </Button>
                
          </Col>       
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'left'}}>
            {/* <Button icon="plus" type="primary" onClick={this.handleAdd}>
            新增项目
            </Button> */}
            <Button icon="save" type="primary" onClick={okHandle} style={{ marginLeft: '1em'}}>
                <FormattedMessage id="WorkingHour.EditableTable.ButtonSave" />
            </Button>
            <Button icon="export" style={{ marginLeft: '1em'}} onClick={() => message.warning("导出功能正在开发中，请耐心等待！")}>
                <FormattedMessage id="WorkingHour.EditableTable.ButtonExport" />
            </Button>
            </div>
            </div>
          </Col>
        </Row>
        
        <Table style={{ marginTop: '20px'}}
          components={components}
          dataSource={this.state.dataSource}
          columns={columns}
          scroll={{ x: 3200}}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.comments}</p>}
        />
        

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={3} sm={24}>
            <div style={{ float: 'right',marginRight:'0',marginTop:'3em'}}>
              <FormattedMessage id="WorkingHour.EditableTable.DailyComments" />
            </div>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ marginTop:'1em'}}>
            {/* <textarea>{this.state.commentShow.content}</textarea> */}
              {/* <Input type="textarea" defaultValue={this.state.commentShow.content.toString()}/> */}
              <FormItem>
                {
                    getFieldDecorator("comments", {
                        initialValue: this.state.commentShow.content
                    })(
                        <TextArea autosize={{minRows: 4, maxRows: 6}} onChange={this.handleSetComment.bind(this)}/>
                    )
                }
            </FormItem>
            </div>
          </Col>
          {/* <p>{this.state.commentShow.content}</p> */}
          <Col md={3} sm={24}>
            </Col>
        {/* </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}> */}
          <Col md={5} sm={24}>
            <Statistic title={formatMessage({ id: 'WorkingHour.EditableTable.SummaryPrjNumber' })} value={this.state.dataSource.length} />
          </Col>
          <Col md={5} sm={24}>
            <Statistic title={formatMessage({ id: 'WorkingHour.EditableTable.SummaryWorkingHours' })} value={ this.state.totalWorkingHour + " h"} />
          </Col>
          {/* <Col span={12}>
            <Statistic title="Account Balance (CNY)" value={112893} precision={2} />
            <Button style={{ marginTop: 16 }} type="primary">
              Recharge
            </Button>
          </Col> */}
 
        </Row>

        </Form>
      </div>
    );
  }
}

export default Form.create<WHListProps>()(EditableTable);