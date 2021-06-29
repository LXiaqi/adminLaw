// 留言列表查询
export async function LeaveMsgList(that) {
    const res = await that.$http.get('/MessageOrder/GetMsgList?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&phone='+that.phone+'&txtStartcreateTime='+that.time[0]+'&txtEndcreateTime='+that.time[1]);
    return res;
}
// 留言处理
export async function reply(that) {
    const res = await that.$http.get('/MessageOrder/Deal?Id='+that.replyid+'&Explain='+that.Explain);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        that.$message({
            message: res.msg,
            type: 'success'
          });
        return res;
    }
}
// 查看进度
export async function GetDealInfo(that) {
    const res = await that.$http.get('/MessageOrder/GetDealInfo?Id='+that.scheduleId);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        return res;
    }
}
// 结束处理
export async function FinishDeal(that) {
    const res = await that.$http.get('/MessageOrder/FinishDeal?Id='+that.scheduleId);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        return res;
    }
}