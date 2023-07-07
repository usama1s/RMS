import moment from "moment/moment"
export function currentDate(){
    return moment().format("Do MMMM YYYY")
}