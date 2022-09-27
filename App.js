import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextView, Button, TextInput, Alert } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import * as Location from'expo-location';
import Geocoder from 'react-native-geocoder';
import { useState, useEffect  } from 'react';
export default function App() {

  const [location, setLocation] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [pin, setPin] = useState({
    latitude: 0.0000,
    longitude: 0.0000,
  })

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);

      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

    const fetchLocation = () => {
    fetch('http://www.mapquestapi.com/geocoding/v1/address?key=KEY&location=' + keyword) // lisää oma key KEY tilalle
    .then(response => response.json())
    .then(data => setData(data.locations))
    .catch(error => {
      Alert.alert('Error',err);
    });
    //.then(res => this.setState({region: res.result.geometry.location}));
    //console.log(res)
    }
    

   /*  Geocoder.geocodeAddress(keyword).then(res => {
     let addr = (res[0].formattedAddress)

    })
    .catch(err => console.log(err))*/
  return (
    <View style={styles.container}>
      
      <MapView 
      style={{width:'100%', height:'75%'}}
      initialRegion={{
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
        
      }}
      showsUserLocation={true}
      onUserLocationChange={(e) => {
        
        setPin({
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        });
      }}
      >
        <Marker
        coordinate={pin}
          title='Haaga-Helia'
          pinColor='gold'
          draggable={true}
          onDragStart={(e) => {
            console.log("drag start", e.nativeEvent.coordinate);
          }}
          onDragEnd={(e) => {
            console.log("drag end", e.nativeEvent.coordinate);


            setPin({
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude
            })
          }}
          
          

          >
            
            <Callout>
              <Text>Olet Tässä</Text>
            </Callout>
          
          </Marker>
        
          
          
      </MapView>
      <TextInput
      style={{fontSize: 18, width: 200}}
      placeholder='Kirjoita Sijainti'
      onChangeText={text => setKeyword(text)}
      />
      <StatusBar style="auto" />
      <Button 
      title="SEARCH"
      onPress={fetchLocation}
      
      />
      
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
