import { Card, Col, Row, Tabs } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { OfflineChartData, OfflineDataType, SearchDataType } from '../data.d';

import { TimelineChart, Pie } from './Charts';
import NumberInfo from './NumberInfo';
import styles from '../style.less';

const TopSearch = React.lazy(() => import('./TopSearch'));

const CustomTab = ({
  data,
  currentTabKey: currentKey,
}: {
  data: OfflineDataType;
  currentTabKey: string;
}) => (
  <Row gutter={8} style={{ width: 138, margin: '8px 0' }} type="flex">
    <Col span={12}>
      <NumberInfo
        title={data.name}
        subTitle={
          <FormattedMessage
            id="analysis.analysis.conversion-rate"
            defaultMessage="Conversion Rate"
          />
        }
        gap={2}
        total={data.cvr}
        theme={currentKey !== data.id ? 'light' : undefined}
      />
    </Col>
    {/* <Col span={12} style={{ paddingTop: 36 }}>
      <Pie
        animate={false}
        inner={0.55}
        tooltip={false}
        margin={[0, 0, 0, 0]}
        percent={data.cvr * 100}
        height={64}
      />
    </Col> */}
  </Row>
);

const { TabPane } = Tabs;

const OfflineData = ({
  activeKey,
  loading,
  offlineData,
  // offlineChartData,
  searchData,
  handleTabChange,
}: {
  activeKey: string;
  loading: boolean;
  offlineData: OfflineDataType[];
  // offlineChartData: OfflineChartData[];
  searchData: SearchDataType[];
  handleTabChange: (activeKey: string) => void;
}) => (
  <Card loading={loading} className={styles.offlineCard} bordered={false} style={{ marginTop: 32 }}>
    <Tabs activeKey={activeKey} onChange={handleTabChange}>
      {offlineData.map(customer => (
        <TabPane tab={<CustomTab data={customer} currentTabKey={activeKey} />} key={customer.id}>
          <div style={{ padding: '0 24px' }}>
            {/* <TimelineChart
              height={400}
              data={offlineChartData}
              titleMap={{
                y1: formatMessage({ id: 'analysis.analysis.traffic' }),
                y2: formatMessage({ id: 'analysis.analysis.payments' }),
              }}
            /> */}
            <TopSearch
              loading={loading}
              // visitData2={visitData2}
              searchData={searchData}
              // dropdownGroup={dropdownGroup}
            />
          </div>
        </TabPane>
      ))}
    </Tabs>
  </Card>
);

export default OfflineData;
