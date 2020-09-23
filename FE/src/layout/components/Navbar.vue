<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div>
            <span>{{name}}</span>
          </div>
          <img src="@/assets/user.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>Trang chủ</el-dropdown-item>
          </router-link>
          <a @click="onRePassword()">
            <el-dropdown-item>Đổi mật khẩu</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Đăng xuất</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="Thay đổi mật khẩu"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="submitInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="Mật khẩu hiện tại" prop="oldPassword">
          <el-input :key="passwordType" :type="passwordType" v-model="submitInfo.oldPassword"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="Mật khẩu mới" prop="newPassword">
          <el-input type="password" v-model="submitInfo.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="Nhập lại mật khẩu" prop="rePassword">
          <el-input type="password" v-model="submitInfo.rePassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Đổi mật khẩu</el-button>
          <el-button @click="resetForm('ruleForm')">Hủy</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { changePassword } from "@/api/user";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "name"])
  },
  data() {
    var checkCurrentPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Nhập mật khẩu hiện tại"));
      }
      setTimeout(() => {
        if (this.submitInfo.oldPassword !== "") {
          this.$refs.ruleForm.validateField("oldPassword");
        }
        callback();
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Nhập mật khẩu mới"));
      } else {
        setTimeout(() => {
          if (this.submitInfo.newPassword !== "") {
            this.$refs.ruleForm.validateField("newPassword");
          }
          callback();
        }, 1000);
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Nhập lại mật khẩu"));
      } else if (value !== this.submitInfo.newPassword) {
        callback(new Error("Mật khẩu không trùng nhau"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      passwordType: "password",
      submitInfo: {
        oldPassword: "",
        newPassword: "",
        rePassword: ""
      },
      rules: {
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        rePassword: [{ validator: validatePass2, trigger: "blur" }],
        oldPassword: [{ validator: checkCurrentPass, trigger: "blur" }]
      }
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    onRePassword() {
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.changePass();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changePass() {
      let data = {
        oldPass: this.submitInfo.oldPassword,
        newPass: this.submitInfo.rePassword
      };
      return changePassword(data).then(res => {
        if (res.status === 1) {
          this.$notify({
            title: "Thành công",
            message: "Đổi mật khẩu thành công",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.submitInfo = {};
        } else if (res.result === "Wrong current password!") {
          this.$notify.error({
            title: "Error",
            message: "Mật khẩu cũ không đúng"
          });
          this.submitInfo = {};
        } else {
          this.$notify.error({
            title: "Error",
            message: "Đổi mật khẩu thất bại"
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .show-pwd {
    position: absolute;
    right: 0;
    transform: translate(-50%, 0);
    font-size: 16px;
    color: gray;
    cursor: pointer;
    user-select: none;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 35px;
          height: 35px;
          border-radius: 100%;
          margin-top: 5px;
          margin-left: 5px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
