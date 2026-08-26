// A model for the Explore Nearby Places feature with Places API
import 'package:geolocator/geolocator.dart';

class Place {
  final String name;
  final String photoRef;
  final double latitude;
  final double longitude;

  // Constructor
  Place({
    required this.name,
    required this.photoRef,
    required this.latitude,
    required this.longitude,
  });

  // Factory constructor
  factory Place.fromJson(Map<String, dynamic> json) {
    // Use ?? [] to provide a default empty list if 'photos' is null
    final photos = json['photos'] ?? [];
    String photoReference = '';

    // Ensure photos is not empty before accessing its first element
    if (photos.isNotEmpty) {
      photoReference = photos[0]['photo_reference'];
    }

    final double lat = json['geometry']['location']['lat'];
    final double lng = json['geometry']['location']['lng'];

    return Place(
      name: json['name'],
      photoRef: photoReference,
      latitude: lat,
      longitude: lng,
    );
  }
}
