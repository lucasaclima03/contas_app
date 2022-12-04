import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function NearToDueDate() {
  const data = [
    {
      id: 1,
      title: 'Unimed',
      description: 'pagar logo',
      amount: 400,
      color: '#FF4500',
      members: 8,
      image: 'https://img.icons8.com/color/70/000000/name.png',
    },
    {
      id: 1,
      title: 'Netflix',
      description: 'pagar logo',
      amount: 500,
      color: '#87CEEB',
      members: 6,
      image: 'https://img.icons8.com/office/70/000000/home-page.png',
    },
    {
      id: 2,
      title: 'Condominio',
      description: 'pagar logo',
      amount: 350,
      color: '#4682B4',
      members: 12,
      image: 'https://img.icons8.com/color/70/000000/two-hearts.png',
    },
    {
      id: 3,
      title: 'Amazon',
      description: 'pagar logo',
      amount: 600,
      color: '#6A5ACD',
      members: 5,
      image: 'https://img.icons8.com/color/70/000000/family.png',
    },
    {
      id: 4,
      title: 'Cartao 2',
      description: 'pagar logo',
      amount: 400,
      color: '#FF69B4',
      members: 6,
      image: 'https://img.icons8.com/color/70/000000/groups.png',
    },
    {
      id: 5,
      title: 'Escola das crianças',
      description: 'pagar logo',
      amount: 400,
      color: '#00BFFF',
      members: 7,
      image: 'https://img.icons8.com/color/70/000000/classroom.png',
    },
    {
      id: 6,
      title: 'Gastos extras inesperados',
      description: 'pagar logo',
      amount: 400,
      color: '#00FFFF',
      members: 8,
      image: 'https://img.icons8.com/dusk/70/000000/checklist.png',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={data}
          horizontal={false}
          numColumns={2}
          //   keyExtractor={(item) => {
          //     return item.id;
          //   }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.card}
                // onPress={() => {
                //   this.clickEventListener(item.view);
                // }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Image
                    style={styles.icon}
                    source={{
                      uri: 'https://img.icons8.com/ios/40/000000/settings.png',
                    }}
                  />
                </View>
                {/* <Image style={styles.cardImage} source={{ uri: item.image }} /> */}
                <Text style={styles.description}> {item.description} </Text>
                <Text style={styles.amount}>R$ {item.amount} </Text>
                <Text style={styles.overDue}> Vencimento em 25/05/2022</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.subTitle}>ICON</Text>
                  <Text style={styles.subTitle}>Marcar como pago</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {/* <Text>Proximas do vencimento</Text>
        <View style={styles.cardArea} >
            <Text>Unimed Plano</Text>
            <Text>Pagar ate o vencimento</Text>
            <Text>RS 400</Text>
            <Text>Atrasado</Text>
            <View style={styles.actionArea} >
                <Text>ICON</Text>
                <Text>marcar como pago</Text>
            </View>
        </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  amount: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',    
  },
  cardArea: {
    width: 100,
    height: 200,
    borderWidth: 1,
    backgroundColor: '#FFEDF8',
  },
  actionArea: {
    height: '100%',
    width: '100%',
  },
  card: {
    marginHorizontal: 7,
    marginVertical: 7,
    flexBasis: '45%',
    backgroundColor: '#FFEDF8',
    borderWidth: 1,
    borderRadius: 20,
    elevation: 6
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    height: 70,
    width: 70,
    alignSelf: 'center',
  },
  description: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 16,
    flex: 1,
    color: 'black',
    fontWeight: 'bold',    
  },
  overDue: {
    textAlign: 'center',
    color: '#A5008A',
  },
  subTitle: {
    fontSize: 12,
    // flex: 1,
    color: 'black',
  },
  icon: {
    height: 20,
    width: 20,
  },
  list: {
    //paddingHorizontal: 5,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    alignItems: 'center',
  },
});
