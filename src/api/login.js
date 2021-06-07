import qs from 'qs'
// 用户登录
export async function adminLogin(that) {
    const res = await that.$http.get('/Login/Login?userName='+that.username+'&pwd='+that.password);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
        that.$message({
            message: '登录成功',
            type: 'success'
          });
       return res;
    }
}

// 登录状态更改
export async function changeStatus(that) {
    const res = await that.$http.get('/UserInfo/ChangeStatus?Status='+that.out_types);
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 退出登录
export async function logout(that) {
    const res = await that.$http.get('/Login/Out');
    if(res.success == false) {
        that.$message.error(res.msg);
    }else {
       return res;
    }
}
// 获取用户登录信息
export async function GetUserData(that) {
    const res = await that.$http.get('/Communication/GetUserData?custId='+that.searchid);
    return res;
}