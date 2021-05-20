// 聊天列表
export async function chatList(that) {
    const res = await that.$http.get('/ChatHistory/GetChatHistoryPageData?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&phone='+that.phone+'&receptionName='+that.receptionName+'&customerName='+that.customerName+'&startTime='+that.time[0]+'&endTime='+that.time[1]);
    return res;
}
// 接待列表
export async function detailsList(that) {
    const res = await that.$http.get('/Reception/GetPageList?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&phone='+that.phone+'&startTime='+that.time[0]+'&endTime='+that.time[1]);
    return res;
}