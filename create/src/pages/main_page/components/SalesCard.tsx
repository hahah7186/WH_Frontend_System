import { Card, Col, DatePicker, Row, Tabs, Switch } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

import { RangePickerValue } from 'antd/es/date-picker/interface';
import React from 'react';
import numeral from 'numeral';
import { RankingListData, VisitDataType } from '../data.d';
import { Bar } from './Charts';
import styles from '../style.less';
import Yuan from '../utils/Yuan';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// const rankingListData: { title: string; total: number }[] = [];
// for (let i = 0; i < 7; i += 1) {
//   rankingListData.push({
//     title: formatMessage({ id: 'analysis.analysis.test' }, { no: i }),
//     total: 323234,
//   });
// }

const SalesCard = ({
  rangePickerValue,
  salesData,
  salesVolume,
  isActive,
  handleRangePickerChange,
  handleSwitchView,
  loading,
  selectDate,
  rankingListData,
  rankingListVolume,
}: {
  rangePickerValue: RangePickerValue;
  isActive: (key: 'today' | 'week' | 'month' | 'year') => string;
  salesData: VisitDataType[];
  salesVolume: VisitDataType[];
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  handleSwitchView: (checked: boolean) => void;
  selectDate: (key: 'today' | 'week' | 'month' | 'year') => void;
  rankingListData: RankingListData[];
  rankingListVolume: RankingListData[];
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a className={isActive('today')} onClick={() => selectDate('today')}>
                <FormattedMessage id="analysis.analysis.all-day" defaultMessage="All Day" />
              </a>
              <a className={isActive('week')} onClick={() => selectDate('week')}>
                <FormattedMessage id="analysis.analysis.all-week" defaultMessage="All Week" />
              </a>
              <a className={isActive('month')} onClick={() => selectDate('month')}>
                <FormattedMessage id="analysis.analysis.all-month" defaultMessage="All Month" />
              </a>
              <a className={isActive('year')} onClick={() => selectDate('year')}>
                <FormattedMessage id="analysis.analysis.all-year" defaultMessage="All Year" />
              </a>
              <a>
                <Switch
                  size="default"
                  checkedChildren={formatMessage({ id: 'analysis.analysis.switchCheck' })}
                  unCheckedChildren={formatMessage({ id: 'analysis.analysis.switchunCheck' })}
                  onChange={checked => handleSwitchView(checked)}
                  defaultChecked
                />
              </a>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{ width: 256 }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane
          tab={<FormattedMessage id="analysis.analysis.sales" defaultMessage="Sales" />}
          key="sales"
        >
          <Row type="flex">
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={400}
                  title={
                    <FormattedMessage
                      id="analysis.analysis.sales-trend"
                      defaultMessage="Sales Trend"
                    />
                  }
                  data={salesData}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  <FormattedMessage
                    id="analysis.analysis.sales-ranking"
                    defaultMessage="Sales Ranking"
                  />
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span className={styles.rankingItemValue}>
                        {numeral(item.total).format('0,0')}
                      </span>
                      <span>&nbsp;h</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={<FormattedMessage id="analysis.analysis.visits" defaultMessage="Visits" />}
          key="views"
        >
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar
                  height={400}
                  title={
                    <FormattedMessage
                      id="analysis.analysis.visits-trend"
                      defaultMessage="Visits Trend"
                    />
                  }
                  data={salesVolume}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  <FormattedMessage
                    id="analysis.analysis.visits-ranking"
                    defaultMessage="Visits Ranking"
                  />
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListVolume.map((item, i) => (
                    <li key={item.title}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                        {item.title}
                      </span>
                      <span>{`￥${numeral(item.total).format('0,0')}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default SalesCard;
