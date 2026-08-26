import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class BottomNav extends StatelessWidget {
  const BottomNav({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(
            Icons.home,
            size: 20,
          ),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(
            FontAwesomeIcons.photoVideo,
            size: 20,
          ),
          label: 'City Clicks',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.handshake, size: 20),
          label: 'Guide',
        ),
      ],
      onTap: (int index) {
        switch (index) {
          case 0:
            Navigator.pushReplacementNamed(context, '/home');
            break;
          case 1:
            Navigator.pushNamed(context, '/photos');
            break;
          case 2:
            Navigator.pushNamed(context, '/guide');
            break;
        }
      },
    );
  }
}
