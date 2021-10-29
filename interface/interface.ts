export namespace boxInterface {
    export interface boxParam {
        dataStore?: any,
        boxMode: 'Head' | 'Tail' | 'Body',
        boxColor?: string,
        textColor?: string,
    }
}
export namespace tableInterface {
    export interface tableRef {
        addSchedule?: (days: number, timeStart: number, timeEnd: number, dataStore: any, options?: {
            textColor?: string,
            boxColor?: string
        }) => void
    }
}
export namespace timeTableInterface {
    export interface timeTableRef {
        addSchedule?: (days: number, timeStart: number, timeEnd: number, dataStore: any, options?: {
            textColor?: string,
            boxColor?: string
        }) => void
    }
}