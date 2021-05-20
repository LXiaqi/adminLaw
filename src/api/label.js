// 标签添加
export async function addLabel(that) {
    let data = {
        Name: that.name,
        ParentId:that.value
    }
    const res = await that.$http.post('/Label/Add',data);
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
// 标签列表查询
export async function labelList(that) {
    const res = await that.$http.get('/Label/GetLabelTree');
    return res;
}
// 标签一二级列表(下拉框)
export async function TwoLabelTree(that) {
    const res = await that.$http.get('/Label/GetTwoLabelTree');
    return res;
}
// 标签删除
export async function delLabel(that) {
    const res = await that.$http.get('/Label/BatchDel?Id='+that.delId);
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
// 标签编辑
export async function editLabel(that) {
    let data = {
        Id:that.editid,
        Name: that.name,
        ParentId:that.value
    }
    const res = await that.$http.post('/Label/Update',data);
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