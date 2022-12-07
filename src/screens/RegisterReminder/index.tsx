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

import ReactNativeAN from 'react-native-alarm-notification'

//const fireDate = ReactNativeAN.parseDate(new Date(Date.now())); // set the fire date for 1 second from now
//console.log('firedate ' + fireDate)
const fireDate = '06-12-2022 19:51:00'; // set exact date time | Format: dd-MM-yyyy HH:mm:ss



async function method() {
  //Schedule Future Alarm
  const alarm = await ReactNativeAN.scheduleAlarm({
    ...alarmNotifData,
    fire_date: fireDate,
  });
  console.log(alarm); // { id: 1 }

  //Delete Scheduled Alarm
  ReactNativeAN.deleteAlarm(alarm.id);

  //Delete Repeating Alarm
  ReactNativeAN.deleteRepeatingAlarm(alarm.id);

  //Stop Alarm
  ReactNativeAN.stopAlarmSound();

  //Send Local Notification Now
  // ReactNativeAN.sendNotification(alarmNotifData);

  //Get All Scheduled Alarms
  const alarms = await ReactNativeAN.getScheduledAlarms();

  //Clear Notification(s) From Notification Center/Tray
  ReactNativeAN.removeFiredNotification(alarm.id);
  ReactNativeAN.removeAllFiredNotifications();
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body dude',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

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
      reminderDate: new Date(Date.now() - 86400000),
      reminderHour: ''
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
  const [fireReminderDate, setFireReminderDate]= useState();

  

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
    date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

  let formatedFireDate =
  date.getDate().toString().padStart(2,'0') + '-' + (date.getMonth() + 1).toString().padStart(2,'0')  + '-' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0') + ':00'  ;


  // console.log('data formatada ' + formatedDate)
  console.log('FIRE FORMATED ' + formatedFireDate)

  

  async function handleReminderData(reminderData) {
    reminderData.reminderDate = formatedDate;
    // console.log('REMINDER DATA ' + JSON.stringify(reminderData));    

    const alarmNotifData = {
      title: 'Lembrete de conta',
      message: reminderData.title ,
      channel: 'my_channel_id',
      small_icon: 'ic_launcher',
      loop_sound: false,
      has_button: true,  
      data: { vencimento: 'pagar hoje!' },
      auto_cancel: true
    };

    await ReactNativeAN.scheduleAlarm({
      ...alarmNotifData,
      fire_date: formatedFireDate,
      }) 

    await database.write(async () => {
      const response = await database
        .get<ReminderModel>('reminder')
        .create((data) => {
          data.title = reminderData.title;
          data.description = reminderData.description;
          data.amount = parseInt(reminderData.amount);
          data.due_date = reminderData.reminderDate;
          data.payd = 0;
        });
    });
    Alert.alert('Lembre salvo com sucesso!');
    reset();
  }  

  

  

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
          <Text style={styles.text}>Escolha a data de vencimento</Text>
          <Button onPress={() => showMode('date')} title='Escolher data' />
          <Button onPress={() => showMode('time')} title='Escolher hora' />
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
                name='reminderDate'
              />
            )}
            {/* {show && (
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
                    onChange={() => showMode('time') }
                    mode={mode}
                  />
                )}
                name='reminderHour'
              />
            )} */}
          </View>
          <Text style={styles.dueDate}>Vencimento em: {formatedDate} </Text>
          <Text style={styles.dueDate}>Alarme: {formatedFireDate} </Text>

          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={handleSubmit(handleReminderData)}
          >
            <Text style={styles.submitFormButtonText}> Salvar </Text>
          </TouchableOpacity>
          <Button title='ver alarmes' onPress={ async () => console.log(await ReactNativeAN.getScheduledAlarms())   } 
          />
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
