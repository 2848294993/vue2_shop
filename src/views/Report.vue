<template>
  <div class="report-container">
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import { getReportList } from "@/api/ReportApi";
import remind from "@/utils/Remind";
import * as echarts from 'echarts';
export default {
  name: "Report",
  data() {
    return {
      reportList: [],
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
    }
  },
  methods: {
  },
  async mounted() {
    const { data: res } = await getReportList();
    if (res.meta.status !== 200) return remind("获取报表数据失败", "错误", this);
    this.reportList = res.data;
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    let finalOption = { ...this.options, ...this.reportList };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(finalOption);
  }

}
</script>

<style lang="less" scoped></style>