import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:travel_app/models/models.dart';
import 'dart:async';

class ImageDownloadProvider extends ChangeNotifier {
  bool isLoading = false;
  final String city;
  List<ImageModel> _photos =
      []; //private so that only provider can make changes to it.
  List<ImageModel> get photos =>
      _photos; //getter exposes the list of photos to other parts of app in a read-only fashion.
  StreamSubscription? _subscription; // Store the Firestore subscription.
  ImageDownloadProvider({required this.city}) {
    _subscribeToPhotos();
  }

  void _subscribeToPhotos() {
    //print("Fetching photos for city: $city");

    _subscription = FirebaseFirestore.instance
        .collection('photos')
        .where('city', isEqualTo: city)
        .orderBy('likes', descending: true)
        .snapshots()
        .listen((QuerySnapshot snapshot) {
      _photos = snapshot
          .docs //snapshot.docs returns a list of Document Snapshots, each of which represents a photo document returned by the query.
          .map((doc) => ImageModel.fromFirestore(
              doc)) //map takes each element of the list doc and applies a function to it, here that function is ImageModel's factory constructor that converts Document Snapshot to ImageModel.
          .toList(); //map() function returns an iterable. The toList() method converts that iterable (an iterable is an abstract collection that represents a sequence of elements that you can loop over) into a List, because we want _photos to be a list of ImageModels.
      isLoading = true;
      notifyListeners();
    });
  }

  // Public method to refresh the Firestore subscription.
  void refresh() {
    _subscription?.cancel(); // Cancel the previous subscription.
    _subscribeToPhotos(); // Re-subscribe to Firestore.
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
