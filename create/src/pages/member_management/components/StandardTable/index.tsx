import { Alert, Table } from 'antd';
import { ColumnProps, TableRowSelection, TableProps } from 'antd/es/table';
import React, { Component, Fragment } from 'react';

import { AccountTableListItem } from '../../data.d';
import styles from './index.less';

import { formatMessage,FormattedMessage } from 'umi-plugin-react/locale';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface StandardTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: StandardTableColumnProps[];
  data: {
    list: AccountTableListItem[];
    pagination: StandardTableProps<AccountTableListItem>['pagination'];
  };
  selectedRows: AccountTableListItem[];
  onSelectRow: (rows: any) => void;
}

export interface StandardTableColumnProps extends ColumnProps<AccountTableListItem> {
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

class StandardTable extends Component<StandardTableProps<AccountTableListItem>, StandardTableState> {
  static getDerivedStateFromProps(nextProps: StandardTableProps<AccountTableListItem>) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  constructor(props: StandardTableProps<AccountTableListItem>) {
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

  handleRowSelectChange: TableRowSelection<AccountTableListItem>['onChange'] = (
    selectedRowKeys,
    selectedRows: AccountTableListItem[],
  ) => {
    const currySelectedRowKeys = selectedRowKeys as string[];
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys: currySelectedRowKeys, needTotalList });
  };

  handleTableChange: TableProps<AccountTableListItem>['onChange'] = (
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
    const { selectedRowKeys, needTotalList } = this.state;
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};

    const paginationProps = pagination ? {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    } : false;

    const rowSelection: TableRowSelection<AccountTableListItem> = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: (record: AccountTableListItem) => ({
        //disabled: record.disabled,
        disabled: false,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                <FormattedMessage id="Customer.StandardTable.Selection.Text1" /> <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> <FormattedMessage id="Customer.StandardTable.Selection.Text2" /> &nbsp;&nbsp;
                {needTotalList.map((item, index) => (
                  <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                    {item.title}
                    <FormattedMessage id="Customer.StandardTable.Selection.Text3" /> &nbsp;
                    <span style={{ fontWeight: 600 }}>
                      {item.render
                        ? item.render(item.total, item as AccountTableListItem, index)
                        : item.total}
                    </span>
                  </span>
                ))}
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                  <FormattedMessage id="Customer.StandardTable.Selection.Text4" /> 
                </a>
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          rowKey={rowKey || 'id'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
