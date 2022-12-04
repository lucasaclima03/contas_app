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
  

  const [date, setDate] = useState(new Date());
  //1598051730000
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(true)

  const pickDate = (event, selectedDate) => {
    const currentDate = selectedDate || date ;
    setShow(false);
    setDate(currentDate);
  };  

//   const showMode = (currentMode) => {
//     setShow(true)
//     setMode(currentMode);
//   };

  const disable = () => {
    setShow(false)
  }
  



  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      <ScrollView>
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
          <Button onPress={ () => setShow(true) } title="Escolher data" />          
          <View style={styles.datePickerArea}>
            { show && <Controller
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
            /> }
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
