<template>
    <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider
            :trigger="null"
            v-model="collapsed"
            collapsible
            :style='style'
        >
            <div class="logo">
                <!-- <img style="width:34px;height:34px;" src="../../assets/icon.jpeg"> -->
                <!-- <a-icon type="desktop" /> -->
                <a href="/">
                    <span :class="schoolName.length > 9?'nameTitle':'nameTitle1'">{{schoolName}}</span>
                </a>
            </div>
            <div>
                <template>
                    <!-- :defaultOpenKeys="defaultOpenKeys" -->
                    <a-menu
                        :defaultSelectedKeys="defaultSelectedKeys"
                        mode="inline"
                        theme="dark"
                        :inlineCollapsed="collapsed"
                        :openKeys="openKeys"
                        @select="oPChange"
                        @openChange="onOpenChange"
                    >
                        <template v-for="(menu,index) in menuData">
                            <a-menu-item
                                v-if="!menu.children"
                                :key="menu.id"
                                @click="clickKey(menu.path)"
                            >
                                <a-icon :type="menu.types" />
                                <span>{{menu.menuTitle}}</span>
                            </a-menu-item>
                            <a-sub-menu
                                v-else
                                :key="menu.id"
                            >
                                <span slot="title">
                                    <span slot="title">
                                        <a-icon :type="menu.types" />
                                        <span>{{menu.menuTitle}}</span>
                                    </span>
                                </span>
                                <a-menu-item
                                    v-for="submenu in menu.children"
                                    :key="submenu.path"
                                    @click="clickKey(submenu.path)"
                                >{{submenu.subMenuTitle}}</a-menu-item>
                            </a-sub-menu>
                        </template>
                    </a-menu>
                </template>
            </div>
        </a-layout-sider>
        <a-layout :style="styles">
            <a-layout-header :style="styleHerder">
                <a-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="minWidth:560px;"
                >
                    <a-col :span="4">
                        <a-icon
                            class="trigger"
                            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                            @click="toggleCollapsed"
                        />
                    </a-col>
                    <a-col
                        :span="12"
                        style="minWidth:400px;"
                    >
                        <ul class="h_right">
                            <li
                                style="position: relative;"
                                class="mxInfoTitle"
                            >
                                <a-badge>
                                    <!--  :count="9" -->
                                    <a-icon
                                        class="icons"
                                        type="bell"
                                    />
                                </a-badge>
                                <!-- <div class="header_text">消息通知</div> -->
                                <!-- <a-dropdown placement="bottomRight"> -->
                                <!-- <div class="header_text">消息通知</div> -->
                                <a-dropdown
                                    placement="bottomRight"
                                    v-model="visible"
                                >
                                    <div class="header_text">消息通知</div>
                                    <div
                                        slot="overlay"
                                        style="background: #fff;box-shadow: 0px 0px 8px 0px #ccc;"
                                    >
                                        <a-tabs
                                            style="width:310px;borderBottom:1px solid #ccc;padding:0 10px;"
                                            defaultActiveKey="1"
                                            :tabPosition="mode"
                                        >
                                            <a-tab-pane
                                                tab="通知(1)"
                                                key="1"
                                                @click="handleMenuClick"
                                            >
                                                <a-menu>
                                                    <a-menu-item
                                                        v-for="(item,index) in 4"
                                                        v-if="hearderList.length > 0"
                                                        :key="index"
                                                        @click="handleClick()"
                                                        style="height:75px;borderBottom:1px solid #ccc;"
                                                    >
                                                        <div
                                                            class="mxInfoOne"
                                                            @click="mxShowInfo"
                                                        >
                                                            <a-badge
                                                                :count="index"
                                                                dot
                                                            >
                                                                <img
                                                                    style="width: 44px;height: 44px;border-radius: 50%;"
                                                                    src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                                                    alt=""
                                                                >
                                                            </a-badge>
                                                            <div style="marginLeft:20px;">
                                                                <p style="margin:-12px;">申请关联上级成功</p>
                                                                <p style="margin:-12px;"><span>2018-09-06</span>&nbsp;&nbsp;<span>18:32</span></p>
                                                            </div>
                                                        </div>
                                                    </a-menu-item>
                                                    <a-menu-item v-if="hearderList.length <= 0">
                                                        <div style="textAlign:center;width:100%;">暂无未查看通知</div>
                                                    </a-menu-item>
                                                    <a-menu-item>
                                                        <div
                                                            @click="mxShowAll"
                                                            style="textAlign:center;width:100%;"
                                                        >
                                                            <p style="margin:0;">查看全部&nbsp;
                                                                <a-icon type="right" />
                                                            </p>
                                                        </div>
                                                    </a-menu-item>
                                                </a-menu>
                                            </a-tab-pane>
                                            <a-tab-pane
                                                tab="审核"
                                                key="2"
                                                @click="handleMenuClick"
                                            >
                                                <a-menu>
                                                    <a-menu-item
                                                        v-for="(item,index) in 4"
                                                        v-if="hearderList.length > 0"
                                                        :key="index"
                                                        @click="handleClick()"
                                                        style="height:75px;borderBottom:1px solid #ccc;"
                                                    >
                                                        <div
                                                            class="mxInfoOne"
                                                            @click="mxShowInfo"
                                                        >
                                                            <a-badge
                                                                :count="index"
                                                                dot
                                                            >
                                                                <img
                                                                    style="width: 44px;height: 44px;border-radius: 50%;"
                                                                    src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                                                    alt=""
                                                                >
                                                            </a-badge>
                                                            <div style="marginLeft:20px;">
                                                                <p style="margin:-12px;">申请关联上级成功</p>
                                                                <p style="margin:-12px;"><span>2018-09-06</span>&nbsp;&nbsp;<span>18:32</span></p>
                                                            </div>
                                                        </div>
                                                    </a-menu-item>
                                                    <a-menu-item v-if="hearderList.length <= 0">
                                                        <div style="textAlign:center;width:100%;">暂无未查看通知</div>
                                                    </a-menu-item>
                                                    <a-menu-item>
                                                        <div
                                                            @click="mxShowAll"
                                                            style="textAlign:center;width:100%;"
                                                        >
                                                            <p style="margin:0;">查看全部&nbsp;
                                                                <a-icon type="right" />
                                                            </p>
                                                        </div>
                                                    </a-menu-item>
                                                </a-menu>
                                            </a-tab-pane>
                                            <a-tab-pane
                                                tab="公告"
                                                key="3"
                                                @click="handleMenuClick"
                                            >
                                                <a-menu>
                                                    <a-menu-item
                                                        v-for="(item,index) in 4"
                                                        v-if="hearderList.length > 0"
                                                        :key="index"
                                                        @click="handleClick()"
                                                        style="height:75px;borderBottom:1px solid #ccc;"
                                                    >
                                                        <div
                                                            class="mxInfoOne"
                                                            @click="mxShowInfo"
                                                        >
                                                            <a-badge
                                                                :count="index"
                                                                dot
                                                            >
                                                                <img
                                                                    style="width: 44px;height: 44px;border-radius: 50%;"
                                                                    src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                                                    alt=""
                                                                >
                                                            </a-badge>
                                                            <div style="marginLeft:20px;">
                                                                <p style="margin:-12px;">申请关联上级成功</p>
                                                                <p style="margin:-12px;"><span>2018-09-06</span>&nbsp;&nbsp;<span>18:32</span></p>
                                                            </div>
                                                        </div>
                                                    </a-menu-item>
                                                    <a-menu-item v-if="hearderList.length <= 0">
                                                        <div style="textAlign:center;width:100%;">暂无未查看通知</div>
                                                    </a-menu-item>
                                                    <a-menu-item>
                                                        <div
                                                            @click="mxShowAll"
                                                            style="textAlign:center;width:100%;"
                                                        >
                                                            <p style="margin:0;">查看全部&nbsp;
                                                                <a-icon type="right" />
                                                            </p>
                                                        </div>
                                                    </a-menu-item>
                                                </a-menu>
                                            </a-tab-pane>
                                        </a-tabs>
                                    </div>

                                </a-dropdown>
                                <!-- <a-menu slot="overlay"> -->
                                <!-- <div class="mx_mains"> -->

                                <!-- </div> -->
                                <!-- </a-menu> -->
                                <!-- </a-dropdown> -->
                            </li>
                            <li>
                                <a-icon
                                    class="icons"
                                    type="question-circle"
                                />
                                <!-- <div class="header_text">帮助中心</div> -->
                                <a-dropdown placement="bottomRight">
                                    <div class="header_text">帮助中心</div>
                                    <a-menu
                                        slot="overlay"
                                        style="padding:22px 30px;"
                                    >
                                        <a-menu-item>
                                            <router-link to="/mx_feedBack">意见反馈</router-link>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <router-link to="/mx_contactUs">联系我们</router-link>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <!-- <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="http://www.tmall.com/"
                                            >系统版本</a> -->
                                            <div>
                                                <p style="margin:0;">系统版本</p>
                                                <p style="margin:0;">V1.0</p>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </li>
                            <li>
                                <img src="../../assets/logo.png" />
                                <a-dropdown placement="bottomRight">
                                    <div class="header_textUser">
                                        <div class="header_text">{{userVip}}-</div>
                                        <div>{{userName}}</div>
                                        <a-icon
                                            class="icon_bom"
                                            type="caret-down"
                                        />
                                    </div>
                                    <a-menu
                                        slot="overlay"
                                        style="padding:15px 20px;"
                                    >
                                        <a-menu-item>
                                            <div style="display: flex;align-items: center;padding:20px 0 20px 10px;borderBottom:1px solid #ccc;">
                                                <img
                                                    style="width:44px;height:44px;border-radius: 50%;marginRight:20px;"
                                                    src="http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg"
                                                    alt=""
                                                >
                                                <div>
                                                    <p style="margin:0;width:100%;textAlign:center;border:1px solid #ccc;border-radius:5px;">{{userVip}}</p>
                                                    <!-- <p style="margin:0;width:100%;textAlign:center;border:1px solid #ccc;border-radius:5px;">超级管理员</p> -->
                                                    <!-- <p style="margin:0;width:100%;textAlign:center;border:1px solid #ccc;border-radius:5px;">王阿航</p> -->
                                                    <p style="margin:0;">账号：{{userName}}</p>
                                                </div>
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item>
                                            <!-- <div> -->

                                            <router-link
                                                v-if="!isSvip"
                                                to="/mx_personal"
                                            >
                                                <a-icon
                                                    style="margin: 0 30px 0 20px;"
                                                    type="user"
                                                />
                                                <span>个人中心</span>
                                            </router-link>
                                            <div v-if="isSvip">
                                                <a-icon
                                                    style="margin: 0 30px 0 20px;"
                                                    type="form"
                                                />
                                                <span @click="mxUpdata">修改密码</span>
                                                <a-modal
                                                    title="修改密码"
                                                    centered
                                                    :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                    v-model="isUpdata"
                                                >
                                                    <div class="mx_model">
                                                        <div class="mx_model_mainDel">
                                                            <a-form :form="form">
                                                                <a-form-item
                                                                    style="display: flex;"
                                                                    label="原密码："
                                                                    :label-col="{ span: 6 }"
                                                                    :wrapper-col="{ span: 12 }"
                                                                >
                                                                    <a-input
                                                                        style="width:240px;"
                                                                        v-decorator="[
                                                                            '原密码：',
                                                                            {rules: [{ required: true, message: '请输入原密码' }]}
                                                                        ]"
                                                                        placeholder="请输入原密码"
                                                                    />
                                                                </a-form-item>
                                                                <a-form-item
                                                                    style="display: flex;"
                                                                    label="新密码："
                                                                    :label-col="{ span: 6 }"
                                                                    :wrapper-col="{ span: 12 }"
                                                                >
                                                                    <a-input
                                                                        style="width:240px;"
                                                                        v-decorator="[
                                                                            '新密码：',
                                                                            {rules: [{ required: true, message: '请输入新密码' }]}
                                                                        ]"
                                                                        placeholder="请输入新密码"
                                                                    />
                                                                </a-form-item>
                                                                <a-form-item
                                                                    style="display: flex;"
                                                                    label="再次确认："
                                                                    :label-col="{ span: 6 }"
                                                                    :wrapper-col="{ span: 12 }"
                                                                >
                                                                    <a-input
                                                                        style="width:240px;"
                                                                        v-decorator="[
                                                                            '再次确认：',
                                                                            {rules: [{ required: true, message: '请再次输入确认' }]}
                                                                        ]"
                                                                        placeholder="请再次输入确认"
                                                                    />
                                                                </a-form-item>
                                                            </a-form>
                                                        </div>
                                                    </div>
                                                    <template slot="footer">
                                                        <a-button
                                                            key="back"
                                                            @click="mxUpdataCel"
                                                        >取 消</a-button>
                                                        <a-button
                                                            key="submit"
                                                            type="primary"
                                                            @click="mxUpdataOk"
                                                        >
                                                            确定
                                                        </a-button>
                                                    </template>
                                                </a-modal>
                                            </div>
                                            <!-- </div> -->

                                        </a-menu-item>
                                        <a-menu-item>
                                            <div style="display: flex;align-items: center;paddingLeft:20px;">
                                                <a-icon
                                                    style="marginRight:30px;"
                                                    type="poweroff"
                                                />
                                                <p
                                                    style="margin:0;"
                                                    @click="mxExit"
                                                >退出登录</p>
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </a-dropdown>
                            </li>
                        </ul>
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout-content :style="{ margin: '90px 16px', padding: '24px', background: '#fff', minWidth:'1170px',overflowY: 'auto' }">
                <router-view />
            </a-layout-content>
            <a-layout-footer style="textAlign: center">
                <p>{{hostSamily}}</p>
                <p v-html="this.hostSamilyInfo"></p>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
