<template>
  <div class="container-manager-user">
    <div>
      <el-button
        icon="el-icon-edit"
        size="mini"
        type="primary"
        @click="isShowFormAddUser = true"
      >Thêm tài khoản</el-button>
    </div>
    <el-table
      :data="tableData.filter(data => !search || data.fullname.toLowerCase().includes(search.toLowerCase()))"
    >
      <el-table-column align="center" label="STT" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="Họ tên" prop="fullname"></el-table-column>
      <!-- <el-table-column label="Địa chỉ" prop="address"></el-table-column>
      <el-table-column label="Ngày sinh">
        <template slot-scope="scope">{{formatDate(scope.row.dob)}}</template>
      </el-table-column> -->
      <el-table-column label="Số điện thoại" prop="phone"></el-table-column>
      <el-table-column label="Đơn vị">
        <template slot-scope="scope">
          <span>{{scope.row.Department.departmentName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Chức vụ">
        <template slot-scope="scope">
          <span>{{formartPosition(scope.row.role)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Nhập tên" />
        </template>
        <template slot-scope="scope">
          <div>
            <el-button class="btn-custom" size="mini">Chi tiết</el-button>
          </div>
          <div>
            <el-button style="margin:5px 0px" type="primary" class="btn-custom" size="mini" @click="handleEdit(scope.$index, scope.row)">Chỉnh sửa</el-button>
          </div>
          <div>
            <el-button
              size="mini"
              type="danger"
              class="btn-custom"
              @click="handleDelete(scope.$index, scope.row)"
            >Xóa</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      @closed="onCloseDialogAddUser"
      custom-class="custom-dialog-add-user"
      width="50%"
      :title="isEdit ? 'Cập nhật tài khoản' : 'Thêm tài khoản'"
      :visible.sync="isShowFormAddUser"
    >
      <el-form
        label-position="top"
        label-width="120px"
        :rules="rules"
        :model="infoUser"
        ref="ruleForm"
      >
        <el-form-item label="Họ và tên" prop="name">
          <el-input v-model="infoUser.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="Tài khoản" prop="username">
          <el-input v-model="infoUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}">
            <el-form-item label="Mật khẩu" prop="password">
              <el-input placeholder="Nhập mật khẩu" v-model="infoUser.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}" style="float:right">
            <el-form-item label="Nhập lại mật khẩu" prop="rePassword">
              <el-input placeholder="Nhập lại mật khẩu" v-model="infoUser.rePassword" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}">
            <el-form-item label="Ngày sinh" prop="birth">
              <el-date-picker
                type="date"
                :picker-options="datePickerOptions"
                format="dd-MM-yyyy"
                placeholder="Nhập ngày sinh"
                v-model="infoUser.birth"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}" style="float:right">
            <el-form-item label="Số điện thoại" prop="phone">
              <el-input v-model="infoUser.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}">
            <el-form-item label="Quyền" prop="role">
              <el-select :disabled="isEdit" v-model="infoUser.role" placeholder="Chọn quyền">
                <el-option label="Nhân viên" :value="0"></el-option>
                <el-option label="Quản lý" :value="1"></el-option>
                <el-option label="Kế toán" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xl="{span: 11, offset: 0}" :lg="{span: 11, offset: 0}" :md="{span: 11, offset: 0}" :sm="{span: 11, offset: 0}" style="float:right">
            <el-form-item label="Đơn vị" prop="position">
              <el-select v-model="infoUser.position" placeholder="Chọn quyền">
                <div v-for="dept in arrDepartment" :key="dept.id">
                  <div>
                    <el-option :label="dept.departmentName" :value="dept.id"></el-option>
                  </div>
                </div>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="Địa chỉ" prop="address">
          <el-input v-model="infoUser.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancelAddUser('ruleForm')">Hủy</el-button>
        <el-button
          type="primary"
          @click="!isEdit ? onClickAddUser('ruleForm') : onEditUser('ruleForm')"
        >{{isEdit ? 'Cập nhật' : 'Thêm'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllUser,addNewUser,editUser,removeUser } from "@/api/user";
import { getAllDepartment } from "@/api/department";
import moment from "moment";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Mật khẩu không được để trống"));
      } else {
        if (this.infoUser.rePassword !== "") {
          this.$refs.ruleForm.validateField("rePassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Nhập lại mật khẩu"));
      } else if (value !== this.infoUser.password) {
        callback(new Error("Mật khẩu không trùng nhau"));
      } else {
        callback();
      }
    };
    return {
      isEdit: false,
      isShowFormAddUser: false,
      tableData: [],
      arrDepartment: [],
      search: "",
      userIdUpdate: undefined,
      infoUser: {
        name: "",
        username: "",
        password: "",
        rePassword: "",
        birth: "",
        phone: "",
        address: "",
        role: undefined,
        position: ""
      },
      datePickerOptions: {
        disabledDate(date) {
          let d = new Date();
          d.setDate(d.getDate() - 1);
          return moment(date).isAfter(d);
        }
      },
      rules: {
        name: [
            { required: true,message: 'Tên không được để trống', trigger: 'blur'},
            { required: true, pattern: /^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ"+"ÊẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ"+"ụủứừỬỮỰYỲỴÝỶỸửữựyỳỵỷỹý\s]+$/ ,message: 'Giá trị không hợp lệ', trigger: 'blur'},
          ],
        username: [
          {
            required: true,
            message: "Tài khoản không được để chống",
            trigger: "blur"
          },
          {
            required: true,
            min: 4,
            max: 20,
            message: "Tên tài khoản từ 4 đến 20 kí tự",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: "Tên tài khoản không được chứa kí tự đặc biệt",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "Nhập mật khẩu", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          {
            required: true,
            pattern: /^[a-zA-Z0-9_@]+$/,
            message: 'Mật khẩu không được chứa kí tự đặc biệt (Chỉ chứa "_@")',
            trigger: "blur"
          }
        ],
        rePassword: [
          { required: true, message: "Nhập lại mật khẩu", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ],
        birth: [{ required: true, message: "Nhập ngày sinh", trigger: "blur" }],
        phone: [
          { required: true, message: "Nhập số điện thoại", trigger: "blur" },
          {
            required: true,
            pattern: /^[0-9]+$/,
            message: "Sai định dạng",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "Địa chỉ không được để trống",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ"+"ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ"+"ụủứừỬỮỰYỲỴÝỶỸửữựyỳỵỷỹ\s]+$/,
            message: "Địa chỉ không hợp lệ (Không chứa các kí tự đặc biệt)",
            trigger: "blur"
          }
        ],
        role: [
          { required: true, message: "Chọn quyền người dùng", trigger: "blur" }
        ],
        position: [
          { required: true, message: "Chọn đơn vị", trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    await this.getDepartment();
    await this.getUser();
  },
  methods: {
    convertIdRole(role) {
      if (role === "Creator") {
        return 0
      } else if (role === "Approver") {
        return 1
      } else if (role === "Accountant") {
        return 2
      }
    },
    handleEdit(index, user) {
      this.isEdit = true;
      this.userIdUpdate = user.id
      this.infoUser.name = user.fullname
      this.infoUser.birth = user.dob
      this.infoUser.phone = user.phone
      this.infoUser.position = user.Department.id
      this.infoUser.role = this.convertIdRole(user.role)
      this.infoUser.address = user.address
      this.isShowFormAddUser = true
    },
    handleDelete(index, user) {
      this.$confirm("Bạn có muốn xóa tài khoản này không?", "Thông báo", {
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            type: "warning"
          })
            .then(async () => {
              await this.inActiveUser(user.id)
              await this.getUser()
            })
            .catch(() => {});
    },
    inActiveUser(id) {
      return removeUser(id).then(res => {
          if (res.status === 1){
            this.$notify({
              title: 'Thành công',
              message: 'Xóa tài khoản thành công',
              type: 'success'
            })
          }
          if (res.status === 2){
            this.$notify.error({
              title: 'Thất bại',
              message: 'Xóa tài khoản thất bại!',
            })
          }
        }).catch(err => {
          this.$notify.error({
              title: 'Thất bại',
              message: 'Xóa tài khoản thất bại!',
            })
        })
    },
    onEditUser(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$confirm("Bạn có muốn cập nhật thông tin?", "Thông báo", {
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy",
            type: "warning"
          })
            .then(async () => {
              let userUpdate = {
                id: this.userIdUpdate,
                fullname: this.infoUser.name,
                dob: moment(this.infoUser.birth).format("YYYY-MM-DD"),
                address:  this.infoUser.address,
                phone: this.infoUser.phone,
                departmentId: this.infoUser.position
              }
              await this.updateUser(userUpdate)
              await this.getUser()
              this.isShowFormAddUser = false
            })
            .catch(() => {});
        } else {
          alert("Nhập thông tin!");
          return;
        }
      });
    },
    updateUser(user){
        return editUser(user).then(res => {
          if (res.status === 1){
            this.$notify({
              title: 'Thành công',
              message: 'Cập nhật thành công',
              type: 'success'
            })
          }
        }).catch(err => {
          this.$notify.error({
              title: 'Thất bại',
              message: 'Cập nhật thất bại!',
            })
        })
      },
    onClickAddUser(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$confirm("Bạn có muốn thêm người dùng không.?", "Thông báo", {
            confirmButtonText: "Thêm",
            cancelButtonText: "Hủy",
            type: "warning"
          })
            .then(async () => {
              let data = {
                fullname: this.infoUser.name,
                username: this.infoUser.username,
                password: this.infoUser.password,
                dob: moment(new Date(this.infoUser.birth)).format("DD-MM-YYYY"),
                phone: this.infoUser.phone,
                address: this.infoUser.address,
                role: this.infoUser.role,
                departmentId: this.infoUser.position
              }
              await this.addNewUser(data);
              await this.getUser();
              this.isShowFormAddUser = false;
            })
            .catch(() => {});
        } else {
          alert("Nhập lại thông tin!");
          this.userInfo = {};
          return false;
        }
      });
    },
    addNewUser (data){
        return addNewUser(data).then(res => {
          if (res.status === 1){
            this.$notify({
              title: 'Thành công',
              message: 'Thêm thành công!',
              type: 'success'
            })
          }
          if (res.result === "Username existed!"){
            this.$notify.error({
              title: 'Thất bại',
              message: 'Tài khoản bị trùng!',
            })
          }
        }).catch(err => {
          this.$notify.error({
              title: 'Thất bại',
              message: 'Thêm thất bại thất bại!',
            })
        })
      },
    onCancelAddUser(form) {
      this.$refs[form].resetFields();
      this.isShowFormAddUser = false;
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    getUser() {
      this.tableData = []
      return getAllUser()
        .then(rs => {
          if (rs.status === 1) {
            this.tableData.push(...rs.result);
          }
        })
        .catch(err => {
          Promise.reject(err);
        });
    },
    getDepartment() {
      return getAllDepartment()
        .then(res => {
          if (res.status === 1) {
            this.arrDepartment.push(...res.result);
          }
        })
        .catch(err => {
          Promise.reject(err);
        });
    },
    formartPosition(role) {
      let str = null;
      if (role === "Creator") {
        return (str = "Nhân viên");
      }
      if (role === "Approver") {
        return (str = "Quản lý");
      }
      if (role === "Accountant") {
        return (str = "Kế toán");
      }
    },
    onCloseDialogAddUser () {
        this.infoUser.name = ""
        this.infoUser.username = ""
        this.infoUser.password = ""
        this.infoUser.rePassword = ""
        this.infoUser.birth = ""
        this.infoUser.phone = ""
        this.infoUser.address = ""
        this.infoUser.role = undefined,
        this.infoUser.position = "",
        this.isEdit = false
      }
  }
};
</script>

<style lang="scss">
.container-manager-user {
  padding: 10px 10px 10px 10px;
  .el-table th {
    text-align: center;
  }
  .el-table td {
    text-align: center;
  }
  .custom-dialog-add-user {
    margin-top: 5px !important;
  }
  .btn-custom {
    width: 100px;
  }
}
</style>