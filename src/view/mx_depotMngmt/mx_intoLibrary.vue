<template>
    <div id="mx_intoLibrary">
        <a-skeleton
            :loading="loadingActive"
            active
            :paragraph="{rows: 20}"
        >
            <a-tabs
                :activeKey="activeKey"
                @change="callback"
            >
                <a-tab-pane
                    tab="验收入库"
                    key="1"
                >
                    <div v-if="!isAcceptanceInfo && !isRefusal && !isOtherFood && !isInputInfo && !isSecond">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenKey"
                                    style="width:150px;"
                                    @change="selectChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">清单:</p>
                            <a-input
                                placeholder="供应商名称"
                                class="seachBox"
                                style="width:200px;"
                                v-model="mxClassVal"
                                ref="userNameInput"
                            >
                                <a-icon
                                    v-if="mxClassVal"
                                    theme="filled"
                                    slot="suffix"
                                    type="close-circle"
                                    @click="emitEmpty"
                                    style="color:#999"
                                />
                            </a-input>
                            <a-button
                                type="primary"
                                class="seachBtn"
                                @click="mxSeach"
                            >搜索</a-button>
                            <span
                                class="mx_btn"
                                @click="mxOtherFood"
                            >
                                <span class="mx_outPoeration">
                                    其他食材入库
                                </span>
                            </span>
                        </div>
                        <!-- main -->
                        <a-skeleton
                            :loading="loading"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div
                                v-if="intoList.length<=0"
                                style="width:100%;textAlign: center;"
                            >
                                暂无订单
                            </div>
                            <div v-else>
                                <div
                                    class="mx_mainList"
                                    v-for="item in intoList"
                                >
                                    <div class="mx_title">
                                        <div class="mx_left"><span style="margin-right:44px;">{{item.canteen_title}}</span><span>{{item.title}}</span></div>
                                        <div><span style="margin-right:18px;">{{moment(item.batch_time).format('MM-DD')}}</span><span>{{item.cycle_str}}</span></div>
                                    </div>
                                    <div
                                        class="mx_list"
                                        v-for="items in item.materials"
                                    >
                                        <img
                                            :src="items.material_single_src"
                                            alt=""
                                        >
                                        <span>{{items.cargo_title}}</span>
                                        <span>&yen;{{items.order_unit_price}}</span>
                                        <span>{{items.order_num}}</span>
                                        <span>&yen;{{items.total_price}}</span>
                                        <span>批次号：{{items.show_group}}</span>
                                        <div>
                                            <a-button
                                                style="background: #f2f2f2;margin-right:10px;"
                                                @click="mxRejection(items.batch_id)"
                                            >拒收</a-button>
                                            <a-button
                                                type="primary"
                                                @click="mxAcceptance(items.batch_id)"
                                            >验收</a-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 验收信息 -->
                    <div v-if="isAcceptanceInfo">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backAcceptance"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">验收信息</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingChecked"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div>
                                <div class="mx_main">
                                    <div class="mx_title">
                                        <div style="margin-right:56px;"><span style="margin-right:44px;">{{acceptanceList.canteen_title}}</span><span>{{acceptanceList.supplier_title}}</span></div>
                                        <div style="margin-right:56px;">所属订单号：{{acceptanceList.order_no}}</div>
                                        <div><span style="margin-right:18px;">{{moment(acceptanceList.batch_time).format('YYYY-MM-DD')}}</span><span>{{moment(acceptanceList.create_batch_time_str).format('HH:mm')}}</span></div>
                                    </div>
                                    <div class="mx_list">
                                        <img
                                            :src="acceptanceList.material_single_src"
                                            alt=""
                                        >
                                        <span style="margin-right:56px;">{{acceptanceList.cargo_title}}</span>
                                        <span style="margin-right:56px;">&yen;{{acceptanceList.order_unit_price}}/斤</span>
                                        <span style="margin-right:56px;">应收：{{acceptanceList.order_num}}斤</span>
                                        <span style="margin-right:56px;">总价：&yen;{{acceptanceList.total_price}}</span>
                                        <span class="mx_left">批次号：{{acceptanceList.batch_num}}</span>
                                    </div>
                                </div>
                                <a-form
                                    :form="form"
                                    @submit="handleSubmit"
                                >
                                    <a-row class="mx_main_form">
                                        <a-col :span="8">
                                            <a-form-item label="入库方式">
                                                <a-select
                                                    :value="stockKey"
                                                    style="width:300px;"
                                                    @change="stockChange"
                                                >
                                                    <a-select-option value="1">立即入库</a-select-option>
                                                    <a-select-option value="3">入库即出库</a-select-option>
                                                </a-select>
                                            </a-form-item>
                                            <a-form-item label="实际数量">
                                                <a-input
                                                    placeholder="填写实际验收数量"
                                                    style="width:300px; paddingRight:26px;"
                                                    @change="mxNumMax"
                                                    v-decorator="[
                                                'number',
                                                {rules: [{ required: true, message: '请填写实际验收数量' }]}
                                            ]"
                                                />
                                                <span style="position: absolute;left:280px;lineHeight:32px;">斤</span>
                                            </a-form-item>
                                            <a-form-item label="存放仓库">
                                                <a-select
                                                    :value="storehouseKey"
                                                    style="width:300px;"
                                                    @change="storehouseChange"
                                                >
                                                    <a-select-option
                                                        v-for="(item,index) in storehouse"
                                                        :key="index"
                                                    >{{item.title}}</a-select-option>
                                                </a-select>
                                            </a-form-item>
                                            <a-form-item>
                                                <div>
                                                    <div style="width:300px;">
                                                        <span>保质期</span>
                                                        <span style="fintSize:20px;color:red;">*</span>
                                                        <span style="color:#ccc;">入库时间起剩余保质期</span>
                                                    </div>
                                                    <div>
                                                        <a-input
                                                            placeholder="填写食材保质期"
                                                            style="width:210px;"
                                                            v-model="warrantyNum"
                                                            :disabled="isDisabled"
                                                        />
                                                        <a-select
                                                            :defaultValue="warranty"
                                                            @change="mxWarranty"
                                                            style="width:80px;marginLeft:10px;"
                                                            :disabled="isDisabled"
                                                        >
                                                            <a-select-option value="d">天</a-select-option>
                                                            <a-select-option value="H">小时</a-select-option>
                                                        </a-select>
                                                    </div>
                                                </div>
                                            </a-form-item>
                                            <a-form-item
                                                v-if="isOutStock"
                                                label="出库用途"
                                            >
                                                <a-select
                                                    placeholder="选择出库用途"
                                                    :value="mealTimesAddKey"
                                                    style="width:300px;"
                                                    @change="mealTimesAddChange"
                                                >
                                                    <a-select-option
                                                        v-for="(item,index) in mealTimeShow"
                                                        :key="item.id"
                                                    >{{item.title}}</a-select-option>
                                                </a-select>
                                            </a-form-item>
                                            <a-form-item
                                                v-if="!isOutStock"
                                                label="提前预警时间"
                                            >
                                                <a-input
                                                    style="width:210px;"
                                                    v-model="earlyNum"
                                                    :disabled="isDisabled"
                                                />
                                                <a-select
                                                    :defaultValue="early"
                                                    @change="mxEarly"
                                                    style="width:80px;marginLeft:10px;"
                                                    :disabled="isDisabled"
                                                >
                                                    <a-select-option value="d">天</a-select-option>
                                                    <a-select-option value="H">小时</a-select-option>
                                                </a-select>
                                            </a-form-item>

                                        </a-col>
                                        <a-col :span="16">
                                            <a-form-item label="食材照片">
                                                <div v-decorator="[
                                                        '食材照片',
                                                        {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                    ]">
                                                    <div class="clearfix">
                                                        <a-upload
                                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                                            listType="picture-card"
                                                            :fileList="fileList"
                                                            @preview="handlePreview"
                                                            @change="handleChange"
                                                        >
                                                            <div v-if="fileList.length < 2">
                                                                <a-icon type="plus" />
                                                            </div>
                                                        </a-upload>
                                                        <a-modal
                                                            :visible="previewVisible"
                                                            :footer="null"
                                                            @cancel="handleCancel"
                                                        >
                                                            <img
                                                                alt="example"
                                                                style="width: 100%"
                                                                :src="previewImage"
                                                            />
                                                        </a-modal>
                                                    </div>
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        :fileList="fileList"
                                                        @preview="handlePreview"
                                                        @change="handleChange"
                                                    >
                                                        <a-button>
                                                            <a-icon type="upload" />上传图片
                                                        </a-button>
                                                    </a-upload>
                                                </div>
                                            </a-form-item>
                                            <a-form-item
                                                label="验收票据"
                                                class="mx_outschool"
                                            >
                                                <div v-decorator="[
                                                        '验收票据',
                                                        {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                    ]">
                                                    <div class="clearfix">
                                                        <a-upload
                                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                                            listType="picture-card"
                                                            :fileList="sedList"
                                                            @preview="handlePreviews"
                                                            @change="handleChanges"
                                                        >
                                                            <div v-if="sedList.length < 2">
                                                                <a-icon type="plus" />
                                                            </div>
                                                        </a-upload>
                                                        <a-modal
                                                            :visible="previewVisibles"
                                                            :footer="null"
                                                            @cancel="handleCancels"
                                                        >
                                                            <img
                                                                alt="example"
                                                                style="width: 100%"
                                                                :src="previewImages"
                                                            />
                                                        </a-modal>
                                                    </div>
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        :fileList="sedList"
                                                        @preview="handlePreviews"
                                                        @change="handleChanges"
                                                    >
                                                        <a-button>
                                                            <a-icon type="upload" />上传图片
                                                        </a-button>
                                                    </a-upload>
                                                </div>
                                            </a-form-item>
                                            <a-form-item
                                                label="出库票据"
                                                class="mx_outschool"
                                                v-if="isOutStock"
                                            >
                                                <div v-decorator="[
                                                        '出库票据',
                                                        {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                    ]">
                                                    <div class="clearfix">
                                                        <a-upload
                                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                                            listType="picture-card"
                                                            :fileList="thirdList"
                                                            @preview="thirdPreviews"
                                                            @change="thirdChanges"
                                                        >
                                                            <div v-if="thirdList.length < 2">
                                                                <a-icon type="plus" />
                                                            </div>
                                                        </a-upload>
                                                        <a-modal
                                                            :visible="thirdVisibles"
                                                            :footer="null"
                                                            @cancel="thirdCancels"
                                                        >
                                                            <img
                                                                alt="example"
                                                                style="width: 100%"
                                                                :src="thirdImages"
                                                            />
                                                        </a-modal>
                                                    </div>
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        :fileList="thirdList"
                                                        @preview="thirdPreviews"
                                                        @change="thirdChanges"
                                                    >
                                                        <a-button>
                                                            <a-icon type="upload" />上传图片
                                                        </a-button>
                                                    </a-upload>
                                                </div>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                    <a-form-item>
                                        <a-button
                                            type="primary"
                                            html-type="submit"
                                        >立即入库</a-button>
                                    </a-form-item>
                                </a-form>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 拒绝验收 -->
                    <div v-if="isRefusal">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backRefusal"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">拒绝验收</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingRejection"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div>
                                <div class="mx_main">
                                    <div class="mx_title">
                                        <div style="margin-right:56px;"><span style="margin-right:44px;">{{rejectionList.canteen_title}}</span><span>{{rejectionList.supplier_title}}</span></div>
                                        <div style="margin-right:56px;">所属订单号：{{rejectionList.order_no}}</div>
                                        <div><span style="margin-right:18px;">{{moment(rejectionList.batch_time).format('YYYY-MM-DD')}}</span><span>{{moment(rejectionList.create_batch_time_str).format('HH:mm')}}</span></div>
                                    </div>
                                    <div class="mx_list">
                                        <img
                                            :src="rejectionList.material_single_src"
                                            alt=""
                                        >
                                        <span style="margin-right:56px;">{{rejectionList.cargo_title}}</span>
                                        <span style="margin-right:56px;">&yen;{{rejectionList.order_unit_price}}/斤</span>
                                        <span style="margin-right:56px;">{{rejectionList.order_num}}斤</span>
                                        <span style="margin-right:56px;">总价：&yen;{{rejectionList.total_price}}</span>
                                        <span class="mx_left">批次号：{{rejectionList.batch_num}}</span>
                                    </div>
                                </div>
                                <a-form
                                    :form="form"
                                    @submit="mxSureRefusal"
                                >
                                    <a-row class="mx_main_form">
                                        <a-col :span="8">
                                            <a-form-item label="拒收原因">
                                                <textarea
                                                    cols="30"
                                                    rows="10"
                                                    style="width:300px;height:95px;resize:none;paddingLeft:12px;lineHeight:22px; borderColor:#ccc;"
                                                    placeholder="请说明拒收原因"
                                                    v-model="causeInfo"
                                                ></textarea>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="16">
                                            <a-form-item label="食材照片上传">
                                                <div>
                                                    <div class="clearfix">
                                                        <a-upload
                                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                                            listType="picture-card"
                                                            :fileList="foodImgList"
                                                            @preview="foodImgPreviews"
                                                            @change="foodImgChanges"
                                                            v-decorator="[
                                                        '食材照片',
                                                        {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                    ]"
                                                        >
                                                            <div v-if="foodImgList.length < 2">
                                                                <a-icon type="plus" />
                                                            </div>
                                                        </a-upload>
                                                        <a-modal
                                                            :visible="foodImgVisibles"
                                                            :footer="null"
                                                            @cancel="foodImgCancels"
                                                        >
                                                            <img
                                                                alt="example"
                                                                style="width: 100%"
                                                                :src="foodImgImages"
                                                            />
                                                        </a-modal>
                                                    </div>
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        :fileList="foodImgList"
                                                        @preview="foodImgPreviews"
                                                        @change="foodImgChanges"
                                                    >
                                                        <!-- v-decorator="[
                                                    '食材照片',
                                                    {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                ]" -->
                                                        <a-button>
                                                            <a-icon type="upload" />上传图片
                                                        </a-button>
                                                    </a-upload>
                                                </div>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                    <a-form-item>
                                        <a-button
                                            type="primary"
                                            html-type="submit"
                                        >确定拒收</a-button>
                                    </a-form-item>
                                </a-form>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 其他食材 -->
                    <div v-if="isOtherFood">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backOtherFood"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">其他食材</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">食材:</p>
                            <a-select
                                :placeholder="12312"
                                showSearch
                                :value="shData.value"
                                placeholder="请输入食材"
                                style="width: 200px"
                                :defaultActiveFirstOption="false"
                                :showArrow="false"
                                :filterOption="false"
                                @search="inpSearch"
                                @change="e => inpChange(e, shData.data[e].val)"
                                :notFoundContent="shData.ts ? undefined : null"
                            >
                                <!-- @change="e => inpChange(e,name, record,shData.data[e-1].val)" -->
                                <a-select-option
                                    v-for="(d,index) in shData.data"
                                    :key="index"
                                >{{d.val}}</a-select-option>
                                <!--远程搜索插槽-->
                                <div
                                    slot="notFoundContent"
                                    style="display: flex;align-items: center;flex-direction: column;"
                                >
                                    <div
                                        class="box"
                                        v-if="!shData.sc"
                                    >
                                        搜索中
                                        <a-icon
                                            type="loading"
                                            style="color:#666"
                                        />
                                    </div>
                                    <div
                                        class="box"
                                        v-if="shData.sc"
                                        style="display: flex; flex-direction: column;align-items: center"
                                    >
                                        <p style="margin-top: 30px;color:#000;">暂无对应食材</p>
                                        <p style="font-size: 14px;">我们正在持续完善食材系统中</p>
                                    </div>
                                </div>
                            </a-select>
                            <a-button
                                type="primary"
                                class="seachBtn"
                                @click="mxSeachOther"
                            >搜索</a-button>
                        </div>
                        <a-skeleton
                            :loading="loadingOther"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div
                                v-if="otherIntoList.length <= 0"
                                style="width:100%;textAlign:center;"
                            >请搜索您要入库的食材</div>
                            <ul
                                class="mx_foodList"
                                v-else
                            >
                                <li
                                    v-for="item in otherIntoList"
                                    @click="mxIntoInfo(item)"
                                >
                                    <img
                                        :src="item.img_src[0].url"
                                        alt=""
                                    >
                                    <p>{{item.title}}</p>
                                    <p>单位：{{item.unit}}</p>
                                </li>
                            </ul>
                        </a-skeleton>
                    </div>
                    <!-- 入库信息 -->
                    <!-- 第一步 -->
                    <div v-if="isInputInfo">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backInputInfo"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">入库信息</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <div>
                            <div
                                class="mx_main"
                                style="width:414px;"
                            >
                                <div class="mx_list">
                                    <img
                                        :src="otherFood.img_src[0].url"
                                        alt=""
                                    >
                                    <span style="margin-right:56px;">{{otherFood.title}}</span>
                                    <span>{{otherFood.unit}}</span>
                                </div>
                            </div>
                            <a-form
                                :form="myForm"
                                @submit="secondSubmit"
                            >
                                <a-row class="mx_main_form">
                                    <a-col :span="10">
                                        <a-form-item label="所属食堂">
                                            <a-select
                                                style="width:150px;"
                                                placeholder="选择所属食堂"
                                                @change="mxCreen"
                                                v-decorator="[
                                                    'canteen',
                                                    {initialValue: intoShow.canteen,rules: [{ required: true, message: '请选择员工所属食堂' }]}
                                                ]"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in canteenShow"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="来源方式">
                                            <a-input
                                                placeholder="例：自购等"
                                                style="width:300px; paddingRight:26px;"
                                                v-decorator="[
                                                    'originMode',
                                                    {initialValue: intoShow.originMode,rules: [{ required: true, message: '请填写来源方式' }]}
                                                ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="获取人">
                                            <a-select
                                                showSearch
                                                :value="getPerson.value"
                                                placeholder="选择食堂获取人"
                                                style="width: 200px"
                                                :defaultActiveFirstOption="false"
                                                :showArrow="false"
                                                :filterOption="false"
                                                @search="inpSearchInfo"
                                                @change="e => inpChangeInfo(e)"
                                                :notFoundContent="getPerson.ts ? undefined : null"
                                            >
                                                <a-select-option
                                                    v-for="d in getPerson.data"
                                                    :key="d.key"
                                                >{{d.val}}</a-select-option>
                                                <!--远程搜索插槽-->
                                                <div
                                                    slot="notFoundContent"
                                                    style="display: flex;align-items: center;flex-direction: column;"
                                                >
                                                    <div
                                                        class="box"
                                                        v-if="!getPerson.sc"
                                                    >
                                                        搜索中
                                                        <a-icon
                                                            type="loading"
                                                            style="color:#666"
                                                        />
                                                    </div>
                                                    <div
                                                        class="box"
                                                        v-if="getPerson.sc"
                                                        style="display: flex; flex-direction: column;align-items: center"
                                                    >
                                                        <p style="margin-top: 30px;color:#000;">暂无对应食材</p>
                                                        <p style="font-size: 14px;">我们正在持续完善食材系统中</p>
                                                    </div>
                                                </div>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="单价/数量">
                                            <a-input
                                                placeholder="填写采购单价"
                                                style="width:145px; paddingRight:26px; marginRight:10px;"
                                                v-decorator="[
                                                    'price',
                                                    {initialValue: intoShow.price,rules: [{ required: true, message: '请填写来源方式' }]}
                                                ]"
                                            />
                                            <span style="position: absolute;left:124px;lineHeight:32px;">元</span>
                                            <a-input
                                                placeholder="填写入库数量"
                                                style="width:145px; paddingRight:26px;"
                                                v-model="intoShow.number"
                                            />
                                            <!-- v-decorator="[
                                                    'number',
                                                    {initialValue: intoShow.number,rules: [{ required: true, message: '请填写单价及数量' }]}
                                                ]" -->
                                            <span style="position: absolute;left:280px;lineHeight:32px;">斤</span>
                                        </a-form-item>
                                        <a-form-item label="入库方式">
                                            <a-select
                                                :defaultValue="intoMode"
                                                style="width:300px;"
                                                @change="storageModeChange"
                                            >
                                                <a-select-option value="1">立即入库</a-select-option>
                                                <a-select-option value="3">入库即出库</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="存放仓库">
                                            <a-select
                                                style="width:300px;"
                                                @change="mxWarehouse"
                                                v-decorator="[
                                                        'warehouse',
                                                        {initialValue: intoShow.warehouse,rules: [{ required: true, message: '请选择存放仓库' }]}
                                                    ]"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in storehouseOther"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="来源方">
                                            <a-input
                                                placeholder="填写来源方名称"
                                                style="width:300px;"
                                                v-decorator="[
                                                'originName',
                                                {initialValue: intoShow.originName,rules: [{ required: true, message: '请填写来源方名称' }]}
                                            ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="联系方式">
                                            <a-input
                                                placeholder="填写来源方联系方式"
                                                v-model="contactMode"
                                                style="width:300px;"
                                            />
                                        </a-form-item>
                                        <a-form-item label="来源方地址">
                                            <a-input
                                                placeholder="填写来源方详细地址"
                                                style="width:300px;"
                                                v-decorator="[
                                                'originAddress',
                                                {initialValue: intoShow.originAddress,rules: [{ required: true, message: '请填写来源方详细地址' }]}
                                            ]"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="14">
                                        <a-form-item label="食材照片">
                                            <div v-decorator="[
                                                        'food',
                                                        {rules: [{ required: inputInfoList.length > 0 ? false : true, message: '请上传至少一张照片' }]}
                                                    ]">
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="inputInfoList"
                                                        @preview="inputInfoPreview"
                                                        @change="inputInfoChange"
                                                    >
                                                        <div v-if="inputInfoList.length < 2">
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="inputInfoVisible"
                                                        :footer="null"
                                                        @cancel="inputInfoCancel"
                                                    >
                                                        <img
                                                            alt="example"
                                                            style="width: 100%"
                                                            :src="inputInfoImage"
                                                        />
                                                    </a-modal>
                                                </div>
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    :fileList="inputInfoList"
                                                    @preview="inputInfoPreview"
                                                    @change="inputInfoChange"
                                                >
                                                    <a-button>
                                                        <a-icon type="upload" />上传图片
                                                    </a-button>
                                                </a-upload>
                                            </div>
                                        </a-form-item>
                                        <a-form-item
                                            label="验收票据"
                                            class="mx_outschool"
                                        >
                                            <div v-decorator="[
                                                        'bill',
                                                        {rules: [{ required: inputInfosList.length > 0 ? false : true, message: '请上传至少一张照片' }]}
                                                    ]">
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="inputInfosList"
                                                        @preview="inputInfosPreview"
                                                        @change="inputInfosChange"
                                                    >
                                                        <div v-if="inputInfosList.length < 2">
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="inputInfosVisible"
                                                        :footer="null"
                                                        @cancel="inputInfosCancel"
                                                    >
                                                        <img
                                                            alt="example"
                                                            style="width: 100%"
                                                            :src="inputInfosImage"
                                                        />
                                                    </a-modal>
                                                </div>
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    :fileList="inputInfosList"
                                                    @preview="inputInfosPreview"
                                                    @change="inputInfosChange"
                                                >
                                                    <a-button>
                                                        <a-icon type="upload" />上传图片
                                                    </a-button>
                                                </a-upload>
                                            </div>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                    >下一步</a-button>
                                </a-form-item>
                            </a-form>
                        </div>
                    </div>
                    <!-- 第二步 -->
                    <div v-show="isSecond">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backSecond"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">入库信息</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <div>
                            <a-form
                                :form="myForms"
                                @submit="secondSubmits"
                            >
                                <a-form-item label="品牌名称">
                                    <a-input
                                        placeholder="填写品牌名称"
                                        v-model="bank_name"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item label="生产厂家">
                                    <a-input
                                        placeholder="填写生产厂家"
                                        v-model="company_name"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item label="产地">
                                    <a-input
                                        placeholder="填写食材产地"
                                        v-model="orgian_place"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item label="贮存方式">
                                    <a-input
                                        placeholder="填写包装方式"
                                        v-model="store_style"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item label="包装方式">
                                    <a-input
                                        placeholder="填写包装方式"
                                        v-model="package"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item label="净含量">
                                    <a-input
                                        placeholder="填写食材净含量"
                                        v-model="net_weight"
                                        style="width:300px;"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <div>
                                        <div style="width:300px;">
                                            <span>保质期</span>
                                            <span style="fintSize:20px;color:red;">*</span>
                                            <span style="color:#ccc;">入库时间起剩余保质期</span>
                                        </div>
                                        <div>
                                            <a-input
                                                placeholder="填写食材保质期"
                                                style="width:210px;"
                                                v-decorator="[
                                                        'expiry',
                                                        {initialValue: expiry,rules: [{ required: true, message: '请填写食材保质期' }]}
                                                    ]"
                                            />
                                            <a-select
                                                :value="expiry_unit"
                                                style="width:80px;marginLeft:10px;"
                                                @change="mxExpiryUnit"
                                            >
                                                <a-select-option value="d">天</a-select-option>
                                                <a-select-option value="H">小时</a-select-option>
                                            </a-select>
                                        </div>
                                    </div>
                                </a-form-item>
                                <a-form-item
                                    v-if="!isIntoAndOut"
                                    label="提前预警时间"
                                >
                                    <a-input
                                        style="width:210px;"
                                        v-model="ttrVal"
                                    />
                                    <a-select
                                        :value="ttr_unit"
                                        style="width:80px;marginLeft:10px;"
                                        @change="mxTtrUnit"
                                    >
                                        <a-select-option value="d">天</a-select-option>
                                        <a-select-option value="H">小时</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item
                                    v-if="isIntoAndOut"
                                    label="出库用途"
                                >
                                    <a-select
                                        placeholder="选择出库用途"
                                        :value="mealTimesIntoKey"
                                        style="width:300px;"
                                        @change="mealTimesIntoChange"
                                    >
                                        <a-select-option
                                            v-for="(item,index) in mealTimeShow"
                                            :key="item.id"
                                        >{{item.title}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item>
                                    <a-button
                                        style="marginRight:10px;"
                                        @click="mxPrebtn"
                                    >上一步</a-button>
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                    >立即入库</a-button>
                                </a-form-item>
                            </a-form>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="验收入库记录"
                    key="2"
                    forceRender
                >
                    <!-- main -->
                    <div v-if="!isShowInfo">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenInfoKey"
                                    style="width:150px;"
                                    @change="selectChangeInfo"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">记录:</p>
                            <a-input
                                placeholder="食材名称/批次号"
                                class="seachBox"
                                style="width:200px;"
                                v-model="mxClassValInfo"
                                ref="userNameInput"
                            >
                                <a-icon
                                    v-if="mxClassValInfo"
                                    theme="filled"
                                    slot="suffix"
                                    type="close-circle"
                                    @click="emitEmptyInfo"
                                    style="color:#999"
                                />
                            </a-input>
                        </div>
                        <a-form
                            layout="inline"
                            class="mx_form"
                            style="margin:20px 0;"
                        >
                            <a-form-item
                                label="状态："
                                style="marginRight:30px;"
                            >
                                <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                                <a-select
                                    :value="stateInfo"
                                    @change="mxState"
                                    style="width: 120px"
                                >
                                    <a-select-option value="0">全部</a-select-option>
                                    <a-select-option value="3">正常验收</a-select-option>
                                    <a-select-option value="2">部分验收</a-select-option>
                                    <a-select-option value="4">拒绝验收</a-select-option>
                                </a-select>
                                <!-- </a-form-item> -->
                            </a-form-item>
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="disabledStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="startValue"
                                    placeholder="选择日期"
                                    @openChange="handleStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="disabledEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择日期"
                                    v-model="endValue"
                                    :open="endOpen"
                                    @openChange="handleEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    @click="inquiryData"
                                >查询</a-button>
                                <a-button @click="inquiryMealReset">重置</a-button>
                                <span class="mx_btns">
                                    <span class="mx_outPoeration">
                                        <a-icon
                                            class="mx_icon"
                                            type="printer"
                                        />
                                        <span>打印</span>
                                    </span>
                                    <a-divider
                                        type="vertical"
                                        style="background: #000;"
                                    />
                                    <span class="mx_outPoeration">
                                        <a-icon
                                            class="mx_icon"
                                            type="printer"
                                        />
                                        <span>导出</span>
                                    </span>
                                </span>
                            </a-form-item>
                        </a-form>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingRecord"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="column"
                                :dataSource="MealRecordList"
                                bordered
                                :pagination="pagination"
                                @change="handleTableChange"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="material_single_src"
                                    slot-scope="text, record,index"
                                >
                                    <viewer>
                                        <img
                                            style="width:60px;heigth:60px"
                                            :src="text"
                                        >
                                    </viewer>
                                </div>
                                <template
                                    slot="operation"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        <div>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxShowInfo(record.id)"
                                            >查看</a>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 验收信息 -->
                    <div v-if="isShowInfo">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowInfo"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingInfo"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div>
                                <div
                                    class="mx_main"
                                    style="width:90%;marginBottom:60px;"
                                >
                                    <div style="display: flex;justify-content: space-between;align-items: center;">
                                        <div
                                            class="mx_title"
                                            style="margin:0;"
                                        >
                                            <div style="margin-right:56px;"><span style="margin-right:44px;">{{acceptanceShow.canteen_title}}</span><span>{{acceptanceShow.supplier_title}}</span></div>
                                            <div
                                                v-if="isNormal || isNormalOut || isNotInto"
                                                style="margin-right:56px;"
                                            >所属订单号：{{acceptanceShow.order_no}}</div>
                                            <div v-if="isNormal || isNormalOut || isNotInto"><span style="margin-right:18px;">{{acceptanceShow.batch_time_str}}</span></div>
                                        </div>
                                        <div>{{acceptanceShow.batch_state_str}}</div>
                                        <!-- <div v-if="isNormalOut">部分验收</div>
                                    <div v-if="isNotInto">拒绝验收</div>
                                    <div v-if="isOtherOut || isOther">其他食材入库</div> -->
                                    </div>
                                    <div class="mx_list">
                                        <img
                                            :src="acceptanceShow.material_single_src"
                                            alt=""
                                        >
                                        <span style="margin-right:56px;">{{acceptanceShow.material_title}}</span>
                                        <span style="margin-right:56px;">&yen;{{acceptanceShow.order_unit_price}}</span>
                                        <span style="margin-right:56px;">{{acceptanceShow.order_num}}</span>
                                        <span style="margin-right:56px;">总价：&yen;{{acceptanceShow.total_price}}</span>
                                        <span>批次号：{{acceptanceShow.batch_num}}</span>
                                    </div>
                                </div>
                                <a-row style="fontWeigh:bold;color:#000;">
                                    <a-col :span="8">
                                        <div>
                                            <div v-if="!isNotInto">
                                                <p>入库方式：<span>{{acceptanceShow.record_state_str}}</span></p>
                                                <p>存放仓库：<span>{{acceptanceShow.storehou_title}}</span></p>
                                                <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{acceptanceShow.expiry}}{{acceptanceShow.expiry_unit_str}}</span></p>
                                                <p v-if="!isOtherOut && !isNormalOut">预警时间：<span>{{acceptanceShow.yj_str}}</span></p>
                                                <p v-if="isOtherOut || isNormalOut">出库用途：<span>早餐</span></p>
                                            </div>
                                            <p v-if="isNotInto">拒收原因：<span>{{acceptanceShow.reason}}</span></p>
                                            <p>操&nbsp;&nbsp;作&nbsp;&nbsp;人：<span>{{acceptanceShow.username}}</span></p>
                                            <p>操作时间：<span>{{acceptanceShow.record_time_str}}</span></p>
                                        </div>
                                        <div
                                            v-if="isOther || isOtherOut"
                                            style="marginTop:30px;"
                                        >
                                            <p>来源方式：<span>自购</span></p>
                                            <p>获&nbsp;&nbsp;取&nbsp;&nbsp;人：<span>王阿航</span></p>
                                            <p>来源方联系方式：<span>1512358963</span></p>
                                            <p>来源方地址：<span>重庆市</span></p>
                                        </div>
                                        <p style="marginTop:30px;">品牌名称：<span>{{acceptanceShow.cargo_title}}</span></p>
                                        <p>生产厂家：<span>{{acceptanceShow.factory}}</span></p>
                                        <p>产&emsp;&emsp;地：<span>{{acceptanceShow.source}}</span></p>
                                        <p>生产日期：<span>{{acceptanceShow.product_date_str}}</span></p>
                                        <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{acceptanceShow.shelf_life}}</span></p>
                                        <p>贮存方式：<span>{{acceptanceShow.storage_method_str}}</span></p>
                                        <p>包装方式：<span>{{acceptanceShow.pack_str}}</span></p>
                                        <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>{{acceptanceShow.net_weight}}</span></p>
                                    </a-col>
                                    <a-col :span="16">
                                        <div>
                                            <p>食材照片</p>
                                            <img
                                                style="width:92px;height:92px;marginRight:30px;"
                                                v-for="item in acceptanceShow.photo_src"
                                                :src="item.url"
                                                alt=""
                                            >
                                        </div>
                                        <div
                                            v-if="!isNotInto"
                                            style="marginTop:50px;"
                                        >
                                            <p>票据照片</p>
                                            <img
                                                style="width:92px;height:92px;marginRight:30px;"
                                                v-for="item in acceptanceShow.bill_src"
                                                :src="item.url"
                                                alt=""
                                            >
                                        </div>
                                        <div
                                            v-if="isOtherOut || isNormalOut"
                                            style="marginTop:50px;"
                                        >
                                            <p>出库票据</p>
                                            <img
                                                style="width:92px;height:92px;marginRight:30px;"
                                                v-for="item in acceptanceShow.out_bill_src"
                                                :src="item.url"
                                                alt=""
                                            >
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>
<script>
import moment from 'moment';
import { log } from 'util';
// 陪餐记录
const column = [
    {
        title: "食堂",
        dataIndex: "canteen_title",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "canteen_title" }
    },
    {
        title: "供应商",
        dataIndex: "supplier_title",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "supplier_title" }
    },
    {
        title: "照片",
        dataIndex: "material_single_src",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "material_single_src" }
        // render:(record) => {
        //           return <img src={record.images} alt="" style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
        //   }
    },
    {
        title: "名称",
        dataIndex: "cargo_title",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "cargo_title" }
    },
    {
        title: "单价/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "order_num",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "order_num" }
    },
    {
        title: "总价",
        dataIndex: "total_price",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "total_price" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "批次状态",
        dataIndex: "batch_state_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "batch_state_str" }
    },
    {
        title: "操作人",
        dataIndex: "username",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "username" }
    },
    {
        title: "操作时间",
        dataIndex: "record_time_str",
        align: "center",
        width: "14%",
        scopedSlots: { record_time_str: "operatTime" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const MealRecordList = [];
for (let i = 0; i < 7; i++) {
    var batchStatus, canteen;
    if (i < 2) {
        canteen = "食堂1";
        batchStatus = "早餐"
    } else if (i < 4) {
        canteen = "食堂2";
        batchStatus = "中餐"
    } else if (i < 5) {
        canteen = "食堂3";
        batchStatus = "晚餐"
    } else {
        canteen = "食堂4";
        batchStatus = "加餐"
    }
    var imgList = [
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" }
        ],
        [
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        ],
        [
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        ],
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        ]

    ]
    MealRecordList.push({
        key: i.toString(),
        canteen_title: `${canteen}`,
        supplier_title: `张三的猪肉`,
        material_single_src: imgList[i],
        cargo_title: `阿${i}`,
        order_unit_price: `￥1${i}.00/斤`,
        order_num: `1${i}0`,
        total_price: `￥500.00`,
        batch_num: `6546546${i}`,
        batch_state_str: `${batchStatus}`,
        username: `王阿${i}`,
        record_time_str: `2019-07-0${i}  1${i}:23`,
    });
}
export default {
    data() {
        return {
            loadingActive: false,
            activeKey: '1',
            // 入库
            loading: true,
            loadingOther: true,
            loadingChecked: true,
            loadingRejection: true,
            loadingInfo: true,
            intoList: [],
            acceptanceList: {},
            rejectionList: {},
            rejectionId: '',
            isAcceptanceInfo: false,
            previewVisible: false,
            previewVisibles: false,
            thirdVisibles: false,
            foodImgVisibles: false,
            previewImage: "",
            previewImages: "",
            thirdImages: "",
            foodImgImages: "",
            causeInfo: "",
            contactMode: "",
            expiry: "",
            fileList: [],
            sedList: [],
            thirdList: [],
            foodImgList: [],
            storehouseOther: [],
            form: this.$form.createForm(this),
            uploading: false,
            uploadings: false,
            isOutStock: false, // 入库方式
            isOtherFood: false,
            isRefusal: false,
            // 联想
            shData: {
                data: [],
                value: '',
                ts: false,
                sc: false
            },
            // 联想
            getPerson: {
                data: [],
                value: '',
                ts: false,
                sc: false
            },
            // 入库信息
            isInputInfo: false,
            acceptanceId: '',
            canteen: [],
            canteenShow: [],
            canteenKey: '全部',
            canteenId: 0,
            storehouse: [],
            storehouseKey: 0,
            storehouseId: '',
            otherIntoList: [],
            otherFood: {},
            stockKey: '1',
            inputInfoVisible: false,
            inputInfoImage: "",
            mealTimeShow: [],
            mealTimesAddKey: "",
            inputInfoList: [],
            inputInfosVisible: false,
            warranty: "d",
            warrantyNum: "",
            early: "d",
            earlyNum: "",
            intoMode: "1",
            mxhcData: {},
            expiry_unit: "H",
            ttr_unit: 'H',
            ttrVal: '5',
            intoShow: {
                canteen: '',
                originMode: '',
                price: '',
                number: '',
                warehouse: '',
                originName: '',
                originAddress: '',
            },
            intoShowNext: {},
            mealTimesIntoKey: "",
            bank_name: "",
            company_name: "",
            orgian_place: "",
            store_style: "",
            package: "",
            net_weight: "",
            inputInfosImage: "",
            inputInfosList: [],
            isSecond: false,
            myForm: this.$form.createForm(this),
            myForms: this.$form.createForm(this),
            isIntoAndOut: false,
            mxClassVal: "",
            // 验收入库记录
            loadingRecord: true,
            column,
            moment,
            canteenInfoKey: '全部',
            canteenInfoId: 0,
            MealRecordList,
            pagination: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            mxClassValInfo: '',
            material_id: '',
            warehouseId: '',
            creenId: '',
            getPersonId: '',
            state: '0',
            stateInfo: '全部',
            startTimeMeal: '',
            endTimeMeal: '',
            startValue: null,
            endValue: null,
            endOpen: false,
            isShowInfo: false,
            // 查看详情
            acceptanceShow: {},
            isNormal: false,    //正常状态
            isNormalOut: false,    //入库即出库
            isNotInto: false,    //拒绝验收
            isOther: false,    //其它食材
            isOtherOut: false,    //其它食材  入库即出库
            isDisabled: false,   //部分入库
        }
    },
    watch: {
        startValue(val) {
            if (val) {
                this.startTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        endValue(val) {
            if (val) {
                this.endTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
    },
    created() {
        this.getIntoList('', '');
        this.getCanteen();
        this.getMealTimes();
        // this.getIntoRecord('', '', '', '', '');
    },
    methods: {
        callback(e) {
            this.activeKey = e;
            this.loadingActive = true;
            if(e == '1'){
                this.getIntoList('', '');
            }else{
                this.getIntoRecord('', '', '', '', '');
            }
            // setTimeout(() => {
            //     this.loadingActive = false;
            // }, 300);
        },
        // 获取入库列表
        getIntoList(canteen_id, keyword) {
            this.$get("api/school/order/instorage?cid=" + canteen_id + "&keyword=" + keyword).then(res => {
                if (res.data.code == 0) {
                    res.data.data.forEach(item => {
                        item.materials.forEach(itemclider => {
                            if (!itemclider.material_single_src) {
                                itemclider.material_single_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.intoList = res.data.data;
                    this.loadingActive = false;
                    this.loading = false;
                } else {
                    this.loadingActive = false;
                    this.loading = false;
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 获取入库记录
        getIntoRecord(canteen_id, keyword, status, begin_time, end_time) {
            var that = this;
            this.$get("api/school/record?page=" + this.pagination.current + "&cid=" + canteen_id + "&keyword=" + keyword + "&status=" + status + "&starttime=" + begin_time + "&endtime=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        if (!item.material_single_src) {
                            item.material_single_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.MealRecordList = res.data.data.data;
                    this.loadingActive = false;
                    this.loadingRecord = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteen.splice(0, 0, data)
                    let arr = []
                    this.canteen.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item)
                        }
                    });
                    this.canteenShow = arr
                } else {
                    console.log(22)
                }
            })
        },
        // 下拉选中
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id;
        },
        // 下拉选中
        selectChangeInfo(e) {
            this.canteenInfoKey = e;
            this.canteenInfoId = this.canteen[e - 1].id;
        },
        mxNumMax(e) {
            console.log(e);
            if (e > this.acceptanceList.order_num) {
                this.form.setFieldsValue({
                    number: '',
                });
            }
        },
        // 搜索
        mxSeach() {
            this.loading = true;
            this.getIntoList(this.canteenId, this.mxClassVal)
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        emitEmptyInfo() {
            this.$refs.userNameInput.focus()
            this.mxClassValInfo = ''
        },
        // 获取其它食材入库列表
        getOtherIntoList(keyword) {
            this.$get("api/school/batch?title=" + keyword).then(res => {
                if (res.data.code == 0) {
                    res.data.data.forEach(item => {
                        item.img_src.forEach(itemclider => {
                            if (!itemclider.url) {
                                itemclider.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.otherIntoList = res.data.data;
                    this.loadingOther = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 搜索
        mxSeachOther() {
            this.loadingOther = true;
            let val = '';
            if (this.shData.value.length <= 0) {
                val = '';
            } else {
                val = this.shData.data[this.shData.value].val;
            }
            this.getOtherIntoList(val);
        },
        // 拒收
        mxRejection(id) {
            this.isRefusal = true;
            this.rejectionId = id;
            this.loadingRejection = true;
            this.$get("api/school/batch/" + id).then(res => {
                if (res.data.code == 0) {
                    if (!res.data.data.material_single_src) {
                        res.data.data.material_single_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                    }
                    this.rejectionList = res.data.data;
                    this.loadingRejection = false;
                } else {
                    console.log(22)
                }
            })

        },
        // 拒收页返回
        backRefusal() {
            this.isRefusal = false;
        },
        // 验收
        mxAcceptance(id) {
            this.acceptanceId = id;
            this.isAcceptanceInfo = true;
            this.loadingChecked = true;
            this.getMealTimes();
            this.$get("api/school/batch/" + id).then(res => {
                if (res.data.code == 0) {
                    this.acceptanceList = res.data.data;
                    this.getStorehouse(res.data.data.canteen_id)
                    this.loadingChecked = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取仓库
        getStorehouse(canteenId) {
            this.$get("api/scale/storehouse", { canteen_id: canteenId }).then(res => {
                if (res.data.code == 0) {
                    this.storehouse = res.data.data;
                    this.storehouseId = res.data.data[this.storehouseKey].id;
                } else {
                    console.log(22)
                }
            })
        },
        // 下拉选中
        storehouseChange(e) {
            this.storehouseKey = e;
            this.storehouseId = this.storehouse[e].id;
        },
        // 获取餐次
        getMealTimes() {
            this.$get("api/common/dictionaries").then(res => {
                if (res.data.code == 0) {
                    this.mealTimeShow = res.data.data.eat;
                } else {
                    console.log(22)
                }
            })
        },
        // 出库用途 下拉选中
        mealTimesAddChange(e) {
            this.mealTimesAddKey = e;
        },
        // 出库用途 下拉选中
        mealTimesIntoChange(e) {
            this.mealTimesIntoKey = e;
        },
        // 验收页返回
        backAcceptance() {
            this.isAcceptanceInfo = false;
            this.isOutStock = false;
            this.stockKey = '1';
        },
        // 提交入库
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let imgArr = [];
                    this.fileList.forEach(item => {
                        imgArr.push(item.response.data.id);
                    })
                    let imgArr2 = [];
                    this.sedList.forEach(item => {
                        imgArr2.push(item.response.data.id);
                    })
                    let imgArr3 = [];
                    if (this.stockKey == '1') {
                        this.mealTimesAddKey = '';
                        imgArr3 = [];
                    } else {
                        this.early = '';
                        this.earlyNum = '';
                        this.thirdList.forEach(item => {
                            imgArr3.push(item.response.data.id);
                        })
                    }
                    let data = {
                        url: "api/school/batch/" + this.acceptanceId,
                        method: 'put',
                        data: {
                            number: values.number,
                            storehou_id: this.storehouseId,
                            photo: imgArr.join(','),
                            bill: imgArr2.join(','),
                            expiry_unit: this.warranty,
                            expiry: this.warrantyNum,
                            state: this.stockKey,
                            ttr_unit: this.early,
                            ttr: this.earlyNum,
                            style: this.mealTimesAddKey,
                            canteen_id: this.acceptanceList.canteen_id,
                            out_bill: imgArr3.join(','),
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('添加记录成功');
                            this.warranty = 'd';
                            this.warrantyNum = '';
                            this.early = 'd';
                            this.earlyNum = '';
                            this.storehouseId = '';
                            this.storehouseKey = 0;
                            this.fileList = [];
                            this.sedList = [];
                            this.thirdList = [];
                            this.isAcceptanceInfo = false;
                            this.loading = true;
                            this.getIntoList(this.canteenId, this.mxClassVal)
                            this.stockKey = '1';
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 入库方式
        stockChange(e) {
            this.stockKey = e;
            if (e == '3') {
                this.isOutStock = true;
            } else {
                this.isOutStock = false;
            }
        },
        // 保质期单位下拉
        mxWarranty(e) {
            this.warranty = e;
        },
        // 预警单位下拉
        mxEarly(e) {
            this.early = e;
        },
        // 食材照片上传
        handleCancel() {
            this.previewVisible = false;
        },
        handlePreview(file) {
            this.previewImage = file.url || file.thumbUrl;
            this.previewVisible = true;
        },
        handleChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-2);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.fileList = fileList;
        },
        // 验收票据上传
        handleCancels() {
            this.previewVisibles = false;
        },
        handlePreviews(file) {
            this.previewImages = file.url || file.thumbUrl;
            this.previewVisibles = true;
        },
        handleChanges(info) {
            let sedList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            sedList = sedList.slice(-2);

            // 2. 从响应读取并显示文件链接
            sedList = sedList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.sedList = sedList;
        },
        // 出库票据上传
        thirdCancels() {
            this.thirdVisibles = false;
        },
        thirdPreviews(file) {
            this.thirdImages = file.url || file.thumbUrl;
            this.thirdVisibles = true;
        },
        thirdChanges(info) {
            let thirdList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            thirdList = thirdList.slice(-2);

            // 2. 从响应读取并显示文件链接
            thirdList = thirdList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.thirdList = thirdList;
        },
        // 拒绝验收上传
        foodImgCancels() {
            this.foodImgVisibles = false;
        },
        foodImgPreviews(file) {
            this.foodImgImages = file.url || file.thumbUrl;
            this.foodImgVisibles = true;
        },
        foodImgChanges(info) {
            let foodImgList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            foodImgList = foodImgList.slice(-2);

            // 2. 从响应读取并显示文件链接
            foodImgList = foodImgList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.foodImgList = foodImgList;
        },
        // 拒收 提交
        mxSureRefusal() {
            let imgArr = [];
            this.foodImgList.forEach(item => {
                imgArr.push(item.response.data.id)
            })
            this.$get("api/school/batch/" + this.rejectionId + "/edit?reason=" + this.causeInfo + "&photo=" + imgArr.join(',')).then(res => {
                if (res.data.code == 0) {
                    this.isRefusal = false;
                    this.$message.success('拒收食材成功');
                    this.foodImgList = [];
                    this.loading = true;
                    this.getIntoList(this.canteenId, this.mxClassVal);
                } else {
                    console.log(22)
                }
            })
        },
        // 其他食材
        mxOtherFood() {
            this.isOtherFood = true;
            this.getOtherIntoList('');
        },
        backOtherFood() {
            this.isOtherFood = false;
            this.otherFood = {};
        },
        mxIntoInfo(val) {
            this.otherFood = val;
            this.material_id = val.id;
            this.isOtherFood = false;
            this.isInputInfo = true;
        },
        // 食堂 选中 获取仓库
        mxCreen(e) {
            this.getPerson.data = [];
            this.creenId = e;
            this.$get("api/scale/storehouse", { canteen_id: e }).then(res => {
                if (res.data.code == 0) {
                    this.storehouseOther = res.data.data;
                } else {
                    console.log(22)
                }
            })
        },
        //搜索数据
        inpSearch(value) {
            let that = this;
            //获取食材
            let data = {
                url: 'api/school/batch?title=' + value,
                method: 'get',
                data: {}
            };
            this.shData.sc = false;
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    if (res.data.data.length > 0) {
                        setTimeout(() => {
                            this.shData.data = [];
                            res.data.data.forEach((e, i) => {
                                this.shData.value = '请选择菜品';
                                let obj = {
                                    key: e.id,
                                    val: e.title,
                                };
                                this.shData.data.push(obj);
                            });
                            this.shData.sc = !this.shData.sc;
                        });
                    } else {
                        this.shData.ts = true;
                        this.shData.sc = true;
                        this.shData.data = [];
                    }
                } else {
                    this.$message.warning(res.data.msg);
                }
            });
        },
        //获取检索数据
        inpChange(key, val) {
            this.shData.value = key
            // this.loogRg = false;
        },
        // 其他食材入库
        //搜索数据
        inpSearchInfo(value) {
            this.$get("api/school/staff?canteen_id=" + this.creenId + "&key_word=" + value).then(res => {
                if (res.data.code == 0) {
                    if (res.data.data.data.length > 0) {
                        setTimeout(() => {
                            this.getPerson.data = [];
                            res.data.data.data.forEach((e, i) => {
                                this.getPerson.value = '请选择菜品';
                                let obj = {
                                    key: e.id,
                                    val: e.title,
                                };
                                this.getPerson.data.push(obj);
                            });
                            this.getPerson.sc = !this.getPerson.sc;
                        });
                    } else {
                        this.getPerson.ts = true;
                        this.getPerson.sc = true;
                        this.getPerson.data = [];
                    }
                } else {
                    console.log(22)
                }
            })
        },
        //获取检索数据
        inpChangeInfo(key) {
            this.getPersonId = key;
            this.getPerson.value = key
        },
        // 保质期单位  变化
        mxExpiryUnit(e) {
            this.expiry_unit = e;
        },
        // 预警时间单位  变化
        mxTtrUnit(e) {
            this.ttr_unit = e;
        },
        // 入库信息 返回
        backInputInfo() {
            this.isOtherFood = true;
            this.isInputInfo = false;
            this.storehouseOther = [];
            this.setNull();
        },
        // 入库方式  判断
        storageModeChange(e) {
            this.intoMode = e;
            if (e == '3') {
                this.isIntoAndOut = true;
                this.ttr_unit = '';
                this.ttrVal = '';
            } else {
                this.isIntoAndOut = false;
            }
        },
        // 仓库选中
        mxWarehouse(e) {
            this.warehouseId = e;
        },
        // 食材照片上传
        inputInfoCancel() {
            this.inputInfoVisible = false;
        },
        inputInfoPreview(file) {
            this.inputInfoImage = file.url || file.thumbUrl;
            this.inputInfoVisible = true;
        },
        inputInfoChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-2);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.inputInfoList = fileList;
        },
        // 验收票据上传
        inputInfosCancel() {
            this.inputInfosVisible = false;
        },
        inputInfosPreview(file) {
            this.inputInfosImage = file.url || file.thumbUrl;
            this.inputInfosVisible = true;
        },
        inputInfosChange(info) {
            let sedList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            sedList = sedList.slice(-2);

            // 2. 从响应读取并显示文件链接
            sedList = sedList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.inputInfosList = sedList;
        },
        // 下一步
        secondSubmit(e) {
            e.preventDefault();
            this.myForm.validateFields((err, values) => {
                if (!err) {
                    Object.assign(values, { 'contactMode': this.contactMode, 'getPersonId': this.getPersonId, 'number': this.intoShow.number, 'intoMode': this.intoMode, 'mealTimesIntoKey': this.mealTimesIntoKey, 'inputInfoList': this.inputInfoList, 'inputInfosList': this.inputInfosList });
                    this.mxhcData = values;
                    if (this.intoShowNext) {
                        this.bank_name = this.intoShowNext.bank_name;
                        this.company_name = this.intoShowNext.company_name;
                        this.orgian_place = this.intoShowNext.orgian_place;
                        this.store_style = this.intoShowNext.store_style;
                        this.package = this.intoShowNext.package;
                        this.net_weight = this.intoShowNext.net_weight;
                        this.mealTimesIntoKey = this.intoShowNext.mealTimesIntoKey;
                        this.expiry_unit = this.intoShowNext.expiry_unit;
                        this.expiry = this.intoShowNext.expiry;
                        this.ttr_unit = this.intoShowNext.ttr_unit;
                        this.ttrVal = this.intoShowNext.ttrVal;
                        this.intoShow.number = this.intoShowNext.ttrVal;
                    }
                    this.isInputInfo = false;
                    this.isSecond = true;
                }
            });
        },
        // 自购  提交
        secondSubmits(e) {
            // this.isInputInfo = false;
            // this.isSecond = true;
            e.preventDefault();
            this.myForms.validateFields((err, values) => {
                if (!err) {
                    let imgArr = [];
                    this.inputInfoList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let imgArr1 = [];
                    this.inputInfosList.forEach(item => {
                        imgArr1.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/batch",
                        method: 'post',
                        data: {
                            material_id: this.material_id,
                            canteen_id: this.mxhcData.canteen,
                            origin_style: this.mxhcData.originMode,
                            pay_uid: this.mxhcData.getPersonId,
                            unit_price: this.mxhcData.price,
                            num: this.mxhcData.number,
                            state: this.mxhcData.intoMode,
                            storehou_id: this.mxhcData.warehouse,
                            origin_name: this.mxhcData.originName,
                            origin_phone: this.mxhcData.contactMode,
                            origin_address: this.mxhcData.originAddress,
                            bank_name: this.bank_name,
                            company_name: this.company_name,
                            orgian_place: this.orgian_place,
                            store_style: this.store_style,
                            package: this.package,
                            net_weight: this.net_weight,
                            expiry_unit: this.expiry_unit,
                            expiry: values.expiry,
                            ttr_unit: this.ttr_unit,
                            ttr: this.ttrVal,
                            style: this.mealTimesIntoKey,
                            photo: imgArr.join(','),
                            bill: imgArr1.join(','),
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('入库食材成功');
                            this.setNull();
                            this.isOtherFood = true;
                            this.isInputInfo = false;
                            this.isSecond = false;
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 清空
        setNull() {
            this.inputInfoList = '';
            this.inputInfosList = '';
            this.getPersonId = '';
            this.intoMode = '1';
            this.contactMode = '';
            this.contactMode = '';
            this.getPerson.value = '';
            this.inputInfoList = [];
            this.inputInfosList = [];
            this.material_id = '';
            this.mxhcData = {};
            this.intoShow = {};
            this.intoShowNext = {};
            this.bank_name = '';
            this.company_name = '';
            this.orgian_place = '';
            this.store_style = '';
            this.package = '';
            this.net_weight = '';
            this.expiry_unit = 'd';
            this.myForms.setFieldsValue({
                expiry: ''
            });
            this.ttr_unit = 'd';
            this.ttrVal = '';
            this.mealTimesIntoKey = '';
        },
        backSecond() {
            this.isOtherFood = true;
            this.isInputInfo = false;
            this.isSecond = false;
            this.storehouseOther = [];
            this.setNull();
        },
        // 上一步
        mxPrebtn() {
            this.isInputInfo = true;
            this.isSecond = false;
            this.intoShow.canteen = this.mxhcData.canteen;
            this.intoShow.originMode = this.mxhcData.originMode;
            this.intoShow.price = this.mxhcData.price;
            this.intoShow.number = this.mxhcData.number;
            this.intoShow.warehouse = this.mxhcData.warehouse;
            this.intoShow.originName = this.mxhcData.originName;
            this.intoShow.originAddress = this.mxhcData.originAddress;
            this.inputInfoList = this.mxhcData.inputInfoList;
            this.inputInfosList = this.mxhcData.inputInfosList;
            this.getPersonId = this.mxhcData.getPersonId;
            this.intoMode = this.mxhcData.intoMode;
            this.contactMode = this.mxhcData.contactMode;
            this.myForms.validateFields((err, values) => {
                if (this.isIntoAndOut) {
                    this.ttr_unit = '';
                    this.ttrVal = '';
                }
                let obj = {
                    bank_name: this.bank_name,
                    company_name: this.company_name,
                    orgian_place: this.orgian_place,
                    store_style: this.store_style,
                    package: this.package,
                    net_weight: this.net_weight,
                    expiry_unit: this.expiry_unit,
                    expiry: values.expiry,
                    ttr_unit: this.ttr_unit,
                    ttrVal: this.ttrVal,
                    mealTimesIntoKey: this.mealTimesIntoKey
                }
                this.intoShowNext = obj;
            })
        },
        // 验收入库记录
        disabledStartDate(startValue) {
            const endValue = this.endValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disabledEndDate(endValue) {
            const startValue = this.startValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        handleStartOpenChange(open) {
            if (!open) {
                this.endOpen = true;
            }
        },
        handleEndOpenChange(open) {
            this.endOpen = open;
        },
        // 状态 选中
        mxState(e) {
            this.state = e;
            this.stateInfo = e;
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.loadingRecord = true;
            this.getIntoRecord('', '', '', '', '');
        },
        // 查询
        inquiryData() {
            this.loadingRecord = true;
            this.getIntoRecord(this.canteenInfoId, this.mxClassValInfo, this.state, this.startTimeMeal, this.endTimeMeal);
        },
        // 重置
        inquiryMealReset() {
            this.startValue = null;
            this.endValue = null;
            this.startTimeMeal = '';
            this.endTimeMeal = '';
            this.canteenInfoKey = '全部';
            this.canteenInfoId = 0;
            this.mxClassValInfo = '';
            this.state = '0';
            this.stateInfo = '全部';

            this.loadingRecord = true;
            this.getIntoRecord('', '', '', '', '');
        },
        // 查看信息
        mxShowInfo(id) {
            this.loadingInfo = true;
            this.$get("api/school/record/" + id).then(res => {
                if (res.data.code == 0) {
                    // record_origin：1：采购入库 2：自购',
                    // record_state：1入库2出库3入库及出库4拒绝验收',
                    // this.isNormal = true;    //正常状态
                    // this.isNormal = true;    //入库即出库
                    // this.isNotInto = true;    //拒绝验收
                    // this.isOther = true;    //其它食材
                    // this.isOtherOut = true;    //其它食材  入库即出库
                    // res.data.data.forEach(item => {
                    this.acceptanceShow = res.data.data;
                    if (res.data.data.record_origin == 1) {
                        if (res.data.data.record_state == 1) {
                            this.isNormal = true; //正常状态
                        } else if (res.data.data.record_state == 3) {
                            this.isNormal = true;  //入库即出库
                        } else {
                            this.isNotInto = true; //拒绝验收
                        }
                    } else {
                        if (res.data.data.record_state == 1) {
                            this.isOther = true;    //其它食材
                        } else {
                            this.isOtherOut = true;    //其它食材  入库即出库
                        }
                    }
                    this.loadingInfo = false;
                } else {
                    this.$message.success(res.data.msg);
                }
            })
            this.isShowInfo = true;
        },
        // 返回
        backShowInfo() {
            this.isShowInfo = false;
            this.isNormal = false;    //正常状态
            this.isNormal = false;    //入库即出库
            this.isNotInto = false;    //拒绝验收
            this.isOther = false;    //其它食材
            this.isOtherOut = false;    //其它食材  入库即出库
        }
    },
}
</script>

<style lang="less" scoped>
.components-input-demo-presuffix {
    display: flex;
    align-items: center;
    margin: 30px 0;
}
.hmTxt {
    margin: 0 10px 0 0;
}
.seachBtn {
    margin-left: 40px;
}
.seachBox {
    width: 245px;
}
.mx_btn {
    margin: 0 20px 0 60px;
}
.mx_btn,
.mx_btns {
    background: #eee;
    padding: 0 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    line-height: 30px;
    .mx_outPoeration {
        cursor: pointer;
    }
}
.mx_btns {
    margin-left: 70px;
}
.mx_mainList {
    padding: 18px 28px;
    margin: 30px 4px 10px;
    box-shadow: 0px 0px 8px 0px #ccc;
    border-radius: 4px;
    .mx_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        .mx_left {
            font-weight: bold;
        }
    }
    .mx_list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #f2f2f2;
        padding: 16px 0;
        img {
            width: 72px;
            height: 72px;
        }
    }
}
// 其它页头部
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
// 验收信息页
.mx_main {
    padding: 18px 28px;
    margin: 4px;
    box-shadow: 0px 0px 8px 0px #ccc;
    border-radius: 4px;
    margin-top: 48px;
    .mx_title {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
    }
    .mx_list {
        display: flex;
        align-items: center;
        padding: 16px 0;
        img {
            width: 77px;
            height: 77px;
            margin-right: 56px;
        }
        .mx_left {
            display: inline-block;
            font-weight: bold;
        }
    }
}
.mx_main_form {
    margin-top: 40px;
    .mx_outschool {
        margin: 0;
        margin-top: 10px;
    }
}
.ant-form {
    margin: 0;
}
.clearfix span {
    display: flex;
}
.mx_staff {
    margin: 20px 0;
}
.mx_inputs {
    width: 100%;
    position: absolute;
    top: 36px;
    left: 0;
    background: #fff;
    border: 1px solid #ccc;
    p {
        margin: 0;
        padding-left: 12px;
        cursor: pointer;
    }
    p:hover {
        background: #eee;
    }
}
.mx_foodList {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li {
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 5px;
        margin: 0 30px 30px 0;
        cursor: pointer;
        img {
            width: 166px;
            height: 158px;
            border-radius: 5px 5px 0 0;
        }
        p {
            margin: 10px 0;
            padding-left: 10px;
        }
    }
    li:hover {
        background: #f2f2f2;
    }
}
.mx_divide {
    line-height: 30px;
    padding: 0 10px;
}
.mx_btnbg {
    margin: 0 10px;
}

.mx_staff {
    margin: 20px 0;
}
.mx_operate {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .mx_switch {
        margin: 0 80px;
    }
    .mx_btns {
        background: #eee;
        padding: 0 10px;
        margin-left: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        color: #000;
        line-height: 30px;
        .mx_outPoeration {
            cursor: pointer;
            .mx_icon {
                margin-right: 6px;
            }
        }
    }
}
.mx_operation {
    margin: 0 5px;
}
.mx_model {
    display: flex;
    justify-content: center;
    align-items: center;
    .mx_model_mainDel {
        line-height: 160px;
    }
}
// 查看详情
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.mx_main {
    margin-top: 40px;
    color: #000;
    font-size: 16px;
    .mx_receipt {
        padding: 5px;
        margin-top: 50px;
        .mx_receipt_main {
            width: 220px;
            font-size: 14px;
            padding: 15px;
            box-shadow: 0px 0px 6px 0px #ccc;
            img {
                width: 100%;
                height: 25px;
            }
            .text_p {
                margin: 0;
            }
            .mx_receipt_main_header {
                text-align: center;
            }
        }
    }
}

// 添加记录
.clearfix span {
    display: flex;
}
</style>