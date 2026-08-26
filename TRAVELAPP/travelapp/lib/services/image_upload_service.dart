import 'dart:io'; // For file handling.
import 'package:image_picker/image_picker.dart'; // To pick images from the gallery.
import 'package:firebase_storage/firebase_storage.dart'; // For uploading files and retrieving download URLs.
import 'package:cloud_firestore/cloud_firestore.dart'; // For saving metadata in Firestore.
import 'package:path/path.dart'; // For using basename() to extract filename.

class ImageUploadService {
  Future<void> uploadImage(
      {required String userId, required String userCity}) async {
    final picker = ImagePicker();
    // Open the gallery and let the user pick an image.
    final xFile = await picker.pickImage(source: ImageSource.gallery);

    if (xFile != null) {
      // Convert the selected file's path into a File object.
      File imageFile = File(xFile.path);
      // Extract the filename.
      String filename = basename(xFile.path);
      print("Selected file: $filename at path: ${xFile.path}");

      // Get a reference to Firebase Storage and the desired location.
      final storageRef = FirebaseStorage.instance.ref();
      final photoRef = storageRef.child('photos/$filename');
      print("Storage reference path: ${photoRef.fullPath}");

      try {
        print("Uploading image with city: $userCity");
        // Start the upload task.
        UploadTask uploadTask = photoRef.putFile(imageFile);
        // Await its completion.
        TaskSnapshot snapshot = await uploadTask;
        print("Upload complete. Snapshot metadata: ${snapshot.metadata}");

        // Wait a little longer (2 seconds) to ensure the file is fully available.
        await Future.delayed(Duration(seconds: 2));

        // Retrieve the download URL.
        String downloadUrl = await snapshot.ref.getDownloadURL();
        print("Retrieved download URL: $downloadUrl");

        // Save metadata to Firestore.
        final db = FirebaseFirestore.instance;
        await db.collection('photos').add({
          'photoUrl': downloadUrl,
          'userId': userId,
          'city': userCity,
          //'timestamp': FieldValue.serverTimestamp(),
          'likes': 0,
        });
        print("Photo metadata saved to Firestore.");
      } on FirebaseException catch (e) {
        print("FirebaseException during upload: ${e.code} - ${e.message}");
        rethrow;
      } catch (e) {
        print("Error during file upload: $e");
        rethrow;
      }
    } else {
      print("No file was selected.");
    }
  }

  Future<void> addComments({
    required String photoId,
    required String userId,
    required String commentText,
  }) async {
    final db = FirebaseFirestore.instance;
    try {
      await db.collection('photos').doc(photoId).collection('comments').add({
        'text': commentText,
        'userId': userId,
        'timestamp': FieldValue.serverTimestamp(),
      });
      print("Comment added to photo $photoId.");
    } catch (e) {
      print("Error adding comment: $e");
      rethrow;
    }
  }
}