export default {
    data() {
        return {
            screenWidths: '',
            collapsed: false,
            hearderList: [{
                num: 1
            }],
            rootSubmenuKeys: ["2", "3", "4", "6", "8", "9", "10", "11", "12", "13"],
            defaultSelectedKeys: [localStorage.getItem('cheakKey')],
            openKeys: [localStorage.getItem('openKey')],
            // defaultOpenKeys: this.openKeys,
            // 导航数据
            menuData: [
                // 系统信息
                {
                    id: "1",
                    menuTitle: "巡查面板",
                    types: "pie-chart",
                    path: "/home"
                },
                // 会员管理
                {
                    id: "2",
                    menuTitle: "学校信息管理",
                    types: "desktop",
                    children: [
                        {
                            id: "2.1",
                            path: "/mx_sMessage",
                            subMenuTitle: "学校信息"
                        }, {
                            id: "2.2",
                            path: "/mx_cMessage",
                            subMenuTitle: "食堂管理"
                        }, {
                            id: "2.3",
                            path: "/mx_uMessage",
                            subMenuTitle: "供应商管理"
                        },
                        //                        {
                        //                            id: "2.4",
                        //                            path: "/mx_hMessage",
                        //                            subMenuTitle: "上级信息"
                        //                        }
                    ]
                },
                {
                    id: "3",
                    menuTitle: "学生管理",
                    types: "table",
                    children: [
                        {
                            id: "3.1",
                            path: "/mxGradeClass",
                            subMenuTitle: "年级班级"
                        },
                        {
                            id: "3.2",
                            path: "/mxAllStudents",
                            subMenuTitle: "全部学生"
                        }
                    ]
                },
                {
                    id: "4",
                    menuTitle: "食堂管理",
                    types: "profile",
                    children: [
                        {
                            id: "4.1",
                            path: "/mxEmployeeInfo",
                            subMenuTitle: "员工信息"
                        },
                        {
                            id: "4.2",
                            path: "/mxTimeTag",
                            subMenuTitle: "考勤记录"
                        },
                        {
                            id: "4.3",
                            path: "/mxWarehouseMngmt",
                            subMenuTitle: "仓库管理"
                        }
                    ]
                }, {
                    id: "5",
                    menuTitle: "营养食谱",
                    types: "pie-chart",
                    path: "/mxCkBook"
                }, {
                    id: "6",
                    menuTitle: "安全卫生",
                    types: "check-circle",
                    children: [
                        {
                            id: "6.1",
                            path: "/mxMealRecord",
                            subMenuTitle: "每餐记录"
                        },
                        {
                            id: "6.2",
                            path: "/mxDailyRecord",
                            subMenuTitle: "每日记录"
                        },
                        {
                            id: "6.3",
                            path: "/mxOtherRecord",
                            subMenuTitle: "其他记录"
                        },
                        {
                            id: "6.4",
                            path: "/mxPhotoGallery",
                            subMenuTitle: "照片库"
                        }
                    ]
                }, {
                    id: "7",
                    menuTitle: "采购计划",
                    types: "pie-chart",
                    path: "/mxPurchase"
                }, {
                    id: "8",
                    menuTitle: "食材选购",
                    types: "check-circle",
                    children: [
                        {
                            id: "8.1",
                            path: "/mxProcure",
                            subMenuTitle: "在线采购"
                        }, {
                            id: "8.2",
                            path: "/mxOrder",
                            subMenuTitle: "采购订单"
                        }, {
                            id: "8.3",
                            path: "/mxVoucher",
                            subMenuTitle: "结算凭证"
                        }
                    ]
                }, {
                    id: "9",
                    menuTitle: "食材库管理",
                    types: "check-circle",
                    children: [
                        {
                            id: "9.1",
                            path: "/mxIntoLibrary",
                            subMenuTitle: "入库"
                        }, {
                            id: "9.2",
                            path: "/mxOutLibrary",
                            subMenuTitle: "出库"
                        }, {
                            id: "9.3",
                            path: "/mxFoodLibrary",
                            subMenuTitle: "食材库"
                        }, {
                            id: "9.4",
                            path: "/mxInventory",
                            subMenuTitle: "库存盘点"
                        }
                    ]
                }, {
                    id: "10",
                    menuTitle: "过期预警",
                    types: "warning",
                    children: [
                        {
                            id: "10.1",
                            path: "/mxWlist",
                            subMenuTitle: "预警列表"
                        }, {
                            id: "10.2",
                            path: "/mxWset",
                            subMenuTitle: "预警设置"
                        }
                    ]
                }, {
                    id: "11",
                    menuTitle: "权限管理",
                    types: "warning",
                    children: [
                        {
                            id: "11.1",
                            path: "/mxJuser",
                            subMenuTitle: "用户权限"
                        }, {
                            id: "11.2",
                            path: "/mxJpost",
                            subMenuTitle: "职位权限"
                        }
                    ]
                }, {
                    id: "12",
                    menuTitle: "通知公告",
                    types: "warning",
                    children: [
                        {
                            id: "12.1",
                            path: "/mxMessage",
                            subMenuTitle: "通知公告"
                        }
                    ]
                }, {
                    id: "13",
                    menuTitle: "数据统计",
                    types: "warning",
                    children: [
                        {
                            id: "13.1",
                            path: "/mxStatistics",
                            subMenuTitle: "数据面板"
                        }
                    ]
                }


            ],
            style: "minWidth:258px;box-shadow: 2px 0 6px rgba(0,21,41,.35);position:fixed; left: 0;height:100%;overflowY: auto;z-index:1000;",
            styles: "marginLeft: 258px;overflowX: auto",
            styleHerder: "background: #fff; padding: 0;minWidth:1200px;position:fixed;top:0;z-index:100;",
            screenWidth: document.body.clientWidth,
            isUpdata: false,
            form: this.$form.createForm(this),
            isSvip: false,
            visible: false,
            mode: 'top',
            schoolName: '',
            hostSamily: 'Ant Design ©2018 Created by Ant UED',
            hostSamilyInfo: '',
            userName: '',
            userVip: '',
        };
    },
    mounted() {
        window.screenWidth = document.body.clientWidth;
        this.screenWidths = window.screenWidth - 258;
        this.styleHerder = "background: #fff; padding: 0;width:" + this.screenWidths + "px;position:fixed;top:0;z-index:100;"
        this.userName = JSON.parse(localStorage.getItem('userInfo')).username
        const that = this
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }
        let data = {
            url: 'api/school',
            method: 'get',
            data: {},
        };
        this.$apiAxiox(data).then((res) => {
            if (res.data.code == 0) {
                localStorage.setItem('sKey', res.data.data.invita_code)
                this.schoolName = res.data.data.config.base.title;
                localStorage.setItem('schoolName', res.data.data.title);
                this.hostSamily = res.data.data.config.base.copyright.cn;
                this.hostSamilyInfo = res.data.data.config.base.copyright.en;
                this.userVip = res.data.data.role.name;
            }
        })
    },
    watch: {
        screenWidth(val) {
            this.screenWidth = val
            let widthherder;
            this.styleHerder = "background: #fff; padding: 0;width:" + widthherder + "px;position:fixed;top:0;z-index:100;"
            if (val <= "1400") {
                this.style = "minWidth:80px;box-shadow: 2px 0 6px rgba(0,21,41,.35);position:fixed; left: 0;height:100%;overflowY: auto;z-index:1000;";
                this.collapsed = true;
                this.openKeys = [];
                this.styles = "marginLeft: 80px;overflowX: auto";
                widthherder = val - 80 + 17;
                this.styleHerder = "background: #fff; padding: 0;width:" + widthherder + "px;position:fixed;top:0;z-index:100;"
            } else {
                this.style = "minWidth:258px;box-shadow: 2px 0 6px rgba(0,21,41,.35);position:fixed; left: 0;height:100%;overflowY: auto;z-index:1000;";
                this.collapsed = false;
                this.openKeys = [localStorage.getItem('openKey')];
                this.styles = "marginLeft: 258px;overflowX: auto"
                widthherder = val - 258 + 17;
                this.styleHerder = "background: #fff; padding: 0;width:" + widthherder + "px;position:fixed;top:0;z-index:100;"
            }
        }
    },
    methods: {
        oPChange(val) {
            this.defaultSelectedKeys = val.selectedKeys;
            localStorage.setItem('cheakKey', val.selectedKeys);
        },
        toggleCollapsed() {
            let widthherder;
            this.collapsed = !this.collapsed;
            if (this.collapsed == true) {
                this.style = "minWidth:80px;box-shadow: 2px 0 6px rgba(0,21,41,.35);position:fixed; left: 0;height:100%;overflowY: auto;z-index:1000;";
                this.styles = "marginLeft: 80px;overflowX: auto";
                widthherder = this.screenWidth - 80 + 17;
                this.styleHerder = "background: #fff; padding: 0;width:" + widthherder + "px;position:fixed;top:0;z-index:100;"
            } else {
                this.style = "minWidth:258px;box-shadow: 2px 0 6px rgba(0,21,41,.35);position:fixed; left: 0;height:100%;overflowY: auto;z-index:1000;";
                this.styles = "marginLeft: 258px;overflowX: auto";
                widthherder = this.screenWidth - 258 + 17;
                this.styleHerder = "background: #fff; padding: 0;width:" + widthherder + "px;position:fixed;top:0;z-index:100;"
            }
            if (this.collapsed) {
                this.openKeys = [];
            } else {
                this.openKeys = [localStorage.getItem('openKey')];
            }
        },
        onOpenChange(openKeys) {
            // console.log(openKeys);
            let num = openKeys.length > 1 ? openKeys[1] : openKeys[0];

            localStorage.setItem('openKey', num);

            const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                if (openKeys.length > 1) {
                    openKeys.splice(0, 1)
                }
                this.openKeys = openKeys
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : []
            }
        },
        // callback(key) {
        //     console.log(key)
        // },
        handleMenuClick(e) {
            // if (e.key === '3') {
            this.visible = false
            // }
        },
        handleClick() {
            this.visible = false
        },
        // clicki(i) {
        //   alert(i);
        // },
        clickKey(key) {
            // console.log(key);
            location.hash = key;
            // alert(key);
            // console.log(location.hash);
        },
        // 意见反馈
        // mxFeedBack(){
        //     console.log(123)
        // },
        // 修改密码
        mxUpdata() {
            this.isUpdata = true;
        },
        mxUpdataCel() {
            this.isUpdata = false;
        },
        mxUpdataOk() {
            this.form.validateFields(
                (err) => {
                    if (!err) {
                        this.isUpdata = false;
                        this.$message.success('密码修改成功');
                    }
                },
            );
        },
        // 退出登陆
        mxExit() {
            this.$router.push({ path: '/' })
            localStorage.removeItem("cheakKey");
            localStorage.removeItem("openKey");
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('schoolName')
        },
        // 消息通知
        // 查看信息
        mxShowInfo() {
            this.$router.push({ path: '/mx_InfoPage' })
        },
        // 查看全部
        mxShowAll() {
            this.visible = false
            this.$router.push({ path: '/mx_showAll' })
            // document.querySelector(".mxSeleMenu").style.display = "none";
        },
        //获取路由
        getPath() {
            let that = this;
            let menus = [];
            let tow_menus_ids = [];

            this.$apiAxiox({
                url: 'api/school/menus',
                method: 'get',
            }).then((res) => {
                if (res.data.code === "0") {
                    //  自定义菜单结构
                    let result_menus = res.data.data;

                    result_menus.forEach(function (menu, x) {
                        x++;
                        //  格式化二级菜单 1.1
                        let children = [];
                        if (typeof menu.children !== "undefined") {
                            let i = 0;
                            menu.children.forEach(function (child) {
                                //  TODO 需要放弃三级菜单
                                child.id = x + '.' + (++i);
                                //  变更名称
                                child.subMenuTitle = child.menuTitle;
                                children.push(child);
                            });
                        }
                        //  一级处理路由
                        if (children.length > 0) {
                            menu.children = children;
                            tow_menus_ids.push(menu.id);
                        }
                        //  处理空路由
                        if (menu.path === "") {
                            delete menu.path
                        };

                        menu.id = x + "";

                        menus.push(menu);
                    });

                    //  菜单 menuData
                    that.menuData = menus;

                    //  标记二级 rootSubmenuKeys
                    that.rootSubmenuKeys = tow_menus_ids;
                } else {
                    //  提示菜单加载失败
                }
            });
        }
    },
    created() {
        //调用获取路由
        // this.getPath();
    }
};
</script>
<style lang="less">
.nameTitle {
    font-size: 15px;
}
.nameTitle1 {
    font-size: 18px;
}
.mxInfoOne {
    cursor: pointer;
    padding: 18px 0;
    display: flex;
    box-sizing: border-box;
    // align-items: center;
}

