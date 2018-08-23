module.exports = {
  errcheck: function (err) {
    if (err) throw err
  },
  errcheckDo: function (func) {
    var errcheck = this.errcheck
    return function (err) {
      errcheck(err)
      var args = []
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      func.apply(this, args)
    }
  },
  logerr (err) {
    console.error('caught error: ', err)
  },
  sqlconf: {
    host: 'localhost',
    user: 'furry',
    password: 'ozs60LO~YNQSUbXWSVxhnzepSNHqG%zv',
    database: 'FurryTail',
    insecureAuth: true
  },
  regex: {
    email: /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    password: /^.{5,25}$/,
    nickname: /^.{3,25}$/
  },
  errors: {
    signup: {
      wrongEmail: 0,
      wrongPassword: 1,
      wrongNickname: 2,
      emailTaken: 3,
      nicknameTaken: 4,
      communityTerms: 5
    }
  },
  responce: {
    make: function (state, errors, data) {
      this.success = state
      if (errors) this.errors = errors
      if (data) this.data = data
    },
    fail: function (errors) {
      this.success = false
      if (errors) this.errors = errors
    },
    success: function (data) {
      this.success = true
      if (data) this.data = data
    }
  },
  formatDate: function (date) {
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' ' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds()
  }
}
