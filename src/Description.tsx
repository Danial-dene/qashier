import { Descriptions } from "antd";
import _ from "lodash";

type CustomDescriptionProps = {
  label: string;
  lowestLotAvailable: number;
  highestLotAvailable: number;
  highestLots: [];
  lowestLots: [];
  lowestCarparkNumber?: [];
};
const CustomDescription: React.FC<CustomDescriptionProps> = ({
  label,
  lowestLotAvailable,
  highestLotAvailable,
  highestLots,
  lowestLots,
  lowestCarparkNumber,
}) => {
  // get lot types
  const highestNames = _.map(highestLots, (obj) => obj.lot_type);
  const lowestNames = _.map(lowestLots, (obj) => obj.lot_type);

  // Eliminate same names
  const uniqueHighestNames = _.uniq(highestNames);
  const uniqueLowestNames = _.uniq(lowestNames);

  //   console.log("highestNames", highestLots);

  return (
    <Descriptions column={2} style={{ marginBottom: 30 }} bordered>
      <Descriptions.Item span={2} label="Size">
        {label}
      </Descriptions.Item>
      <Descriptions.Item label="Highest">
        <div>
          <p>Total: {highestLotAvailable}</p>
          <p>Type: {_.join(lowestCarparkNumber, ",")}</p>
        </div>
      </Descriptions.Item>
      <Descriptions.Item label="Lowest">
        <div>
          <p>Total: {lowestLotAvailable}</p>
          <p>Type: {_.join(uniqueLowestNames, ",") || "-"}</p>
        </div>
      </Descriptions.Item>
    </Descriptions>
  );
};
export default CustomDescription;