.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
}
.mx_model_mainDel {
    line-height: 160px;
}
// 下拉菜单
.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
    color: #02bb72;
}
.ant-menu-item-selected {
    color: #02bb72;
}

.ant-menu-dark .ant-menu-submenu-selected {
    color: #02bb72;
}
.ant-menu-item:active,
.ant-menu-submenu-title:active {
    background: rgba(2, 187, 114, 0.3);
}
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
    border-right: 0;
}

#components-layout-demo-custom-trigger {
    min-height: 100%;
}
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}
/* 
#components-layout-demo-custom-trigger .trigger:hover {
  background: #02bb72;
} */
.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background: #02bb72;
}
#components-layout-demo-custom-trigger .logo {
    height: 42px;
    /* background: rgba(255, 255, 255, 0.2); */
    overflow: hidden;
    margin: 12px;
    padding-left: 10px;
    line-height: 42px;
}
#components-layout-demo-custom-trigger .logo img {
    width: 32px;
    height: 32px;
}
#components-layout-demo-custom-trigger .logo a {
    color: #fff;
    font-size: 20px;
}
.h_right {
    list-style: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.h_right li {
    display: flex;
    align-items: center;
}
.h_right li .icons {
    font-size: 20px;
}
.h_right li img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
.header_textUser {
    display: flex;
    align-items: center;
}
.header_text {
    margin-left: 8px;
}
.icon_bom {
    color: #aaa;
    margin-left: 8px;
}
.ant-upload-list-text {
    display: none;
}
.ant-pagination-total-text {
    position: absolute;
    left: 0;
    bottom: -50px;
}
/* 模态框 */
.ant-modal-header {
    border-bottom: 0;
}
.ant-modal-title {
    color: #000;
    font-size: 18px;
    font-weight: bold;
}
.ant-modal-footer {
    border-top: 0;
    padding: 10px 16px 20px;
}
/* 全局主题颜色 */
/* 按钮背景色 */
.mx_btnbg {
    background: #02bb72;
    color: #fff;
}
/* 按钮hover和焦点 */
.mx_btnbg:hover,
.mx_btnbg:focus {
    background: #02bb72;
    color: #fff;
    border-color: #02bb72;
}
/* 字体颜色 */
.mx_color,
.mx_color:hover {
    color: #02bb72;
}
/* input */
.ant-input:focus,
.ant-input:hover,
.ant-select-selection:hover,
.ant-select-selection:focus,
.ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
    border-color: #02bb72;
}
/* .ant-select-selection {
  border-color: #02bb72;
} */
/* 下拉框 */
.ant-select-dropdown-menu-item:hover,
.ant-select-dropdown-menu-item-active {
    background-color: rgba(2, 187, 114, 0.4);
}
.ant-select-focused .ant-select-selection,
.ant-select-selection:focus,
.ant-select-selection:active {
    border-color: #02bb72;
}
/* 分页 */
.ant-pagination-item-active,
.ant-pagination-item-active:hover,
.ant-pagination-item:focus,
.ant-pagination-item:hover {
    border-color: #02bb72;
}
.ant-pagination-item-active a,
.ant-pagination-item:hover a,
.ant-pagination-item-active:focus a {
    color: #02bb72;
}
a.ant-pagination-item-link:hover {
    border-color: #02bb72;
    color: #02bb72;
}
.ant-pagination-prev:focus .ant-pagination-item-link,
.ant-pagination-next:focus .ant-pagination-item-link,
.ant-pagination-prev:hover .ant-pagination-item-link,
.ant-pagination-next:hover .ant-pagination-item-link {
    border-color: #02bb72;
    color: #02bb72;
}
.ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-link-icon,
.ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-link-icon {
    color: #02bb72;
}
.ant-pagination-options-quick-jumper input:hover,
.ant-pagination-options-quick-jumper input:focus {
    border-color: #02bb72;
}
/* 按钮 */
.ant-btn-primary {
    border-color: #02bb72;
    background: #02bb72;
    color: #fff;
}
.ant-btn-primary:hover,
.ant-btn-primary:focus {
    border-color: #02bb72;
    background: #02bb72;
    color: #fff;
}
.ant-btn-default:hover,
.ant-btn-default:focus {
    border-color: #02bb72;
    color: #02bb72;
}
.ant-btn-background-ghost.ant-btn-primary,
.ant-btn-background-ghost.ant-btn-primary:hover,
.ant-btn-background-ghost.ant-btn-primary:focus {
    color: #02bb72;
    border-color: #02bb72;
}
/* 上传框颜色 */
.ant-upload.ant-upload-select-picture-card:hover {
    border-color: #02bb72;
}
.ant-table-row.ant-table-row-level-0:hover {
    background: rgba(2, 187, 114, 0.6);
}

