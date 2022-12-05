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
import * as Notifications from 'expo-notifications';

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
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
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
      reminderDate: '',
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
  const [disabled, setDisabled] = useState(true);

  const pickDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  //   const showMode = (currentMode) => {
  //     setShow(true)
  //     setMode(currentMode);
  //   };

  const disable = () => {
    setShow(false);
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
          <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>
              Title: {notification && notification.request.content.title}{' '}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>
              Data:{' '}
              {notification &&
                JSON.stringify(notification.request.content.data)}
            </Text>
          </View>
          <Button
            title='Press to schedule a notification'
            onPress={async () => {
              await schedulePushNotification();
            }}
          />
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
              />
            )}
            name='amount'
          />
          <Text style={styles.text}>Escolha uma data para te lembrar</Text>
          <Button onPress={() => setShow(true)} title='Escolher data' />
          <View style={styles.datePickerArea}>
            {show && (
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onBlur, value } }) => (
                  <DateTimePicker
                    style={styles.datePicker}
                    //   locale="pt-Br"
                    value={date}
                    onChange={pickDate}
                  />
                )}
                name='reminderDate'
              />
            )}
          </View>
          <Text> {date.toLocaleString()} </Text>

          <TouchableOpacity
            style={styles.submitFormButton}
            // onPress={
            //    handleSubmit(handleReminderData)
            // }
          >
            <Text style={styles.submitFormButtonText}> Salvar </Text>
          </TouchableOpacity>
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
