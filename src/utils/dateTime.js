export default {
    formateDate(time) {
        if(!time) return '';
        let date = new Date(time);
        return date.getFullYear() +'-'+(date.getMonth()+1)+'-'+date.getDate();
    },
    FormatToDate(val) {
        if (val != null) {
            var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
            //月份为0-11，所以+1，月份小于10时补个0
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            return date.getFullYear() + "-" + month + "-" + currentDate + ' '+ hours +':'+ Minutes +':'+ Seconds;
        }
        return "";
    }
}