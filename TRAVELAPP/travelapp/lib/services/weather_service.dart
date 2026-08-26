import 'dart:convert'; //Provides functions to convert between JSON and Dart objects.
import 'package:http/http.dart'
    as http; //Lets us make HTTP requests (like GET) to external APIs, aliased as http to prevent confusion on get function on line 20
import 'package:geolocator/geolocator.dart'; //Allows us to get the device’s current GPS position.
import 'package:geocoding/geocoding.dart'; //Used for Reverse Geocoding
import 'package:travel_app/models/models.dart';

//class declaration to encapsulate API interactions, which has apiKey and baseUrl DEPENDENCY INJECTED to it (Inversion of Control)
class WeatherService {
  final String apiKey; //our API key from OpenWeatherMap
  final String baseUrl; //Provides the base URL for the API endpoints
  //constructor
  WeatherService({
    required this.apiKey,
    this.baseUrl = "https://api.openweathermap.org/data/2.5",
  });

  //getCurrentWeather method
  Future<CurrentWeather> getCurrentWeather(String city) async {
    final url = Uri.parse(
        '$baseUrl/weather?q=$city&appid=$apiKey&units=metric'); //Parsing is the conversion of a string to an object, URI is any resource on internet, get NEEDS a uri object
    final response = await http
        .get(url); //get is a type of request method to ask for a resource
    //http package dictates that HTTP response includes a status code and response body holding data
    if (response.statusCode == 200) {
      //200 is the HTTP Status Code for Success
      final data =
          json.decode(response.body); //converting json string to a dart object
      return CurrentWeather.fromJson(
          data); //calls our factory constructor CurrentWeather.fromJson and returns a new instance
    } else {
      throw Exception(
          'Failed to load current weather'); //when exception is thrown, code after it in the block is not executed, and the runtime looks for a nearby error handler (like a try-catch block)
    }
  }

  //this method fetches a list of weather forecast
  Future<List<Forecast>> getForecast(String city) async {
    final url =
        Uri.parse('$baseUrl/forecast?q=$city&appid=$apiKey&units=metric');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      List<Forecast> forecasts = [];
      // The API returns a list of forecast entries under the 'list' key.
      // For each item in this list, convert it to a Forecast object.
      for (var item in data['list']) {
        forecasts.add(Forecast.fromJson(item));
      }
      //returning the list of Forecast Objects
      return forecasts;
    } else {
      throw Exception('Failed to load weather forecast');
    }
  }

// Cached city Future to avoid multiple concurrent calls.
  static Future<String>? _cityFuture;

  // wrapper over _fetchCity to avoid multiple concurrent calls
  Future<String> getCityFromCurrentLocation() async {
    // If a location fetch is already in progress or completed, use it.
    if (_cityFuture != null) {
      return _cityFuture!;
    }
    _cityFuture = _fetchCity();
    return _cityFuture!;
  } //this method gets city name based on gps coordinates (not dependent on openweathermap)

  //uses geolocator package for gps coordinates and
  Future<String> _fetchCity() async {
    Position position = await Geolocator.getCurrentPosition(
      locationSettings: LocationSettings(
        accuracy: LocationAccuracy
            .high, //high uses gps and gives accurate location (best is even better)
      ),
    );

    //reverse geocode to get human readable city name
    List<Placemark> placemarks = await placemarkFromCoordinates(
      position.latitude,
      position.longitude,
    );

    //uses first placemark's locality as city name
    if (placemarks.isNotEmpty) {
      return placemarks.first.locality ?? //placemarks.first >>> placemarks[0]
          ''; //as the placemarks list can be null and Future<String> can NOT ne null, we return an empty list as a fallback (we use ?? operator for creating such fallbacks, called as null coalescing operator)
    } else {
      throw Exception('Unable to determine city from location');
    }
  }
}
