// 钉钉推送
export async function dingPush(that,name) {
    const res = await that.$http.get('https://onlineadmin.365lawhelp.com/TaskNotice/SendNotice?custName='+name+'&usermobile='+that.getuserinfo.Phone);
    return res;
}