// 日常问题列表
export async function getDayIssuePageList(that) {
  const res = await that.$http.get(
    "/DayIssue/GetDayIssuePageList?page=" +
      that.listQuery.page +
      "&limit=" +
      that.listQuery.limit +
      "&keywords=" +
      that.keywords +
      "&startTime=" +
      that.time[0] +
      "&endTime=" +
      that.time[1] +
      "&vipType=" +
      that.vipType +
      "&status=" +
      that.status
  );
  return res;
}

// 处理
export async function dealDayIssue(that) {
  const res = await that.$http.post("/DayIssue/DealDayIssue", that.groupinfo);
  if (res.success == false) {
    that.$message.error(res.msg);
  } else {
    that.$message.success(res.msg);
  }
  return res;
}

// 完结
export async function finishDayIssue(that, id) {
  const res = await that.$http.get("/DayIssue/FinishDayIssue?Id=" + id);
  if (res.success == false) {
    that.$message.error(res.msg);
  } else {
    that.$message.success(res.msg);
  }
  return res;
}
// 查看详情
export async function getDayIssueByLegalDeatil(that, id) {
  const res = await that.$http.get(
    "/DayIssue/GetDayIssueByLegalDeatil?Id=" + id
  );
  if (res.success) {
    return res;
  } else {
    that.$message.error(res.msg);
  }
}
// 处理进度
export async function dealDayIssuaDeatil(that, id) {
  const res = await that.$http.get("/DayIssue/DealDayIssuaDeatil?Id=" + id);
  if (res.success) {
    return res;
  } else {
    that.$message.error(res.msg);
  }
}
// 通过输入用户手机号查询
export async function getDataByPhone(that) {
  const res = await that.$http.get(
    "/DayIssue/GetDataByPhone?phone=" + that.orderInfo.Phone
  );
  if (res.success) {
    return res;
  } else {
    that.$message.error(res.msg);
  }
}

// 创建工单
export async function dayIssueByCustomerService(that) {
  const res = await that.$http.post(
    "/DayIssue/DayIssueByCustomerService",
    that.orderInfo
  );
  if (res.success) {
    that.$message.success(res.msg);
  } else {
    that.$message.error(res.msg);
  }
  return res;
}

// 获取客服列表
export async function getCustomerServiceList(that) {
  const res = await that.$http.get("/DayIssue/GetCustomerServiceList");
  if (res.success) {
    return res;
  } else {
    that.$message.error(res.msg);
  }
}
// 重新分配客服
export async function ManualAllocation(that, id) {
  const res = await that.$http.get(
    "/DayIssue/ManualAllocation?id=" +
      id +
      "&CustomerServiceId=" +
      that.CustomerServiceId
  );
  if (res.success) {
    that.$message.success(res.msg);
    return res;
  } else {
    that.$message.error(res.msg);
  }
}
