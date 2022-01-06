import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import { Rect, Text as SvgText, Line, TSpan } from 'react-native-svg'
import { useWindowDimensions } from 'react-native';

const calp = (value: number, percent: number): number => {
    return value * percent / 100
}

export default forwardRef((props: any, ref: any) => {

    const { height, width } = useWindowDimensions();
    //* Get from props
    const {
        //* Common
        matrix,
        columnFirstWidth,
        columnHeight,
        columnWidth,
        boxState,
        dataStore,
        optionBox,
        onPressEvent,
        deleteEvent,
        address,
        //* For New
        newX,
        newY,
        newCor,
        onPressNew,
        //* For Period,
        yStart,
        yEnd,
        //* For Time
        startTime,
        endTime,
        day,

    } = props

    //* State
    //*First time will show
    const [stateNote, setStateNote] = useState(true)
    //* Setting

    const changeStateNote = () => {
        setStateNote(!stateNote)
    }

    useImperativeHandle(ref, () => ({
        changeStateNote: changeStateNote
    }));

    //* State of box

    //props: { x1: number, y1: number, x2: number, y2: number }
    const BoxModePeriod = (props) => {
        const { day, yStart, yEnd } = props
        //* Bias
        const minWidth = calp(height, 1) / 2
        //* Border Radius
        const borderRadius = calp(height, 0.5)
        //* 
        const boxColor = optionBox.boxColor ? optionBox.boxColor : '#99BFFD'
        //* For Text
        const fontSize = calp(height, 2)
        const fontBias = calp(height, 1)
        const fontColor = optionBox.fontColor ? optionBox.fontColor : 'white'
        const countText = ((dataStore?.text ?? "Không xác định").length + 1) / 5

        return (
            <React.Fragment>
                <Rect
                    fill={boxColor}
                    x={matrix[day][yStart].x + minWidth}
                    y={matrix[day][yStart].y + minWidth}
                    rx={borderRadius}
                    height={(yEnd - yStart) * columnHeight - 2 * minWidth}
                    width={columnWidth - 2 * minWidth}
                    onPress={() => {
                        onPressEvent(day, yStart, yEnd, dataStore, deleteEvent)
                    }}
                ></Rect>
                <SvgText
                    x={matrix[day][0].x + minWidth + fontBias}
                    y={matrix[day][yStart].y + fontSize + fontBias}
                    fill={fontColor}
                >
                    <TSpan fontSize={fontSize} inlineSize={columnWidth - 2 * minWidth - fontBias} fontWeight="bold">
                        {dataStore?.text ?? "Không xác định"}
                    </TSpan >
                    <TSpan y={matrix[day][yStart].y + calp(height, 2.5) * (countText + 1) + 2 * minWidth} fontSize={fontSize} inlineSize={columnWidth - 2 * minWidth - fontBias}  >
                        {dataStore?.noteText ?? "Không có ghi chú"}
                    </TSpan >
                </SvgText>
            </React.Fragment>
        )
    }

    const BoxModeTime = (props) => {
        const { day, startTime, endTime } = props
        const y1 = ((columnHeight * 24) / (24 * 60 * 60)) * (startTime)
        const y2 = ((columnHeight * 24) / (24 * 60 * 60)) * (endTime)
        //* Bias
        const minWidth = calp(height, 1) / 2
        //* Border Radius
        const borderRadius = calp(height, 0.5)
        //* Const
        const boxColor = optionBox.boxColor ? optionBox.boxColor : '#99BFFD'
        //* For Text
        const fontSize = calp(height, 2)
        const fontBias = calp(height, 0.5)
        const fontColor = optionBox.fontColor ? optionBox.fontColor : 'white'

        const countText = ((dataStore?.text ?? 'Không xác định').length + 1) / 5
        return (
            <React.Fragment>
                <Rect
                    //key={boxStoreRealLength.current + 2}
                    fill={boxColor}
                    x={matrix[day][0].x + minWidth}
                    y={y1}
                    rx={borderRadius}
                    height={y2 - y1 + columnHeight}
                    width={columnWidth - 2 * minWidth}
                    onPress={() => {
                        onPressEvent(day, startTime, endTime, dataStore, deleteEvent)
                    }}
                //onPress={() => onPressNew()}
                ></Rect>
                <SvgText
                    x={matrix[day][0].x + minWidth + fontBias}
                    y={y1 + fontSize + fontBias}
                    fill={fontColor}
                >

                    <TSpan
                        fontSize={fontSize}
                        inlineSize={columnWidth - 2 * minWidth - fontBias}
                        fontWeight="bold"
                        fill={fontColor}>

                        {dataStore?.text ?? 'Không xác định'}
                    </TSpan >
                    <TSpan
                        y={y1 + fontBias + calp(height, 2.5) * (countText + 1)}
                        fontSize={fontSize}
                        inlineSize={columnWidth - 2 * minWidth - fontBias}
                        fill={fontColor}>

                        {dataStore?.noteText ?? "Không có ghi chú"}
                    </TSpan >
                </SvgText>
            </React.Fragment>
        )
    }

    const BoxNew = (props) => {
        const { x, y } = props
        //* Bias
        const minWidth = calp(height, 1) / 2
        const verticalLine = calp(columnHeight, 20)
        const horizontalLine = verticalLine * 1.7

        //* Border Radius
        const borderRadius = calp(height, 0.5)
        //* Const
        const boxColor = '#99BFFD'
        const lineColor = 'white'
        const strokeLine = calp(columnHeight, 3)

        return (
            <React.Fragment>
                {/* Main box */}
                <Rect
                    //key={boxStoreRealLength.current + 2}
                    fill={boxColor}
                    x={x + minWidth}
                    y={y + minWidth}
                    rx={borderRadius}
                    height={columnHeight - 2 * minWidth}
                    width={columnWidth - 2 * minWidth}
                    onPress={() => onPressNew(newCor.r, newCor.c)}
                ></Rect>
                {/* Vertical Line */}
                <Line
                    x1={x + minWidth + verticalLine}
                    y1={y + columnHeight / 2}
                    x2={x + (columnWidth - minWidth) - verticalLine}
                    y2={y + columnHeight / 2}
                    stroke={lineColor}
                    strokeWidth={strokeLine}
                />
                <Line
                    x1={x + columnWidth / 2}
                    y1={y + minWidth + horizontalLine}
                    x2={x + columnWidth / 2}
                    y2={y + (columnHeight - minWidth) - horizontalLine}
                    stroke={lineColor}
                    strokeWidth={strokeLine}
                />
            </React.Fragment>
        )
    }
    const DrawBox = () => {
        if (boxState == 'isNew') {
            return (
                <React.Fragment>
                    <BoxNew x={newX} y={newY} />
                </React.Fragment>
            )
        }
        if (boxState == 'isPeriod') {
            return (
                <React.Fragment>
                    <BoxModePeriod day={day} yStart={yStart} yEnd={yEnd}></BoxModePeriod>
                </React.Fragment>
            )
        }
        if (boxState == 'isTime') {
            return (
                <React.Fragment>
                    <BoxModeTime day={day} startTime={startTime} endTime={endTime}></BoxModeTime>
                </React.Fragment>
            )
        }
    }
    return (
        <DrawBox />
    )
})