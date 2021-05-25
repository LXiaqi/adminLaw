import qs from 'qs'
// 客服账号列表
export async function accountList(that) {
    const res = await that.$http.get('/UserInfo/GetUserInfoList?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&userName='+that.username);
    return res;
}
// 账号删除
export async function Delaccount(that) {
    let data = {
        Ids:that.delId
    }
    const res = await that.$http.post('/UserInfo/BatchDel',data);
    if(res.success == false) {
        that.$message.error(res.data.msg);
    }else {
        return res;
    }
}
// 账号添加
export async function Addaccount(that) {
    let data = {
        UserName:that.userinfo.UserName,
        Pwd:that.userinfo.Pwd,
        Sex:that.userinfo.Sex,
        Age:that.userinfo.Age,
        Type:1,
        HeadImg:that.userinfo.HeadImg
    }
    const res = await that.$http.post('/UserInfo/Add',data);
    if(res.success == false) {
        that.$message.error(res.data.msg);
    }else {
        that.$message({
            message: res.msg,
            type: 'success'
          });
        return res;
    }
}
// 账号编辑
export async function Editaccount(that) {
    let data = {
        Id:that.userinfo.Id,
        UserName:that.userinfo.UserName,
        Pwd:that.userinfo.Pwd,
        Sex:that.userinfo.Sex,
        Age:that.userinfo.Age,
        Type:1,
        HeadImg:that.userinfo.HeadImg
    }
    const res = await that.$http.post('/UserInfo/Update',data);
    if(res.success == false) {
        that.$message.error(res.data.msg);
    }else {
        that.$message({
            message: res.msg,
            type: 'success'
          });
        return res;
    }
}
// 客服坐席列表查询
export async function serviceLogoinList(that) {
    const res = await that.$http.get('/UserInfo/GetUserOnlinePageList?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&userName='+that.username+'&startTime='+that.time[0]+'&endTime='+that.time[1]);
    return res;
}
// 导出
export async function ExportUserOnline(that) {
    const res = await that.$http.get();
    return res;
}