<template>
    <div>
      <div v-if="success">
        Регистрация почти завершена. На указанный email было отправлено письмо с дальнейшими инструкциями.
      </div>
      <div v-else>
        <b-form @submit="Submit">
          <b-form-group label="Email" :invalid-feedback="EmailInvalid" :valid-feedback="EmailValid" :state="EmailState">
            <b-form-input required type="email" :state="EmailState" v-model.trim="email" @change="EmailInput" placeholder="Введите Email"></b-form-input>
          </b-form-group>
          <b-form-group label="Пароль" :invalid-feedback="PasswordInvalid" :valid-feedback="PasswordValid" :state="PasswordState">
            <b-input-group>
              <b-form-input required :type="PasswordType" :state="PasswordState" v-model.trim="password" placeholder="Введите пароль"></b-form-input>
              <b-button slot="append" exact @click="TogglePassword">
                <font-awesome-icon v-if="showPassword" icon="eye" />
                <font-awesome-icon v-else icon="eye-slash" />
              </b-button>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Подтверждение пароля" :invalid-feedback="RepasswordInvalid" :valid-feedback="RepasswordValid" :state="RepasswordState">
            <b-form-input required type="password" :state="RepasswordState" v-model.trim="repassword" placeholder="Повторите пароль"></b-form-input>
          </b-form-group>
          <b-form-group label="Никнейм" :invalid-feedback="NicknameInvalid" :valid-feedback="NicknameValid" :state="NicknameState">
            <b-form-input required type="text" :state="NicknameState" v-model.trim="nickname" @change="NicknameInput" placeholder="Введите никнейм"></b-form-input>
          </b-form-group>
          <b-form-checkbox v-model="terms" required>Я принимаю <b-link>правила сообщества</b-link></b-form-checkbox>
          <b-button :disabled="Invalid" block type="submit" variant="primary">Зарегистрироваться</b-button>
        </b-form>
      </div>
    </div>
</template>

<script>
import fur from '../fur'
import axios from 'axios'

export default {
  name: 'Signup',
  methods: {
    Submit () {
      var vue = this
      axios.post('api/signup', {email: this.email, password: this.password, nickname: this.nickname, terms: this.terms}).then(function (responce) {
        vue.success = responce.data.success
      })
    },
    TogglePassword () {
      this.showPassword = !this.showPassword
    },
    EmailInput () {
      if (fur.regex.email.test(this.email)) {
        var vue = this
        if (this.emailCheckCancelToken) this.emailCheckCancelToken()
        axios.post('api/checkemail', {email: this.email}, {
          cancelToken: new axios.CancelToken(function (token) {
            vue.emailCheckCancelToken = token
          })
        }).then(function (responce) {
          vue.emailTaken = responce.data.success
        })
      }
    },
    NicknameInput () {
      if (fur.regex.nickname.test(this.nickname)) {
        var vue = this
        if (this.nicknameCheckCancelToken) this.nicknameCheckCancelToken()
        axios.post('api/checknickname', {nickname: this.nickname}, {
          cancelToken: new axios.CancelToken(function (token) {
            vue.nicknameCheckCancelToken = token
          })
        }).then(function (response) {
          vue.nicknameTaken = response.data.success
        })
      }
    }
  },
  computed: {
    EmailInvalid () {
      if (this.emailTaken) return 'Почта уже зарегистрирована'
      else return 'Email должен быть похож на <strong>example@domain.com</strong>'
    },
    EmailValid () {
      return 'Email введен корректно'
    },
    EmailState () {
      if (this.emailTaken) return false
      else return fur.regex.email.test(this.email)
    },
    PasswordInvalid () {
      if (this.password.length < 5) return 'Пароль должен содержать не менее 5 символов'
      else if (this.password.length > 25) return 'Пароль не должен содержать более 25 символов'
    },
    PasswordValid () {
      return 'Пароль введен корректно'
    },
    PasswordState () {
      return fur.regex.password.test(this.password)
    },
    PasswordType () {
      return this.showPassword ? 'text' : 'password'
    },
    RepasswordInvalid () {
      return 'Пароли не совпадают'
    },
    RepasswordValid () {
      return 'Пароли совпадают'
    },
    RepasswordState () {
      return this.password === '' ? null : this.password === this.repassword
    },
    NicknameInvalid () {
      if (this.nicknameTaken) return 'Этот никнейм уже занят'
      else if (this.nickname.length < 3) return 'Никнейм должен содержать не менее 3 символов'
      else if (this.nickname.length > 25) return 'Никнейм не должен содержать более 25 символов'
    },
    NicknameValid () {
      return 'Никнейм введен корректно'
    },
    NicknameState () {
      if (this.nicknameTaken) return false
      else return fur.regex.nickname.test(this.nickname)
    },
    Invalid () {
      return !(this.EmailState && this.PasswordState && this.RepasswordState && this.NicknameState && this.terms)
    }
  },
  data () {
    return {
      email: '',
      password: '',
      repassword: '',
      nickname: '',
      emailTaken: false,
      nicknameTaken: false,
      terms: false,
      showPassword: false,
      success: false,
      emailCheckCancelToken: undefined,
      nicknameCheckCancelToken: undefined
    }
  }
}
</script>

<style scoped>
form {
  width: 400px;
  max-width: 100%;
  margin: auto;
}
</style>
