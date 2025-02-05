import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurn } from "@fortawesome/free-solid-svg-icons/faBurn";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import FormattedBalance from "../components/FormattedBalance";
import PercentageGauge from "../components/PercentageGauge";
import { TransactionData } from "../types";
import { useChainInfo } from "../useChainInfo";

type RewardSplitProps = {
  txData: TransactionData;
};

const RewardSplit: React.FC<RewardSplitProps> = ({ txData }) => {
  const {
    nativeCurrency: { symbol },
  } = useChainInfo();
  const paidFees = txData.gasPrice.mul(txData.confirmedData!.gasUsed);
  const burntFees = txData.confirmedData!.blockBaseFeePerGas!.mul(
    txData.confirmedData!.gasUsed
  );

  const minerReward = paidFees.sub(burntFees);
  const burntPerc =
    Math.round(burntFees.mul(10000).div(paidFees).toNumber()) / 100;
  const minerPerc = Math.round((100 - burntPerc) * 100) / 100;

  return (
    <div className="inline-block">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 items-center text-sm">
        <PercentageGauge
          perc={burntPerc}
          bgColor="bg-orange-100"
          bgColorPerc="bg-orange-500"
          textColor="text-orange-800"
        />
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1 text-orange-500">
            <span title="Burnt fees">
              <FontAwesomeIcon icon={faBurn} size="1x" />
            </span>
            <span>
              <span className="line-through">
                <FormattedBalance value={burntFees} />
              </span>{" "}
              {symbol}
            </span>
          </span>
        </div>
        <PercentageGauge
          perc={minerPerc}
          bgColor="bg-amber-100"
          bgColorPerc="bg-amber-300"
          textColor="text-amber-700"
        />
        <div className="flex items-baseline space-x-1">
          <span className="flex space-x-1">
            <span className="text-amber-300" title="Miner fees">
              <FontAwesomeIcon icon={faCoins} size="1x" />
            </span>
            <span>
              <FormattedBalance value={minerReward} /> {symbol}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RewardSplit);
