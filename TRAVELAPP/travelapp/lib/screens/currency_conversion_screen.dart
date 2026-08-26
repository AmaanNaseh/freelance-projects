import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CurrencyConversionScreen extends StatefulWidget {
  const CurrencyConversionScreen({Key? key}) : super(key: key);

  @override
  _CurrencyConversionScreenState createState() =>
      _CurrencyConversionScreenState();
}

class _CurrencyConversionScreenState extends State<CurrencyConversionScreen> {
  final TextEditingController _amountController = TextEditingController();

  // Dropdown state for source and target currencies.
  String _selectedSourceCurrency = 'USD';
  String _selectedTargetCurrency = 'INR';
  List<String> _currencies = [];

  // Conversion result.
  double? _convertedAmount;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchSupportedCurrencies();
  }

  // Fetch supported currencies from the ExchangeRate-API.
  Future<void> _fetchSupportedCurrencies() async {
    // We'll use USD as the base to fetch available currencies.
    final url = Uri.parse("https://api.exchangerate-api.com/v4/latest/USD");
    final response = await http.get(url);
    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      Map<String, dynamic> rates = jsonResponse['rates'];
      List<String> currencies = rates.keys.toList();
      currencies.sort();
      setState(() {
        _currencies = currencies;
        // Set default source and target currencies.
        _selectedSourceCurrency = 'USD';
        _selectedTargetCurrency = 'EUR';
      });
    } else {
      throw Exception("Failed to load currencies");
    }
  }

  // Trigger the currency conversion.
  Future<void> _convertCurrency() async {
    final amountText = _amountController.text.trim();
    if (amountText.isEmpty) return;

    final amount = double.tryParse(amountText);
    if (amount == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please enter a valid number")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _convertedAmount = null;
    });

    try {
      // Fetch conversion rates using the source currency as base.
      final url = Uri.parse(
          "https://api.exchangerate-api.com/v4/latest/$_selectedSourceCurrency");
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        Map<String, dynamic> rates = jsonResponse['rates'];
        double rate = rates[_selectedTargetCurrency] ?? 0;
        double converted = amount * rate;
        setState(() {
          _convertedAmount = converted;
        });
      } else {
        throw Exception("Failed to fetch conversion rate");
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _buildInputSection() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Amount input.
            TextField(
              controller: _amountController,
              decoration: InputDecoration(
                labelText: 'Enter amount',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.numberWithOptions(decimal: true),
            ),
            SizedBox(height: 16),
            // Row for "From" and "To" dropdowns.
            Row(
              children: [
                Text(
                  "From:",
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                SizedBox(width: 10),
                _currencies.isNotEmpty
                    ? DropdownButton<String>(
                        value: _selectedSourceCurrency,
                        items: _currencies.map((currency) {
                          return DropdownMenuItem<String>(
                            value: currency,
                            child: Text(currency),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedSourceCurrency = value!;
                          });
                        },
                      )
                    : CircularProgressIndicator(),
                Spacer(),
                Text(
                  "To:",
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                SizedBox(width: 10),
                _currencies.isNotEmpty
                    ? DropdownButton<String>(
                        value: _selectedTargetCurrency,
                        items: _currencies.map((currency) {
                          return DropdownMenuItem<String>(
                            value: currency,
                            child: Text(currency),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedTargetCurrency = value!;
                          });
                        },
                      )
                    : CircularProgressIndicator(),
              ],
            ),
            SizedBox(height: 20),
            // Convert button.
            ElevatedButton(
              onPressed: _convertCurrency,
              child: Text("Convert"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultSection() {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoading
            ? Center(child: CircularProgressIndicator())
            : _convertedAmount != null
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Conversion Result:',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Text(
                        '$_convertedAmount $_selectedTargetCurrency',
                        style: TextStyle(fontSize: 16),
                      ),
                    ],
                  )
                : Text(
                    'Conversion Result:',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Currency Converter"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildInputSection(),
            SizedBox(height: 20),
            _buildResultSection(),
          ],
        ),
      ),
    );
  }
}
