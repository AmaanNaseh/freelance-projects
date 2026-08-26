import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_app/screens/screens.dart';
import 'package:travel_app/shared/bottom_nav.dart';
import 'package:travel_app/providers/providers.dart';
import 'package:travel_app/widgets/destinations.dart';
import 'package:travel_app/widgets/weather_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _hasInitialized = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_hasInitialized) {
      _hasInitialized = true;
      // Delay the API calls until after the first frame is rendered.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final weatherProvider =
            Provider.of<WeatherProvider>(context, listen: false);
        final placeProvider =
            Provider.of<PlaceProvider>(context, listen: false);

        weatherProvider.fetchWeather();
        placeProvider.fetchTouristDestinations();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Travel App'),
      ),
      drawer: Drawer(
        backgroundColor: Theme.of(context).colorScheme.surface,
        child: ListView(
          padding: EdgeInsets.zero, // Remove default padding.
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                // Use a primary container color for the header background.
                color: Theme.of(context).colorScheme.primaryContainer,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.account_circle,
                    size: 36,
                    color: Theme.of(context).colorScheme.onPrimaryContainer,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    authProvider.user?.displayName ?? 'Anonymous',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.contact_phone,
                color: Theme.of(context).colorScheme.onSurface,
              ),
              title: Text(
                'Emergency Contacts',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
              onTap: () {
                // Add navigation or functionality here.
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) {
                      return EmergencyServicesScreen();
                    },
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(
                Icons.logout,
                color: Theme.of(context).colorScheme.onSurface,
              ),
              title: Text(
                'Sign Out',
                style: TextStyle(
                  color: Theme.of(context).colorScheme.onSurface,
                ),
              ),
              onTap: () async {
                await authProvider.signOut();
                Navigator.pushReplacementNamed(context, '/');
              },
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          SizedBox(
            height: 8,
          ),
          Consumer<WeatherProvider>(
            builder: (context, weatherProvider, child) {
              return weatherProvider.isLoading
                  ? Padding(
                      padding: const EdgeInsets.all(30.0),
                      child: SizedBox(
                        height: 30,
                        width: 30,
                        child: CircularProgressIndicator(),
                      ),
                    ) // Show loading indicator
                  : weatherProvider.errorMessage != null
                      ? Text(
                          weatherProvider.errorMessage!) // Show error message
                      : weatherProvider.currentWeather != null
                          ? WeatherCard(
                              cityName:
                                  weatherProvider.currentWeather!.cityName,
                              weatherDescription:
                                  weatherProvider.currentWeather!.description,
                              iconUrl: weatherProvider.currentWeather!.icon,
                              temperature: weatherProvider.currentWeather!.temp,
                              forecast: weatherProvider.forecast!,
                            )
                          : Text("No weather data available");
            },
          ),
          SizedBox(
            height: 8,
          ),
          Align(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Popular Tourist Destinations',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.amber,
                ),
              ),
            ),
          ),
          SizedBox(
            height: 4,
          ),
          Consumer<PlaceProvider>(
            builder: (context, placeProvider, child) {
              return placeProvider.isLoading
                  ? Expanded(
                      child: Center(
                        child: SizedBox(
                          height: 30,
                          width: 30,
                          child: CircularProgressIndicator(),
                        ),
                      ),
                    ) // Show loading indicator
                  : placeProvider.errorMessage != null
                      ? Text(placeProvider.errorMessage!) // Show error message
                      : placeProvider.places != null
                          ? Expanded(
                              child: DestinationsList(
                                places: placeProvider.places ?? [],
                                apiKey: placeProvider.placeApiKey,
                              ),
                            )
                          : const Center(
                              child: Text('No destinations available'),
                            );
            },
          ),
        ],
      ),
      bottomNavigationBar: BottomNav(),
    );
  }
}
