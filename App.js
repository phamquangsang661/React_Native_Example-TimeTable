import { StatusBar } from 'expo-status-bar';
import Timetable from './screen/Timetable';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Svg, { Rect } from 'react-native-svg'
export default function App() {

  const [days, setDays] = useState()
  const [startTime, SetStartTime] = useState()
  const [endTime, SetEndTime] = useState()
  const timeTableRef = useRef()
  const [timetableMode, setTimetableMode] = useState('TIME')
  const [childKey, setChildKey] = useState(1);
  console.log(childKey)

  const onPressChangeTableMode = useCallback(() => {
    if (timetableMode == 'PERIOD') {
      setChildKey(prev => prev + 1);
      setTimetableMode('TIME')
    } else {
      setChildKey(prev => prev + 1);
      setTimetableMode('PERIOD')
    }
  }, [childKey])

  return (
    <View style={styles.container}>
      <Timetable
        key={childKey}
        ref={timeTableRef}
        tableMode={timetableMode}
        HeaderHeight={100}
        HeaderRenderComponent={
          () => (
            <>
              <Button title='test' onPress={() => {
                onPressChangeTableMode()
              }}></Button>

            </>
          )
        }
        onPressCreateNewEvent={(days, time) => {

          timeTableRef.current.addSchedule(1, 20000, 40500, {}, {
            boxColor: '#f2cc0c'
          })

          timeTableRef.current.addSchedule(1, 41000, 42500, {}, {
            boxColor: 'red'
          })

          timeTableRef.current.addSchedule(3, 35000, 42500, {}, {
            boxColor: '#f20cb8'
          })

          timeTableRef.current.addSchedule(1, 42600, 60000, {}, {
            boxColor: 'blue',
            textColor:'white'
          })

          timeTableRef.current.addSchedule(4, 20000, 45000, {}, {
            boxColor: 'orange'
          })

          timeTableRef.current.addSchedule(4, 10000, 19000, {}, {
            boxColor: 'violet'
          })
          //  timeTableRef.current.addSchedule(1, 6, 9, {}, {
          //   boxColor: 'red'
          // })
        }}
        onPressEvent={(days, time, dataStore) => {

        }}
      ></Timetable>
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
});
