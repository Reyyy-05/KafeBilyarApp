import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text, Chip, Button, Divider } from 'react-native-paper';

const TableDetailScreen = ({ route, navigation }: any) => {
  const { tableId } = route.params || { tableId: '1' };

  const tableDetails = {
    id: tableId,
    name: 'Bilyar Table A1',
    type: 'billiard',
    status: 'available',
    pricePerHour: 60000,
    description: 'Meja bilyar premium dengan kain tournament quality',
    features: [
      'Ukuran standar tournament',
      'Kain premium Simonis',
      'Bola Aramith',
      'Pencahayaan LED',
      'Area nyaman dengan kursi'
    ],
    rules: [
      'Minimum booking 1 jam',
      'DP 50% untuk booking',
      'Batal maksimal 2 jam sebelum booking',
      'Dilarang merokok di area meja'
    ]
  };

  const handleBookNow = () => {
    navigation.navigate('Booking', { tableId: tableDetails.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mainCard}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.tableName}>{tableDetails.name}</Title>
            <Chip 
              mode="outlined"
              style={[
                styles.statusChip,
                tableDetails.status === 'available' ? styles.availableChip : styles.bookedChip
              ]}
            >
              {tableDetails.status === 'available' ? 'Tersedia' : 'Dipesan'}
            </Chip>
          </View>
          
          <Paragraph style={styles.description}>
            {tableDetails.description}
          </Paragraph>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Harga per jam:</Text>
            <Text style={styles.priceValue}>Rp {tableDetails.pricePerHour.toLocaleString()}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.featuresCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Fasilitas</Title>
          <Divider style={styles.divider} />
          {tableDetails.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.rulesCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Aturan & Ketentuan</Title>
          <Divider style={styles.divider} />
          {tableDetails.rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleNumber}>{index + 1}.</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleBookNow}
          style={styles.bookButton}
          disabled={tableDetails.status !== 'available'}
        >
          {tableDetails.status === 'available' ? 'Book Now' : 'Tidak Tersedia'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  mainCard: {
    marginBottom: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tableName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    height: 32,
  },
  availableChip: {
    backgroundColor: '#E8F5E8',
  },
  bookedChip: {
    backgroundColor: '#FFEBEE',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1976D2',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  featuresCard: {
    marginBottom: 16,
    elevation: 2,
  },
  rulesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#2196F3',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#2196F3',
    minWidth: 20,
  },
  ruleText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    marginVertical: 24,
  },
  bookButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default TableDetailScreen;