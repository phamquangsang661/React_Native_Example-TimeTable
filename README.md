

# RN-timetable

### How to install

---

```
npm install rn-timetable
#OR
yarn add rn-timetable
```

### How to use

- Image<br>
Period Mode <br>
![Period Mode](image/period_mode.gif) <br>
Time Mode<br>
![Time Mode](image/time_mode.gif)<br>
Day Mode 1<br>
![Day mode 2](image/day_mode_1.jpg)<br>
Day Mode 2<br>
![Day mode 2](image/day_mode_2.jpg)<br>
---<br>

```react
  const timeTableRef = useRef()
  const [timetableMode, setTimetableMode] = useState('TIME') //TIMETABLE MODE
```
- API Reference<br>
timeTableRef.current.changeMode(): Change mode <br>
timeTableRef.current.reset(): reset All data in table<br>
timeTableRef.current.addSchedule(day, timeStart,timeEnd,dataStore,option): add new time to table<br>
```
In time mode timeStart ,timeEnd is "time in day" convert to second ,ex 3h -> 10800
In period mode timeStart, timeEnd is period ex: 1,2,3 (Period)
```
---<br>
- Timetable props<br>
ref: table ref (mush have)<br>
daysMode: 1 (six day/week) - 2 (seven day/week) - 3 (five day/week)<br> 
data: data input (example below)<br>
tableMode: time(24h) or period(Default: 12 period)<br>
numberOfPeriod: if u want more than 12 period<br>
stateNoteOption: show note if true or else (default:true)
---<br>
- use in JSX
```react
<Timetable
      daysMode={1} 
      ref={tableRef}
      HeaderHeight={100} // 0 for none
      data={[{
        mode: 'TIME',
        days: 1,
        timeStart: 20000,
        timeEnd: 40000,
        dataStore: {
          text: 'Toán',
          noteText: "Thi cuoi ky"
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
        deleteEvent()//use to delete time on point
      }}
      HeaderRenderComponent={() => {
        return (
          <Button title='Change mode' onPress={() => {
            tableRef.current.changeMode() // Change mode
          }}></ Button>
        )
      }}
    />
```

