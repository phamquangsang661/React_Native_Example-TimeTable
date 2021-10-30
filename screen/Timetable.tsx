import { StatusBar } from 'expo-status-bar';
import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'
import constantSetting from '../constant/constantSetting';
import utils from '../utils';
import HeaderDays from './component/HeaderDays';
import Table from './component/Table';
import { tableInterface, timeTableInterface } from '../interface/interface';



interface inProps {
    [key: string]: any,
    HeaderRenderComponent: () => JSX.Element,
    HeaderHeight?: number,
    tableMode: 'PERIOD' | 'TIME',
    onPressCreateNewEvent?: (days: number, time: number) => void,
    onPressEvent?: (days: number, time: number, dataStore: any, deleteEvent: void) => void
}

export default forwardRef(function Timetable(props: inProps, ref: React.Ref<timeTableInterface.timeTableRef>) {

    const { HeaderHeight, tableMode, onPressCreateNewEvent, onPressEvent } = props
    const { height, width } = useWindowDimensions();
    const epLeft = height > width ? 15 : 70;

    const tableRef: React.MutableRefObject<tableInterface.tableRef> = useRef({})

    useImperativeHandle(ref, () => ({
        addSchedule: (days: number, timeStart: number, timeEnd: number, dataStore = {}, options = {}): void => {
            setTimeout(() => tableRef.current && tableRef.current?.addSchedule?.(days, timeStart, timeEnd, dataStore, options), 10)
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
        <ScrollView style={styles.scrollView} scrollEnabled={false}>
            <HeaderRender ></HeaderRender>
            <Svg viewBox={`0 0 ${width + epLeft} ${utils.common.getPercent(height, 15)}`} style={{ backgroundColor: 'white', minHeight: '5%', maxHeight: isPotrait ? '14%' : '5%' }}>
                <HeaderDays height={height} width={width} epLeft={epLeft}></HeaderDays>
            </Svg >
            <ScrollView
                //contentContainerStyle={styles.contentScrollView}
                onScroll={() => {
                }}
                style={{ backgroundColor: 'white', flex: 2, minWidth: width, minHeight: height }}>
                <Table
                    ref={tableRef}
                    tableMode={tableMode}
                    onPressCreateNewEvent={(days, time, boxRef) => {
                        onPressCreateNewEvent && onPressCreateNewEvent(days, time)
                    }}
                    onPressEvent={(days, time, dataStore, deleteEvent) => {
                        onPressEvent && onPressEvent(days, time, dataStore, deleteEvent)
                    }}
                />
            </ScrollView>
        </ScrollView >
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
