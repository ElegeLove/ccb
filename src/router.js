const routers = [{
        path: '/',
        name: 'login',
        component: (resolve) => require(['@/components/login/Login.vue'], resolve), //登录页面
    }, {
        path: '/register',
        name: 'register',
        component: (resolve) => require(['@/components/login/Register.vue'], resolve), //登录页面-忘记密码
    },
    {
        path: '/register-result',
        name: 'registerResult',
        component: (resolve) => require(['@/components/login/RegisterResult.vue'], resolve), //登录页面-修改密码
    },
    // 安全卫生模块 小票
    {
        path: '/mxMealRecordReceipt',
        name: 'mxMealRecordReceipt',
        component: (resolve) => require(['@/view/mx_healthSafety/mx_mealRecord/mx_mealRecordReceipt.vue'], resolve), //安全卫生 陪餐记录 小票
    },
    {
        path: '/mxSample',
        name: 'mxSample',
        component: (resolve) => require(['@/view/mx_healthSafety/mx_mealRecord/mx_sample.vue'], resolve), //安全卫生 留样记录 小票
    },
    {
        path: '/mxDisinfection',
        name: 'mxDisinfection',
        component: (resolve) => require(['@/view/mx_healthSafety/mx_mealRecord/mx_disinfection.vue'], resolve), //安全卫生 餐具消毒记录 小票
    },
    {
        path: '/home',
        name: 'home',
        component: (resolve) => require(['@/components/test/home.vue'], resolve), //入口
        meta: {
            title: '',
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        children: [{
                path: '/home',
                name: 'home',
                component: (resolve) => require(['@/view/index.vue'], resolve), //首页
            }, {
                path: '/mx_sMessage',
                name: 'mx_sMessage',
                component: (resolve) => require(['@/view/mx_sMessage/mx_sMessage.vue'], resolve), //学校
            }, {
                path: '/mx_cMessage',
                name: 'mx_cMessage',
                component: (resolve) => require(['@/view/mx_sMessage/mx_cMessage.vue'], resolve), //食堂
            }, {
                path: '/mx_canteen', //mx_cDetails
                name: 'mx_canteen',
                component: (resolve) => require(['@/view/mx_sMessage/mx_canteen.vue'], resolve), //添加食堂
            }, {
                path: '/mx_cDetails', //
                name: 'mx_cDetails',
                component: (resolve) => require(['@/view/mx_sMessage/mx_cDetails.vue'], resolve), //食堂详情
            }, {
                path: '/mx_uMessage',
                name: 'mx_uMessage',
                component: (resolve) => require(['@/view/mx_sMessage/mx_uMessage.vue'], resolve), //供应商
            },{
                path: '/mx_hMessage',
                name: 'mx_hMessage',
                component: (resolve) => require(['@/view/mx_sMessage/mx_hMessage.vue'], resolve), //上级
            },
            // 顶部  帮助中心
            {
                path: '/mx_feedBack',
                name: 'mx_feedBack',
                component: (resolve) => require(['@/view/mx_hearder/mx_help/mx_feedBack.vue'], resolve), //意见反馈
            },{
                path: '/mx_subSucceed',
                name: 'mx_subSucceed',
                component: (resolve) => require(['@/view/mx_hearder/mx_help/mx_subSucceed.vue'], resolve), //提交成功
            },{
                path: '/mx_contactUs',
                name: 'mx_contactUs',
                component: (resolve) => require(['@/view/mx_hearder/mx_help/mx_contactUs.vue'], resolve), //联系我们
            },
            // 顶部  消息通知
            {
                path: '/mx_showAll',
                name: 'mx_showAll',
                component: (resolve) => require(['@/view/mx_hearder/mx_Notify/mx_showAll.vue'], resolve), //联系我们
            },
            {
                path: '/mx_InfoPage',
                name: 'mx_InfoPage',
                component: (resolve) => require(['@/view/mx_hearder/mx_Notify/mx_InfoPage.vue'], resolve), //查看详情
            },
            // 账号信息
            {
                path: '/mx_personal',
                name: 'mx_personal',
                component: (resolve) => require(['@/view/mx_hearder/mx_userInfo/mx_personal.vue'], resolve), //个人中心
            },
            //学生管理
            {
                path: '/mxAllStudents',
                name: 'mxAllStudents',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_allStudents/mx_allStudents.vue'], resolve), //所有学生
            },
            {
                path: '/mxGradeClass',
                name: 'mxGradeClass',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_gradeClass.vue'], resolve), //年级班级
            },
            {
                path: '/mxClassList',
                name: 'mxClassList',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_classList.vue'], resolve), //年级班级 班级列表
            },
            {
                path: '/mxStudentList',
                name: 'mxStudentList',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_studentList.vue'], resolve), //年级班级 学生列表
            },
            {
                path: '/mxAddStudent',
                name: 'mxAddStudent',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_addStudent.vue'], resolve), //年级班级 添加学生
            },
            {
                path: '/mxLeaveRecord',
                name: 'mxLeaveRecord',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_leaveRecord.vue'], resolve), //年级班级 离班记录
            },
            {
                path: '/mxUpdataInfo',
                name: 'mxUpdataInfo',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_updataInfo.vue'], resolve), //年级班级 修改信息
            },
            {
                path: '/mxStudentInfo',
                name: 'mxStudentInfo',
                component: (resolve) => require(['@/view/mx_studentMngmt/mx_gradeClass/mx_studentInfo.vue'], resolve), //年级班级 查看学生详情
            },
            // 食堂管理
            {
                path: '/mxEmployeeInfo',
                name: 'mxEmployeeInfo',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_employeeInfo.vue'], resolve), //食堂管理 员工信息
            },
            {
                path: '/mxStaffInfo',
                name: 'mxStaffInfo',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_staffInfo.vue'], resolve), //食堂管理 查看员工详情
            },
            {
                path: '/mxDepRecord',
                name: 'mxDepRecord',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_depRecord.vue'], resolve), //食堂管理 离职记录
            },
            {
                path: '/mxAddStaff',
                name: 'mxAddStaff',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_addStaff.vue'], resolve), //食堂管理 添加员工1
            },
            {
                path: '/mxAddStaffs',
                name: 'mxAddStaffs',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_addStaffs.vue'], resolve), //食堂管理 添加员工2
            },
            {
                path: '/mxModifyInfo',
                name: 'mxModifyInfo',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_modifyInfo.vue'], resolve), //食堂管理 修改信息1
            },
            {
                path: '/mxModifyInfos',
                name: 'mxModifyInfos',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_employeeInfo/mx_modifyInfos.vue'], resolve), //食堂管理 修改信息2
            },
            {
                path: '/mxTimeTag',
                name: 'mxTimeTag',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_timeTag/mx_timeTag.vue'], resolve), //食堂管理 考勤记录
            },
            {
                path: '/date',
                name: 'date',
                component: (resolve) => require(['@/view/date.vue'], resolve), //食堂管理 考勤记录
            },
            {
                path: '/mxWarehouseMngmt',
                name: 'mxWarehouseMngmt',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_warehouseMngmt/mx_warehouseMngmt.vue'], resolve), //食堂管理 仓库管理
            },
            {
                path: '/mxAddWarehouse',
                name: 'mxAddWarehouse',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_warehouseMngmt/mx_addWarehouse.vue'], resolve), //食堂管理 新建仓库
            },
            {
                path: '/mxWarehouseView',
                name: 'mxWarehouseView',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_warehouseMngmt/mx_warehouseView.vue'], resolve), //食堂管理 查看仓库
            },{
                path: '/mxUpdataMngmnt',
                name: 'mxUpdataMngmnt',
                component: (resolve) => require(['@/view/mx_canteenMngmt/mx_warehouseMngmt/mx_updataMngmnt.vue'], resolve), //食堂管理 修改信息
            },{
                path: '/mxCkBook',
                name: 'mxCkBook',
                component: (resolve) => require(['@/view/mx_ckBook/mx_ckBook.vue'], resolve), //营养食谱
            },
            // 安全卫生
            {
                path: '/mxMealRecord',
                name: 'mxMealRecord',
                component: (resolve) => require(['@/view/mx_healthSafety/mx_mealRecord/mx_mealRecord.vue'], resolve), //安全卫生 每餐记录
            },
            {
                path: '/mxDailyRecord',
                name: 'mxDailyRecord',
                component: (resolve) => require(['@/view/mx_healthSafety/mx_dailyRecord/mx_dailyRecord.vue'], resolve), //安全卫生 每日记录
            },
            {
                path: '/mxOtherRecord',
                name: 'mxOtherRecord',
                component: (resolve) => require(['@/view/mx_healthSafety/mx_otherRecord/mx_otherRecord.vue'], resolve), //安全卫生 其他记录
            },
            {
                path: '/mxPhotoGallery',
                name: 'mxPhotoGallery',
                component: (resolve) => require(['@/view/mx_healthSafety/mx_photoGallery/mx_photoGallery.vue'], resolve), //安全卫生 照片库
            },{
                path: '/mxPurchase',
                name: 'mxPurchase',
                component: (resolve) => require(['@/view/mx_purchase/mx_purchase.vue'], resolve), //采购计划
            },{
                path: '/mxProcure',
                name: 'mxProcure',
                component: (resolve) => require(['@/view/mx_procure/mx_procure.vue'], resolve), //在线采购
            },{
                path: '/mxOrder',
                name: 'mxOrder',
                component: (resolve) => require(['@/view/mx_procure/mx_order.vue'], resolve), //采购订单
            },{
                path: '/mxVoucher',
                name: 'mxVoucher',
                component: (resolve) => require(['@/view/mx_procure/mx_voucher.vue'], resolve), //结算凭证
            },
            // 食材库管理
            {
                path: '/mxIntoLibrary',
                name: 'mxIntoLibrary',
                component: (resolve) => require(['@/view/mx_depotMngmt/mx_intoLibrary.vue'], resolve), //食材库管理 入库
            },
            {
                path: '/mxOutLibrary',
                name: 'mxOutLibrary',
                component: (resolve) => require(['@/view/mx_depotMngmt/mx_outLibrary.vue'], resolve), //食材库管理 出库
            },
            {
                path: '/mxFoodLibrary',
                name: 'mxFoodLibrary',
                component: (resolve) => require(['@/view/mx_depotMngmt/mx_foodLibrary.vue'], resolve), //食材库管理 食材库
            },
            {
                path: '/mxFoodsInfo',
                name: 'mxFoodsInfo',
                component: (resolve) => require(['@/view/mx_depotMngmt/mx_foodsInfo.vue'], resolve), //食材库管理 食材库
            },
            {
                path: '/mxInventory',
                name: 'mxInventory',
                component: (resolve) => require(['@/view/mx_depotMngmt/mx_inventory.vue'], resolve), //食材库管理 库存盘点
            },{
                path: '/mxWlist',
                name: 'mxWlist',
                component: (resolve) => require(['@/view/mx_warning/warningList.vue'], resolve), //过期列表
            },{
                path: '/mxWset',
                name: 'mxWset',
                component: (resolve) => require(['@/view/mx_warning/warningSet.vue'], resolve), //过期设置
            },{
                path: '/mxJuser',
                name: 'mxJuser',
                component: (resolve) => require(['@/view/mx_Jurisdiction/mx_Juser.vue'], resolve), //用户权限
            },{
                path: '/mxJpost',
                name: 'mxJpost',
                component: (resolve) => require(['@/view/mx_Jurisdiction/mx_Jpost.vue'], resolve), //职位权限
            },{
                path: '/mxMessage',
                name: 'mxMessage',
                component: (resolve) => require(['@/view/mx_message/mx_message.vue'], resolve), //职位权限
            },
            // 数据统计
            {
                path: '/mxStatistics',
                name: 'mxStatistics',
                component: (resolve) => require(['@/view/mx_statistics/mx_statistics.vue'], resolve), //职位权限
            }
        ]
    }
];
export default routers;