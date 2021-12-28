// 导航等级的添加
export async function addNavLevel(that) {
    const res = await that.$http.post('/Answer/Add',that.leveNav)
    if(res.success == false) {
        that.$message.error(res.msg)
    }else {
        that.$message.success(res.msg)
    }
    return res
}
// 一二三级导航的列表渲染
export async function getNavLevel(that) {
    const res = await that.$http.get('/Answer/GetAnswerTree')
    if(res.success == false) {
        that.$message.error(res.msg)
    }
    return res
}