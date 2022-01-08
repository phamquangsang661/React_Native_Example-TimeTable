import * as React from 'react';
import { useState } from 'react';
import Timetable from '../../src/index'
import { StyleSheet, View, Text, Button } from 'react-native';



export default function App() {
  const [result, setResult] = React.useState<number | undefined>();
  const [data, setData] = useState([])
  const addData=()=>{
    setData([{
      mode: 'PERIOD',
      days: 1,
      timeStart: 1,
      timeEnd: 5,
      dataStore: {
        text: 'Toán văn',
        noteText: "Học ngu"
      },
      option: {
        boxColor: 'red',
        fontColor: 'green'
      }
    },
    {
      mode: 'TIME',
      days: 2,
      timeStart: 10800,
      timeEnd: 14400,
    }])
  }

  const tableRef = React.useRef()
  React.useEffect(() => {

  }, []);

  return (
    <Timetable
      daysMode={3}
      stateNoteOption={true}
      ref={tableRef}
      numberOfPeriod={20}
      HeaderHeight={100}
      data={data }
      tableMode={'TIME'}
      onPressCreateNewEvent={(day, time) => {
        console.log("LOG here")
        addData()
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
