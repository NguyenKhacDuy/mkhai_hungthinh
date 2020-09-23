import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    role: '',
    userInfos: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO_USER: (state, userInfos) => {
    state.userInfos = userInfos
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      let data = {
        username: username,
        password: password
      }
      login(data).then(response => {
        if (response) {
          if(response.status === 1) {
            let  info  = response.result.userInfo
            commit('SET_TOKEN', response.result.token)
            commit('SET_INFO_USER', info)
            commit('SET_NAME', info.fullname)
            commit('SET_ROLE', info.role)
            setToken(response.result.token)
            resolve(true)
          } else {
            alert("Sai thông tin đăng nhập")
            resolve(false)
          }
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({commit}){
    return new Promise(resolve => {
      removeToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

