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

import * as Calendar from 'expo-calendar';

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

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [display, setDisplay] = useState('default');

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
    setShow(true);
    setMode(currentMode);
    if (currentMode == 'time') {
      setDisplay('spinner');
    }
  };

  let formatedDate =
    date.getDate().toString().padStart(2, '0') +
    '/' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    date.getFullYear();

  let formatedFireDate =
    date.getDate().toString().padStart(2, '0') +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getFullYear() +
    ' ' +
    date.getHours().toString().padStart(2, '0') +
    ':' +
    date.getMinutes().toString().padStart(2, '0') +
    ':00';

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  date.setHours(9)
  date.setMinutes(0)
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const [savedReminders, setSavedReminders] = useState();

  async function handleReminderData(reminderData) {
    async function getDefaultCalendarSource() {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      return defaultCalendar.source;
    }

    const calendars = await Calendar.getCalendarsAsync();

    if (!calendars[0]?.id) {
      const defaultCalendarSource =
        Platform.OS === 'ios'
          ? await getDefaultCalendarSource()
          : {
              name: 'Contas App Calendar',
              type: 'local',
              isLocalAccount: true,
            };
      const newCalendarID = await Calendar.createCalendarAsync({
        title: 'Contas App',
        color: 'blue',
        entityType: Calendar.EntityTypes.REMINDER,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.NONE,
        allowedReminders: [
          Calendar.AlarmMethod.ALARM,
          Calendar.AlarmMethod.ALERT,
          Calendar.AlarmMethod.DEFAULT,
        ],
        isVisible: true,
        isPrimary: false,
        isSynced: true
      });
    }

    reminderData.dueDate = formatedDate;

    const eventId = await Calendar.createEventAsync('1', {
      title: reminderData.title,
      startDate: date,
      endDate: date,
      recurrenceRule: {
        frequency: Calendar.Frequency.MONTHLY,
      },
      alarms: [
        {
          method: Calendar.AlarmMethod.ALERT,
          relativeOffset: -1,
        },
      ],
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
          data.event_id = parseInt(eventId);
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
        ></View>
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
          <Text style={styles.dueDateText}>
            Escolha a data de vencimento
          </Text>
          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={() => showMode('date')}
          >
            <Text style={styles.submitFormButtonText}> Escolher data </Text>
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
          
          <Text style={styles.dueDate}>Vencimento em: {`${day}/${month}`} </Text>          

          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={handleSubmit(handleReminderData)}
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
  dueDate: {
    color: 'black',
    marginHorizontal: '8%',
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
  },
  dueDateText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'flex-start',    
    marginTop: 10,
    color: 'black',
    textAlign: 'center'
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
