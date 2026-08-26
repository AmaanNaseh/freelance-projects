import 'package:flutter/material.dart';
import 'package:travel_app/models/models.dart';
import 'package:travel_app/screens/weather_screen.dart';

class WeatherCard extends StatelessWidget {
  final String cityName;
  final String weatherDescription;
  final String iconUrl; // This will be the icon code, like '01d', '02n', etc.
  final double temperature;
  final List<Forecast>? forecast;

  const WeatherCard({
    super.key,
    required this.cityName,
    required this.weatherDescription,
    required this.iconUrl, // Passing iconUrl as a parameter
    required this.temperature,
    required this.forecast,
  });

  @override
  Widget build(BuildContext context) {
    // Base URL for OpenWeatherMap icons
    final String iconBaseUrl = 'http://openweathermap.org/img/wn/';

    return InkWell(
      onTap: () {
        //Navigate to Weather screen
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => WeatherForecastScreen(
                    cityName: cityName, forecast: forecast ?? [])));
      },
      child: Card(
        surfaceTintColor: Colors.amber,
        margin: EdgeInsets.all(10),
        child: ListTile(
          leading: iconUrl.isEmpty
              ? Icon(Icons.error) // If the iconUrl is empty, show an error icon
              : Image.network(
                  '$iconBaseUrl$iconUrl@2x.png', // Constructing the full URL
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                ),
          title: Text(cityName), // Displaying the city name
          subtitle:
              Text(weatherDescription), // Displaying the weather description
          trailing: Text(
              '${temperature.toStringAsFixed(1)}°C'), // Displaying the temperature with 1 decimal place
        ),
      ),
    );
  }
}
