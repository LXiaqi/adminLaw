import qs from	'qs'
// 会话列表  0是当前会话1是历史会话
export async function chatList(that) {
    const res = await that.$http.get('/ChatHistory/GetChatHistoryList?Type='+that.chatType+'&customerName='+that.keymords);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 会话详情内容（当前会话）
export async function conversation(that,id) {
    const res = await that.$http.get('/ChatHistory/GetChatHistoryRecord?start='+that.paging.page+'&length='+that.paging.pageSize+'&customerId='+id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 选中会话之后查看对方基本信息
export async function getCustomerInfo(that,id) {
    const res = await that.$http.get('/Customer/GetCustomerInfo?CustomerId='+id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 获取用户登录信息
export async function GetUserData(that,id) {
    const res = await that.$http.get('/Communication/GetUserData?custId='+id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 分配客服id
export async function distribution(that) {
    const res = await that.$http.get('/Communication/GetUserId?custid='+that.send_id);
    if(res.success == false) {
        // that.$message.error(res.msg);
        return res;
    }else {
       return res;
    }
}
//快捷回复列表
export async function quickList(that,id) {
    const res = await that.$http.get('/Customer/GetCustomerclassByGreet?CustomerId='+id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 结束会话
export async function endSession(that) {
    const res = await that.$http.get('/Reception/FinishChat?customerId='+that.userInformationId+'&userId='+that.user_id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 移动端获取用户聊天记录
export async function chatHistoryMob(that) {
    const res = await that.$http.get('/ChatHistory/GerChatHistoryByCustomer?start='+that.page+'&length='+that.pagenum+'&customerId='+that.send_id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
//  获取接待id
export async function getreceid(that) {
    const res = await that.$http.get('/Communication/GetReceptId?custid='+that.userInformationId);
    if(res.success == false) {
        return res;
    }else {
       return res;
    }
}
// 标签选择
export async function labelList(that) {
    const res = await that.$http.get('/Label/GetThreeLabelTree');
    return res;
}
// 标签提交
export async function setLabel(that) {
    const res = await that.$http.get('/Label/SetReceLabel?receId='+that.receid+'&labelIds='+that.labelId);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        that.$message.success(res.msg);
       return res;
    }
}
// 移除会话
export async function DeleteCon(that) {
    const res = await that.$http.get('/Reception/DeleteCon?customerId='+that.send_id);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 选择标签结束会话
export async function commitLab(that,linkid,labs) {
    const res = await that.$http.get('/Reception/FinishChat?receid='+linkid+'&labelIds='+labs);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        that.$message.success(res.msg);
    }
    return res;
}