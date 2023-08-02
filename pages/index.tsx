import { Card } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import CustomDescription from "../src/Description";

const Home = () => {
  const [data, setData] = useState();

  const [small, setSmall] = useState();
  const [medium, setMedium] = useState();
  const [big, setBig] = useState();
  const [large, setLarge] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // fetch data from api
  const fetchData = async () => {
    try {
      setLoading(true);
      //https://api.github.com/users/andrewbaldwin44
      const res = await fetch(
        "https://api.data.gov.sg/v1/transport/carpark-availability"
      );
      const data = await res.json();

      const { items } = data;

      const getItems = items[0].carpark_data;

      // filter by number of lots available
      const smallRecords = calculation(
        getItems,
        (value: number) => value < 100
      );
      setSmall(smallRecords);

      const mediumRecords = calculation(
        getItems,
        (value: number) => value >= 100 && value < 300
      );
      setMedium(mediumRecords);

      const bigRecords = calculation(
        getItems,
        (value: number) => value >= 300 && value < 400
      );
      setBig(bigRecords);

      const largeRecords = calculation(
        getItems,
        (value: number) => value >= 400
      );
      setLarge(largeRecords);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!small || !medium || !big || !large) return;

  const {
    lowestLotAvailable: smallLowestLotsAvailable,
    highestLotAvailable: smallHighestLotsAvailable,
    highestLots: smallHighestLots,
    lowestLots: smallLowestLots,
  } = small;

  const {
    lowestLotAvailable: mediumLowestLotsAvailable,
    highestLotAvailable: mediumHighestLotsAvailable,
    highestLots: mediumHighestLots,
    lowestLots: mediumLowestLots,
  } = medium;

  const {
    lowestLotAvailable: bigLowestLotsAvailable,
    highestLotAvailable: bigHighestLotsAvailable,
    highestLots: bigHighestLots,
    lowestLots: bigLowestLots,
  } = big;

  const {
    lowestLotAvailable: largeLowestLotsAvailable,
    highestLotAvailable: largeHighestLotsAvailable,
    highestLots: largeHighestLots,
    lowestLots: largeLowestLots,
  } = large;

  // console.log("samll", small);
  return (
    <Card style={{ margin: 20 }} loading={loading}>
      {/* Small */}
      <CustomDescription
        label={"Small"}
        lowestLotAvailable={smallLowestLotsAvailable}
        highestLotAvailable={smallHighestLotsAvailable}
        highestLots={smallHighestLots}
        lowestLots={smallLowestLots}
      />

      {/* Medium */}
      <CustomDescription
        label={"Medium"}
        lowestLotAvailable={mediumLowestLotsAvailable}
        highestLotAvailable={mediumHighestLotsAvailable}
        highestLots={mediumHighestLots}
        lowestLots={mediumLowestLots}
      />

      {/* Big */}
      <CustomDescription
        label={"Big"}
        lowestLotAvailable={bigLowestLotsAvailable}
        highestLotAvailable={bigHighestLotsAvailable}
        highestLots={bigHighestLots}
        lowestLots={bigLowestLots}
      />

      {/* Large */}
      <CustomDescription
        label={"Large"}
        lowestLotAvailable={largeLowestLotsAvailable}
        highestLotAvailable={largeHighestLotsAvailable}
        highestLots={largeHighestLots}
        lowestLots={largeLowestLots}
      />
    </Card>
  );
};

const calculation = (items, comparisonFunction) => {
  // compare the number of lots available
  const filteredItems = _.filter(items, (item) =>
    _.some(item.carpark_info, (info) => comparisonFunction(info.total_lots))
  );

  const carparkNumbers = _.map(filteredItems, (item) => item.carpark_number);

  const records = _.map(filteredItems, (item) => {
    return _.filter(item.carpark_info, (info) =>
      comparisonFunction(info.total_lots)
    );
  });

  // get the total lots available, highest and lowest
  const flattenedRecords = records.flat();

  let lowestCarparkNumber: string[] = [];
  let highestLotAvailable = Number.MIN_SAFE_INTEGER;
  let lowestLotAvailable = Number.MAX_SAFE_INTEGER;

  flattenedRecords.forEach((info) => {
    const lotsAvailable = Number(info.lots_available);

    if (lotsAvailable > highestLotAvailable) {
      highestLotAvailable = lotsAvailable;
    }

    if (lotsAvailable < lowestLotAvailable) {
      // lowestCarparkNumber.push(items)
      lowestLotAvailable = lotsAvailable;
    }
  });

  const highestLots = _.filter(flattenedRecords, {
    total_lots: highestLotAvailable.toString(),
  });

  const lowestLots = _.filter(flattenedRecords, {
    total_lots: lowestLotAvailable.toString(),
  });

  //  get highest and lowest carpark_number
  items.forEach((info) => {
    // console.log("info", info.carpark_number);
    const lotsAvailable = Number(info.lots_available);

    if (lotsAvailable === highestLotAvailable) {
      lowestCarparkNumber.push(info.carpark_number);
    }
  });

  console.log("lowestCarparkNumber", lowestCarparkNumber);

  return {
    flattenedRecords,
    lowestCarparkNumber: _.uniq(lowestCarparkNumber),
    highestLotAvailable,
    lowestLotAvailable,
    highestLots,
    lowestLots,
  };
};

export default Home;
