<template>
  <div class="app-container">
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入文字标题"></el-input>
    </div>

    <div class="block">文章编辑</div>
    <editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    />

    <div class="block">文章描述</div>
    <el-input rows="6" type="textarea" v-model="form.description"></el-input>

    <div class="block">文章头图</div>
    <Upload uploadTitlt="文章头图" v-model="form.thumb" />

    <div class="block">选择文章分类</div>
    <el-select
      v-model="form.select"
      placeholder="请选择文章分类"
      @change="changeHandle"
    >
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>

    <div class="block">选择文章标签</div>
    <el-select
      v-model="form.selectTag"
      multiple
      placeholder="请选择"
      @change="changeHandle"
    >
      <el-option
        v-for="item in blogTag"
        :key="item.id"
        :label="item.tagName"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <div>
      <el-button
        type="primary"
        style="margin-top: 15px"
        @click="addArticleHandle"
        >{{ btnContent }}</el-button
      >
    </div>
  </div>
</template>
  
<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import Upload from "@/components/Upload.vue";
import { getBlogType } from "@/api/blogType.js";
import { addBlog, editBlog, findOneBlog } from "@/api/blog.js";
import { getBlogTag } from "@/api/blogTag";
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
  props: ["mode"],
  data() {
    return {
      form: {
        title: "",
        editorText: "",
        description: "",
        thumb: "",
        select: "",
        imgUrl: "",
        selectTag: [],
      },
      blogType: [],
      blogTag: [],
      editorOptions: {
        language: "zh-CN",
      },
      btnContent: "发布文章",
    };
  },
  components: {
    editor: Editor,
    Upload,
  },
  created() {
    getBlogType().then((res) => {
      this.blogType = res.data;
    });
    getBlogTag().then((res) => {
      this.blogTag = res.data;
    });
    if (this.mode === "edit") {
      // 一进来的时候，就拿到传递过来的 id，根据这个 id 获取到这篇文章的内容，回填到表单
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        // 接下来，将这个内容回填至表单
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        let tags = [];
        data.tags.forEach((item) => {
          tags.push(item.id)
        });
        data.tags = tags
        this.form.selectTag = tags
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
      this.btnContent = "确认修改";
    }
  },
  methods: {
    addArticleHandle() {
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        // toc 传递一个空数组过去，之后在服务器根据 markdown 的内容来生成 toc 目录
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdown,
        tags: Object.values(this.form.selectTag),
      };
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          addBlog(obj).then(() => {
            this.$router.push("/blogList");
          });
        } else {
          editBlog({ id: this.id, data: obj }).then(() => {
            this.$router.push("/blogList"); // 跳转到文章列表
            this.$message.success("文章修改成功");
          });
        }
      } else {
        this.$message.error("请填写完整除了缩略图以外的内容");
      }
    },
    changeHandle() {
      this.$forceUpdate();
    },
  },
};
</script>

  <style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>