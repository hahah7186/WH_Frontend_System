import { Alert, Table, Card } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { ListItemDataType } from '../../data.d';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: ListItemDataType[];
    //pagination: StandardTableProps<ListItemDataType>['pagination'];
  };
  visible: boolean;
  //selectedRows: ListItemDataType[];
  //onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<ListItemDataType> {
  needTotal?: boolean;
  total?: number;
}

function initTotalList(columns: StandardTableColumnProps[]) {
  if (!columns) {
    return [];
  }
  const totalList: StandardTableColumnProps[] = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

interface StandardTableState {
  selectedRowKeys: string[];
  needTotalList: StandardTableColumnProps[];
}

class StandardTable extends Component<StandardTableProps<ListItemDataType>, StandardTableState> {
  // static getDerivedStateFromProps(nextProps: StandardTableProps<ListItemDataType>) {
  //   // clean state
  //   if (nextProps.selectedRows.length === 0) {
  //     const needTotalList = initTotalList(nextProps.columns);
  //     return {
  //       selectedRowKeys: [],
  //       needTotalList,
  //     };
  //   }
  //   return null;
  // }

  constructor(props: StandardTableProps<ListItemDataType>) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    //console.log(columns);
    //console.log(needTotalList);
    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  handleRowSelectChange: TableRowSelection<ListItemDataType>['onChange'] = (
    selectedRowKeys,
    selectedRows: ListItemDataType[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    //const { onSelectRow } = this.props;
    // if (onSelectRow) {
    //   onSelectRow(selectedRows);
    // }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<ListItemDataType>['onChange'] = (
    pagination,
    filters,
    sorter,
    ...rest
  ) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys /*needTotalList*/ } = this.state;
    const { visible, data, rowKey, ...rest } = this.props;
    // debugger
    let tableVisible = 'none';
    switch (visible) {
      case true:
        tableVisible = 'none';
        break;
      case false:
        tableVisible = 'block';
        break;
    }

    const { list = [] /* pagination = false*/ } = data || {};
    debugger;
    let renderList = list;
    renderList.forEach(item => {
      item.engineers = '';
      item.bd = '';
      item.pss = '';
      item.sales = '';
      const prjMembers = item.member;
      prjMembers.forEach(mem => {
        switch (mem.role_id) {
          case 1: //apc
            if (item.apc == '') {
              item.apc = mem.member_name;
            } else {
              item.apc = item.apc + ',' + mem.member_name;
            }
            break;
          case 2: //bd
            if (item.bd == '') {
              item.bd = mem.member_name;
            } else {
              item.bd = item.bd + ',' + mem.member_name;
            }
            break;
          case 3: //pss
            if (item.pss == '') {
              item.pss = mem.member_name;
            } else {
              item.pss = item.pss + ',' + mem.member_name;
            }
            break;
          case 4: //sales
            if (item.sales == '') {
              item.sales = mem.member_name;
            } else {
              item.sales = item.sales + ',' + mem.member_name;
            }
            break;
        }
      });

      const prjEngineers = item.engineer;

      prjEngineers.forEach(eng => {
        if (item.engineers == '') {
          item.engineers = eng.member_name;
        } else {
          item.engineers = item.engineers + ',' + eng.member_name;
        }
      });

      item.str_start_time = item.start_time.toString().substring(0, 10);
      item.str_end_time = item.end_time.toString().substring(0, 10);
      item.str_update_time = item.update_time.toString().substring(0, 10);
    });

    return (
      <div className={styles.standardTable} style={{ display: tableVisible }}>
        <Card bordered={false}>
          <Table
            // visible={visible}
            rowKey="project_id"
            //rowSelection={rowSelection}
            dataSource={renderList}
            pagination={false}
            onChange={this.handleTableChange}
            {...rest}
          />
        </Card>
      </div>
    );
  }
}

export default StandardTable;
