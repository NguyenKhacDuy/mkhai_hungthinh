<template>
  <div class="add-department">
    <div>
      <el-button icon="el-icon-edit" size="mini" type="primary" @click="openDialog()">Thêm đơn vị</el-button>
    </div>
    <el-table
      :data="arrDepartment.filter(data => !search || data.departmentName.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column align="center" label="STT" width="100">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="Tên đơn vị" prop="departmentName"></el-table-column>
      <el-table-column label="Địa chỉ đơn vị" prop="address"></el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">Xóa đơn vị</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      title="Thêm đơn vị"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="department" :rules="rules" ref="ruleForm">
        <el-form-item label="Tên đơn vị" label-width="120px" prop="name">
          <el-input v-model="department.name" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="Địa chỉ" label-width="120px" prop="address">
          <el-input v-model="department.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel('ruleForm')">Hủy</el-button>
        <el-button type="primary" @click="addNewDepartment('ruleForm')">Thêm</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllDepartment,
  addDepartment,
  removeDepartment
} from "@/api/department";
export default {
  data() {
    return {
      dialogFormVisible: false,
      arrDepartment: [],
      search: "",
      department: {
        name: "",
        address: ""
      },
      rules: {
        name: [
          { required: true, message: "Chọn đơn vị", trigger: "blur" }
        ],
        address: [
          { required: true, message: "Chọn địa chỉ đơn vị", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    handleDelete(department) {
      this.$confirm("Bạn có muốn xóa đơn vị không.?", "Thông báo", {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning"
      })
        .then(async () => {
          await this.deleteDepart(department.id);
        })
        .catch(() => {});
    },
    deleteDepart(id) {
      return removeDepartment({ departmentId: id }).then(res => {
        if (res.status === 1) {
          this.$notify({
            title: "Thành công",
            message: "Xóa thành công!",
            type: "success"
          });
        }
        this.dialogFormVisible = false;
        this.getDepartment();
      });
    },
    addNewDepartment(rule) {
      this.$refs[rule].validate(valid => {
        if (valid) {
          let data = {
            departmentName: this.department.name,
            address: this.department.address
          }
          return addDepartment(data)
            .then(rs => {
              if (rs.status === 1) {
                this.$notify({
                  title: "Thành công",
                  message: "Thêm thành công!",
                  type: "success"
                });
                this.department.name = "";
                this.department.address = "";
                this.dialogFormVisible = false;
                this.getDepartment();
              }
              if (rs.status === 2) {
                this.$notify.error({
                  title: "Thất bại",
                  message: "Đơn vị bị trùng!"
                });
              }
            })
            .catch(err => {
              this.$notify.error({
                title: "Thất bại",
                message: "Thêm thất bại thất bại!"
              });
            });
        } else {
          return;
        }
      });
    },

    onCancel(rule) {
      this.$refs[rule].resetFields();
      this.dialogFormVisible = false;
    },
    openDialog() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    getDepartment() {
      this.arrDepartment = [];
      return getAllDepartment()
        .then(res => {
          if (res.status === 1) {
            this.arrDepartment.push(...res.result);
          }
        })
        .catch(err => {
          Promise.reject(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-department {
  padding: 10px 10px 10px 10px;
}
</style>