<template>
  <div class="category-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table :data="categoryList" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" :tree-props="catTreeProps"
        :cell-style="{
          borderTop: '1px solid lightgray',
        }" class="catTable">
        <el-table-column type="index" label="#">
          <template v-slot:default="scoped">
            <span v-if="scoped.row.index">{{ scoped.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template #default="scoped">
            <i class="el-icon-success" style="color:#d0b2ed;font-size: 18px;" v-if="!scoped.row.cat_deleted"></i>
            <i class="el-icon-error" v-else style="color:#d0b2ed;font-size: 18px"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template #default="scoped">
            <el-tag type="success" v-if="scoped.row.cat_level === 0">级别1</el-tag>
            <el-tag type="danger" v-else-if="scoped.row.cat_level === 1">级别2</el-tag>
            <el-tag type="primary" v-else>标签三</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" circle icon="el-icon-edit"></el-button>
            <el-button type="danger" circle icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="closeaddCatDialog">
      <div>
        <el-form :model="addCatForm" :rules="addCatRule" ref="addCatRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名" prop="cat_name">
            <el-input v-model="addCatForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span style="margin-left: 30px;">父级分类：</span>
        <el-cascader v-model="selectedCatId" :options="categoryList2" :props="addCatProps" clearable
          @change="addCatIdChange" ref="addCatCascader" popper-class="cascaderCb"></el-cascader>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addCatConfirm } from "@/api/CategoryApi";
import remind from "@/utils/Remind";
export default {
  name: "Category",
  data() {
    return {
      categoryList: [],
      catTreeProps: {
        children: "children",
      },
      queryInfo: {
        pagesize: 5,
        pagenum: 1,
      },
      queryInfo2: {
        type: 2,
      },
      total: 0,
      addCatDialogVisible: false,
      addCatForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0,
      },
      addCatRule: {
        cat_name: [
          { required: true, message: "分类名不能为空", trigger: "blur" },
        ]
      },
      selectedCatId: [],
      categoryList2: [],
      addCatProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
    }
  },
  methods: {
    async getCategoryList() {
      let index = 0;
      const { data: res } = await getCategoryList(this.queryInfo);
      if (res.meta.status !== 200) return remind("获取分类列表失败", "错误", this);
      this.categoryList = res.data.result;

      this.categoryList.forEach(item => {
        index++;
        item.index = index;
      });
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoryList();
      window.sessionStorage.setItem("catpagesize", this.queryInfo.pagesize);
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCategoryList();
      window.sessionStorage.setItem("catpagenum", this.queryInfo.pagenum);
    },
    async addCate() {
      const { data: res } = await getCategoryList(this.queryInfo2);
      if (res.meta.status !== 200) return remind("获取分类列表失败", "错误", this);
      this.categoryList2 = res.data;
      this.addCatDialogVisible = true;
    },
    addCatIdChange() {
      this.addCatForm.cat_level = this.selectedCatId.length;
      if (this.selectedCatId.length < 1)
        this.addCatForm.cat_pid = 0;
      else
        this.addCatForm.cat_pid = this.selectedCatId.slice(-1);
      this.$refs.addCatCascader.dropDownVisible = false;
    },
    addCatConfirm() {
      this.$refs.addCatRef.validate(async valid => {
        if (!valid) return remind("输入的分类名不符合格式要求", "错误", this);
        else {
          const { data: res } = await addCatConfirm(this.addCatForm);
          if (res.meta.status !== 201) return remind("添加分类失败", "错误", this);
          this.getCategoryList();
          this.$message.success("新增分类成功");
          this.addCatDialogVisible = false;
        }
      })
    },
    closeaddCatDialog() {
      this.$refs.addCatRef.resetFields();
      this.selectedCatId = [];
    }
  },
  created() {
    if (window.sessionStorage.getItem("catpagesize"))
      this.queryInfo.pagesize = parseInt(window.sessionStorage.getItem("catpagesize"));
    if (window.sessionStorage.getItem("catpagenum"))
      this.queryInfo.pagenum = parseInt(window.sessionStorage.getItem("catpagenum"));
    this.getCategoryList();
  },
  mounted() {
    //每个一秒就自动执行该计数器
    setInterval(function () {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
  }
}
</script>

<style lang="less" scoped>
/deep/ .cell {
  text-align: left;
}

.catTable {
  margin-top: 20px;
  border: 1px solid lightgray;
}

.el-cascader-node>.el-radio {
  display: none !important;
}
</style>