
class UserInfo {
  static get (args) {
    return {
      id: args.id,
      permission: args.id === '2'
    }
  }

  static getIp (parent) {
    if (parent.permission) return '9.9.9.9'
    return parent.id
  }

  static getTime () {
    return 'time'
  }
}

module.exports = {
  UserInfo
}
