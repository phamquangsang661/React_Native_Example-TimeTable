import  _ from 'lodash'

export default (array:any[],index:number):any[]=> {
    _.pullAt(array,[index])
    return array
}