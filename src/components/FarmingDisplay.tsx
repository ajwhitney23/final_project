import * as React from "react";

import FarmableProps from "../types/props/FarmableProps";
import FarmingSpotProps from "../types/props/FarmingSpotProps";
import DayDisplay from "./primitives/DayDisplay";

interface FarmingDisplayProps {
  farmables: FarmableProps[];
  locations: FarmingSpotProps[];
}

const FarmingDisplay = ({
  farmables,
  locations,
}: FarmingDisplayProps): JSX.Element => {
  // !!! TODO (Nick): Create logic for displaying artifact preferences using the setter

  const [monLocs, setMonLoc] = React.useState<FarmingSpotProps[]>(
    locations.filter(
      (e) => e.day_of_week.find((d) => d === "mon") !== undefined
    )
  );
  const [tueLocs, setTueLoc] = React.useState<FarmingSpotProps[]>(
    locations.filter(
      (e) => e.day_of_week.find((d) => d === "tue") !== undefined
    )
  );
  const [wedLocs, setWedLoc] = React.useState<FarmingSpotProps[]>(
    locations.filter(
      (e) => e.day_of_week.find((d) => d === "wed") !== undefined
    )
  );
  const [monFarm, setMonFarm] = React.useState<FarmableProps[]>(
    farmables.filter((e) => monLocs.some((l) => l.name === e.farm_at))
  );
  const [tueFarm, setTueFarm] = React.useState<FarmableProps[]>(
    farmables.filter((e) => tueLocs.some((l) => l.name === e.farm_at))
  );
  const [wedFarm, setWedFarm] = React.useState<FarmableProps[]>(
    farmables.filter((e) => wedLocs.some((l) => l.name === e.farm_at))
  );

  return (
    // !!! TODO (UI): Create and implement JSX components for FarmingDisplay
    <>
      <div style={{ display: "flex", width: "100%", textAlign: "center" }}>
        <DayDisplay days={"Mon/Thu"} farmables={monFarm} locations={monLocs} />
        <DayDisplay days={"Tue/Fri"} farmables={tueFarm} locations={tueLocs} />
        <DayDisplay days={"Wed/Sat"} farmables={wedFarm} locations={wedLocs} />
        <DayDisplay days={"All"} farmables={farmables} locations={locations} />
      </div>
    </>
  );
};

export default FarmingDisplay;
