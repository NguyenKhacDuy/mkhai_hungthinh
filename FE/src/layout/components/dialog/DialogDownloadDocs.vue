<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column
      type="index"
      width="50">
    </el-table-column>
    <el-table-column prop="name" label="Tên tài liệu"></el-table-column>
    <el-table-column  width="140">
      <template slot-scope="scope">
        <el-button type="primary" @click="onClickDownload(scope.row)" size="mini" icon="el-icon-download">Tải xuống</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { download } from "@/api/notification";
import FileSaver from "file-saver";
export default {
  props: {
    listFile: Array,
  },
  watch: {
    listFile: function (val) {
      this.tableData = []
      for (let i in val) {
        let temp = {
          name: val[i],
        };
        this.tableData.push(temp);
      }
    },
  },
  created() {
    for (let i in this.listFile) {
      let temp = {
        name: this.listFile[i],
      };
      this.tableData.push(temp);
    }
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    onClickDownload(file) {
      let filename = file.name.split("/").reverse()[0];
      download({ filename })
        .then((res) => {
          let extension = filename.split(".").reverse()[0];
          if (res.status === 2) {
            return;
          }

          if (extension === "jpg") {
            FileSaver.saveAs(new Blob([res], { type: "image/jpeg" }), filename);
          } else if (extension === "png") {
            FileSaver.saveAs(new Blob([res], { type: "image/png" }), filename);
          } else if (extension === "doc") {
            FileSaver.saveAs(
              new Blob([res], { type: "application/msword" }),
              filename
            );
          } else if (extension === "docx") {
            FileSaver.saveAs(
              new Blob([res], {
                type:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              }),
              filename
            );
          } else if (extension === "ppt") {
            FileSaver.saveAs(
              new Blob([res], { type: "application/vnd.ms-powerpoint" }),
              filename
            );
          } else if (extension === "pptx") {
            FileSaver.saveAs(
              new Blob([res], {
                type:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              }),
              filename
            );
          } else if (extension === "xls") {
            FileSaver.saveAs(
              new Blob([res], { type: "application/vnd.ms-excel" }),
              filename
            );
          } else if (extension === "xlsx") {
            FileSaver.saveAs(
              new Blob([res], {
                type:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }),
              filename
            );
          } else {
            alert("Loại file không hỗ trợ download");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>