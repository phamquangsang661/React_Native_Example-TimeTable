import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Rect, Text as SvgText, Line } from 'react-native-svg'
import constantSetting from '../../constant/constantSetting';
import utils from '../../utils';

interface inProps {
    epLeft: number,
    height: number,
    width: number,
}

export default function HeaderDays(props: inProps) {
    //const { height, width } = useWindowDimensions();

    const { epLeft, height, width } = props
    let isPotrait = utils.common.isPotrait(height, width);

    const Render: JSX.Element[] = constantSetting.DAYS_IN_WEEK.map((day, key) => {
        return (
            <SvgText
                key={key}
                x={(utils.common.getPercent(width, 95) / (isPotrait ? 5 : 2)) * key + utils.common.getPercent(width, isPotrait ? 6 : 20) - (isPotrait ? 0 : utils.common.getPercent(width, 85))}
                y={utils.common.getPercent(height, 10)}
                fontSize={utils.common.getPercent(height, isPotrait ? 5 : 5)}
                fill={constantSetting.DAYS_IN_WEEK_STYLES.textColor}>
                {day}
            </SvgText>
        )
    })

    return (
        <React.Fragment>
            <Rect width={width * (isPotrait ? 3 : 4)} height={utils.common.getPercent(height, 15)} x={-width + (isPotrait ? 0 : -epLeft)} y='0' fill='white' />
            <Line x1={-width + (isPotrait ? 0 : -epLeft)} y1={utils.common.getPercent(height, isPotrait ? 15 : 15)} x2={width * (isPotrait ? 1 : 2) + epLeft * 2} y2={utils.common.getPercent(height, isPotrait ? 15 : 15)}
                stroke={constantSetting.DAYS_IN_WEEK_STYLES.line.lineColor} strokeWidth={isPotrait ? 4 : 6} />
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
