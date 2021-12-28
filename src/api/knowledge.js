// 知识库列表
export async function getKnowledg(that) {
    const res = await that.$http.get('/Knowledge/GetKnowledge?page='+that.listQuery.page+'&size='+that.listQuery.limit+'&keywords='+that.keywords)
    return res
}
// 知识库的添加或者编辑
export async function addKnowledg(that,type) {
    let data = {}
    if(type == 0) {
        data = {
            keywords:that.language.keywords,
            Contents:that.language.Contents
        }
    }else {
        data = {
            Id: that.language.Id,
            keywords:that.language.keywords,
            Contents:that.language.Contents
        }
    }
    const res = await that.$http.post('/Knowledge/AddOrUpdate',data)
    if(res.success == false) {
        that.$message.error(res.msg)
    }else {
        that.$message.success(res.msg)
        
    }
    return res
}
// 知识库的删除
export async function delKnowledg(that,id) {
    const res = await that.$http.get('/Knowledge/Del?Id='+id)
    if(res.success == false) {
        that.$message.error(res.msg)
    }else {
        that.$message.success(res.msg)
    }
    return res
}