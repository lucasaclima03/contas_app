import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, FlatList, Pressable, SafeAreaView, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Q } from '@nozbe/watermelondb';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../../../../database';

export default function Payd(){
    useFocusEffect(
        useCallback(() => {
          getPaydBills();
        }, []),
      );
    
      const [paydBills, setPaydBills] = useState();
    
      const getPaydBills = async () => {
        const remindersCollection = database.get('reminder');
        const response = await remindersCollection.query(Q.where('payd', 1)).fetch();
        setPaydBills(response);
      };

      async function updateReminder(reminder) {
        Alert.alert('Atenção', 'Selecione uma das opções', [
          {
            text: 'Cancelar',
          },
          {
            text: 'Marcar como não pago',
            onPress: async () => {
              await database.write(async () => {
                await reminder.update((reminder) => {
                  reminder.payd = 0;
                });
              });
              getPaydBills();
            },
          },
          {
            text: 'Excluir',
            onPress: async () =>
              await database.write(async () => {
                await reminder.destroyPermanently();
                getPaydBills();
              }),
          },
        ]);
      }
      
    return (
        <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={paydBills}
          horizontal={false}
          numColumns={2}
          //   keyExtractor={(item) => {
          //     return item.id;
          //   }}
          renderItem={({ item }) => {
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Pressable >
                    <Image
                      style={styles.icon}
                      source={{
                        uri: 'https://img.icons8.com/ios/40/000000/settings.png',
                      }}
                    />
                  </Pressable>
                </View>
                {/* <Image style={styles.cardImage} source={{ uri: item.image }} /> */}
                <Text style={styles.description}> {item.description} </Text>
                <Text style={styles.amount}>R$ {item.amount} </Text>
                <Text style={styles.overDue}>Vencimento: {item.due_date} </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.subTitle}>ICON</Text>
                  <Text style={styles.subTitle}>Marcar como pago</Text>
                </View>
              </View>
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
    )
}

const styles = StyleSheet.create({
    amount: {
      color: 'black',
      textAlign: 'center',
      marginBottom: 5,
      fontSize: 16,
      fontWeight: 'bold',
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
      elevation: 6,
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
      marginBottom: 8,
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
  