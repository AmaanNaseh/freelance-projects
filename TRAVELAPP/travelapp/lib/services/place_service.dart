import 'package:travel_app/models/models.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PlaceService {
  final String apiKey;
  final String baseUrl;

  PlaceService({
    required this.apiKey,
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch',
  });

  Future<List<Place>> getTouristDestinations(String city) async {
    final url = Uri.parse(
        '$baseUrl/json?query=tourist+attractions+in+$city&key=$apiKey');
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      List<Place> places = [];
      for (var item in data['results']) {
        places.add(Place.fromJson(item));
      }
      return places;
    } else {
      throw Exception('Failed to load destinations.');
    }
  }
}
