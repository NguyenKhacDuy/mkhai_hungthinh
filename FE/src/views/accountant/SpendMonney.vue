<template>
  <div class="container-approved">
    <el-table :data="arrLicense" style="width: 100%">
      <el-table-column label="Mã chứng từ">
        <template slot-scope="scope">
          <span>{{formatId(scope.row.id)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Người tạo">
        <template slot-scope="scope">
          <span>{{scope.row.Creator.fullname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày tạo">
        <template slot-scope="scope">
          <span>{{formatDate(scope.row.createdAt)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="Nội dung"></el-table-column>
      <el-table-column label="Đơn vị">
        <template slot-scope="scope">
          <span>{{scope.row.Department.departmentName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Số tiền (VNĐ)">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.money)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Trạng thái">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 3" type="success">Đã chi</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success">Đã phê duyệt</el-tag>
          <el-tag v-if="scope.row.status === 4" type="info">Không chi</el-tag>
          <el-tag v-if="scope.row.status === 2" type="danger">Bị hủy</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right" width="80">
        <template slot-scope="scope">
          <el-button class="btn" size="mini" @click="openDialogDetails(scope.row)">Chi tiết</el-button>
        </template>
      </el-table-column>
      <el-table-column width="40">
        <template slot-scope="scope">
          <i
            @click="onClickDownload(scope.row)"
            v-if="scope.row.status === 3"
            class="el-icon-download"
          ></i>
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

    <el-dialog
      custom-class="dialog-custom"
      title="Chi tiết chứng từ"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="isOpenDetailLicense"
    >
      <dialog-detail :data="license" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="isOpenDetailLicense = false">Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCompletedLicense } from "@/api/accountant";
import DetailsLicense from "@/layout/components/dialog/DetailsLicense";
import moment from "moment";
import { getBill } from "@/api/approver";
import FileSaver from "file-saver";
export default {
  components: {
    "dialog-detail": DetailsLicense,
  },
  data() {
    return {
      arrLicense: [],
      isOpenDetailLicense: false,
      license: null,
      option: "",
      completedLicense: [],
      splitPage: {
        page: 0,
        size: 10,
      },
      totalPage: null,
      currentPage: null,
    };
  },
  created() {
    this.getLicenseCompleted(this.splitPage);
  },
  methods: {
    prevClickPagination(currentPage) {
      let size = {
        page: currentPage - 1,
        size: 10,
      };
      this.getLicenseCompleted(size);
    },
    onClickDownload(license) {
      let id = license.id;
      getBill({ id })
        .then((res) => {
          if (res.status === 2) {
            return;
          }
          FileSaver.saveAs(
            new Blob([res], {
              type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }),
            "Hoadon.docx"
          );
        })
        .catch((err) => console.log(err));
    },
    formatMoney(money) {
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    formatId(id) {
      return id.toString().padStart(7, "0");
    },
    openDialogDetails(license) {
      this.isOpenDetailLicense = true;
      this.license = Object.assign({}, license);
    },
    getLicenseCompleted(size) {
      return getCompletedLicense(size)
        .then((res) => {
          if (res.status === 1) {
            this.arrLicense = [];
            this.arrLicense.push(...res.result);
            this.totalPage = res.totalDocuments;
            this.currentPage = res.currentPage;
            this.arrLicense.reverse();
          }
        })
        .catch((err) => {
          Promise.reject(err);
        });
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
  },
};
</script>

<style lang="scss">
.container-approved {
  padding: 10px 10px;
}
</style>