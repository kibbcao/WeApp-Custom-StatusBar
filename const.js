// 不同系统手机最顶部statusBar高度
const statusBar = {
    android: 24,
    iPhone: 20,
    newModel: 44 //长屏下默认高度(iphoneX带齐刘海的)
}
// 小程序默认导航栏高度
const navigationBar = {
    default: 44
}
// 小程序导航栏配置
const navBarStyle = {
    appName: '独家记忆',
    background: 'rgba(255,255,255,1)',
    color: '#000',
    textAlign: 'center',
    fontSize: 16
}

const systemInfo = wx.getSystemInfoSync()
const isIPhone = systemInfo.model.indexOf('iPhone') >= 0
const ratio = systemInfo.screenHeight / systemInfo.screenWidth // 高宽比例
const isNewModel = ratio >= 2
const barHeight =
    systemInfo.statusBarHeight ||
    (isNewModel
        ? this.$StatusBar.newModel
        : isIPhone
        ? this.$StatusBar.iPhone
        : this.$StatusBar.android)
const height = barHeight + navigationBar.default

const CONFIG = {}

CONFIG.install = function(Vue, options) {
    Vue.prototype.$StatusBar = statusBar
    Vue.prototype.$NavigationBar = navigationBar
    Vue.prototype.$NavBarStyle = navBarStyle
    Vue.prototype.$NavBarHeight = height
}

export {CONFIG}
