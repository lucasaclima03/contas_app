import React, { useEffect, useState } from 'react';
import * as Calendar from 'expo-calendar';
import {
  Text,
  Button,
  Platform,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import CalendarPicker from 'react-native-calendar-picker'

async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source.name === 'Default'
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
}

async function addNewEvent() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  
  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}

export default function Reminder() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [friendNameText, setFriendNameText] = useState('');

  const startDate = selectedStartDate
    ? selectedStartDate.format('YYYY-MM-DD').toString()
    : '';

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

//   const addNewEvent = async () => {
//     try {
//       const calendarId = await createCalendar();
      
//       const res = await Calendar.createEventAsync(calendarId, {
//         endDate:  startDate,
//         startDate: startDate,
//         title: 'Happy Birthday buddy ' + friendNameText,
//       });
//       Alert.alert('Event Created!');
//     } catch (e) {
//       console.log(e);
//     }
//   };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Text>Calendar Module Example</Text>      
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text style={styles.dateText}>Birthday: {startDate}</Text>
      {/* <Button title='Create a new calendar' onPress={createCalendar} /> */}
      <Button title='Add to calendar' onPress={addNewEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  dateText: {
    margin: 16,
  },
});
