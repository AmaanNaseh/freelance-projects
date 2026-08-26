import 'package:flutter/material.dart';
import 'package:travel_app/models/models.dart';
import 'package:travel_app/services/services.dart';
import 'package:permission_handler/permission_handler.dart';

//This allows the provider to notify listeners when there’s a change in its state, like when new data is fetched.
class WeatherProvider extends ChangeNotifier {
  final WeatherService
      weatherService; //A final property to hold our API service. We inject it through the constructor so that this provider doesn’t have to create it itself.
  //Data holders for weather information
  CurrentWeather? currentWeather;
  List<Forecast>? forecast;
  bool isLoading = false;
  String? errorMessage;

  //constructor with dependency injection of WeatherService
  WeatherProvider({required this.weatherService});

  //method to fetch weather
  Future<void> fetchWeather() async {
    // Set loading to true and notify listeners so UI can show a spinner.
    isLoading = true;
    notifyListeners();

    var status = await Permission.location.request();
    if (status.isGranted) {
      try {
        String city = await weatherService.getCityFromCurrentLocation();

        if (city.isNotEmpty) {
          currentWeather = await weatherService.getCurrentWeather(city);
          forecast = await weatherService.getForecast(city);
          errorMessage = null;
        } else {
          errorMessage = 'Unable to determine city from location';
        }
      } catch (e) {
        errorMessage = e.toString();
      }
    } else if (status.isDenied) {
      errorMessage = 'Location permission denied';
    } else if (status.isPermanentlyDenied) {
      errorMessage =
          'Location permission permanently denied. Please enable it in settings.';
      await openAppSettings();
    }
    //data fetching is now complete, setting isLoading to False
    isLoading = false;
    //update UI
    notifyListeners();
  }
}
