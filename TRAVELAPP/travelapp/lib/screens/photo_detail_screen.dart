import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:travel_app/models/models.dart';

class PhotoDetailScreen extends StatefulWidget {
  final ImageModel photo;

  const PhotoDetailScreen({super.key, required this.photo});

  @override
  _PhotoDetailScreenState createState() => _PhotoDetailScreenState();
}

class _PhotoDetailScreenState extends State<PhotoDetailScreen> {
  final TextEditingController _commentController = TextEditingController();

  /// Adds a comment to Firestore if the text is not empty.
  Future<void> _addComment() async {
    final commentText = _commentController.text.trim();
    if (commentText.isNotEmpty) {
      // Use the authenticated user's display name; fallback to "Anonymous".
      final userName =
          FirebaseAuth.instance.currentUser?.displayName ?? 'Anonymous';
      await FirebaseFirestore.instance
          .collection('photos')
          .doc(widget.photo.id)
          .collection('comments')
          .add({
        'text': commentText,
        'userId': userName,
        'timestamp': FieldValue.serverTimestamp(),
      });
      _commentController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Comments"),
      ),
      body: SafeArea(
        child: Column(
          mainAxisAlignment:
              MainAxisAlignment.spaceBetween, // Pushes bottom widget down
          children: [
            // This Expanded widget holds the main scrollable content.
            Expanded(
              child: SingleChildScrollView(
                padding: EdgeInsets.only(bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Large image area.
                    Container(
                      height: 400,
                      width: double.infinity,
                      child: Image.network(
                        widget.photo.photoUrl,
                        fit: BoxFit.contain, // Scales large images down
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
                    SizedBox(height: 8),
                    // Display the like count.
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Row(
                        children: [
                          Text(
                            "${widget.photo.likes} likes",
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          Spacer(
                            flex: 2,
                          ),
                          Text(
                            'Posted by ${widget.photo.userId}',
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold),
                          )
                        ],
                      ),
                    ),
                    Divider(),
                    // Comments list.
                    Container(
                      // You can adjust the height if needed.
                      child: StreamBuilder<QuerySnapshot>(
                        stream: FirebaseFirestore.instance
                            .collection('photos')
                            .doc(widget.photo.id)
                            .collection('comments')
                            .orderBy('timestamp', descending: true)
                            .snapshots(),
                        builder: (context, snapshot) {
                          if (snapshot.hasError) {
                            print("Comments query error: ${snapshot.error}");

                            return Center(
                                child: Text("Error loading comments"));
                          }
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          }
                          final commentDocs = snapshot.data!.docs;
                          if (commentDocs.isEmpty) {
                            return Padding(
                              padding: const EdgeInsets.all(100),
                              child: Center(child: Text("No comments yet.")),
                            );
                          }
                          return ListView.builder(
                            shrinkWrap: true,
                            physics:
                                NeverScrollableScrollPhysics(), // Let the outer scroll view handle scrolling.
                            itemCount: commentDocs.length,
                            itemBuilder: (context, index) {
                              final data = commentDocs[index].data()
                                  as Map<String, dynamic>;
                              final commentText = data['text'] ?? '';
                              final userId = data['userId'] ?? '';
                              return Card(
                                margin: EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                child: ListTile(
                                  title: Text(commentText),
                                  subtitle: Text("By $userId"),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Comment input field at the bottom.
            Container(
              padding: const EdgeInsets.all(8.0),
              color: Colors.grey[900],
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: "Write a comment...",
                        hintStyle: TextStyle(color: Colors.white54),
                        border: OutlineInputBorder(),
                        filled: true,
                        fillColor: Colors.grey[850],
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _addComment,
                    child: Text("Send"),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
