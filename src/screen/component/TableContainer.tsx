/* eslint-disable */
import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react'
import { Text, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Circle } from 'react-native-svg'
import _ from 'lodash';
import constantSetting from '../../constant/constantSetting';
import TimeInstance from './TimeInstance';
import utils from '../../utils/index';



const calp = (value: number, percent: number): number => {
    return value * percent / 100
}

const makeAddress = (length: number): string => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export default forwardRef(function (props: any, ref: any) {
    //* Start State
    const { tableMode, daysMode, numberOfPeriod, data } = props

    //* Ref
    const isFirst = useRef(true)

    //* Event state
    const { onPressCreateNewEvent, onPressEvent } = props
    const { height, width } = useWindowDimensions();

    //*Check mode
    let isPeriod = tableMode == 'PERIOD' ? true : false
    //* Check is Potrait

    let isPortrait = width > height ? true : false

    //* Get const day of week
    //* In test
    const DAY_OF_WEEK = daysMode == 1 ? constantSetting.DAYS_IN_WEEK_1 : constantSetting.DAYS_IN_WEEK_2

    //* Cal number of col
    const columnCount = DAY_OF_WEEK.length
    //* Cal number of row
    const rowCount = isPeriod ? (numberOfPeriod == null ? 12 : numberOfPeriod) : 24

    //* Cal first column
    const columnFirstWidth = isPortrait ? calp(width, 2) : calp(width, 8)
    //* Cal column width
    const columnWidth = (width - columnFirstWidth) / columnCount
    //* Cal column Height
    const columnHeight = calp(height, 13)

    //*Const
    const BACKGROUND_COLOR = 'white'
    const lineTime = ((columnHeight * 24) / (24 * 60 * 60)) * (utils.common.getSecDateNow())
    const arrayVeLine = _.range(1, columnCount) //* array temp of vertical
    const arrayHoLine = _.range(1, rowCount + 2) //* array temp of horizontal
    const MATRIX_COORDINATES = _.range(1, columnCount + 1).map((value, key) => {
        return _.range(1, rowCount + (isPeriod ? 1 : 2)).map((_value, _key) => {
            return {
                x: columnWidth * (key) + columnFirstWidth,
                y: columnHeight * (_key)
            }
        })
    })

    //* Current Box State
    const [currentBoxLocationState, setCurrentBoxLocationState] = useState({
        x: -1,
        y: -1
    })
    const timeInstanceRef = React.useRef([<React.Fragment key={0} />])
    const [timeInstances, setTimeInstances] = useState([<React.Fragment key={0} />])

    //* Make it ref
    useImperativeHandle(ref, () => ({
        addSchedule: createSchedule,
        resetTable: () => {
            //* Reset ref
            timeInstanceRef.current = [<React.Fragment key={0} />]
            setTimeInstances([<React.Fragment key={0} />])
        }
    }));

    //* Function callback
    const initData = () => {
        //* Check data is null
        if (data == null) {
            return
        }
        //* Check data size
        if (data.length == 0) {
            return
        }
        for (let key = 0; key < data.length; key++) {
            //* Check mode
            let sd = data[key]
            if (!data[key].mode || data[key].mode == '') {
                continue
            }
            //* Add period mode
            if (isPeriod && data[key].mode == 'PERIOD') {
                createSchedule(sd.days, sd.timeStart, sd.timeEnd, sd.dataStore, sd.option)
                continue
            }
            //* Add Time mode
            if (!isPeriod && data[key].mode == 'TIME') {
                createSchedule(sd.days, sd.timeStart, sd.timeEnd, sd.dataStore, sd.option)
                continue
            }
        }
    }
    const deleteEventBox = (address: string) => {
        const inData = timeInstanceRef.current
        const result = inData.filter((obj: JSX.element) => obj.props.address != address)
        timeInstanceRef.current = result
        setTimeInstances(timeInstanceRef.current)
    }
    const createSchedule = (days: number, timeStart: number, timeEnd: number, dataStore: any, option: any) => {
        if (isPeriod) {
            //* Days start from 0
            timeStart -= 1 //* Period Start
            timeEnd -= 1  //* Period End
            const address = makeAddress(10)
            const timeTempInstances = timeInstanceRef.current
            timeTempInstances.push((
                <TimeInstance
                    matrix={MATRIX_COORDINATES}
                    columnHeight={columnHeight}
                    columnWidth={columnWidth}
                    columnFirstWidth={columnFirstWidth}
                    boxState={'isPeriod'}
                    day={days}
                    yStart={timeStart}
                    yEnd={timeEnd}
                    dataStore={dataStore}
                    optionBox={option ? option : {}}
                    onPressEvent={onPressEvent}
                    address={address}
                    deleteEvent={() => deleteEventBox(address)}
                />
            ))
            timeInstanceRef.current = timeTempInstances
            setTimeInstances(timeInstanceRef.current)
        } else {
            const timeTempInstances = timeInstanceRef.current
            const address = makeAddress(10)
            timeTempInstances.push((
                <TimeInstance
                    matrix={MATRIX_COORDINATES}
                    columnHeight={columnHeight}
                    columnWidth={columnWidth}
                    columnFirstWidth={columnFirstWidth}
                    boxState={'isTime'}
                    day={days}
                    startTime={timeStart}
                    endTime={timeEnd}
                    dataStore={dataStore}
                    optionBox={option ? option : {}}
                    onPressEvent={onPressEvent}
                    address={address}
                    deleteEvent={() => deleteEventBox(address)}
                />
            ))
            timeInstanceRef.current = timeTempInstances
            setTimeInstances(timeInstanceRef.current)
        }
    }

    const getLocationOnPress = (X: number, Y: number) => {
        const minWidth = calp(height, 1) / 2
        for (let j = 0; j < MATRIX_COORDINATES.length; j++) {
            const column = MATRIX_COORDINATES[j]
            for (let i = 0; i < column.length; i++) {
                const location = column[i]
                if (location.x <= X && X <= location.x + columnWidth - 2 * minWidth) {
                    if (location.y <= Y && Y <= location.y + columnHeight - 2 * minWidth) {
                        return {
                            r: j,
                            c: i
                        }
                    }
                }
            }
        }
        return {
            r: -1,
            c: -1
        }
    }

    //* Call function
    if (isFirst.current) {
        isFirst.current = false
        initData()
    }


    //* Component
    //* Time line
    const TimeLine = (props: { x1: number, x2: number, y1: number, y2: number }) => {
        return (
            <React.Fragment>
                <Line x1={isPortrait ? (props.x1 + calp(width, 2)) : props.x1} y1={lineTime} x2={props.x2} y2={lineTime} stroke='#377CFB' strokeWidth={1.5}> </Line>
                <Circle cx={isPortrait ? (props.x1 + calp(width, 2)) : (props.x1 + calp(width, 1))} cy={lineTime} r={4} fill='#377CFB'></Circle>
            </React.Fragment>
        )
    }

    const NewBox = (props) => {
        //* Get from props
        const { onPressNew } = props
        //* If is Select
        if (currentBoxLocationState.x != -1) {
            let newPos = MATRIX_COORDINATES[currentBoxLocationState.x][currentBoxLocationState.y]
            return (
                <TimeInstance
                    matrix={MATRIX_COORDINATES}
                    columnHeight={columnHeight}
                    columnWidth={columnWidth}
                    columnFirstWidth={columnFirstWidth}
                    boxState={'isNew'}
                    newX={newPos.x}
                    newY={newPos.y}
                    newCor={{
                        r: currentBoxLocationState.x,
                        c: currentBoxLocationState.y
                    }}
                    onPressNew={onPressNew}
                />
            )
        }
        return <></>
    }


    const DrawLine = () => {
        //* Setting
        const colorLine = '#DFDFDF'
        const fontColor = '#7A7A7A'
        const strokeSize = 0.5
        //* vertical

        const verticalLine = arrayVeLine.map((value, key) => {
            return (
                <React.Fragment key={key} >
                    <Line
                        x1={columnWidth * (key + 1) + columnFirstWidth}
                        y1={0}
                        x2={columnWidth * (key + 1) + columnFirstWidth}
                        y2={columnHeight * (rowCount + (isPeriod ? 0 : 1))}
                        strokeWidth={strokeSize}
                        stroke={colorLine}
                    />
                </React.Fragment>
            )
        })
        //* horizontal

        const horizontalLine = arrayHoLine.map((value, key) => {
            if (key == 0)
                return (
                    <React.Fragment key={key} >
                        {/* Sub line (Only Time mode) */}
                        {!isPeriod &&
                            <Line
                                x1={columnFirstWidth}
                                y1={columnHeight / 2}
                                x2={columnFirstWidth + columnCount * columnWidth}
                                y2={columnHeight * key + columnHeight / 2}
                                strokeWidth={strokeSize / 2}
                                stroke={colorLine}
                            />
                        }
                    </React.Fragment>
                )
            const textY = isPeriod ? (columnHeight * key - columnHeight / 2 + 3) : (columnHeight * key + 3)
            return (
                <React.Fragment key={key}>

                    {/* Period/Time */}
                    <SvgText
                        x={columnFirstWidth / 2}
                        y={textY}
                        fontSize={calp(columnHeight, 15)}
                        fill={fontColor}
                    >{key}</SvgText>
                    {/* Sub line (Only Time mode) */}
                    {!isPeriod &&
                        <Line
                            x1={columnFirstWidth}
                            y1={(columnHeight / 2) + columnHeight * key}
                            x2={columnFirstWidth + columnCount * columnWidth}
                            y2={columnHeight * key + columnHeight / 2}
                            strokeWidth={strokeSize / 2}
                            stroke={colorLine}
                        />
                    }
                    {/* Main line */}
                    <Line
                        x1={columnFirstWidth}
                        y1={columnHeight * key}
                        x2={columnFirstWidth + columnCount * columnWidth}
                        y2={columnHeight * key}
                        strokeWidth={(isPeriod && (key == rowCount)) ? 0 : strokeSize}
                        stroke={colorLine}
                    />

                </React.Fragment>
            )
        })
        return (
            <React.Fragment>
                {verticalLine}
                {horizontalLine}
            </React.Fragment>
        )
    }
    const RenderTime = () => {
        return (
            <React.Fragment key={0}>
                {timeInstances.map((ins, key) => {
                    return (
                        <React.Fragment key={key}>
                            {ins}
                        </React.Fragment>
                    )
                })}
            </React.Fragment>)
    }
    return (
        <React.Fragment>
            <Svg
                viewBox={`0 0 ${width} ${columnHeight * (rowCount + 4)}`}
                height={columnHeight * (rowCount + 4)}

                style={{
                    backgroundColor: BACKGROUND_COLOR,
                    minHeight: columnHeight * rowCount,
                    minWidth: columnWidth * columnCount
                }}>
                {/* Background */}
                <Rect
                    fill='white'
                    width={"100%"}
                    height={"100%"}
                    onPress={(event: any) => {
                        const { locationX, locationY } = event.nativeEvent
                        const { r, c } = getLocationOnPress(locationX, locationY)
                        if (r != -1)
                            setCurrentBoxLocationState({
                                x: r,
                                y: c
                            })
                    }}
                />

                {/* Draw all line */}
                <DrawLine></DrawLine>

                {/* Draw box */}
                <RenderTime />

                {/* Time line */}
                {!isPeriod ? <TimeLine x1={columnFirstWidth} y1={height / 2} x2={width} y2={20} /> : <></>}

                {/* Draw New box */}
                <NewBox
                    onPressNew={onPressCreateNewEvent}
                />
                {/* < Rect fill='white' width={(columnFirstWidth + 2)} height={columnHeight * rowCount} x={0} y={0} ></Rect > */}

            </Svg >

        </React.Fragment>
    )
})