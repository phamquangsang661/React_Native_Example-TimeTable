import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'
import constantSetting from '../constant/constantSetting';
import utils from '../utils';
import HeaderDays from './component/HeaderDays';
import { tableInterface, timeTableInterface } from '../interface/interface';
import TableContainer from './component/TableContainer';


interface inProps {
    [key: string]: any,
    HeaderRenderComponent: () => JSX.Element,
    HeaderHeight?: number,
    tableMode: 'PERIOD' | 'TIME',
    onPressCreateNewEvent?: (days: number, time: number) => void,
    onPressEvent?: (days: number, timeStart: number, timeEnd: number, dataStore: any, deleteEvent: void) => void,
    data: {
        mode: 'TIME' | 'PERIOD'
        days: number,
        timeStart: number,
        timeEnd: number,
        dataStore: any,
        options: any
    }[]
}
const calp = (value: number, percent: number): number => {
    return value * percent / 100
}
export default forwardRef(function Timetable(props: inProps, ref: React.Ref<timeTableInterface.timeTableRef>) {

    const {
        HeaderHeight,
        tableMode,
        onPressCreateNewEvent,
        onPressEvent,
        data,
        daysMode,
        numberOfPeriod,
       stateNoteOption
    } = props
    
    const [tableModeState, setTableModeState] = useState(tableMode ? tableMode : 'TIME');
    const { height, width } = useWindowDimensions();

    const [resetKey, setResetKey] = useState(1)
    const epLeft = height > width ? 15 : 70;
    const tableRef: React.MutableRefObject<tableInterface.tableRef> = useRef({})
    const [isFirst, setIsFirst] = useState(true)
    let isPortrait = width > height ? true : false
    const columnFirstWidth = isPortrait ? calp(width, 2) : calp(width, 8)
    //* Get const day of week
    //* In test
    const DAY_OF_WEEK = daysMode == 1 ? constantSetting.DAYS_IN_WEEK_1 : constantSetting.DAYS_IN_WEEK_2

    //* Cal number of col
    const columnCount = DAY_OF_WEEK.length
    const columnWidth = (width - columnFirstWidth) / columnCount
    useLayoutEffect(() => {
        if (isFirst) {
            setIsFirst(false)
        }
    })
    useImperativeHandle(ref, () => ({
        addSchedule: (days: number, timeStart: number, timeEnd: number, dataStore = {}, options = {}): void => {
            //* add Schedule in timetable
            tableRef.current && tableRef.current?.addSchedule?.(days, timeStart, timeEnd, dataStore, options)
        },
        changeMode: (mode: 'PERIOD' | 'TIME' | undefined): void => {
            if (mode == undefined) {
                if (tableModeState == 'PERIOD') {
                    setTableModeState('TIME');
                } else {
                    setTableModeState('PERIOD')
                }
            }
            else {
                setTableModeState(mode);
            }
            setResetKey((prev: number) => prev + 1)
            setIsFirst(true)
        }
    }));

    let isPotrait = utils.common.isPotrait(height, width);

    const { HeaderRenderComponent } = props
    const HeaderRender = () => (
        <View style={{ height: utils.common.getPercent(height, HeaderHeight ? utils.common.getPercent(15, HeaderHeight) : 15) }}>
            {!HeaderRenderComponent ? (<></>) : (<HeaderRenderComponent />)}
        </View>
    )

    return (
        <React.Fragment key={resetKey}>
            <ScrollView style={styles.scrollView} scrollEnabled={false}>
                <HeaderRender ></HeaderRender>
                <Svg
                    // viewBox={`0 0 ${width} ${utils.common.getPercent(height, 5)}`}
                    width={width}
                    height={utils.common.getPercent(height, 18)}

                    style={{ backgroundColor: 'white', minWidth: columnFirstWidth + columnWidth * columnCount, maxHeight: isPotrait ? '14%' : '5%' }}>

                    <HeaderDays heightHeader={utils.common.getPercent(height, 18)} daysMode={daysMode} height={height} width={width} epLeft={epLeft}></HeaderDays>
                  
                </Svg >
                <ScrollView
                    style={{ backgroundColor: 'white', flex: 2, minWidth: width, minHeight: height }}>
                    {/* Table container */}
                    <TableContainer
                        ref={tableRef}
                        data={data}
                        tableMode={tableModeState}
                        daysMode={daysMode}
                        numberOfPeriod={numberOfPeriod}
                        onPressCreateNewEvent={onPressCreateNewEvent}
                        onPressEvent={onPressEvent}
                        stateNoteOption={stateNoteOption}
                    ></TableContainer>
                </ScrollView>
            </ScrollView >
        </React.Fragment>
    );
})

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'row'
    },
    contentScrollView: {
        flex: 1,
        flexGrow: 1
    }
})
