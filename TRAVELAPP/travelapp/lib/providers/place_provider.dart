import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:travel_app/models/models.dart';
import 'package:travel_app/services/services.dart';

class PlaceProvider extends ChangeNotifier {
  final PlaceService placeService;
  final WeatherService weatherService;

  List<Place>? places;
  bool isLoading = false;
  String? errorMessage;

  PlaceProvider({
    required this.placeService,
    required this.weatherService,
  });

  // Getter to access the API key from placeService
  String get placeApiKey => placeService.apiKey;

  // Method to fetch tourist destinations
  Future<void> fetchTouristDestinations() async {
    isLoading = true;
    notifyListeners();

    // Request location permission
    var status = await Permission.location.request();
    if (status.isGranted) {
      try {
        String city = await weatherService.getCityFromCurrentLocation();

        // Fetch tourist destinations using the detected city.
        places = await placeService.getTouristDestinations(city);
        errorMessage = null;
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

    isLoading = false;
    notifyListeners();
  }
}
