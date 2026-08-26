import 'package:flutter/material.dart';

class EmergencyServicesScreen extends StatelessWidget {
  const EmergencyServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Hard-coded emergency services.
    return Scaffold(
      appBar: AppBar(
        title: Text('Emergency Contacts'),
      ),
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.local_police, color: Colors.blue),
              title: Text('Police'),
              subtitle: Text('100'),
              // No onTap action
            ),
          ),
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.fire_extinguisher, color: Colors.red),
              title: Text('Fire'),
              subtitle: Text('101'),
              // No onTap action
            ),
          ),
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.medical_services, color: Colors.green),
              title: Text('Ambulance'),
              subtitle: Text('102'),
              // No onTap action
            ),
          ),
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.warning, color: Colors.orange),
              title: Text('Disaster Management'),
              subtitle: Text('108'),
              // No onTap action
            ),
          ),
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.female, color: Colors.purple),
              title: Text('Women Helpline'),
              subtitle: Text('1091'),
              // No onTap action
            ),
          ),
          Card(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: ListTile(
              leading: Icon(Icons.child_care, color: Colors.teal),
              title: Text('Child Helpline'),
              subtitle: Text('1098'),
              // No onTap action
            ),
          ),
        ],
      ),
    );
  }
}
