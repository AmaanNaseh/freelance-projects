//A model in Flutter is a class that defines the structure of data that an app will use.

class CurrentWeather {
  final String cityName;
  final String description;
  final double temp;
  final String icon;
  //constructor to ensure these 3 parameters are specified when creating an instance
  CurrentWeather({
    required this.cityName,
    required this.description,
    required this.temp,
    required this.icon,
  });

  //factory constructor to process the incoming json map and return a new instance (Unlike a normal constructor that just creates a new instance, a factory constructor can perform extra logic before returning an object.)
  factory CurrentWeather.fromJson(Map<String, dynamic> json) {
    //the json we're taking has string keys and dynamic values
    return CurrentWeather(
        cityName: json['name'],
        description: json['weather'][0][
            'description'], //description of the first element of the array weather (API condition)
        temp: (json['main']['temp'] as num)
            .toDouble(), //casted as num, then converted to double
        icon: json['weather'][0]['icon']);
  }
}

//same as CurrentWeather, but for weather forecast
class Forecast {
  final DateTime dateTime;
  final double temperature;
  final String description;
  final String icon;
  Forecast({
    required this.dateTime,
    required this.temperature,
    required this.description,
    required this.icon,
  });

  //takes json values as a map, extracts necessary stuff, returns a new forecast instance
  factory Forecast.fromJson(Map<String, dynamic> json) {
    //Forecast.fromJson is a named constructor. It allows you to create a Forecast instance from a JSON map.
    return Forecast(
        dateTime: DateTime.parse(json[
            'dt_txt']), //DateTime.parse(...) is a Dart method that takes a string formatted as a date/time and converts it into a DateTime object.        description: json['weather'][0]['description'],
        temperature: (json['main']['temp'] as num).toDouble(),
        description: json['weather'][0]['description'],
        icon: json['weather'][0]['icon']);
  }
}
