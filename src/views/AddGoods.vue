<template>
  <div class="addgoods-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
          </el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-steps :active="activeTab - 0" finish-status="success" align-center
            style="margin-top: 10px;margin-bottom: 20px;">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-form ref="addGoodsRef" :rules="addGoodsRules" :model="addGoodsForm" label-position="top">
        <el-tabs tab-position="left" v-model="activeTab" :before-leave="beforeLeaveTab" style="min-height: 300px;">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格(元)" prop="goods_price">
              <el-input-number v-model="addGoodsForm.goods_price" :precision="2" :min="0"
                :controls="false"></el-input-number>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input-number v-model="addGoodsForm.goods_weight" :precision="4" :min="0"
                :controls="false"></el-input-number>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input-number v-model="addGoodsForm.goods_number" :min="0" :max="9999" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat" :options="catList" :props="cascaderProps"
                @change="selectedCatIdChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in paramList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals1" @change="selectedParamChange(item.attr_vals1)">
                <el-checkbox :label="item1" v-for="(item1, index1) in item.attr_vals" :key="index1"
                  style="margin-top: 10px;"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in attrList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" list-type="picture-card"
              :on-preview="handlePictureCardPreview" :on-remove="handlePicRemove" :on-success="picSuccessUpload"
              :headers="picHeaderObj">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="picDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="图片加载失败">
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce" ref="myQuillEditorRef">
            </quill-editor>
            <el-button type="primary" style="margin-top: 10px;" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCategoryList } from "@/api/CategoryApi";
import { getParamList } from "@/api/ParamApi";
import { addGoods } from "@/api/GoodsApi";
import remind from "@/utils/Remind";
import deepCopy from "@/utils/Deepcopy";
export default {
  name: "AddGoods",
  data() {
    return {
      activeTab: "0",
      addGoodsForm: {
        goods_number: 0,
        goods_price: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: "商品名称不允许为空", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "商品价格不允许为空", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "商品重量不允许为空", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "商品数量不允许为空", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "商品的分类不允许为空", trigger: "blur" }
        ],
      },
      catList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      paramList: [],
      attrList: [],
      dialogImageUrl: "",
      picDialogVisible: false,
      picHeaderObj: {
        Authorization: window.localStorage.getItem("token"),
      }
    }
  },
  computed: {
    id() {
      if (this.addGoodsForm.goods_cat.length === 3)
        return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1];
      else
        return null;
    }
  },
  methods: {
    beforeLeaveTab(newActiveTab, oldActiveTab) {
      //newActiveTab为将要前往的标签页的name，而oldActiveTab为将要离开的标签页的name
      //return false表示阻止切换标签页
      if (newActiveTab !== "0" && this.addGoodsForm.goods_cat.length !== 3) {
        remind("请先选择商品分类", "错误", this);
        return false;
      }
    },
    async getCatlist() {
      const { data: res } = await getCategoryList();
      if (res.meta.status != 200)
        return remind("获取商品的分类列表失败", "错误", this);
      this.catList = res.data;
    },
    selectedCatIdChange() {
      if (this.addGoodsForm.goods_cat.length !== 3)
        return this.addGoodsForm.goods_cat = [];
      this.getParamList();
      this.getAttrList();
    },
    async getParamList() {
      const { data: res } = await getParamList(this.id, "many");
      if (res.meta.status !== 200) return remind("获取参数列表出错", "错误", this);
      res.data.forEach(item => {
        if (item.attr_vals) {
          item.attr_vals = item.attr_vals.split("，");
          item.attr_vals1 = [];
          deepCopy(item.attr_vals1, item.attr_vals);
        }
        else {
          item.attr_vals = [];
          item.attr_vals1 = [];
        }
      });
      this.paramList = res.data;
    },
    async getAttrList() {
      const { data: res } = await getParamList(this.id, "only");
      if (res.meta.status !== 200) return remind("获取属性列表失败", "错误", this);
      this.attrList = res.data;
    },
    //图片预览时的钩子
    handlePictureCardPreview(file) {
      const imgURL = file.response.data.url;
      this.dialogImageUrl = imgURL;
      this.picDialogVisible = true;
    },
    //移除掉图片时的钩子
    handlePicRemove(file) {
      if (file.response.meta.status !== 200) return ("删除图片失败", "错误", this);
      const tmpPath = file.response.data.tmpPath;
      let index = this.addGoodsForm.pics.findIndex(item => item.pic === tmpPath);
      this.addGoodsForm.pics.splice(index, 1);
    },
    //图片上传成功的钩子
    picSuccessUpload(response) {
      if (response.meta.status !== 200) return remind("图片上传失败", "错误", this);
      const picInfo = { pic: response.data.tmp_path };
      this.addGoodsForm.pics.push(picInfo);
    },
    addGoods() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return remind("请填写必要的表单项", "错误", this);
        this.paramList.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals1.join("，"),
          }
          this.addGoodsForm.attrs.push(attrInfo);
        });
        this.attrList.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(attrInfo);
        });
        let form = {};
        deepCopy(form, this.addGoodsForm);
        form.goods_cat = form.goods_cat.join(",");
        const { data: res } = await addGoods(form);
        if (res.meta.status !== 201) {
          return remind(res.meta.msg, "错误", this);

        }
        this.$message.success("添加商品成功");
        this.$router.push("/home/goods");
      })
    }
  },
  created() {
    this.getCatlist();
  }
}
</script>

<style lang="less" scoped></style>
