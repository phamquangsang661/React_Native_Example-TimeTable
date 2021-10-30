import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg'
import moment from 'moment';

import utils from '../../utils';
import { boxInterface } from '../../interface/interface';


interface inProps {
    columnWidth: number,
    columnFirstWidth: number,
    columnHeight: number,
    days: number,
    time: number,
    memRef: any,
    onPressCreateNewEvent?: () => void,
    onPressEvent?: (dataStore: any, deleteEvent: any) => void,
    tableMode: 'PERIOD' | 'TIME'
}


export default forwardRef(function createTimeBox(props: inProps, ref) {
    const { columnWidth, columnHeight, columnFirstWidth, days, time, onPressCreateNewEvent, memRef, onPressEvent, tableMode } = props
    const [boxState, setBoxState] = useState('isNone')
    const boxStoreRealLength = useRef(1)
    const boxStoreRef = useRef([<React.Fragment key={0} />])
    const [isChanging, setIsChanging] = useState(true)

    let isPeriod = tableMode == 'PERIOD' ? true : false

    if (boxState == 'isNone' && boxStoreRealLength.current > 1) {
        setBoxState('isEvent')
    }

    const reset = () => {
        if (boxStoreRealLength.current <= 1)
            setBoxState('isNone')
        else {
            setBoxState('isEvent')
        }
    }

    const removeEventFromBox = useCallback((position: number) => {
        boxStoreRef.current[position] = <React.Fragment key={position}></React.Fragment>
        boxStoreRealLength.current -= 1
        if (boxStoreRealLength.current == 1) {
            boxStoreRef.current = [<React.Fragment key={0} />]
            setBoxState('isNone')
        }
        else {
            setBoxState('isNone')
        }

        setIsChanging(!isChanging)
    }, [boxState])
    const createSmallBox = (key: number, y: number, height: number, setting: { boxColor?: string, textColor?: string, textSize?: number, dataStore?: any, deleteEvent?: any } = { dataStore: {} }, pos: 'HEAD' | 'TAIL' | 'BODY') => {
        return (
            <React.Fragment key={key}>
                <Rect
                    key={0}
                    fill={setting?.boxColor ?? 'green'}
                    x={columnFirstWidth + columnWidth * days + utils.common.getPercent(columnWidth, 5)}
                    y={y}
                    height={height + 0.5}
                    width={columnWidth - utils.common.getPercent(columnWidth, 10)}
                    onPress={() => onPressEventCell(setting.dataStore, setting.deleteEvent)}
                >
                </Rect>
                {pos == 'HEAD' && <LineDraw x={columnFirstWidth + columnWidth * days} y={columnHeight * time} up={true} ></LineDraw>}
                {/* {pos == 'TAIL' && <LineDraw x={columnFirstWidth + columnWidth * days} y={y} down={boxStoreRealLength.current <= 1} left={true} right={true}></LineDraw>} */}
                {pos == 'BODY' && <LineDraw x={columnFirstWidth + columnWidth * days} y={y} up={boxStoreRealLength.current > 1} down={boxStoreRealLength.current > 1}></LineDraw>}
                {pos == 'HEAD' && <SvgText
                    key={key}
                    x={columnFirstWidth + columnWidth * days + utils.common.getPercent(columnWidth, 15)}
                    y={y + utils.common.getPercent(columnHeight, 25)}
                    fill={setting?.textColor ?? 'black'}
                    fontSize={setting.textSize ? setting.textSize : utils.common.getPercent(columnHeight, 20)}
                >
                    {setting.dataStore?.text ?? 'HAHA'}
                </SvgText>}
            </React.Fragment>
        )
    }

    useImperativeHandle(ref, () => ({

        changeMode: ({ dataStore, boxMode, boxColor, textColor, textSize, deleteEvent }: boxInterface.boxParam, startTime?: number, endTime?: number) => {
            memRef.current = null
            switch (boxMode) {
                case 'Head': {
                    let y = (columnHeight) * time + utils.common.getPercent(columnHeight, 5)
                    let height = columnHeight

                    if (startTime) {
                        let startTimeHour = moment.duration(startTime ? startTime : 0, 'seconds').hours()
                        let endTimeHour = moment.duration(endTime ? endTime : 0, 'seconds').hours()
                        y = ((columnHeight * 24) / (24 * 60 * 60)) * (startTime)
                        if (startTimeHour == endTimeHour) {
                            height = ((columnHeight * 24) / (24 * 60 * 60)) * ((endTime ? endTime : 0) - startTime)
                        }
                    }

                    boxStoreRef.current.push(createSmallBox(boxStoreRealLength.current, y, height, { boxColor, textColor, textSize, dataStore, deleteEvent }, 'HEAD'))
                    setBoxState('isEvent')
                    break;
                }
                case 'Tail': {
                    let y = (columnHeight) * time
                    let height = columnHeight - utils.common.getPercent(columnHeight, 5)
                    if (endTime) {
                        let startOfEnd = moment.duration(endTime ? endTime : 0, 'seconds').hours() * 60 * 60
                        height = ((columnHeight * 24) / (24 * 60 * 60)) * ((endTime ? endTime : 0) - startOfEnd)
                    }

                    boxStoreRef.current.push(createSmallBox(boxStoreRealLength.current, y, height, { boxColor, textColor, textSize, dataStore, deleteEvent }, 'TAIL'))
                    setBoxState('isEvent')
                    break;
                }
                case 'Body': {
                    let y = (columnHeight) * time
                    let height = columnHeight

                    boxStoreRef.current.push(createSmallBox(boxStoreRealLength.current, y, height, { boxColor, textColor, textSize, dataStore, deleteEvent }, 'BODY'))
                    setBoxState('isEvent')
                    break;
                }
            }
            boxStoreRealLength.current += 1
            setIsChanging(!isChanging)

            return {
                removeFunc: removeEventFromBox,
                position: boxStoreRealLength.current - 1
            }
        }
    }));

    const Line30 = (props: { x1: number, y1: number, x2: number, y2: number }) => (//#F7F7F7
        !isPeriod ? (
            <Line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke='#F4F4F4' strokeWidth={1}> </Line>
        ) : <></>
    )

    const LineDraw = (props: { x: number, y: number, up?: boolean, left?: boolean, right?: boolean, down?: boolean }) => {
        //#DFDFDF
        const { x, y, up, down, left, right } = props
        const colorLine = '#DFDFDF'
        return (
            <React.Fragment>
                {up == true && <Line x1={x} y1={y} x2={x + columnWidth} y2={y} stroke={colorLine} strokeWidth={1}></Line>}
                {left == true && <Line x1={x} y1={y} x2={x} y2={y + columnHeight} stroke={colorLine} strokeWidth={1}></Line>}
                {right == true && <Line x1={x + columnWidth} y1={y} x2={x + columnWidth} y2={y + columnHeight} stroke={colorLine} strokeWidth={1}></Line>}
                {down == true && <Line x1={x} y1={y + columnHeight} x2={x + columnWidth} y2={y + columnHeight} stroke={colorLine} strokeWidth={1}></Line>}
            </React.Fragment>
        )
    }

    const BoxNone = () => (<React.Fragment >
        <Rect
            key={(time + 1) * (days + 2)}
            fill='white'
            x={columnFirstWidth + columnWidth * days}
            y={(columnHeight) * time}
            height={columnHeight}
            width={columnWidth}
            onPress={() => onPressCell(time, days)}
        >
        </Rect>
        <LineDraw x={columnFirstWidth + columnWidth * days} y={(columnHeight) * time} up={time != 0} left={true} right={true} />
        <Line30 x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
    </React.Fragment>)

    const BoxEvent = () => (
        <React.Fragment key={(time + 1) * (days + 1)}>
            <Rect
                key={boxStoreRealLength.current + 2}
                fill='white'
                x={columnFirstWidth + columnWidth * days}
                y={(columnHeight) * time}
                height={columnHeight}
                width={columnWidth}
                onPress={() => onPressCell(time, days)}
            >
            </Rect>
            <Line30 key={boxStoreRealLength.current + 3} x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
            <LineDraw x={columnFirstWidth + columnWidth * days} y={(columnHeight) * time} left={true} right={true} ></LineDraw>
            {boxStoreRef.current}
        </React.Fragment>
    )


    const BoxNew = () => (
        <React.Fragment key={(time + 1) * (days + 1)}>
            <Rect
                key={boxStoreRealLength.current + 2}
                fill='white'
                x={columnFirstWidth + columnWidth * days}
                y={(columnHeight) * time}
                height={columnHeight}
                width={columnWidth}
            >
            </Rect>
            <Line30 key={boxStoreRealLength.current + 3} x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
            {boxStoreRealLength.current == 1 && <LineDraw x={columnFirstWidth + columnWidth * days} y={(columnHeight) * time} up={true} left={true} right={true} down={true} />}
            {boxStoreRealLength.current > 1 && boxStoreRef.current}
            <Rect
                key={boxStoreRealLength.current + 4}
                fill='#99BFFD'
                x={columnFirstWidth + columnWidth * days + utils.common.getPercent(columnWidth, 5)}
                y={(columnHeight) * time + utils.common.getPercent(columnHeight, 5)}
                rx="5"
                ry="5"
                height={columnHeight - utils.common.getPercent(columnHeight, 10)}
                width={columnWidth - utils.common.getPercent(columnWidth, 10)}
                onPress={() => onPressCell(time, days)}
            >
            </Rect>
        </React.Fragment>
    )

    const onPressEventCell = useCallback((dataStore: any, deleteEvent: any) => {
        memRef.current && memRef.current()
        memRef.current = null
        onPressEvent?.(dataStore, deleteEvent)
    }, [boxStoreRef.current])

    const onPressCell = useCallback((time, days) => {

        switch (boxState) {
            case 'isEvent': {
                memRef.current && memRef.current()
                memRef.current = reset

                setBoxState('isNewPress');
                break;
            }
            case 'isNone': {
                memRef.current && memRef.current()
                memRef.current = reset
                setBoxState('isNewPress');
                break;
            }
            case 'isNewPress': {
                if (boxStoreRealLength.current == 1)
                    setBoxState('isNone');
                else
                    setBoxState('isEvent')
                onPressCreateNewEvent && onPressCreateNewEvent()
                break;
            }
        }

    }, [boxState])

    const RenderBox = () => {

        if (boxState == 'isEvent') {
            return (
                <BoxEvent />
            )
        }

        if (boxState == 'isNewPress') {
            return (
                <BoxNew />
            )
        }
        return (<BoxNone />)
    }

    return (
        <RenderBox />
    );
})

