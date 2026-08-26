import 'package:cloud_firestore/cloud_firestore.dart';

class ImageModel {
  final String id;
  final String photoUrl;
  final String userId;
  final String city;
  final Timestamp timestamp;
  final int likes;

  //constructor
  ImageModel({
    required this.id,
    required this.photoUrl,
    required this.userId,
    required this.city,
    required this.timestamp,
    required this.likes,
  });

  //factory constructor to convert Firestore DocumentSnapshot into a PhotoModel instance.
  //defines a factory constructor called fromFirestore for the PhotoModel class. It takes one argument: a DocumentSnapshot
  factory ImageModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String,
        dynamic>; //gets raw data from Firestore and casts that object to a map.
    return ImageModel(
      id: doc.id,
      photoUrl: data['photoUrl'],
      userId: data['userId'],
      city: data['city'],
      timestamp: data['timestamp'],
      likes: data['likes'],
    );
  }
}
