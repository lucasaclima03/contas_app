import * as Device from 'expo-device';
import React, { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ReminderModel } from '../../database/models/Reminder';
import { database } from '../../database';
import * as Notifications from 'expo-notifications';
import { Q } from '@nozbe/watermelondb';
import { Linking } from 'react-native';


//const fireDate = ReactNativeAN.parseDate(new Date(Date.now())); // set the fire date for 1 second from now
//console.log('firedate ' + fireDate)

import * as TaskManager from 'expo-task-manager';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }





export default function RegisterReminder() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      dueDate: '',
      reminderDate: new Date(Date.now() - 86400000),      
    },
  });
  

  //   const [open, setOpen] = useState(false);

  //   const [selectedStartDate, setSelectedStartDate] = useState(null);

  //   const startDate = selectedStartDate
  //     ? selectedStartDate.format('YYYY-MM-DD').toString()
  //     : '';

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  

  const [date, setDate] = useState(new Date());
  //1598051730000
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showHours, setShowHours] = useState(false);
  // const [disabled, setDisabled] = useState(true);
  const [display, setDisplay] = useState('default')

  const pickDate = (event, selectedDate) => {    
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const pickHour = () => {
    setMode('time');
    setShowHours(false);
  };

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
    if(currentMode == 'time') {
      setDisplay('spinner')
    }

  }  

  let formatedDate =
    date.getDate().toString().padStart(2,'0') + '/' + (date.getMonth() + 1).toString().padStart(2,'0') + '/' + date.getFullYear();

  let formatedFireDate =
  date.getDate().toString().padStart(2,'0') + '-' + (date.getMonth() + 1).toString().padStart(2,'0')  + '-' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0') + ':00'  ;
  


  let day = date.getDate();
  let month = (date.getMonth() + 1 );
  let year = date.getFullYear()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  // console.log('data formatada ' + formatedDate)
  

  const [savedReminders, setSavedReminders] = useState();


  async function scheduleNextReminder(){

    await getScheduledReminder(25)

    
    // const currentMonth = (savedReminders[0].month + 1 )

    const currentMonth = 1
    
    console.log('mes atual ' + currentMonth )
    
    let nextMonthData;

    if(currentMonth > 11 ){
      nextMonthData = 1      
    }

    console.log('ano atual ' + date.getFullYear())
    
    // const currentYear = date.getFullYear()

    const currentYear = 2023

    let nextYearData ;

    if(currentYear > savedReminders[0].year) {
      nextYearData = (savedReminders[0].year + 1)
    }

    console.log('proximo ano ' + nextYearData)

    const nextMonthFireDate =  savedReminders[0].day.toString().padStart(2,'0') + '-' + (parseInt(currentMonth) > 11 ? (nextMonthData).toString().padStart(2,'0') : (currentMonth +1).toString().padStart(2,'0'))  + '-' + savedReminders[0].year + ' ' + savedReminders[0].hours.toString().padStart(2,'0') + ':' + savedReminders[0].minutes.toString().padStart(2,'0') + ':00'  ;

    const nextMonthDueDate = savedReminders[0].day.toString().padStart(2,'0') + '/' + (parseInt(currentMonth) > 11 ? (nextMonthData).toString().padStart(2,'0') : (currentMonth +1).toString().padStart(2,'0'))  + '/' + savedReminders[0].year ;

    const nextMonth = (currentMonth < 12 ? (currentMonth + 1) : nextMonthData )

    console.log('next month fire date ' + nextMonthFireDate)

    console.log('next month due date ' + nextMonthDueDate)

    const alarmNotifData = {
      title: `Lembrete ${savedReminders[0].title} `,
      message: savedReminders[0].description,
      channel: 'my_channel_id',
      small_icon: 'ic_launcher',
      loop_sound: false,
      has_button: true,      
      auto_cancel: true,
      fire_date: nextMonthFireDate,
      schedule_type: 'repeat',
    };

    

    console.log('proximo mes ' + JSON.stringify(alarmNotifData ))
    // const alarm = await ReactNativeAN.scheduleAlarm(alarmNotifData) 

    await database.write(async () => {
      const response = await database
        .get<ReminderModel>('reminder')
        .create((data) => {
          data.title = savedReminders[0].title;
          data.description = savedReminders[0].description;
          data.amount = savedReminders[0].amount;
          data.due_date = savedReminders[0].dueDate;
          data.reminder_date = formatedFireDate;
          data.payd = 0;
          data.alarm_id = alarm.id;
          data.previous_id = savedReminders[0].alarm_id;
          data.day = savedReminders[0].day;
          data.month = nextMonth;
          data.hours = savedReminders[0].hours;
          data.minutes = savedReminders[0].minutes;
          data.payment_proof = savedReminders[0].payment_proof;
          data.username = savedReminders[0].username;
          data.email = savedReminders[0].email;

        });
    });

  }

  // const trigger = new Date()
  //   trigger.setHours(11)
  //   trigger.setMinutes(30);
  //   trigger.setSeconds(0);
  //   console.log('trigger ' + trigger)

  async function getScheduledNotifications (){
    const response = await Notifications.getAllScheduledNotificationsAsync()
    console.log('reponse ' + JSON.stringify(response))
  }

  async function schedulePushNotification() {

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    const daysToSeconds = (days) => { return days * 24 * 60 * 60; }

    console.log('days to seconds ' + new Date(daysToSeconds(31)) )

    const trigger = date
    trigger.setHours(hours)
    trigger.setMinutes(minutes);    
    trigger.setSeconds(0);
    console.log('trigger ' + trigger)
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "Novo teste",
    //     body: 'Teste novo',
    //     data: { data: 'goes here' },
    //   },
    //   // trigger: { seconds: 2 },
    //   trigger: {
    //     channelId: 'default',
    //     date: date,
    //     repeats: true
    //   }
    // });

    // console.log('date ' + date)
  }

  

  async function handleReminderData(reminderData) {
    reminderData.dueDate = formatedDate;
    // console.log('REMINDER DATA ' + JSON.stringify(reminderData));    

    // const alarmNotifData = {
    //   title: 'Lembrete de conta',
    //   message: reminderData.title ,
    //   channel: 'my_channel_id',
    //   small_icon: 'ic_launcher',
    //   loop_sound: false,
    //   has_button: true,  
    //   data: { vencimento: 'pagar hoje!' },
    //   auto_cancel: true,
    //   fire_date: formatedFireDate,
    //   schedule_type: 'once'
    // };

    const trigger = date
    trigger.setHours(hours)
    trigger.setMinutes(minutes);    
    trigger.setSeconds(0);
    console.log('trigger ' + trigger)    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminderData.title ,
        body: reminderData.description,
        data: { data: 'goes here' },
      },
      // trigger: { seconds: 2 },
      trigger: trigger
        
        ,
      
    });    

    await database.write(async () => {
      const response = await database
        .get<ReminderModel>('reminder')
        .create((data) => {
          data.title = reminderData.title;
          data.description = reminderData.description;
          data.amount = parseInt(reminderData.amount);
          data.due_date = reminderData.dueDate;
          data.reminder_date = formatedFireDate;
          data.payd = 0;
          // data.alarm_id = alarm.id;
          data.day = day;
          data.month = month;
          data.year = year;
          data.hours = hours;
          data.minutes = minutes;
        });
    });
    Alert.alert('Lembre salvo com sucesso!');
    reset();
  }  

  async function returnAllScheduledReminders(){
    // const response = await ReactNativeAN.getScheduledAlarms()
    console.log('ALARMES ' + JSON.stringify(response))
    return response
  }

  async function getScheduledReminder(id) {
    //const response = await ReactNativeAN.getScheduledAlarms()
    
      const remindersCollection = database.get('reminder');
      const response = await remindersCollection
        .query(Q.where('alarm_id', parseInt(id)))
        .fetch();
        var seen = [];
      console.log('unico ' + JSON.stringify(response, function(key, val) {
        if (val != null && typeof val == "object") {
             if (seen.indexOf(val) >= 0) {
                 return;
             }
             seen.push(val);
         }
         return val;
     } ))   
    setSavedReminders(response)
  }

  

  const returnReminders = async () => {
    const remindersCollection = database.get('reminder');
    const response = await remindersCollection
      .query(Q.where('payd', 0))
      .fetch();
      var seen = [];
    console.log('banco de dados ' + JSON.stringify(response, function(key, val) {
      if (val != null && typeof val == "object") {
           if (seen.indexOf(val) >= 0) {
               return;
           }
           seen.push(val);
       }
       return val;
   } ))
    setSavedReminders(response);
  };

  

  

  

  

  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >           
        </View>
        <View style={styles.contentArea}>
          <Text style={styles.text}>Registre sua conta a pagar</Text>
          <Controller
            control={control}
            rules={{
              required: true,
              maxLength: 50,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
            name='title'
          />
          {errors.title && (
            <Text style={styles.textError}>O campo é obrigatório</Text>
          )}
          <Text style={styles.text}>Descrição (opcional)</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 80,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                // onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name='description'
          />
          {errors.description && (
            <Text style={styles.textError}>
              O campo deve ter no máximo 80 caracteres
            </Text>
          )}
          <Text style={styles.text}>Valor</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                // onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType='numeric'
              />
            )}
            name='amount'
          />
          <Text style={styles.text}>Escolha a data/hora de lembrete/vencimento</Text>
          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={() => showMode('date')}
          >
            <Text style={styles.submitFormButtonText}> Escolher data </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={() => showMode('time')}
          >
            <Text style={styles.submitFormButtonText}> Escolher hora </Text>
          </TouchableOpacity>
          
          <View style={styles.datePickerArea}>
            {show && (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateTimePicker
                    style={styles.datePicker}
                    //   locale="pt-Br"
                    value={date}
                    onChange={pickDate}
                    mode={mode}                    
                    display={display}
                  />
                )}
                name='dueDate'
              />
            )}            
          </View>
          {/* <Text style={styles.dueDate}>Vencimento em: {formatedDate} </Text> */}
          
          <Text style={styles.dueDate}>Lembrete em: {formatedFireDate} </Text>

          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={handleSubmit(handleReminderData)}
          >
            <Text style={styles.submitFormButtonText}> Salvar </Text>
          </TouchableOpacity>      
          <Button title='Agendar notif' onPress={ () => schedulePushNotification() }  />     
          <Button title='ver notif agendadas' onPress={ async() => await getScheduledNotifications() }  />     
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  contentArea: {
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'flex-start',
    marginLeft: '8%',
    marginTop: 10,
    color: 'black',
  },
  datePicker: {
    marginVertical: 25,
  },
  datePickerArea: {
    alignItems: 'center',
  },
  dueDate: {
    color: 'black',
    marginHorizontal: '8%',
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
  },
  input: {
    padding: 5,
    marginLeft: '8%',
    marginHorizontal: 10,
    borderBottomWidth: 1,
    width: '80%',
    marginBottom: 5,
    color: 'black',
  },
  submitFormButton: {
    backgroundColor: '#8B008B',
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    height: 50,
    borderWidth: 1,
    marginVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
  },
  submitFormButtonText: {
    fontSize: 18,
    color: 'white',
  },
  textError: {
    color: 'red',
    marginLeft: 35,
  },
});
