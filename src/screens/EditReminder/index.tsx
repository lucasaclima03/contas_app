import React, { useEffect, useState } from 'react';
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
import {ReminderModel} from '../../database/models/Reminder';
import {database} from '../../database';
import { useRoute } from '@react-navigation/core';

export default function EditReminder() {
  const route = useRoute();
  const {reminder} = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      title: reminder.title,
      description: reminder.description,
      amount: reminder.amount.toString(),
      due_date: reminder.due_date,
      reminderDate: new Date((Date.now()) - 86400000 ),
    },
  });
  
  
  const [date, setDate] = useState(new Date());
  const [oldDate, setOldDate] = useState(reminder.due_date)    
  const [show, setShow] = useState(false);    

  const pickDate = (event, selectedDate) => {
    const currentDate = selectedDate || date ;
    setShow(false);
    setOldDate(false)
    setDate(currentDate);
  };  

  let formatedDate = ((date.getDate() )) + "/" + ((date.getMonth() + 1)) + "/" + date.getFullYear();   

  async function handleReminderData(reminderData ) {    
    reminderData.reminderDate = formatedDate    
    await database.write(async () => {
      const response = await database
      .get<ReminderModel>('reminder')
      .create(data => {
        data.title = reminderData.title;
        data.description = reminderData.description;
        data.amount = parseInt(reminderData.amount) ;
        data.due_date = reminderData.reminderDate;
        data.payd = 0
      });
    });    
    Alert.alert('Lembre atualizado com sucesso!')
    reset()          
  }  
  



  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      <ScrollView>
        <View style={styles.contentArea}>
          <Text style={styles.text}>Edite sua conta a pagar</Text>
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
                // value={reminder.description}
                value={value }
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
                onChangeText={ onChange}
                value={ value }                
                keyboardType="numeric"                
              />
            )}
            name='amount'
          />
          <Text style={styles.text}>Escolha a data de vencimento</Text>
          <Button onPress={ () => setShow(true) } title="Escolher data" />          
          <View style={styles.datePickerArea}>
            { show && <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (                
                
                <DateTimePicker
                  style={styles.datePicker}                
                  value={value}
                  onChange={pickDate }
                  locale={'pt'}
                              
                />
              )}
               name='reminderDate'
            /> }
          </View>
          <Text style={styles.dueDate}>Vencimento em: { oldDate ? oldDate : formatedDate } </Text>          

          <TouchableOpacity
            style={styles.submitFormButton}
            onPress={
               handleSubmit(handleReminderData)
            }
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
