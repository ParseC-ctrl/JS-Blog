<template>
  <div class="app-container">
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入要添加的标签，左边选择该标签的等级"
        v-model="input"
        class="input-with-select blogAddInput"
      >
        <el-select
          style="width: 200px"
          v-model="select"
          slot="prepend"
          placeholder="请选择标签等级"
        >
          <el-option v-for="x in 20" :label="x" :value="x" :key="x"></el-option>
        </el-select>
        <el-color-picker
          slot="append"
          size="mini"
          v-model="color"
        ></el-color-picker>
      </el-input>

      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="addBlogTagHandle"
        >添加</el-button
      >
    </div>
    <el-table :data="data" style="width: 100%" border v-loading="listLoading">
      <el-table-column label="序号" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="博客类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.tagName }}
        </template>
      </el-table-column>
      <el-table-column label="标签颜色" align="center">
        <template slot-scope="scope">
          <div
            class="showColorBox"
            :style="{ backgroundColor: `${scope.row.tagColor}` }"
          >
            Tag-Color
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序等级" align="center">
        <template slot-scope="scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogTagHandler(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteBlogTagHandler(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑文章标签" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标签名称">
          <el-input v-model="form.tagName"></el-input>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="标签等级">
            <el-option
              v-for="x in 20"
              :label="x"
              :value="x"
              :key="x"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择颜色">
          <div class="block">
            <el-color-picker
              v-model="form.tagColor"
            ></el-color-picker>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBlogTagHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogTag,
  addBlogTag,
  delBlogTag,
  updateOneBlogTag,
  findOneBlogTag,
} from "@/api/blogTag.js";
export default {
  data() {
    return {
      data: [],
      input: "",
      select: "",
      color: "#409EFF",
      form: {
        tagName: "",
        order: "",
        tagColor: "#",
      },
      dialogFormVisible: false,
      listLoading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getBlogTag().then((res) => {
        this.listLoading = false;
        this.data = res.data;
      });
    },
    addBlogTagHandle() {
      if (this.input) {
        addBlogTag({
          tagName: this.input,
          order: this.select,
          tagColor: this.color,
        }).then((res) => {
          this.fetchData();
          this.input = "";
          this.$message.success("标签添加成功");
        });
      } else {
        this.$message.error("标签名称不能为空");
      }
    },
    editBlogTagHandler({ id }) {
      findOneBlogTag(id).then((res) => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },

    deleteBlogTagHandler({ id }) {
      this.$confirm(
        "删除该标签后，该标签下所有文章将会失去该标签，是否继续",
        "是否删除此文章标签",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delBlogTag(id).then(() => {
            this.fetchData();
            this.$message.success("删除成功");
          });
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    confirmBlogTagHandle() {
      updateOneBlogTag({
        id: this.form.id,
        data: this.form,
      }).then(() => {
        this.fetchData();
        this.$message.success("编辑标签成功");
        this.dialogFormVisible = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.blogAddInput {
  width: 650px;
  margin-bottom: 20px;
}
.showColorBox {
  width: 80%;
  height: 80%;
  margin: 0 auto;
}
</style>
