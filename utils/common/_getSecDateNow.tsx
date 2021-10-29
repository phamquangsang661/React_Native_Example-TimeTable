import moment from 'moment'

export default (): number => {
    return (moment().hour() * 60 * 60) + (moment().minute() * 60) + (moment().second())
}