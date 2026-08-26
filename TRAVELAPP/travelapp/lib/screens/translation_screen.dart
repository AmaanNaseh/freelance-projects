import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_cloud_translation/google_cloud_translation.dart';
import 'package:http/http.dart' as http;

class MyTranslationPage extends StatefulWidget {
  const MyTranslationPage({Key? key}) : super(key: key);

  @override
  _MyTranslationPageState createState() => _MyTranslationPageState();
}

class _MyTranslationPageState extends State<MyTranslationPage> {
  late Translation _translation;
  final TextEditingController _textController = TextEditingController();

  // Store translation/detection results.
  TranslationModel _translated =
      TranslationModel(translatedText: '', detectedSourceLanguage: '');
  TranslationModel _detected =
      TranslationModel(translatedText: '', detectedSourceLanguage: '');

  // Dropdown state: selected language code and list of languages.
  String _selectedLanguage = 'en';
  List<Map<String, String>> _languages = [];

  @override
  void initState() {
    super.initState();
    _translation =
        Translation(apiKey: 'AIzaSyBMQuPEIkgaOYq4a2VoEeCMlW5BQYxaBrM');
    _fetchSupportedLanguages();
  }

  // Fetch all supported languages from the API.
  Future<void> _fetchSupportedLanguages() async {
    final url = Uri.parse(
      "https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyBMQuPEIkgaOYq4a2VoEeCMlW5BQYxaBrM&target=en",
    );
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      List<dynamic> languagesJson = jsonResponse['data']['languages'];
      List<Map<String, String>> langs = languagesJson.map((lang) {
        final Map<String, dynamic> language = lang;
        return {
          "code": language['language'] as String,
          "name": language['name'] != null
              ? language['name'] as String
              : language['language'] as String,
        };
      }).toList();

      setState(() {
        _languages = langs;
        if (_languages.isNotEmpty) {
          _selectedLanguage = _languages.first["code"]!;
        }
      });
    } else {
      throw Exception('Failed to load supported languages');
    }
  }

  // Trigger translation and language detection.
  Future<void> _translateText() async {
    final inputText = _textController.text.trim();
    if (inputText.isEmpty) return;

    setState(() {
      _translated =
          TranslationModel(translatedText: '', detectedSourceLanguage: '');
      _detected =
          TranslationModel(translatedText: '', detectedSourceLanguage: '');
    });

    try {
      final result =
          await _translation.translate(text: inputText, to: _selectedLanguage);
      final detected = await _translation.detectLang(text: inputText);

      setState(() {
        _translated = result;
        _detected = detected;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Translator'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User input field.
            TextField(
              controller: _textController,
              decoration: InputDecoration(
                labelText: 'Enter text to translate',
                border: OutlineInputBorder(),
              ),
              minLines: 1,
              maxLines: 5,
            ),
            SizedBox(height: 20),

            // Dropdown for selecting target language.
            _languages.isNotEmpty
                ? Row(
                    children: [
                      Text('Target Language: '),
                      SizedBox(width: 10),
                      DropdownButton<String>(
                        value: _selectedLanguage,
                        items: _languages.map((lang) {
                          return DropdownMenuItem<String>(
                            value: lang["code"],
                            child: Text(lang["name"] ?? lang["code"]!),
                          );
                        }).toList(),
                        onChanged: (newValue) {
                          setState(() {
                            _selectedLanguage = newValue!;
                          });
                        },
                      ),
                    ],
                  )
                : Center(child: CircularProgressIndicator()),
            SizedBox(height: 40),

            // Button to trigger translation.
            Center(
              child: ElevatedButton(
                onPressed: _translateText,
                child: Text('Translate'),
              ),
            ),
            SizedBox(height: 40),

            // Display detected language.
            if (_translated.detectedSourceLanguage.isNotEmpty)
              Center(
                child: Text(
                  'Detected Language: ${_translated.detectedSourceLanguage}',
                  style: TextStyle(color: Colors.blueAccent),
                ),
              ),
            SizedBox(height: 20),

            // Display the translated text.
            if (_translated.translatedText.isNotEmpty)
              Center(
                child: Text(
                  'Translation: ${_translated.translatedText}',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
