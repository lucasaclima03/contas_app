import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { Q } from '@nozbe/watermelondb';
import { database } from '../../../../database';

import { useNavigation } from '@react-navigation/native';

import { ReminderModel } from '../../../../database/models/Reminder';


export default function NearToDueDate() {
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      getReminders();
    }, [])
  );

  const [savedReminders, setSavedReminders] = useState();
  const [date, setDate] = useState(new Date());

  async function removeReminder(reminder) {
    Alert.alert('Atenção', 'Deseja realmente excluir o item?', [
      {
        text: 'Cancelar',
      },      
      {
        text: 'Excluir',
        onPress: async () =>
          await database.write(async () => {
            await reminder.destroyPermanently();
            getReminders();
          }),
      },
    ]);    
    

    

  //   let formatedDate =
  //   date.getDate().toString().padStart(2,'0') + '/' + (date.getMonth() + 1).toString().padStart(2,'0') + '/' + date.getFullYear();

  // let formatedFireDate =
  // date.getDate().toString().padStart(2,'0') + '-' + (date.getMonth() + 1).toString().padStart(2,'0')  + '-' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0') + ':00'  ;
  //   var seen = [];
  //   console.log('REMINDER DATA ' + JSON.stringify(reminder, function(key, val) {
  //     if (val != null && typeof val == "object") {
  //          if (seen.indexOf(val) >= 0) {
  //              return;
  //          }
  //          seen.push(val);
  //      }
  //      return val;
  //  }))   
  //  console.log( 'formated date ' + formatedDate)

   
  // //  const hoje = date.getDate()
  //  const hoje = 1
  //  const lembrete = reminder.day
   
  //  console.log('hoje ' + hoje
  //  )
  //  console.log('reminder day ' + lembrete)

  //  const resultado = lembrete - hoje

  //  console.log('resultado ' + resultado)
   
  // if(resultado === 2 ) {

  // }


  await scheduleNextReminder(reminder.alarm_id)

  // console.log('respostaaa ' + response)

    
  }
  
  
  
  async function scheduleNextReminder(id){

    console.log('IDE ' + id.id)
    const reminderId = parseInt(id.id)

    console.log('number ' + reminderId)
    
    const response = await getScheduledReminder(reminderId)
    console.log('RESPONSE ' + response[0].month )

    
    const currentMonth = (response[0].month )

    //const currentMonth = 1
    
    console.log('mes atual ' + currentMonth )
    
    let nextMonthData;

    if(currentMonth > 11 ){
      nextMonthData = 1      
    }    
    
    const currentYear = date.getFullYear()

    // const currentYear = 2023

    let nextYearData ;

    if(currentYear > response[0].year) {
      nextYearData = (response[0].year + 1)
    }
    if(currentYear > 11) {
      nextYearData = (response[0].year + 1)
    }

    console.log('dia ' + response[0].day)

    const nextMonthFireDate =  response[0].day.toString().padStart(2,'0') + '-' + (parseInt(currentMonth) > 11 ? (nextMonthData).toString().padStart(2,'0') : (currentMonth +1).toString().padStart(2,'0'))  + '-' + ((currentYear > 11 ) ? (nextYearData).toString() : response[0].year  ) + ' ' + response[0].hours.toString().padStart(2,'0') + ':' + response[0].minutes.toString().padStart(2,'0') + ':00'  ;

    const nextMonthDueDate = response[0].day.toString().padStart(2,'0') + '/' + (parseInt(currentMonth) > 11 ? (nextMonthData).toString().padStart(2,'0') : (currentMonth +1).toString().padStart(2,'0'))  + '/' + response[0].year ;

    const nextMonth = (currentMonth < 12 ? (currentMonth + 1) : nextMonthData )

    console.log('next month fire date ' + nextMonthFireDate)

    console.log('next month due date ' + nextMonthDueDate)

    const alarmNotifData = {
      title: `Lembrete ${response[0].title} `,
      message: response[0].description,
      channel: 'my_channel_id',
      small_icon: 'ic_launcher',
      loop_sound: false,
      has_button: true,      
      auto_cancel: true,
      fire_date: nextMonthFireDate,
      schedule_type: 'once',
    };

    

    console.log('proximo mes ' + JSON.stringify(alarmNotifData ))
    // const alarm = await ReactNativeAN.scheduleAlarm(alarmNotifData) 

    await database.write(async () => {
      const response = await database
        .get<ReminderModel>('reminder')
        .create((data) => {
          data.title = response[0].title;
          data.description = response[0].description;
          data.amount = response[0].amount;
          data.due_date = nextMonthDueDate;
          data.reminder_date = nextMonthFireDate;
          data.payd = 0;
          data.alarm_id = alarm.id;
          data.previous_id = response[0].alarm_id;
          data.day = response[0].day;
          data.month = nextMonth;
          data.hours = response[0].hours;
          data.minutes = response[0].minutes;
          data.payment_proof = response[0].payment_proof;
          data.username = response[0].username;
          data.email = response[0].email;

        });
    });

  }

  async function getScheduledReminder(id) {

    console.log('ID DO SCHEDULE ' + id)
    //const response = await ReactNativeAN.getScheduledAlarms()
    
      const remindersCollection = database.get('reminder');
      const response = await remindersCollection
        .query(Q.where('alarm_id', parseInt(id)))
        .fetch();
        setSavedReminders(response)        
        var seen = [];
      console.log('unico ' + JSON.stringify(response[0], function(key, val) {
        if (val != null && typeof val == "object") {
             if (seen.indexOf(val) >= 0) {
                 return;
             }
             seen.push(val);
         }
         return val;
     } ))   

     return response;
  }


  const getReminders = async () => {
    const remindersCollection = database.get('reminder');
    const response = await remindersCollection
      .query(Q.where('payd', 0))
      .fetch();
    setSavedReminders(response);
  };

  async function updateReminder(reminder) {
    Alert.alert('Atenção', 'Selecione uma das opções', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Editar',
        onPress: () => navigation.navigate('EditReminderNavigation', {reminder})

      },
      {
        text: 'Marcar como pago',
        onPress: async () => {
          await database.write(async () => {
            await reminder.update((reminder) => {
              reminder.payd = 1;
            });
          });
          getReminders();
        },
      },
      {
        text: 'Excluir',
        onPress: async () =>
          await database.write(async () => {
            await reminder.destroyPermanently();
            getReminders();
          }),
      },
    ]);
  }
  
  


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />        
      {/* <Button title='agendados' onPress={ async() => console.log(await ReactNativeAN.getScheduledAlarms()) } /> */}
      {/* <Button title='apagar' onPress={ () => console.log( ReactNativeAN.deleteAlarm(59)) } /> */}
      
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={savedReminders}
          horizontal={false}
          numColumns={2}
          //   keyExtractor={(item) => {
          //     return item.id;
          //   }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity style={styles.card} onLongPress={() => removeReminder(item)} onPress={() => updateReminder(item)} >
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Pressable onPress={() => updateReminder(item)}>
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
                {/* <View style={styles.cardFooter}>
                  <Text style={styles.subTitle}>ICON</Text>
                  <Text style={styles.subTitle}>Marcar como pago</Text>
                </View> */}
              </TouchableOpacity>
            );
          }}
        />      
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
    // textAlign: 'left',
    marginBottom: 8,
    marginLeft: 12    
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
    paddingBottom: 25,
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
