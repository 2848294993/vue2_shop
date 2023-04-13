<template>
  <div class="param-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-alert title="只能够为三级分类设置动态参数" type="info" center show-icon size="middle" effect="dark" :closable="false"
            style="width: 50%; margin: 10px auto;">
          </el-alert>
        </el-col>
      </el-row>

      <span>选择商品分类：</span>
      <el-cascader v-model="selectedCatId" :options="catList" :props="chooseCatProps" @change="selectedCatIdChange"
        clearable></el-cascader>
      <el-tabs v-model="selectedPane" @tab-click="changeTabs" style="margin-top: 20px;">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="!is3" @click="addParam">
            添加参数
          </el-button>
          <el-table :data="paramList" style="width: 100%">
            <el-table-column type="expand">
              <template #default="scoped">
                <el-tag v-for="(item, index) in scoped.row.attr_vals" :key="index" type="success" closable
                  @close="deleteTag(index, scoped.row)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scoped.row.tagOrInput" v-model.trim="scoped.row.inputTag"
                  ref="saveTagInput" size="small" @keyup.enter.native="$event.target.blur()"
                  @blur="confirmAddTag(scoped.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="addTag(scoped.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scoped">
                <el-button type="primary" circle icon="el-icon-edit" @click="editParam(scoped.row)"></el-button>
                <el-button type="danger" circle icon="el-icon-delete" @click="deleteParam(scoped.row.attr_id)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="!is3" @click="addParam">
            添加属性
          </el-button>
          <el-table :data="paramList" style="width: 100%">
            <el-table-column type="expand">
              <template #default="scoped">
                <el-tag v-for="(item, index) in scoped.row.attr_vals" :key="index" type="success" closable
                  @close="deleteTag(index, scoped.row)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scoped.row.tagOrInput" v-model.trim="scoped.row.inputTag"
                  ref="saveTagInput" size="small" @keyup.enter.native="$event.target.blur()"
                  @blur="confirmAddTag(scoped.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="addTag(scoped.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="scoped">
                <el-button type="primary" circle icon="el-icon-edit" @click="editParam(scoped.row)"></el-button>
                <el-button type="danger" circle icon="el-icon-delete" @click="deleteParam(scoped.row.attr_id)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="'添加' + titleText" :visible.sync="addParamDialogVisible" width="50%" @close="closeAddParamDialog">
      <el-form :model="addParamForm" :rules="addParamRules" ref="addParamRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddParam">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改' + titleText" :visible.sync="editParamDialogVisible" width="50%" @close="closeEditParamDialog">
      <el-form :model="editParamForm" :rules="editParamRules" ref="editParamRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList } from '@/api/CategoryApi';
import { getParamList, addParam, editParam, deleteParam, addTag } from "@/api/ParamApi";
import remind from '@/utils/Remind';
export default {
  name: "Param",
  data() {
    return {
      selectedCatId: [],
      catList: [],
      chooseCatProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedPane: "many",
      paramList: [],
      addParamDialogVisible: false,
      addParamForm: {},
      infoText: "",
      addParamRules: {
        attr_name: [
          { required: true, message: "该项不能为空", trigger: "blur" },
        ]
      },
      editParamDialogVisible: false,
      editParamForm: {
        attr_name: "",
      },
      editParamRules: {
        attr_name: [
          { required: true, message: "该项不能为空", trigger: "blur" }
        ]
      },
      editParamAttrId: 0,
      deleteParamForm: {
      },
      tagOrInput: false,
      inputTag: "",
      addTagForm: {},
      deleteTagForm: {}
    }
  },
  computed: {
    is3() {
      return this.selectedCatId.length === 3 ? true : false;
    },
    titleText() {
      if (this.selectedPane === "many") return "动态参数";
      else return "静态属性";
    }
  },
  methods: {
    selectedCatIdChange() {
      this.paramList = [];
      this.getParamList();

    },
    async getCatList() {
      const { data: res } = await getCategoryList();
      if (res.meta.status !== 200) return remind("获取分类列表失败", "错误", this);
      this.catList = res.data;
    },
    changeTabs() {
      this.getParamList();
    },
    async getParamList() {
      if (this.is3) {
        const { data: res } = await getParamList(this.selectedCatId[2], this.selectedPane);
        if (res.meta.status !== 200) return remind("获取参数列表失败", "错误", this);
        res.data.forEach(item => {
          if (item.attr_vals) {
            item.attr_vals = item.attr_vals.split("，");
          }
          else {
            item.attr_vals = [];
          }
          item.tagOrInput = false;
          item.inputTag = "";
        });
        this.paramList = res.data;
        console.log(this.paramList);
      }

    },
    addParam() {
      this.addParamDialogVisible = true;
    },
    closeAddParamDialog() {
      this.$refs.addParamRef.resetFields();
    },
    confirmAddParam() {
      this.$refs.addParamRef.validate(async valid => {
        if (valid) {
          this.addParamForm.cat_id = this.selectedCatId[this.selectedCatId.length - 1],
            this.addParamForm.attr_sel = this.selectedPane;
          const { data: res } = await addParam(this.addParamForm);
          if (res.meta.status !== 201) return remind("添加参数失败", "错误", this);
          this.getParamList();
          this.addParamDialogVisible = false;
          this.$message.success("添加参数成功");
        }
        else {
          return remind("输入内容不符合要求", "错误", this)
        }
      })
    },
    editParam(row) {
      this.editParamForm.attr_name = row.attr_name;
      this.editParamAttrId = row.attr_id;
      this.editParamDialogVisible = true;
      this.editParamForm.attr_vals = row.attr_vals.join("，");
    },
    closeEditParamDialog() {
      this.$refs.editParamRef.resetFields();
    },
    confirmEditParam() {
      this.$refs.editParamRef.validate(async valid => {
        if (valid) {
          this.editParamForm.cat_id = this.selectedCatId[this.selectedCatId.length - 1];
          this.editParamForm.attr_id = this.editParamAttrId;
          this.editParamForm.attr_sel = this.selectedPane;
          const { data: res } = await editParam(this.editParamForm);
          if (res.meta.status !== 200) return remind("更新参数失败", "错误", this);
          this.getParamList();
          this.editParamDialogVisible = false;
          this.$message.success("更新参数成功");
        }
      })
    },
    async deleteParam(attr_id) {

      const confirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirm === "confirm") {
        this.deleteParamForm.attr_id = attr_id;
        this.deleteParamForm.cat_id = this.selectedCatId[this.selectedCatId.length - 1];
        const { data: res } = await deleteParam(this.deleteParamForm);
        if (res.meta.status !== 200) return remind("删除参数失败", "错误", this);
        this.getParamList();
        this.$message.success("删除参数成功");
      }
      else {
        this.$message.info("取消删除");
      }
    },
    async deleteTag(index, row) {
      const str = row.attr_vals[index];
      row.attr_vals.splice(index, 1);
      this.deleteTagForm.attr_id = row.attr_id;
      this.deleteTagForm.cat_id = this.selectedCatId[this.selectedCatId.length - 1];
      this.deleteTagForm.attr_name = row.attr_name;
      this.deleteTagForm.attr_sel = this.selectedPane;
      this.deleteTagForm.attr_vals = row.attr_vals.join("，");
      const { data: res } = await addTag(this.deleteTagForm);
      if (res.meta.status !== 200) {
        row.attr_vals.splice(index, 0, str);
        return remind("无法删除", "错误", this)
      }
      else {
        this.$message.success("删除成功");
      }

    },
    addTag(row) {
      row.tagOrInput = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      })
    },
    async confirmAddTag(row) {
      if (row.inputTag.length === 0) {
        row.tagOrInput = false;
        return;
      }
      row.attr_vals.push(row.inputTag);
      console.log(row.attr_vals);
      row.inputTag = '';
      row.tagOrInput = false;
      this.addTagForm.attr_id = row.attr_id;
      this.addTagForm.cat_id = this.selectedCatId[this.selectedCatId.length - 1];
      this.addTagForm.attr_name = row.attr_name;
      this.addTagForm.attr_sel = this.selectedPane;
      this.addTagForm.attr_vals = row.attr_vals.join("，");
      const { data: res } = await addTag(this.addTagForm);
      console.log(res);
      if (res.meta.status !== 200) {
        remind("添加失败", "错误", this);
        row.attr_vals.pop();
        return;
      }
      this.$message.success("添加成功");
    }
  },
  created() {
    this.getCatList();

  }

}
</script>

<style lang="less" scoped>
/deep/ .el-input__inner {
  width: 400px;
}

.input-new-tag {
  display: inline;
}

/deep/ .input-new-tag .el-input__inner {
  width: 150px !important;
  height: 32px;
}
</style>