<template>
  <div class="container-manage-notification">
    <el-button
      type="primary"
      @click="dialogFormVisible = true"
      icon="el-icon-edit"
      size="mini"
    >Tạo thông báo mới</el-button>
    <div class="selelct-noti">
      <el-select size="mini" @change="changeTypeFilter" v-model="option" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <template>
      <el-table :data="listSchedule">
        <el-table-column type="expand">
          <template slot-scope="props">
            <label>Tiêu đề:</label>
            <span>{{ props.row.title }}</span>
            <div style="margin-top:20px" v-if="props.row.content">
              <label>Nội dung:</label>
              <span>{{ props.row.content }}</span>
            </div>
            <div style="margin-top:20px" v-if="props.row.files">
              <el-button
                slot="reference"
                type="info"
                icon="el-icon-document"
                @click="showDocs(props.row)"
                size="mini"
              >Đính kèm</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ngày tạo">
          <template slot-scope="scope">
            <div>{{formatDate(scope.row.createdAt)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Tiêu đề" prop="title"></el-table-column>
        <el-table-column label="Người tạo">
          <template slot-scope="scope">
            <div>{{scope.row.Creator.fullname}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Đơn vị">
          <template slot-scope="scope">
            <div>{{scope.row.Department.departmentName}}</div>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.Creator.fullname === name || role === 'Approver'"
              class="btn"
              size="mini"
              type="danger"
              @click="onDeleteNoti(scope.row)"
              icon="el-icon-document-delete"
            >Xóa</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="prevClickPagination"
        :current-page="currentPage + 1"
        :page-size="10"
        layout="prev, pager, next"
        :total="totalPage"
      ></el-pagination>
    </template>

    <el-dialog title="Danh sách tài liệu" :visible.sync="isOpenDialogDownload" width="50%">
      <dialog-download :listFile="loadFiles" />
      
    </el-dialog>

    <!-- Dialog thêm thông báo -->
    <el-dialog
      width="60%"
      custom-class="custom-dialog-add-noti"
      title="Tạo thông báo mới"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @closed="onCloseDialog"
      :visible.sync="dialogFormVisible"
    >
      <el-checkbox-group v-model="checkValue" @change="changeCheckBox(checkValue)">
        <el-checkbox label="Thông báo"></el-checkbox>
        <el-checkbox label="Lịch họp"></el-checkbox>
        <el-checkbox label="Tài liệu đào tạo" :disabled="checkDisable"></el-checkbox>
      </el-checkbox-group>
      <el-form :model="noti" :rules="rules" ref="ruleForm">
        <el-form-item label="Tiêu đề" prop="title">
          <el-input type="textarea" :rows="2" v-model="noti.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Nội dung" prop="content">
          <el-input type="textarea" :rows="6" v-model="noti.content" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <input
        type="file"
        multiple
        @change="handleSelectsFile"
        name="images"
        ref="fileInput"
        style="display:none"
      />
      <input
        type="button"
        @click="$refs.fileInput.click()"
        style="margin-bottom: 10px"
        value="Chọn tệp"
        :disabled="isDisableInput"
      />
      <input
        type="button"
        @click="deleteAllFile"
        style="margin-bottom: 10px"
        value="Xóa hết"
        :disabled="isDisableInput"
      />
      <div class="container-image" style="display:flex; flex-wrap: wrap;">
        <div class="block" v-for="(image, i ) in imagesSchedule" :key="i">
          <el-image
            @click="removeImage(image)"
            style="width: 150px; height: 150px; margin-right:10px"
            :src="image"
            fit="cover"
          ></el-image>
        </div>
      </div>
      <ul id="list-file">
        <li v-for="(item,index) in files" :key="index">{{ item }}</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Hủy bỏ</el-button>
        <el-button type="primary" @click="onCreateNoti('ruleForm')">Tạo mới</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  createNotification,
  getAllMeetingSchedule,
  getAllNoti,
  getAllTranningDocs,
  deleteDocs
} from "@/api/notification";
import moment from "moment";
import DialogDownloadDocs from '@/layout/components/dialog/DialogDownloadDocs'

export default {
  components: {
    'dialog-download': DialogDownloadDocs
  },
  computed: {
    ...mapGetters(["role", "name"]),
    checkDisable() {
      if (this.role !== "Approver") return true;
      return false;
    },
  },
  watch: {
    checkValue: function () {
      if (
        !this.checkValue ||
        this.checkValue === null ||
        this.checkValue === []
      ) {
        this.isDisableInput = true;
      } else {
        this.isDisableInput = false;
      }
    },
  },
  created() {
    this.getAllMeeting(this.splitPage);
  },
  methods: {
    showDocs(doc) {
      this.isOpenDialogDownload = true
      this.loadFiles = [];
      this.loadFiles = doc.files.split(",");
    },
    onDeleteNoti(noti) {
      this.$confirm("Bạn có muốn xóa thông báo này?", "Thông báo", {
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.deleteDoccument(noti.id);
        })
        .catch(() => {
          return;
        });
    },
    deleteDoccument(id) {
      return deleteDocs({ id: id }).then((res) => {
        if (res.status === 1) {
          this.$notify({
            title: "Thành công",
            message: "Xóa thành công",
            type: "success",
          });
          this.changeTypeFilter();
        }
      });
    },
    changeTypeFilter() {
      if (this.option === 1) {
        this.getAllNotiSys(this.splitPage);
      }
      if (this.option === 2) {
        this.getAllMeeting(this.splitPage);
      }
      if (this.option === 3) {
        this.getAllTranning(this.splitPage);
      }
    },
    prevClickPagination(currentPage) {
      let size = {
        page: currentPage - 1,
        size: 10,
      };
      if (this.option === 1) {
        this.getAllNotiSys(size);
      }
      if (this.option === 2) {
        this.getAllMeeting(size);
      }
      if (this.option === 3) {
        this.getAllTranning(size);
      }
    },
    getAllMeeting(size) {
      return getAllMeetingSchedule(size)
        .then((res) => {
          if (res.status === 1) {
            this.listSchedule = [];
            this.listSchedule = [...res.result];
            this.totalPage = res.totalDocuments;
            this.currentPage = res.currentPage;
          } else {
            return;
          }
        })
        .catch((err) => {
          Promise.reject(err);
        });
    },

    getAllNotiSys(size) {
      return getAllNoti(size)
        .then((res) => {
          if (res.status === 1) {
            this.listSchedule = [];
            this.listSchedule = [...res.result];
            this.totalPage = res.totalDocuments;
            this.currentPage = res.currentPage;
          } else {
            return;
          }
        })
        .catch((err) => {
          Promise.reject(err);
        });
    },

    getAllTranning(size) {
      return getAllTranningDocs(size)
        .then((res) => {
          if (res.status === 1) {
            this.listSchedule = [];
            this.listSchedule = [...res.result];
            this.totalPage = res.totalDocuments;
            this.currentPage = res.currentPage;
          } else {
            return;
          }
        })
        .catch((err) => {
          Promise.reject(err);
        });
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    onCloseDialog() {
      this.noti = {};
      this.imagesSchedule = [];
      this.files = [];
      this.checkValue = [];
    },
    createNotification() {
      let formData = new FormData();
      for (let i = 0; i < this.temp.length; i++) {
        formData.append("images", this.temp[i]);
      }
      formData.append("content", this.noti.content);
      formData.append("title", this.noti.title);

      return createNotification(formData, this.typeNoti)
        .then((res) => {
          if (res.status === 1) {
            this.$notify({
              title: "Thành công",
              message: "Tạo yêu cầu thành công",
              type: "success",
            });
            this.changeTypeFilter();
            this.dialogFormVisible = false;
          }
        })
        .catch((err) => {
          this.$notify.error({
            title: "Thất bại",
            message: "Tạo yêu cầu thất bại!",
          });
        });
    },
    onCreateNoti(formName) {
      if (this.checkValue.length === 0 || this.checkValue[0] === undefined) {
        this.$message("Chưa chọn loại thông báo !");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createNotification();
          this.$refs[formName].resetFields();
          this.noti = {};
          this.files = [];
          this.imagesSchedule = [];
        } else {
          return false;
        }
      });
    },
    deleteAllFile() {
      this.imagesSchedule = [];
      this.files = [];
      this.temp = [];
    },
    removeImage(image) {
      this.imagesSchedule.splice(this.imagesSchedule.indexOf(image), 1);
      let found = this.tempDelete.find((ele) => ele.img === image);
      this.temp.splice(this.temp.indexOf(found.file), 1);
      this.$refs.fileInput.value = null;
    },
    handleSelectsFile(e) {
      let fileList = [];
      Array.prototype.push.apply(fileList, e.target.files);
      if (this.checkValue[0] === "Lịch họp") {
        this.temp.push(...fileList);
        fileList.forEach((f) => {
          if (!f.type.match("image.*")) {
            alert("Lịch họp phải là ảnh !");
            return;
          }
          if (f.size > 10 * 1024 * 1024) {
            alert("Ảnh dưới 5MB");
            return;
          }
          if (f.type === "image/jpeg" || f.type === "image/png") {
            let reader = new FileReader();
            let that = this;
            reader.onload = function (e) {
              if (!that.imagesSchedule.includes(e.target.result)) {
                that.imagesSchedule.push(e.target.result);
                that.tempDelete.push({ img: e.target.result, file: f });
              } else {
                alert("Trùng hình ảnh!");
              }
            };
            reader.readAsDataURL(f);
          }
        });
      } else {
        this.temp.push(...fileList);
        fileList.forEach((file) => {
          this.files.push(file.name);
        });
      }
    },
    changeCheckBox(value) {
      this.imagesSchedule = [];
      this.files = [];
      this.temp = [];
      let item = value.slice(-1).pop();
      this.checkValue = [];
      this.checkValue.push(item);
      if (this.checkValue[0] === "Thông báo") {
        this.typeNoti = 1;
      } else if (this.checkValue[0] === "Lịch họp") {
        this.typeNoti = 0;
      } else if (this.checkValue[0] === "Tài liệu đào tạo") {
        this.typeNoti = 2;
      }
    },
  },
  data() {
    return {
      rules: {
        title: { required: true, message: "Nhập tiêu đề", trigger: "blur" },
      },
      isOpenDialogDownload: false,
      isDisableInput: true,
      checkValue: [],
      dialogFormVisible: false,
      imagesSchedule: [],
      typeNoti: undefined,
      temp: [],
      tempDelete: [],
      files: [],
      loadFiles: [],
      options: [
        {
          value: 1,
          label: "Thông báo",
        },
        {
          value: 2,
          label: "Lịch họp",
        },
        {
          value: 3,
          label: "Tài liệu đào tạo",
        },
      ],
      option: 2,
      noti: {
        title: "",
        content: "",
        type: "",
      },
      splitPage: {
        page: 0,
        size: 10,
      },
      totalPage: null,
      currentPage: null,
      listSchedule: [],
    };
  },
};
</script>

<style lang="scss">
.container-manage-notification {
  padding: 10px;
  .custom-dialog-add-noti {
    margin-top: 5px !important;
  }
  .btn-all-docs {
    cursor: pointer;
    text-decoration: underline;
  }
  .selelct-noti {
    margin-top: 10px;
  }
}
</style>