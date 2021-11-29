import { Card, Radio } from 'antd';

import { FormattedMessage } from 'umi-plugin-react/locale';
import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { VisitDataType } from '../data';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSupport = ({
  dropdownGroup,
  supportType,
  loading,
  supportPieData,
  handleChangeSupportType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  supportType: 'supportProjectNumber' | 'supportProjectCostNumber';
  supportPieData: VisitDataType[];
  handleChangeSupportType?: (e: RadioChangeEvent) => void;
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id="analysis.analysis.the-proportion-of-support"
        defaultMessage="The Proportion of Support Type"
      />
    }
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
        {dropdownGroup}
        <div className={styles.salesTypeRadio}>
          <Radio.Group value={supportType} onChange={handleChangeSupportType}>
            <Radio.Button value="supportProjectNumber">
              <FormattedMessage
                id="analysis.analysis.supportTypeProjectNumber"
                defaultMessage="supportTypeProjectNumber"
              />
            </Radio.Button>
            <Radio.Button value="supportProjectCostNumber">
              <FormattedMessage
                id="analysis.analysis.supportTypeWorkingHour"
                defaultMessage="supportTypeWorkingHour"
              />
            </Radio.Button>
            {/* <Radio.Button value="branchProjectCostNumber">
              <FormattedMessage id="analysis.channel.stores" defaultMessage="branchProjectCostNumber" />
            </Radio.Button> */}
          </Radio.Group>
        </div>
      </div>
    }
  >
    <div>
      <h4 style={{ marginTop: 8, marginBottom: 32 }}>
        <FormattedMessage id="analysis.analysis.support" defaultMessage="Support" />
      </h4>
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="analysis.analysis.support" defaultMessage="Support" />}
        total={() => {
          supportPieData.reduce((pre, now) => now.y + pre, 0);
        }}
        data={supportPieData}
        valueFormat={value => value}
        height={500}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSupport;
