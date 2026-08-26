import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:travel_app/models/models.dart';
import 'package:travel_app/providers/providers.dart';
import 'package:travel_app/services/services.dart'; // Contains ImageUploadService.
import 'package:travel_app/screens/screens.dart';

class PhotoListScreen extends StatefulWidget {
  @override
  _PhotoListScreenState createState() => _PhotoListScreenState();
}

class _PhotoListScreenState extends State<PhotoListScreen> {
  final ImageUploadService _uploadService = ImageUploadService();
  bool _isUploading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Each time the screen appears, refresh the Firestore subscription.
    Provider.of<ImageDownloadProvider>(context, listen: false).refresh();
  }

  /// This method calls the upload service to pick an image and upload it.
  Future<void> _uploadImageDirectly() async {
    setState(() {
      _isUploading = true;
    });
    // Get the current user's display name; default to 'Anonymous' if not signed in.
    final userName =
        FirebaseAuth.instance.currentUser?.displayName ?? 'Anonymous';
    // Retrieve the current city from the FutureProvider (e.g. "Delhi").
    final currentCity =
        Provider.of<String?>(context, listen: false) ?? "DefaultCity";
    // Call the uploadImage service with the dynamic userName and city.
    await _uploadService.uploadImage(userId: userName, userCity: currentCity);
    setState(() {
      _isUploading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Listen to ImageDownloadProvider for real-time updates.
    final imageProvider = Provider.of<ImageDownloadProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text("City Clicks")),
      body: imageProvider.photos.isEmpty
          ? Center(child: Text("No photos uploaded yet."))
          : ListView.builder(
              itemCount: imageProvider.photos.length,
              itemBuilder: (context, index) {
                final photo = imageProvider.photos[index];
                // Provide a unique key so Flutter rebuilds the widget when data changes.
                return PhotoCard(key: ValueKey(photo.id), photo: photo);
              },
            ),

      // Floating Action Button to trigger image upload.
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: _isUploading
          ? CircularProgressIndicator()
          : FloatingActionButton(
              onPressed: _uploadImageDirectly,
              child: Icon(Icons.add),
            ),
    );
  }
}

///
/// PhotoCard displays a photo in an Instagram-like style:
/// - The image fills the card as a background with a gradient overlay.
/// - The bottom overlay shows the like count and a heart icon (white initially, red when liked).
/// - The entire card is tappable to navigate to a detailed view.
/// - A local like count is maintained for immediate UI feedback.
///
class PhotoCard extends StatefulWidget {
  final ImageModel photo;
  const PhotoCard({Key? key, required this.photo}) : super(key: key);

  @override
  _PhotoCardState createState() => _PhotoCardState();
}

class _PhotoCardState extends State<PhotoCard> {
  bool _liked =
      false; // Local flag to track if the photo has been liked in this session.
  late int _localLikes; // Local copy of the like count.

  @override
  void initState() {
    super.initState();
    // Initialize the local like count from the photo's data.
    _localLikes = widget.photo.likes;
  }

  @override
  void didUpdateWidget(covariant PhotoCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    // If the Firestore like count changes (e.g., from a provider update), sync the local counter.
    if (widget.photo.likes != oldWidget.photo.likes) {
      setState(() {
        _localLikes = widget.photo.likes;
      });
    }
  }

  /// Toggles the like state and increments the like count in Firestore.
  Future<void> _toggleLike() async {
    if (!_liked) {
      await FirebaseFirestore.instance
          .collection('photos')
          .doc(widget.photo.id)
          .update({
        'likes': FieldValue.increment(1),
      });
      setState(() {
        _liked = true; // Disable further likes.
        //_localLikes++; // Immediately update the UI.
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Tapping the card navigates to the detailed view.
      onTap: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) {
          return PhotoDetailScreen(photo: widget.photo);
        }));
      },
      child: Container(
        margin: EdgeInsets.all(8),
        child: AspectRatio(
          aspectRatio: 16 / 9, // Instagram-like card ratio.
          child: Card(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            clipBehavior: Clip.antiAlias,
            child: Stack(
              children: [
                // Background image.
                Positioned.fill(
                  child: Image.network(
                    widget.photo.photoUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.grey[300],
                        child: Center(
                          child: Icon(Icons.broken_image,
                              size: 50, color: Colors.grey),
                        ),
                      );
                    },
                  ),
                ),
                // Gradient overlay.
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.transparent, Colors.black54],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                ),
                // Bottom overlay showing like count and heart icon.
                Positioned(
                  bottom: 8,
                  left: 16,
                  right: 16,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "$_localLikes likes",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          Icons.favorite,
                          color: _liked ? Colors.red : Colors.white,
                          size: 32,
                        ),
                        onPressed: _liked ? null : _toggleLike,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
