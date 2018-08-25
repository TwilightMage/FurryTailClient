<template>
    <div>
      <div v-if="success">
        Регистрация почти завершена. На указанный email было отправлено письмо с дальнейшими инструкциями.
      </div>
      <div v-else>
        <b-form @submit="Submit">
          <b-form-group description="Ваш адрес электронной почты." label="Email" :invalid-feedback="EmailInvalid" :valid-feedback="EmailValid" :state="EmailState">
            <b-form-input required type="email" :state="EmailState" v-model.trim="email" @change="EmailInput" placeholder="Введите Email"></b-form-input>
          </b-form-group>
          <b-form-group description="Придумайте уникальный пароль." label="Пароль" :invalid-feedback="PasswordInvalid" :valid-feedback="PasswordValid" :state="PasswordState">
            <b-input-group>
              <b-form-input required :type="PasswordType" :state="PasswordState" v-model.trim="password" placeholder="Введите пароль"></b-form-input>
              <b-button slot="append" exact @click="TogglePassword">
                <font-awesome-icon v-if="showPassword" icon="eye" />
                <font-awesome-icon v-else icon="eye-slash" />
              </b-button>
            </b-input-group>
            <div class="strength" :str="PasswordStrength">
              <div class="strength_bar"></div>
              <div class="strength_measures">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </b-form-group>
          <b-form-group description="Эта процедура позволит быстрее запомнить свой пароль." label="Подтверждение пароля" :invalid-feedback="RepasswordInvalid" :valid-feedback="RepasswordValid" :state="RepasswordState">
            <b-form-input required type="password" :state="RepasswordState" v-model.trim="repassword" placeholder="Повторите пароль"></b-form-input>
          </b-form-group>
          <b-form-group label="Имя" description="Ваше имя на сайте. Оно должно быть уникальным." :invalid-feedback="NameInvalid" :valid-feedback="NameValid" :state="NameState">
            <b-form-input required type="text" :state="NameState" v-model.trim="name" @change="NameInput" placeholder="Введите имя"></b-form-input>
          </b-form-group>
          <b-form-checkbox v-model="terms" required>Я принимаю <b-link>правила сообщества</b-link></b-form-checkbox>
          <!--div class="g-recaptcha" data-sitekey="6Lc0vGsUAAAAAMfdyq0kaADtwMS3ANddoQai0MvP"></div-->
          <b-button :disabled="Invalid" block type="submit" variant="primary">Зарегистрироваться</b-button>
        </b-form>
      </div>
    </div>
</template>

<script>
import fur from '../../fur'
import axios from 'axios'
import Zxcvbn from 'zxcvbn'

export default {
  name: 'Signup',
  methods: {
    Submit () {
      var vue = this
      axios.post('api/signup', {email: this.email, password: this.password, name: this.name, terms: this.terms}).then(function (response) {
        vue.success = response.data.success
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
        }).then(function (response) {
          vue.emailTaken = response.data.success
        })
      }
    },
    NameInput () {
      if (fur.regex.name.test(this.name)) {
        var vue = this
        if (this.nameCheckCancelToken) this.nameCheckCancelToken()
        axios.post('api/checkname', {name: this.name}, {
          cancelToken: new axios.CancelToken(function (token) {
            vue.nameCheckCancelToken = token
          })
        }).then(function (response) {
          vue.nameTaken = response.data.success
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
      else if (this.email === '') return null
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
      if (this.password === '') return null
      else return fur.regex.password.test(this.password)
    },
    PasswordType () {
      return this.showPassword ? 'text' : 'password'
    },
    PasswordStrength () {
      var info = new Zxcvbn(this.password)
      return info.score
    },
    RepasswordInvalid () {
      return 'Пароли не совпадают'
    },
    RepasswordValid () {
      return 'Пароли совпадают'
    },
    RepasswordState () {
      if (this.repassword === '') return null
      else return this.password === this.repassword
    },
    NameInvalid () {
      if (this.nameTaken) return 'Это имя уже занято'
      else if (this.name.length < 3) return 'Имя должно содержать не менее 3 символов'
      else if (this.name.length > 25) return 'Имя не должно содержать более 25 символов'
    },
    NameValid () {
      return 'Имя введено корректно'
    },
    NameState () {
      if (this.nameTaken) return false
      else if (this.name === '') return null
      else return fur.regex.name.test(this.name)
    },
    Invalid () {
      return !(this.EmailState && this.PasswordState && this.RepasswordState && this.NameState && this.terms)
    }
  },
  data () {
    return {
      email: '',
      password: '',
      repassword: '',
      name: '',
      emailTaken: false,
      nameTaken: false,
      terms: false,
      showPassword: false,
      success: false,
      emailCheckCancelToken: undefined,
      nameCheckCancelToken: undefined
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
  .strength {
    margin-top: 5px;
    border: 1px solid grey;
    border-radius: 0.25rem;
    height: 0.5rem;
    overflow: hidden;
    position: relative;
  }
  .strength > .strength_bar {
    height: 100%;
    transition: width ease 0.15s;
  }
  .strength[str='0'] .strength_bar {
    width: 20%;
    background: #ff162d;
  }
  .strength[str='1'] .strength_bar {
    width: 40%;
    background: orangered;
  }
  .strength[str='2'] .strength_bar {
    width: 60%;
    background: coral;
  }
  .strength[str='3'] .strength_bar {
    width: 80%;
    background: yellow;
  }
  .strength[str='4'] .strength_bar {
    width: 100%;
    background: greenyellow;
  }
  .strength > .strength_measures {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
  }
  .strength > .strength_measures > div {
    flex-grow: 1;
    height: 100%;
  }
  .strength > .strength_measures > div:not(:last-child) {
    border-right: 1px solid grey;
  }
  .g-recaptcha > div {
    width: auto;
    margin: auto;
  }
</style>
