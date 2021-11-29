import { Col, Icon, Row, Tooltip } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import {
  VisitDataType,
  TotalWorkingHour,
  ProjectFiscalYear,
  TeamInfo,
  TotalWorkingHourFiscalYear,
  CustomerInfo,
} from '../data.d';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({
  loading,
  visitData,
  totalWorkingHour,
  projectFiscalYear,
  // teamInfo,
  customerInfo,
  totalWorkingHourFiscalYear,
}: {
  loading: boolean;
  visitData: VisitDataType[];
  totalWorkingHour: TotalWorkingHour;
  projectFiscalYear: ProjectFiscalYear;
  // teamInfo: TeamInfo;
  customerInfo: CustomerInfo;
  totalWorkingHourFiscalYear: TotalWorkingHourFiscalYear;
}) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={
          <FormattedMessage
            id="analysis.analysis.working-hour"
            defaultMessage="Total Working Hour"
          />
        }
        action={
          <Tooltip
            title={<FormattedMessage id="analysis.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => totalWorkingHour.totalHour}
        footer={
          <Field
            label={
              <FormattedMessage id="analysis.analysis.day-sales" defaultMessage="Daily Sales" />
            }
            value={`￥${numeral(totalWorkingHour.totalMoney).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="analysis.analysis.normal-hour" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>{totalWorkingHour.normalHour}</span>
        </Trend>
        <Trend flag="up">
          <FormattedMessage id="analysis.analysis.overtime-hour" defaultMessage="Daily Changes" />
          <span className={styles.trendText}>{totalWorkingHour.overtimeHour}</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={
          <FormattedMessage id="analysis.analysis.workingHourFiscalYear" defaultMessage="Visits" />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="analysis.analysis.introduceWorkingHourFiscalYear"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(totalWorkingHourFiscalYear.totalWorkingHourFiscalYear).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage id="analysis.analysis.day-visits" defaultMessage="Daily Visits" />
            }
            value={`￥${numeral(totalWorkingHourFiscalYear.totalFiscalYearVolume).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <MiniBar color="#48D1CC" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="analysis.analysis.payments" defaultMessage="Payments" />}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="analysis.analysis.introduceProjectNumberFiscalYear"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(projectFiscalYear.projectNumber).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="analysis.analysis.conversion-rate"
                defaultMessage="Total project number"
              />
            }
            value={projectFiscalYear.totalProjectNumber}
          />
        }
        contentHeight={46}
      >
        {/* <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="analysis.analysis.normal-hour" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>{totalWorkingHour.normalHour}</span>
        </Trend>
        <Trend flag="up">
          <FormattedMessage id="analysis.analysis.overtime-hour" defaultMessage="Daily Changes" />
          <span className={styles.trendText}>{totalWorkingHour.overtimeHour}</span>
        </Trend> */}
        <MiniProgress
          percent={Math.round(
            (projectFiscalYear.projectNumber * 100) / projectFiscalYear.totalProjectNumber,
          )}
          strokeWidth={8}
          target={100}
          color="#48D1CC"
        />
        {/* <MiniBar data={visitData} /> */}
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          <FormattedMessage
            id="analysis.analysis.supportCustomerFiscalYear"
            defaultMessage="Operational Effect"
          />
        }
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="analysis.analysis.introduceSupportCustomer"
                defaultMessage="Introduce"
              />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={customerInfo.customerNumberForSupport}
        footer={
          // <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          //   <Trend flag="up" style={{ marginRight: 18 }}>
          //     <FormattedMessage id="analysis.analysis.bdnumber" defaultMessage="BD Number" />
          //     <span className={styles.trendText}>{}</span>
          //   </Trend>
          //   <Trend flag="down" style={{ marginRight: 18 }}>
          //     <FormattedMessage id="analysis.analysis.pssnumber" defaultMessage="PSS Number" />
          //     <span className={styles.trendText}>{}</span>
          //   </Trend>
          //   <Trend flag="up">
          //     <FormattedMessage id="analysis.analysis.salesnumber" defaultMessage="Sales Number" />
          //     <span className={styles.trendText}>{}</span>
          //   </Trend>
          // </div>
          <Field
            label={
              <FormattedMessage
                id="analysis.analysis.totalCustomerNumber"
                defaultMessage="Total customer number"
              />
            }
            value={customerInfo.customerNumber}
          />
        }
        contentHeight={46}
      >
        <MiniProgress
          percent={Math.round(
            (customerInfo.customerNumberForSupport * 100) / customerInfo.customerNumber,
          )}
          strokeWidth={8}
          target={100}
          color="#48D1CC"
        />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
