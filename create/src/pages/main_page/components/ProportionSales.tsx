import { Card, Radio } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { VisitDataType } from '../data.d';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'branchCustomerNumber' | 'branchProjectNumber' | 'branchProjectCostNumber';
  salesPieData: VisitDataType[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id="analysis.analysis.the-proportion-of-sales"
        defaultMessage="The Proportion of Sales"
      />
    }
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={salesType} onChange={handleChangeSalesType}>
            <Radio.Button value="branchCustomerNumber">
              <FormattedMessage id="analysis.channel.all" defaultMessage="branchCustomerNumber" />
            </Radio.Button>
            <Radio.Button value="branchProjectNumber">
              <FormattedMessage id="analysis.channel.online" defaultMessage="branchProjectNumber" />
            </Radio.Button>
            <Radio.Button value="branchProjectCostNumber">
              <FormattedMessage
                id="analysis.channel.stores"
                defaultMessage="branchProjectCostNumber"
              />
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4 style={{ marginTop: 8, marginBottom: 32 }}>
        <FormattedMessage id="analysis.analysis.sales" defaultMessage="Sales" />
      </h4>
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="analysis.analysis.sales" defaultMessage="Sales" />}
        total={() => {
          salesPieData.reduce((pre, now) => now.y + pre, 0);
        }}
        data={salesPieData}
        valueFormat={value => value}
        height={500}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSales;
