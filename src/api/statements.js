// 语句列表
export async function statementsList(that) {
    const res = await that.$http.get('/Greetings/GetPageData?start='+that.listQuery.page+'&length='+that.listQuery.limit+'&useStatuz='+that.useStatuz+'&types='+that.types);
    return res;
}
// 快捷语删除
export async function DelStatements(that) {
    let data = {
        Ids:that.delId
    }
    const res = await that.$http.post('/Greetings/BatchDel',data);
    if(res.success == false) {
        that.$message.error(res.data.msg);
    }else {
        return res;
    }
}
// 添加
export async function AddStatements(that) {
    let data = {
        Contents:that.language.Contents,
        UseStatuz:that.language.UseStatuz,
        Types:that.language.Types,
    }
    const res = await that.$http.post('/Greetings/Add',data);
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
// 编辑
export async function EditStatements(that) {
    let data = {
        Id:that.language.Id,
        Contents:that.language.Contents,
        UseStatuz:that.language.UseStatuz,
        Types:that.language.Types,
    }
    const res = await that.$http.post('/Greetings/Update',data);
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