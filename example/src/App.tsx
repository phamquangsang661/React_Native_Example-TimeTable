import * as React from 'react';
import Timetable from '../../src/index'
import { StyleSheet, View, Text, Button } from 'react-native';



export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const tableRef = React.useRef()
  React.useEffect(() => {

  }, []);

  return (
    <Timetable
      daysMode={1}
      ref={tableRef}
      numberOfPeriod={20}
      HeaderHeight={100}
      data={[{
        mode: 'TIME',
        days: 1,
        timeStart: 20000,
        timeEnd: 40000,
        dataStore: {
          text: 'Toán',
          noteText: "Học ngu"
        },
        option:{
          boxColor:'red',
          fontColor:'green'
        }
      },
      {
        mode: 'TIME',
        days: 2,
        timeStart: 30000,
        timeEnd: 40000,
      }]}
      tableMode={'TIME'}
      onPressCreateNewEvent={(day, time) => {

      }}
      onPressEvent={(day, timeStart, timeEnd, dataStore, deleteEvent) => {
        deleteEvent()
      }}
      HeaderRenderComponent={() => {
        return (
          <Button title='Đổi chế độ' onPress={() => {
            tableRef.current.changeMode()
          }}></ Button>
        )
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
