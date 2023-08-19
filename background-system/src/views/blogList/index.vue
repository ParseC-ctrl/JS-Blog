<template>
  <div class="app-container">
    <el-input
      v-model="searchInput"
      style="width: 250px; margin: 10px 10px 10px 0"
      placeholder="通过文字描述以及标题查询"
    ></el-input>
    <el-button type="primary" @click="searchBlog">查询</el-button>

    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="文章名称" width="150" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              slot="reference"
            >
              {{ scope.row.title }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="文章描述" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="浏览数" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>
      <el-table-column label="评论量" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>
      <el-table-column label="所属分类" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.category === null ? "未分类" : scope.row.category.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属标签" width="150" align="center">
        <template slot-scope="scope">
          <div class="showtags" v-if="scope.row.tags.length > 0">
            <el-tag
              style="margin: 5px;color: white;font-weight: bold;"
              v-for="item in scope.row.tags"
              :key="item.id"
              :color="item.tagColor"
              effect="light"
            >
              {{ item.tagName }}
            </el-tag>
          </div>
          <div v-else><div>暂无标签</div></div>
        </template>
      </el-table-column>
      <el-table-column label="创建日期" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
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
              @click="editBlogHandle(scope.row)"
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
              @click="deleteBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 15px"
      background
      layout="prev, pager, next, total, ->, sizes, jumper"
      :page-size="eachPage"
      :total="count"
      :page-sizes="[5, 10, 20]"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findBlog, delOneBlog } from "@/api/blog";
import { formatDate } from "@/utils/tools";
import { frontEnd_URL, server_URL } from "@/urlConfig";
export default {
  data() {
    return {
      searchInput: "",
      data: [],
      srcList: [],
      eachPage: 5,
      currentPage: 1,
      totalPage: 0,
      count: 0,
      pagerCurrentPage: 1,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(keyword = "") {
      findBlog(this.currentPage, this.eachPage, keyword).then(({ data }) => {
        for (let i of data.rows) {
          i.createDate = formatDate(i.createDate);
          i.thumb = server_URL + i.thumb;
          this.srcList.push(i.thumb);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
        this.data = data.rows;
      });
    },
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },
    deleteBlog(blogInfo) {
      this.$confirm(
        "删除该文章会讲该文章下的评论一并删除，是否继续",
        "是否删除此篇文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delOneBlog(blogInfo.id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    sizeChangeHandle(pagerNum) {
      this.eachPage = parseInt(pagerNum);
      this.currentPage = 1;
      this.fetchData(this.searchInput);
    },
    currentChangeHandle(pageNum) {
      this.currentPage = parseInt(pageNum);
      this.fetchData(this.searchInput);
    },
    prevClickHandle() {
      this.currentPage -= 1;
    },
    nextClickHandle() {
      this.currentPage += 1;
    },
    editBlogHandle(blogInfo) {
      this.$router.push(`/editBlog/${blogInfo.id}`);
    },
    searchBlog() {
      this.fetchData(this.searchInput)
    },
  },
};
</script>

<style lang="scss" scoped>

</style>