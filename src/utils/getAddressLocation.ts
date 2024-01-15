import { reverseGeocodeAsync, LocationObjectCoords } from 'expo-location';

export async function getAddressLocation({
  latitude,
  longitude,
}: { latitude: number; longitude: number }): Promise<string | null> {
  try {

    const locationObject: LocationObjectCoords = {
      latitude,
      longitude,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    };


    await new Promise(resolve => setTimeout(resolve, 1000));

    const addressResponse = await reverseGeocodeAsync(locationObject);


    const subregion = addressResponse[0]?.subregion;
    const country = addressResponse[0]?.country;

    const formattedLocation = subregion ? `${subregion}, ${country}` : country;


    return formattedLocation;
  } catch (error) {
    console.error('Error in getAddressLocation:', error);
    return null;
  }
}
