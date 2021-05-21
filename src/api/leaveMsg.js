// 留言列表查询
export async function LeaveMsgList(that) {
    const res = await that.$http.get('/MessageOrder/GetMsgList?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&phone='+that.phone+'&txtStartcreateTime='+that.time[0]+'&txtEndcreateTime='+that.time[1]);
    return res;
}
// 留言处理
export async function reply(that) {
    const res = await that.$http.get('/DealMsgOrder/Deal?Id='+that.replyid+'&Explain='+that.Explain);
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