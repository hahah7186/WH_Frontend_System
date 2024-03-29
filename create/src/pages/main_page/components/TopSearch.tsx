import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { SearchDataType, VisitDataType } from '../data.d';

import { MiniArea } from './Charts';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';

const columns = [
  {
    title: <FormattedMessage id="analysis.table.rank" defaultMessage="projectId" />,
    dataIndex: 'projectId',
    key: 'projectId',
  },
  {
    title: <FormattedMessage id="analysis.table.search-keyword" defaultMessage="Search keyword" />,
    dataIndex: 'projectName',
    key: 'projectName',
    // render: (text: React.ReactNode) => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="analysis.table.users" defaultMessage="workingHour" />,
    dataIndex: 'workingHour',
    key: 'workingHour',
    // sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
    // className: styles.alignRight,
  },
  {
    title: <FormattedMessage id="analysis.table.weekly-range" defaultMessage="supportType" />,
    dataIndex: 'supportType',
    key: 'supportType',
  },
  {
    title: <FormattedMessage id="analysis.table.weekly-range" defaultMessage="startTime" />,
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: <FormattedMessage id="analysis.table.weekly-range" defaultMessage="endTime" />,
    dataIndex: 'endTime',
    key: 'endTime',
  },
];

const TopSearch = ({
  loading,
  // visitData2,
  searchData,
}: // dropdownGroup,
{
  loading: boolean;
  // visitData2: VisitDataType[];
  // dropdownGroup: React.ReactNode;
  searchData: SearchDataType[];
}) => (
  <Card
    loading={loading}
    bordered={false}
    title={
      <FormattedMessage
        id="analysis.analysis.online-top-search"
        defaultMessage="Online Top Search"
      />
    }
    // extra={dropdownGroup}
    style={{
      height: '100%',
    }}
  >
    {/* <Row gutter={68} type="flex">
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage
                id="analysis.analysis.search-users"
                defaultMessage="search users"
              />
              <Tooltip
                title={
                  <FormattedMessage id="analysis.analysis.introduce" defaultMessage="introduce" />
                }
              >
                <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
          gap={8}
          total={numeral(12321).format('0,0')}
          status="up"
          subTotal={17.1}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
      <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
        <NumberInfo
          subTitle={
            <span>
              <FormattedMessage
                id="analysis.analysis.per-capita-search"
                defaultMessage="Per Capita Search"
              />
              <Tooltip
                title={
                  <FormattedMessage id="analysis.analysis.introduce" defaultMessage="introduce" />
                }
              >
                <Icon style={{ marginLeft: 8 }} type="info-circle-o" />
              </Tooltip>
            </span>
          }
          total={2.7}
          status="down"
          subTotal={26.2}
          gap={8}
        />
        <MiniArea line height={45} data={visitData2} />
      </Col>
    </Row> */}
    <Table<any>
      rowKey={record => record.index}
      size="small"
      columns={columns}
      dataSource={searchData}
      pagination={{
        style: { marginBottom: 0 },
        pageSize: 5,
      }}
    />
  </Card>
);

export default TopSearch;
