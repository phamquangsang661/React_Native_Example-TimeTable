import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Rect, Text as SvgText, Line } from 'react-native-svg'
import constantSetting from '../../constant/constantSetting';
import utils from '../../utils';

interface inProps {
    epLeft: number,
    height: number,
    width: number,
    daysMode?: number,
    heightHeader: number
}

const calp = (value: number, percent: number): number => {
    return value * percent / 100
}

export default function HeaderDays(props: inProps) {
    //const { height, width } = useWindowDimensions();

    const { epLeft, height, width, daysMode, heightHeader } = props

    let isPortrait = width > height ? true : false
    const columnFirstWidth = isPortrait ? calp(width, 2) : calp(width, 8)
    //* Get const day of week
    //* In test
    const DAY_OF_WEEK = daysMode == 1 ? constantSetting.DAYS_IN_WEEK_1 : constantSetting.DAYS_IN_WEEK_2

    //* Cal number of col
    const columnCount = DAY_OF_WEEK.length
    const columnWidth = (width - columnFirstWidth) / columnCount

    const Render: JSX.Element[] = DAY_OF_WEEK.map((day, key) => {
        let columnLeftHeader = columnWidth / 3 + columnFirstWidth
        return (
            <SvgText
                key={key}
                x={columnLeftHeader + (columnWidth) * (key)}
                y={utils.common.getPercent(heightHeader, 15)}
                fontSize={calp(heightHeader, 10)}
                fill={constantSetting.DAYS_IN_WEEK_STYLES.textColor}>
                {day}
            </SvgText>
        )
    })

    return (
        <React.Fragment>
            <Rect width={width * (isPortrait ? 3 : 4)} height={utils.common.getPercent(height, 15)} x={-width + (isPortrait ? 0 : -epLeft)} y='0' fill='white' />
            <Line
                x1={0}
                y1={utils.common.getPercent(heightHeader, 20)}
                x2={width}
                y2={utils.common.getPercent(heightHeader, 20)}
                stroke={constantSetting.DAYS_IN_WEEK_STYLES.line.lineColor}
                strokeWidth={isPortrait ? 1 : 1} />
            {Render}
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        flexDirection: 'row'
    },
    contentScrollView: {
        flexGrow: 1
    }
})
