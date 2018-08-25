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
  cookie: {
    Get (name, defaultValue) {
      var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')

      if (results) return decodeURIComponent(results[2])
      else return defaultValue
    },
    Set (name, value, lifetime, path, domain, secure) {
      var cookieString = name + '=' + encodeURIComponent(value)

      var expires = new Date()
      if (lifetime) expires.setSeconds(expires.getSeconds() + lifetime)
      else expires.setSeconds(expires.getSeconds() + 60 * 60 * 24 * 365)

      cookieString += '; expires=' + expires.toGMTString()
      if (path) cookieString += '; path=' + encodeURIComponent(path)
      if (domain) cookieString += '; domain=' + encodeURIComponent(domain)
      if (secure) cookieString += '; secure'

      document.cookie = cookieString
    },
    Remove (name) {
      var expires = new Date()
      document.cookie = name += '=; expires=' + expires.toGMTString()
    }
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
    name: /^.{3,25}$/
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