.ant-form-item-children {
    display: flex;
}
/* tab选项卡 */
.ant-tabs-bar {
    border-bottom: 0;
}
.ant-tabs-nav .ant-tabs-tab-active {
    color: #02bb72;
}
.ant-tabs-nav .ant-tabs-tab:hover {
    color: #02bb72;
}
.ant-tabs-ink-bar {
    background-color: #02bb72;
}
/* 开关 */
.ant-switch-checked {
    background-color: #02bb72;
}
/* 多选框 */
.ant-checkbox-checked .ant-checkbox-inner {
    background-color: #02bb72;
    border-color: #02bb72;
}
.ant-checkbox-wrapper:hover .ant-checkbox-inner,
.ant-checkbox:hover .ant-checkbox-inner,
.ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #02bb72;
}
.ant-checkbox-indeterminate .ant-checkbox-inner:after {
    background-color: #02bb72;
}
/* 单选框组 */
.ant-radio-checked .ant-radio-inner {
    border-color: #02bb72;
}
.ant-radio-inner:after {
    background-color: #02bb72;
}
.ant-radio-wrapper:hover .ant-radio .ant-radio-inner,
.ant-radio:hover .ant-radio-inner,
.ant-radio-focused .ant-radio-inner {
    border-color: #02bb72;
}
/* 时间选择框 */
.ant-calendar-picker:focus .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #02bb72;
    -webkit-box-shadow: 0 0 0 2px rgba(2, 187, 114, 0.2);
    box-shadow: 0 0 0 2px rgba(2, 187, 114, 0.2);
}
.ant-time-picker-input:focus {
    border-color: #02bb72;
    -webkit-box-shadow: 0 0 0 2px rgba(2, 187, 114, 0.2);
    box-shadow: 0 0 0 2px rgba(2, 187, 114, 0.2);
}
ul {
    margin: 0;
    padding: 0;
}
ul li {
    list-style: none;
}
</style>