import { Dimensions } from 'react-native';
import _ from 'lodash';

export default {
    PHONE_WIDTH: Dimensions.get('window').width,
    PHONE_HEIGHT: Dimensions.get('window').height,
    DAYS_IN_WEEK: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    DAYS_IN_WEEK_1: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    DAYS_IN_WEEK_2: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'],
    DAYS_IN_WEEK_STYLES: {
        textColor: '#777777',
        line: {
            lineColor: '#DFDFDF'
        }
    },
    HEADER_LEFT: {
        PERIOD: _.range(1, 13),
        TIME: _.range(1, 25)
    }
}