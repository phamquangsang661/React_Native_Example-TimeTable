import moment from 'moment'

export default (time: string, format: string = 'HH:mm'): number => {
    return (moment(time, format).hour() * 60 * 60) + (moment(time, format).minute() * 60) + (moment(time, format).second())
}