import 'package:travel_app/screens/screens.dart';
import 'package:travel_app/providers/providers.dart';

var appRoutes = {
  '/signup': (context) => SignUpScreen(),
  '/signin': (context) => SignInScreen(),
  '/home': (context) => HomeScreen(),
  '/photos': (context) => PhotoListScreen(),
  '/guide': (context) => GuideScreen(),
};
