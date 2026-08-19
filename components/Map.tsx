import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  const region = {};

  return (
    <MapView
      provider={PROVIDER_DEFAULT} // Map provided based on device OS
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 16,
      }}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      // initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    ></MapView>
  );
};

export default Map;
