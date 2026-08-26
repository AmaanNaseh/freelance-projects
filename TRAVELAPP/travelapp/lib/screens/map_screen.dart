import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:travel_app/providers/providers.dart';

class MapScreen extends StatelessWidget {
  final double destinationLat;
  final double destinationLng;
  final String apiKey;

  const MapScreen({
    super.key,
    required this.destinationLat,
    required this.destinationLng,
    required this.apiKey,
  });

  @override
  Widget build(BuildContext context) {
    final destination = LatLng(destinationLat, destinationLng);
    return ChangeNotifierProvider(
      create: (_) =>
          DirectionsProvider(apiKey: apiKey, destination: destination),
      child: Scaffold(
        appBar: AppBar(title: const Text("Navigation")),
        body: Consumer<DirectionsProvider>(
          builder: (context, provider, child) {
            if (provider.polylines.isEmpty) {
              return const Center(child: CircularProgressIndicator());
            }
            return GoogleMap(
              initialCameraPosition: CameraPosition(
                target: provider.currentLocation!,
                zoom: 13,
              ),
              markers: provider.markers,
              polylines: provider.polylines,
              onMapCreated: (controller) {
                // Optionally store the controller if you need to interact with it.
              },
            );
          },
        ),
      ),
    );
  }
}
