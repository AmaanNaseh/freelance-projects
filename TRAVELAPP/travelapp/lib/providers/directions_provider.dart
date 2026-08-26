import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';

class DirectionsProvider extends ChangeNotifier {
  final String apiKey; //Google Maps API Key for Directions API
  final LatLng
      destination; //LatLng object passed into provider showing destination location (for google_maps_flutter)
  LatLng? currentLocation; //same as above but showing user's current location
  Set<Marker> markers = {}; //set of Markers to be shown on map
  Set<Polyline> polylines =
      {}; //set of polyline objects representing routes, is updated when new directions are fetched
  List<LatLng> polylineCoordinates =
      []; //List of LatLng points making up the DECODED route polyline. You update this list based on the polyline points returned by the API.
  StreamSubscription<Position>?
      _positionStreamSubscription; //stream subscription is the object you get when listening to a stream
  DateTime _lastApiCall = DateTime.now().subtract(const Duration(
      seconds:
          6)); //timestamp to throttle how often you call Directions API. IMPORTANT--->Here, an error occured when DateTime.now was used, as the throttling condition skipped the first api call, thus we subtracted it a bit so that the first call is made.

  DirectionsProvider({
    //constructor
    required this.apiKey,
    required this.destination,
  }) {
    _startLocationUpdates(); //upon creation, the provider begins listening for location updates
  }

  Future<void> _startLocationUpdates() async {
    try {
      // Get initial location
      Position initialPosition = await Geolocator.getCurrentPosition(
        locationSettings: LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 10, //updates occur after moving 10 metres
        ),
      );
      _updateCurrentLocation(initialPosition);

      // storing the continuous location updates by subscribing to the position stream
      _positionStreamSubscription = Geolocator.getPositionStream(
        locationSettings: LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 10,
        ),
      ).listen((Position pos) {
        //listening to the stream
        _updateCurrentLocation(
            pos); //everytime a new Position pos is emited, this function is executed
      });
    } catch (e) {
      print("Error obtaining location: $e");
    }
  }

  //updating current location
  void _updateCurrentLocation(Position pos) {
    //this function takes a new Position from device's location service and updates provider
    currentLocation = LatLng(pos.latitude,
        pos.longitude); //Converts Position to LatLng, google_maps_flutter locations to be in LatLng format for markers, camera updates, and polylines.

    //updating current location marker
    markers.removeWhere((marker) =>
        marker.markerId.value ==
        'currentLocation'); //removeWhere traverses the set markers and removes the marker where the lamba function (which takes a marker as its parameter) returns true.
    markers.add(
      //adds a new marker at currentLocation
      Marker(
        markerId: const MarkerId('currentLocation'),
        position: currentLocation!,
        infoWindow: const InfoWindow(title: 'Your Location'),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
      ),
    );

    //updating destination marker
    markers.removeWhere((marker) => marker.markerId.value == 'destination');
    markers.add(
      Marker(
        markerId: const MarkerId('destination'),
        position: destination,
        infoWindow: const InfoWindow(title: 'Destination'),
      ),
    );

    notifyListeners();

    Future<void> getDirections() async {
      if (currentLocation == null) return;

      PolylinePoints polylinePoints =
          PolylinePoints(); //instance of PolylinePoints class from flutter_polyline_points
      //requesting directions from the API
      PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
        googleApiKey: apiKey,
        request: PolylineRequest(
          origin: PointLatLng(
              //converting LatLng object to PointLatLng coz flutter_polyline_points likes it this way.
              currentLocation!.latitude,
              currentLocation!.longitude),
          destination: PointLatLng(destination.latitude, destination.longitude),
          mode: TravelMode.driving,
        ),
      );
      //checking if the API response list isn't empty
      if (result.points.isNotEmpty) {
        //Converting PointLatLng to LatLng because google_maps_flutter uses LatLng. But, flutter_polyline_points produces PointLatLng
        List<LatLng> tempPolyline = result.points
            .map((point) => LatLng(point.latitude, point.longitude))
            .toList(); //iterating over each PointLatLng item in result.points with .map function and converting it to LatLng object, the resulting iterable is then converted to list using .toList().

        // update Provider's state with the new route
        polylineCoordinates = tempPolyline;
        polylines = {
          //google_maps_flutter requires polylines to be a set of Polyline objects as each should have a unique ID
          Polyline(
            polylineId: const PolylineId('route'),
            points: polylineCoordinates,
            color: Colors.blueAccent,
            width: 5,
          ),
        };
        notifyListeners();
      } else {
        print("Failed to fetch route: ${result.errorMessage}");
      }
    }

    //throttle API calls (only call every 5 seconds atmost)
    if (DateTime.now().difference(_lastApiCall) > const Duration(seconds: 5)) {
      //the differenece method returns a Duration with the difference when subtracting other from this DateTime.
      getDirections(); //the function responsible for fetching and updating the polyline.
      _lastApiCall = DateTime.now();
    }
  }

  @override
  void dispose() {
    _positionStreamSubscription
        ?.cancel(); //checks if the subscription isn't null, and then calls its cancel method
    super.dispose();
  }
}
