<template>
  <div class="app">
    <div v-if="state.account.id">
      <p>안녕하세요! {{state.account.name}}</p>
      <button @click="logout">로그아웃</button>
    </div>
    <div v-else>
      <label for="loginId">
        <span>아이디</span>
        <input
          type="text"
          id="loginId"
          v-model="state.form.loginId"
        >
      </label>
      <label for="loginPwd">
        <span>패스워드</span>
        <input
          type="password"
          id="loginPwd"
          v-model="state.form.loginPwd"
        >
      </label>
      <hr>
      <button @click="submit">로그인</button>
    </div>
  </div>
</template>

<script>
import {reactive} from 'vue'
import axios from 'axios'

export default {
  setup() {
    const state = reactive({
      // 첫 값은 비워두기
      account: {
        id: null,
        name: ''
      },
      // back에 post할 양식
      form: {
        loginId: '',
        loginPwd: ''
      }
    })

    // 로그인 버튼 눌렀을 때
    function submit() {
      const args = {
        loginId: state.form.loginId,
        loginPwd: state.form.loginPwd
      }

      axios.post('api/account', args).then(res => {
        alert('로그인에 성공했습니다.')
        state.account = (res.data);
      }).catch(() => {
        alert('계정 정보를 확인해주세요.')
      })
    }

    axios.get('/api/account').then(res => {
      state.account = res.data
    })

    // 로그아웃 버튼 눌렀을 때
    function logout() {
      axios.delete('/api/account').then(() => alert('로그아웃 되었습니다.'))
      state.account.id = null
      state.account.name = ''
    }

    return {state, submit, logout}
  }
}
</script>

<style>

</style>
