import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Circle } from 'react-native-svg'
import moment from 'moment';

import constantSetting from '../../constant/constantSetting';
import utils from '../../utils';
import TimeBox from './TimeBox';
import { boxInterface } from '../../interface/interface';
import { ReactElement } from 'react';



interface inProps {
    epRight?: number,
    epLeft?: number,
    tableMode: 'PERIOD' | 'TIME',
    onPressCreateNewEvent?: (days: number, time: number, boxRef: React.MutableRefObject<{
        changeMode?: (param: boxInterface.boxParam, startTime?: number, endTime?: number) => void,
        getText?: JSX.Element[]
    }>) => void,
    onPressEvent?: (days: number, time: number, dataStore: any) => void
}

export default forwardRef(function HeaderDays(props: inProps, ref) {

    const { tableMode, onPressCreateNewEvent, onPressEvent } = props
    const { height, width } = useWindowDimensions();
    useImperativeHandle(ref, () => ({
        addSchedule: createSchedule
    }));

    let isPeriod = tableMode == 'PERIOD' ? true : false
    let isPotrait = utils.common.isPotrait(height, width);
    const columnFirstWidth = isPotrait ? utils.common.getPercent(width, 2) : utils.common.getPercent(width, 8)
    const columnWidth = (width - columnFirstWidth) / 6
    const columnHeight = utils.common.getPercent(height, 10)

    const lineTime = ((columnHeight * 24) / (24 * 60 * 60)) * (utils.common.getSecDateNow())

    const modeLength = constantSetting.HEADER_LEFT[tableMode].length
    const modeArrayInit = constantSetting.HEADER_LEFT[tableMode]

    const timeBoxRef = useRef(null)
    const timeBoxesRef: React.MutableRefObject<React.MutableRefObject<{
        changeMode?: (param: boxInterface.boxParam, startTime?: number, endTime?: number) => void,
        getText?: JSX.Element[]
    }>[][]> = useRef([])

    const [Table, setTable] = useState(modeArrayInit.map((period: number, time: number) => {
        let column = []
        let boxesRef = []
        for (const days in constantSetting.DAYS_IN_WEEK) {
            const box = useRef({})
            column.push((
                <TimeBox
                    ref={box}
                    memRef={timeBoxRef}
                    key={(parseInt(days) + 1) * (time + 1)}
                    columnWidth={columnWidth}
                    columnHeight={columnHeight}
                    columnFirstWidth={columnFirstWidth}
                    days={parseInt(days)}
                    time={time}
                    tableMode={tableMode}
                    onPressCreateNewEvent={() => onPressCreateNewEvent && onPressCreateNewEvent(parseInt(days), time, box)}
                    onPressEvent={(dataStore) => onPressEvent && onPressEvent(parseInt(days), time, dataStore)}
                />
            ))
            boxesRef.push(box)
        }
        timeBoxesRef.current.push(boxesRef);
        return column
    }))
    const createSchedule = useCallback((days, timeStart: number, timeEnd: number, dataStore, options = {}) => {
        if (isPeriod) {
            timeStart -= 1
            timeEnd -= 1
            for (let time = timeStart; time <= timeEnd; time++) {
                let changeMode = timeBoxesRef.current[time][days].current.changeMode
                if (time == timeStart) {
                    changeMode?.({ boxMode: 'Head', dataStore, ...options })
                    continue
                }

                if (time == timeEnd) {
                    changeMode?.({ boxMode: 'Tail', dataStore, ...options })
                    continue
                }

                changeMode?.({ boxMode: 'Body', dataStore, ...options })
            }
        }
        else {
            let timeStartHour = moment.duration(timeStart, 'seconds').hours();
            let timeEndHour = moment.duration(timeEnd, 'seconds').hours();

            for (let time = timeStartHour; time <= timeEndHour; time++) {
                let changeMode = timeBoxesRef.current[time][days].current.changeMode

                if (time == timeStartHour) {
                    changeMode?.({ boxMode: 'Head', dataStore, ...options }, timeStart, timeEnd)
                    continue
                }
                if (time == timeEndHour) {
                    changeMode?.({ boxMode: 'Tail', dataStore, ...options }, timeStart, timeEnd)
                    continue
                }
                changeMode?.({ boxMode: 'Body', dataStore, ...options })
            }
        }

    }, [])

    const TextLeft = modeArrayInit.map((time: number, key: number) => {
        return (time == 24) ? <React.Fragment key={key} /> : <SvgText
            key={key}
            x={columnFirstWidth - utils.common.getPercent(width, 5) + (isPotrait ? utils.common.getPercent(width, 4) : 0)}
            y={(columnHeight) * (key + 1) - (isPeriod ? utils.common.getPercent(height, 4) : 0)}
            fontSize={utils.common.getPercent(columnHeight, isPotrait ? 28 : 20)}
            fill='#777777'>
            {time}
        </SvgText>
    })
    const TimeLine = (props: { x1: number, x2: number, y1: number, y2: number }) => {
        return (
            <React.Fragment>
                <Line x1={isPotrait ? (props.x1 + utils.common.getPercent(width, 2)) : props.x1} y1={lineTime} x2={props.x2} y2={lineTime} stroke='#377CFB' strokeWidth={1.5}> </Line>
                <Circle cx={isPotrait ? (props.x1 + utils.common.getPercent(width, 2)) : (props.x1 + utils.common.getPercent(width, 1))} cy={lineTime} r={4} fill='#377CFB'></Circle>
            </React.Fragment>
        )
    }

    return (
        <Svg viewBox={`0 0 ${width} ${columnHeight * (modeLength + (isPotrait ? 4 : 3)) - 25}`} style={{
            backgroundColor: 'white', minHeight: columnHeight * (modeLength + (isPotrait ? 4 : 3)) - 10, minWidth: columnWidth * 6 + columnFirstWidth
        }}>
            {Table.reverse()}
            < Rect fill='white' width={(columnFirstWidth + 2)} height={columnHeight * (modeLength)} x={0} y={0} ></Rect >
            {TextLeft}
            {!isPeriod ? <TimeLine x1={columnFirstWidth} y1={height / 2} x2={width} y2={20} /> : <></>}
        </Svg >
    );
})
