import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
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
    onPressEvent?: (dataStore: any) => void,
    tableMode: 'PERIOD' | 'TIME'
}


export default forwardRef(function createTimeBox(props: inProps, ref) {
    const { columnWidth, columnHeight, columnFirstWidth, days, time, onPressCreateNewEvent, memRef, onPressEvent, tableMode } = props
    const [boxState, setBoxState] = useState('isNone')
    // const settingRef: React.MutableRefObject<{ boxColor?: string, textColor?: string, dataStore?: any }[]> = useRef([])
    const [boxStore, setBoxStore] = useState([<React.Fragment key={0} />])

    let isPeriod = tableMode == 'PERIOD' ? true : false
    const reset = () => {
        if (boxStore.length <= 1)
            setBoxState('isNone')
        else
            setBoxState('isEvent')
    }
    const createSmallBox = (key: number, y: number, height: number, setting: { boxColor?: string, textColor?: string, dataStore?: any } = { dataStore: {} }, pos: 'HEAD' | 'TAIL' | 'BODY') => {
        return (
            <React.Fragment key={key}>
                <Rect
                    key={0}
                    fill={setting?.boxColor ?? 'green'}
                    x={columnFirstWidth + columnWidth * days + utils.common.getPercent(columnWidth, 5)}
                    y={y}
                    height={height + 1}
                    width={columnWidth - utils.common.getPercent(columnWidth, 10)}
                    onPress={() => onPressEventCell(setting.dataStore, key - 1)}
                >
                </Rect>
                {pos == 'HEAD' && <LineDraw x={columnFirstWidth + columnWidth * days} y={y} up={true} left={true} right={true}></LineDraw>}
                {pos == 'TAIL' && <LineDraw x={columnFirstWidth + columnWidth * days} y={y} down={true} left={true} right={true}></LineDraw>}
                {pos == 'BODY' && <LineDraw x={columnFirstWidth + columnWidth * days} y={y} left={true} right={true}></LineDraw>}
                {pos == 'HEAD' && <SvgText
                    key={key}
                    x={columnFirstWidth + columnWidth * days + utils.common.getPercent(columnWidth, 15)}
                    y={y + utils.common.getPercent(columnHeight, 25)}
                    fill={setting?.textColor ?? 'black'}
                    fontSize={utils.common.getPercent(columnHeight, 20)}
                >
                    {setting.dataStore?.text ?? 'HAHA'}
                </SvgText>}
            </React.Fragment>

        )
    }

    useImperativeHandle(ref, () => ({
        changeMode: ({ dataStore, boxMode, boxColor, textColor }: boxInterface.boxParam, startTime?: number, endTime?: number) => {
            memRef.current = null
            let tmpBoxStore = [...boxStore]
            switch (boxMode) {
                case 'Head': {
                    // settingRef.current.push({
                    //     boxColor,
                    //     textColor,
                    //     dataStore
                    // })
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

                    tmpBoxStore.push(createSmallBox(tmpBoxStore.length + 1, y, height, { boxColor, textColor, dataStore }, 'HEAD'))
                    setBoxStore(tmpBoxStore)
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

                    tmpBoxStore.push(createSmallBox(tmpBoxStore.length + 1, y, height, { boxColor, textColor, dataStore }, 'TAIL'))
                    setBoxStore(tmpBoxStore)
                    setBoxState('isEvent')
                    break;
                }
                case 'Body': {
                    let y = (columnHeight) * time
                    let height = columnHeight
                    tmpBoxStore.push(createSmallBox(tmpBoxStore.length + 1, y, height, { boxColor, textColor, dataStore }, 'BODY'))
                    setBoxStore(tmpBoxStore)
                    setBoxState('isEvent')
                    break;
                }
            }
        }
    }));

    const Line30 = (props: { x1: number, y1: number, x2: number, y2: number }) => (//#F7F7F7
        !isPeriod ? (
            <Line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke='#F4F4F4' strokeWidth={1}> </Line>
        ) : <></>
    )

    // const removeBox=(position:number)=>{
    //     let tmpBoxStore=[...boxStore]
    //     tmpBoxStore.
    // }

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
            //stroke='#DFDFDF'
            onPress={() => onPressCell(time, days)}
        >
        </Rect>
        <LineDraw x={columnFirstWidth + columnWidth * days} y={(columnHeight) * time} up={true} left={true} right={true} down={true} />
        <Line30 x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
    </React.Fragment>)

    const BoxEvent = () => (
        <React.Fragment key={(time + 1) * (days + 1)}>
            <Rect
                key={boxStore.length + 2}
                fill='white'
                x={columnFirstWidth + columnWidth * days}
                y={(columnHeight) * time}
                height={columnHeight}
                width={columnWidth}
                onPress={() => onPressCell(time, days)}
            >
            </Rect>
            <Line30 key={boxStore.length + 3} x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
            {boxStore}
        </React.Fragment>
    )

    const BoxNew = () => (
        <React.Fragment key={(time + 1) * (days + 1)}>
            <Rect
                key={boxStore.length + 2}
                fill='white'
                x={columnFirstWidth + columnWidth * days}
                y={(columnHeight) * time}
                height={columnHeight}
                width={columnWidth}

            >
            </Rect>
            <Line30 key={boxStore.length + 3} x1={columnFirstWidth + columnWidth * days} y1={(columnHeight) * time + columnHeight / 2} x2={columnFirstWidth + columnWidth * days + columnWidth} y2={(columnHeight) * time + columnHeight / 2} />
            {boxStore.length == 1 && <LineDraw x={columnFirstWidth + columnWidth * days} y={(columnHeight) * time} up={true} left={true} right={true} down={true} />}
            {boxStore}
            <Rect
                key={boxStore.length + 4}
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

    const onPressEventCell = useCallback((dataStore, position) => {
        memRef.current && memRef.current()
        memRef.current = null
        onPressEvent?.(dataStore)
    }, [])
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
                if (boxStore.length == 1)
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

