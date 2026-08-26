import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:travel_app/providers/providers.dart';
import 'package:travel_app/routes.dart';
import 'package:travel_app/services/services.dart';
import 'package:travel_app/theme.dart';
import 'package:travel_app/widgets/auth_wrapper.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(
          create: (_) => WeatherProvider(
            weatherService:
                WeatherService(apiKey: '16d08a2df3580415f76422da7be567a8'),
          ),
        ),
        ChangeNotifierProvider(
          create: (_) => PlaceProvider(
            placeService:
                PlaceService(apiKey: 'AIzaSyAk-9uSpw7SNcezKeTlFo29GVxkrLPl0zU'),
            weatherService:
                WeatherService(apiKey: '16d08a2df3580415f76422da7be567a8'),
          ),
        ),
        // Use a FutureProvider to asynchronously fetch the current city.
        FutureProvider<String?>(
          create: (context) =>
              WeatherService(apiKey: '16d08a2df3580415f76422da7be567a8')
                  .getCityFromCurrentLocation(),
          initialData: null, // No default; we'll handle a fallback in the UI.
        ),
        // Use a ChangeNotifierProxyProvider to inject the city into ImageDownloadProvider.
        ChangeNotifierProxyProvider<String?, ImageDownloadProvider>(
          create: (context) => ImageDownloadProvider(city: "DefaultCity"),
          update: (context, city, previous) =>
              ImageDownloadProvider(city: city ?? "DefaultCity"),
        ),
      ],
      child: const TravelApp(),
    ),
  );
}

class TravelApp extends StatelessWidget {
  const TravelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TravelFree',
      theme: appTheme,
      home: AuthWrapper(),
      routes: appRoutes,
    );
  }
}
