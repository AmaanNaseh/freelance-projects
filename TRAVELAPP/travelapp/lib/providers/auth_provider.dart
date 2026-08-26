import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:travel_app/services/auth.dart';

class AuthProvider with ChangeNotifier {
  final SignIn _signIn = SignIn(); // from auth.dart
  User? _user; // from firebase_auth
  User? get user => _user; //making getter (encapsulation)

  AuthProvider() {
    FirebaseAuth.instance.authStateChanges().listen(
        _onAuthStateChanged); //constructor listening to auth state changes
  }
  void _onAuthStateChanged(User? firebaseUser) {
    _user = firebaseUser; //updates the user variable when auth state changes
    notifyListeners();
  }

  Future<void> signInWithGoogle() async {
    final credential = await _signIn
        .signInWithGoogle(); //calling a private instance of the SignIn class from auth.dart
    if (credential != null) {
      _user = credential.user;
      notifyListeners();
    }
  }

  Future<void> signInWithEmailAndPassword(
      {required String email, required String password}) async {
    final credential = await _signIn.signInWithEmailAndPassword(
        email: email, password: password);
    if (credential != null) {
      _user = credential.user;
      notifyListeners();
    }
  }

  Future<void> signUpWithEmailAndPassword(
      {required String name,
      required String email,
      required String password}) async {
    final credential = await _signIn.signUpWithEmailAndPassword(
        name: name, email: email, password: password);
    if (credential != null) {
      _user = credential.user;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    await _signIn.signOut();
    _user = null;
    notifyListeners();
  }
}
