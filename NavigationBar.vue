<!--
* @des:  小程序自定义头部导航栏组件
* @date: 2020-02-25 14:02:20
* @version:  1.0
*
* Date                   Author               Description
* ------------------------------------------------------
* 2020-02-25             曹天笑               创建
-->
<template>
    <div>
        <div
            class="navigation-bar color-000"
            :style="{
                paddingTop: paddingTop + 'px',
                height: height + 'px',
                backgroundColor: background || barStyle.background
            }"
        >
            <!-- 首页的 -->
            <div class="isIndex box" v-if="isIndex">
                <div class="h_search">
                    <!-- <div class="icon icon_search fl"></div> -->
                    <div @click="activeBtnClick()" class="top_sort fl clearfix">
                        <span class="selected fl color-333 fontbold">{{ activeTitle }}</span>
                        <!-- 箭头方向加active -->
                        <span
                            class="icon icon_arrow fl"
                            :class="active ? 'active' : ''"
                        ></span>
                    </div>
                    <div v-if="active" class="select_box color-333 f36">
                        <div @click="squareBtnClick('广场')" class="option">广场</div>
                        <div @click="squareBtnClick('关注')" class="option">关注</div>
                    </div>
                </div>
                <div
                    class="appName"
                    :style="{
                        textAlign: barStyle.textAlign,
                        color: color || barStyle.color,
                        fontSize: barStyle.fontSize + 'px',
                        lineHeight: barStyle.height + 'px',
                        fontWeight: 'bold'
                    }"
                    >{{ appName }}
                </div>
            </div>

            <!-- 个人中心 -->
            <div class="isMine box" v-if="isMine">
                <div class="handler clearfix">
                    <navigator
                        hover-class="none"
                        url="/pages/setUserInfo/main"
                        open-type="navigate"
                        class="icon i_set"
                    >
                        <image style="width: 21px;height: 22px" src="/static/images/my_set.svg" />
                    </navigator>
                    <button class="icon i_share" hover-class="none" open-type="share">
                        <image style="width: 21px;height: 19px" src="/static/images/my_share.svg" />
                    </button>
                </div>
                <div
                    class="title"
                    v-if="title"
                    :style="{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: color || barStyle.color,
                        fontSize: barStyle.fontSize + 'px',
                        lineHeight: barStyle.height + 'px'
                    }"
                >
                    {{ title }}
                </div>
            </div>

            <div class="box" v-if="!isIndex && !isMine">
                <div class="">
                    <div
                        class="goback"
                        @click="goBack(title)"
                        v-if="showBack"
                        :style="{
                            height: barStyle.height + 'px',
                            lineHeight: barStyle.height + 'px'
                        }"
                    >
                        <image src="/static/tabs/back.svg" style="" alt="" />
                    </div>
                    <div
                        class="title"
                        v-if="title"
                        :style="{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: color || barStyle.color,
                            fontSize: barStyle.fontSize + 'px',
                            lineHeight: barStyle.height + 'px'
                        }"
                    >
                        {{ title }}
                    </div>
                    <button
                        class="icon_share"
                        v-if="showShare"
                        hover-class="none"
                        open-type="share"
                    >
                        <image src="/static/images/my_share.svg" style="" alt="" />
                    </button>
                    <div
                        class="title showCenter"
                        v-if="showAppName"
                        :style="{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: color || barStyle.color,
                            fontSize: barStyle.fontSize + 'px',
                            lineHeight: barStyle.height + 'px'
                        }"
                    >
                        {{ appName }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 填充头部fixed布局的空白 -->
        <div
            class="fixBlock"
            :style="{
                width: '100%',
                height: height + 'px'
            }"
        ></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            paddingTop: this.$StatusBar.android, // 默认为android大部分普通机型高度
            height: this.$NavigationBar.default + this.$StatusBar.android,
            barStyle: {},
            marginTop: 0,
            scale: 1,
            menuSettings: {
                height: 0
            },
            appName: this.$NavBarStyle.appName,
            active: false,
            activeTitle: '广场',
            isFromShare: false //是否是从分享内容进入
        }
    },
    props: {
        isIndex: {type: Boolean, default: false},
        isMine: {type: Boolean, default: false},
        isLogin: {type: Boolean, default: false},
        status: {type: Number, default: 1},
        title: {type: String, default: ''},
        color: {type: String, default: ''},
        background: {type: String, default: ''},
        showBack: {type: Boolean, default: false},
        showShare: {type: Boolean, default: false},
        showAppName: {type: Boolean, default: false}
    },
    computed: {
        currentPage() {
            /* eslint-disable */
            const pages = getCurrentPages()
            return pages[pages.length - 1].route
        }
    },
    onLoad(options) {
        this.isFromShare = options.isFromShare || options.scene
    },
    created() {
        const systemInfo = wx.getSystemInfoSync()
        if (this.menuSettings.height === 0) {
            this.getMenuSettings(1, 3)
        }
        this.scale = 1 - 0.5 / this.menuSettings.height
        this.marginTop = this.menuSettings.top - systemInfo.statusBarHeight
        const ratio = systemInfo.screenHeight / systemInfo.screenWidth // 高宽比例
        const isNewModel = ratio >= 2
        const isIPhone = systemInfo.model.indexOf('iPhone') >= 0
        const barHeight =
            systemInfo.statusBarHeight ||
            (isNewModel
                ? this.$StatusBar.newModel
                : isIPhone
                ? this.$StatusBar.iPhone
                : this.$StatusBar.android)
        this.paddingTop = barHeight
        this.height = barHeight + this.$NavigationBar.default
        let barStyle = {...this.$NavBarStyle}
        barStyle.height = this.$NavigationBar.default
        this.barStyle = barStyle
    },
    methods: {
        goBack: function(title) {
            this.$emit('ISsavedraft', title)
            if (title == '草稿箱') {
                wx.switchTab({
                    url: '/pages/mine/main'
                })
            } else if (title == '设置') {
                getApp().SetState = {
                    category: '',
                    Whosee: '',
                    Whocomment: '',
                    family: ''
                } //设置为原数据
                wx.navigateBack({
                    delta: 1
                })
            } else if (title == '发布') {
                wx.switchTab({
                    url: '/pages/mine/main'
                })
            }  else if (this.isFromShare) {
                wx.switchTab({
                    url: '/pages/index/main'
                })
            }else if (title != '图文') {
                wx.navigateBack({
                    delta: 1
                })
            }
        },
        getMenuSettings(current, count) {
            // let menuSettings = wx.getMenuButtonBoundingClientRect()
            let menuSettings
            try {
                menuSettings = wx.getMenuButtonBoundingClientRect
                    ? wx.getMenuButtonBoundingClientRect()
                    : null
                if (!menuSettings) {
                    throw new Error('getMenuButtonBoundingClientRect error')
                }
            } catch (err) {
                // 赋默认数值
            }
            if (menuSettings.height === 0) {
                if (current > 3) {
                    return
                }
                setTimeout(() => {
                    this.getMenuSettings(current + 1, count)
                }, 200)
            } else {
                this.menuSettings = menuSettings
            }
        },
        activeBtnClick() {
            this.active = !this.active
        },
        squareBtnClick(name) {
            this.active = false
            this.activeTitle = name
            this.$emit('activeTitle', this.activeTitle)
        }
    }
}
</script>
<style lang="less" scoped>
.navigation-bar {
    width: 100vw;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    .box {
        width: 100%;
        padding: 0 20rpx;
        position: relative;
        .appName {
            overflow: hidden;
        }
        .index_top {
            width: 100%;
            position: absolute;
            text-align: center;
        }
    }
    .isIndex {
        .h_search {
            height: 44px;
            position: absolute;
            left: 30rpx;
            top: 0;
            .icon_search {
                width: 22px;
                height: 22px;
                background: url('../assets/images/search.svg') left center no-repeat;
                background-size: 100%;
                margin-top: 10px;
            }
            .top_sort {
                // margin-left: 15px;
                height: 44px;
                .selected {
                    font-size: 19px;
                    height: 44px;
                    line-height: 44px;
                    letter-spacing: 0.73px;
                }
                .icon_arrow {
                    width: 12px;
                    height: 7px;
                    background: url('../assets/images/xiala.svg') no-repeat center;
                    background-size: 100%;
                    margin-top: 18px;
                    margin-left: 5px;
                    transition: all 0.3s linear;
                }
                .icon_arrow.active {
                    transform: rotate(180deg);
                }
            }
            .select_box {
                position: absolute;
                background: rgb(255, 255, 255);
                border: 1px solid #f8f8f8;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                z-index: 10;
                top: 44px;
                left: 0;
                .option {
                    width: 196rpx;
                    padding: 25rpx 0;
                    line-height: 36rpx;
                    text-align: center;
                    border-top: 1px solid #f8f8f8;
                }
                .option:first-child {
                    border: none;
                }
            }
        }
    }
    .isMine {
        .handler {
            height: 44px;
            position: absolute;
            left: 30rpx;
            top: 0;
            .icon {
                width: 44rpx;
                height: 88rpx;
                line-height: 88rpx;
                display: flex;
                display: -webkit-flex;
                flex-direction: column;
                justify-content: center;
                float: left;
            }
            .i_share {
                width: 80rpx;
                height: 80rpx;
                background: #fff;
                padding: 0 0;
                image {
                    transform: translateY(2px);
                }
            }
            .i_set {
                margin-right: 40rpx;
            }
        }
    }
    .goback {
        width: 80rpx;
        height: 88rpx;
        position: absolute;
        left: 30rpx;
        image {
            width: 19px;
            height: 18px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-9px);
        }
    }
    .icon_share {
        width: 80rpx;
        height: 80rpx;
        position: absolute;
        left: 60px;
        top: 0;
        background: #fff;
        image {
            width: 20px;
            height: 20px;
            position: absolute;
            left: 0;
            top: 12px;
        }
    }
}
</style>
