import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_app/providers/auth_provider.dart';
import 'package:travel_app/screens/screens.dart';

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    // Return HomeScreen if logged in, otherwise SignInScreen
    return authProvider.user != null ? HomeScreen() : SignInScreen();
  }
}
