import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class SignIn {
  /*This instance is necessary to call methods like signInWithCredential and signOut on Firebase, 
  which manage the user's authentication state.*/
  final FirebaseAuth _auth = FirebaseAuth.instance;
  /*This instance is used to trigger the Google authentication flow. 
  It will display the Google account picker to the user and return account 
  details upon successful sign-in.*/
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  Future<UserCredential?> signInWithGoogle() async {
    try {
      /*This line opens the Google Sign-In UI, allowing the user to select a Google account, 
      ie triggering authentication flow.*/
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      //if the user cancels sign-in, we return null.
      if (googleUser == null) return null;
      /*After selecting a Google account, 
        we fetch the authentication details (tokens) from the user’s account.*/
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      //We create a Firebase credential using the authentication tokens received from Google.
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      //We sign in to Firebase using the credential.
      return await _auth.signInWithCredential(credential);
    } on Exception catch (e) {
      print(
          'Error during Google sign-in: $e'); //note: next time use logger here.
      return null;
    }
  }

  Future<UserCredential?> signInWithEmailAndPassword({
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _auth.signInWithEmailAndPassword(
          email: email, password: password);
      return credential;
    } on FirebaseAuthException catch (e) {
      if (e.code == 'user-not-found') {
        print('No user found for that email.');
      } else if (e.code == 'wrong-password') {
        print('Wrong password provided for that user.');
      }
    } catch (e) {
      print(e);
    }
    return null;
  }

  Future<UserCredential?> signUpWithEmailAndPassword({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final credential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      await credential.user!
          .updateDisplayName(name); //updating user's name with provided name

      await credential.user
          ?.reload(); //reloading user to ensure name is updated
      return credential;
    } on FirebaseAuthException catch (e) {
      if (e.code == 'weak-password') {
        print('The password provided is too weak.');
      } else if (e.code == 'email-already-in-use') {
        print('The account already exists for that email.');
      }
    } catch (e) {
      print(e);
    }
    return null;
  }

  //signing out from everything
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
  }
}
