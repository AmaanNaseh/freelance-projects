import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

var appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: Colors.amber,
    brightness: Brightness.dark,
  ),
  primarySwatch: Colors.amber,
  fontFamily: GoogleFonts.roboto().fontFamily,
  appBarTheme: AppBarTheme(
    centerTitle: true,
    foregroundColor: Colors.black,
    backgroundColor: Colors.amber,
    titleTextStyle: TextStyle(
      fontWeight: FontWeight.w600,
      color: Colors.black,
      fontSize: 24,
    ),
  ),
);
