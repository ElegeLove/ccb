<template>
    <div id="mxDailyRecord">
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
                    tab="健康晨检"
                    key="1"
                >
                    <!-- main -->
                    <div v-if="!isShowHealthy && !isUpdataHealthy">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenHealthyKey"
                                    style="width:150px;"
                                    @change="selectHealthyChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            class="mx_form"
                        >
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="healthyStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="healthyStartValue"
                                    placeholder="选择日期"
                                    @openChange="healthyStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="healthyEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择日期"
                                    v-model="healthyEndValue"
                                    :open="endOpenHealthy"
                                    @openChange="healthyEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    html-type="submit"
                                    @click="mxInquiryHealthy"
                                >查询</a-button>
                                <a-button @click="mxResetHealthy">重置</a-button>
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                @click="allUpdataHealthy"
                            >批量编辑</a-button>
                            <a-modal
                                title="批量编辑"
                                centered
                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                v-model="isAllUpdata"
                                @cancel="mxAllUpdataCel"
                                @ok="mxAllUpdata"
                                okText="确认"
                                cancelText="取消"
                            >
                                <div class="mx_model">
                                    <a-form
                                        :form='allForm'
                                        @submit="mxAllUpdata"
                                    >
                                        <a-form-item>
                                            <p>健康状况</p>
                                            <a-checkbox-group
                                                @change="onBoxActive"
                                                v-model="healthTypeAll"
                                            >
                                                <a-checkbox
                                                    v-for="item in healthTypeList"
                                                    :value="item.id"
                                                >{{item.title}}</a-checkbox>
                                            </a-checkbox-group>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="otherHealthAll"
                                            style="margin:-30px 0 0 70px;"
                                        >
                                            <textarea
                                                style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                                cols="50"
                                                rows="5"
                                                placeholder="请填写其他原因"
                                                v-model="otherAllMain"
                                            ></textarea>
                                        </a-form-item>
                                        <a-form-item>
                                            <p>晨检时间</p>
                                            <a-time-picker
                                                @change="onChangeAllTime"
                                                :value="moment(attendanceAllTime, 'HH:mm')"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item>
                                            <p>晨检人&nbsp;&nbsp;</p>
                                            <a-input
                                                placeholder="填写晨检人姓名"
                                                style="width:300px;"
                                                v-decorator="[
                                                'inspectionName',
                                                {rules: [{ required: true, message: '请填写填写晨检人姓名' }]}
                                            ]"
                                            />
                                        </a-form-item>
                                    </a-form>
                                </div>
                            </a-modal>
                            <div class="mx_switch">
                                <span>公示到家长端：</span>
                                <a-switch
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    defaultChecked
                                />
                            </div>
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
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loading"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                                :columns="healthyColumn"
                                :dataSource="healthyList"
                                bordered
                                :pagination="pagination"
                                @change="healthyTableChange"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="annex_src"
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
                                                @click="mxShowHealthy(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdataHealthy(record)"
                                            >编辑</a>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowHealthy">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowHealthy"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingShowHealthy"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <div class="mx_updataHealthy">
                                    <img
                                        :src="showList.annex_src"
                                        alt=""
                                    >
                                    <div>
                                        <p class="mx_updataHealthy_title">{{showList.nickname}}</p>
                                        <p>{{showList.canteen_str}}&nbsp;&nbsp;&nbsp;&nbsp;{{showList.position}}</p>
                                    </div>
                                </div>
                                <p>
                                    出勤日期：
                                    <span>{{showList.meal_date_str}}</span>
                                </p>
                                <p>
                                    健康状况：
                                    <span>{{showList.health_str}}</span>
                                </p>
                                <p>
                                    晨检时间：
                                    <span>{{isMorningCheck?showList.meal_time_str:'--'}}</span>
                                </p>
                                <p>
                                    晨&nbsp;&nbsp;检&nbsp;&nbsp;人：
                                    <span>{{isMorningCheck?showList.person:'--'}}</span>
                                </p>
                                <p v-if="isMorningCheck">
                                    记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                    <span>{{showList.sponsor_str}}</span>
                                </p>
                                <p v-if="isMorningCheck">
                                    记录时间：
                                    <span>{{showList.created_at_str}}</span>
                                </p>
                                <div
                                    class="mx_receipt"
                                    v-if="isMorningCheck"
                                >
                                    <p>健康晨检小票<a @click="mxPrintingHealthy">（点击打印）</a></p>
                                    <div class="mx_receipt_main">
                                        <p class="mx_receipt_main_header">健康晨检小票</p>
                                        <img
                                            src="../../../assets/border_bottom.png"
                                            alt=""
                                        >
                                        <p>食&emsp;&emsp;堂：{{showList.canteen_str}}</p>
                                        <p>出&nbsp;&nbsp;勤&nbsp;&nbsp;人：{{showList.nickname}}</p>
                                        <p>职&emsp;&emsp;位：{{showList.position}}</p>
                                        <p>出勤日期：{{showList.meal_date_str}}</p>
                                        <p>健康状况：{{showList.health_str}}</p>
                                        <p>晨检时间：{{showList.meal_time_str}}</p>
                                        <p>晨&nbsp;&nbsp;检&nbsp;&nbsp;人：{{showList.person}}</p>
                                        <img
                                            src="../../../assets/border_bottom.png"
                                            alt=""
                                        >
                                        <div style="display: flex;align-items: center;">
                                            <p>扫描二维码即可查看
                                                样详情及图片</p>
                                            <img
                                                style="width:54px;height:54px;"
                                                src="../../../assets/erweima.jpg"
                                                alt=""
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 编辑 -->
                    <div v-show="isUpdataHealthy">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backUpdataHealthy"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">修改信息</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <div class="mx_updataHealthy">
                            <img
                                :src="updataList.annex_src"
                                alt=""
                            >
                            <div>
                                <p class="mx_updataHealthy_title">{{updataList.nickname}}</p>
                                <p>{{updataList.canteen_str}}&nbsp;&nbsp;&nbsp;&nbsp;{{updataList.position}}</p>
                            </div>
                        </div>
                        <a-form
                            :form="form"
                            @submit="handleSubmit"
                        >
                            <a-form-item label="出勤日期">
                                <a-date-picker
                                    placeholder="出勤日期"
                                    :value="moment(attendanceData, 'YYYY-MM-DD')"
                                    style="width:300px;"
                                    disabled="disabled"
                                />
                            </a-form-item>
                            <a-form-item label="健康状况">
                                <a-checkbox-group
                                    @change="onChangeHealthType"
                                    v-model="healthType"
                                >
                                    <a-checkbox
                                        v-for="item in healthTypeList"
                                        :value="item.id"
                                    >{{item.title}}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item v-if="otherHealth">
                                <textarea
                                    style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                    cols="76"
                                    rows="5"
                                    placeholder="请填写其他原因"
                                    v-model="otherMain"
                                ></textarea>
                            </a-form-item>
                            <a-form-item label="晨检时间">
                                <a-time-picker
                                    @change="onChangeTimeUpdata"
                                    :value="moment(attendanceTime, 'HH:mm')"
                                    format="HH:mm"
                                />
                            </a-form-item>
                            <a-form-item label="晨检人">
                                <a-input
                                    placeholder="填写晨检人姓名"
                                    style="width:300px;"
                                    v-decorator="[
                                    'inspectionName',
                                    {rules: [{ required: true, message: '请填写填写晨检人姓名' }]}
                                ]"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    type="primary"
                                    html-type="submit"
                                >立即保存</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="安全巡检"
                    key="2"
                    forceRender
                >
                    <!-- main -->
                    <div v-if="!isAddSafety && !isShowSafety && !isUpdataSafety">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenSafetyKey"
                                    style="width:150px;"
                                    @change="selectSafetyChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            class="mx_form"
                        >
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="safetyStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="safetyStartValue"
                                    placeholder="选择日期"
                                    @openChange="safetyStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="safetyEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择日期"
                                    v-model="safetyEndValue"
                                    :open="endOpenSafety"
                                    @openChange="safetyEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    html-type="submit"
                                    @click="mxInquirySafety"
                                >查询</a-button>
                                <a-button @click="mxResetSafety">重置</a-button>
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                @click="mxAddSafety"
                            >添加记录</a-button>
                            <div class="mx_switch">
                                <span>公示到家长端：</span>
                                <a-switch
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    defaultChecked
                                />
                            </div>
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
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingSafety"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="safetyColumn"
                                :dataSource="safetyList"
                                bordered
                                :pagination="paginationSafety"
                                @change="safetyTableChange"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="photos_src"
                                    slot-scope="text, record,index"
                                >
                                    <viewer>
                                        <img
                                            v-for="item in record.photos_src"
                                            style="width:60px;heigth:60px;margin:0 10px;"
                                            :src="item.url"
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
                                                @click="mxShowSafety(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateSafety(record)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDelSafety(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDelSafety"
                                                @cancel="mxSafetyCel"
                                                @ok="mxDelSafetysure"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条安全巡检记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddSafety">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backAddSafety"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">添加记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <a-modal
                            title="确认返回"
                            centered
                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                            v-model="isGoSafety"
                            @cancel="mxCancelSafety"
                            @ok="mxGoSafety"
                            okText="确认"
                            cancelText="取消"
                        >
                            <div class="mx_model">
                                <div class="mx_model_mainDel">
                                    您还未保存所添加记录，是否继续返回
                                </div>
                            </div>
                        </a-modal>
                        <!-- main -->
                        <a-form
                            :form="formSafety"
                            @submit="safetySubmit"
                        >
                            <a-row class="mx_main">
                                <a-col :span="8">
                                    <a-form-item label="所属食堂">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择所属食堂"
                                            v-decorator="[
                                                'canteen',
                                                {rules: [{ required: true, message: '请选择所属食堂' }]}
                                            ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in canteenShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="巡检点">
                                        <a-input
                                            placeholder="填写巡检点"
                                            style="width:300px;"
                                            v-decorator="[
                                            'siteName',
                                            {rules: [{ required: true, message: '请填写巡检点' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="安全情况">
                                        <a-radio-group
                                            @change="onChangeSituation"
                                            v-model="valueSafety"
                                        >
                                            <a-radio
                                                :value="1"
                                                style="margin-right:10px;"
                                            >正常</a-radio>
                                            <a-radio :value="0">异常</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                    <a-form-item v-if="isAbnormal">
                                        <textarea
                                            style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                            cols="76"
                                            rows="5"
                                            v-model="mainSafety"
                                            placeholder="请填写异常详情"
                                        ></textarea>
                                    </a-form-item>
                                    <a-form-item label="巡检时间">
                                        <a-date-picker
                                            style="margin-right: 6px;"
                                            placeholder="选择巡检时间"
                                            @change="onChangeDataMeal"
                                            :defaultValue="moment(newDataSafety, 'YYYY-MM-DD')"
                                        />
                                        <a-time-picker
                                            @change="onChangeTimeMeal"
                                            :defaultValue="moment(newTimeSafety, 'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="巡检人">
                                        <a-input
                                            placeholder="填写巡检人姓名"
                                            style="width:300px;"
                                            v-decorator="[
                                            'person',
                                            {rules: [{ required: true, message: '请填写巡检人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="巡检照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="safetyAddList"
                                                    @preview="safetyPreview"
                                                    @change="safetyAddChange"
                                                >
                                                    <div
                                                        v-if="safetyAddList.length < 1"
                                                        v-decorator="[
                                                        '巡检照片',
                                                        {rules: [{ required: true, message: '请录入巡检照片' }]}
                                                    ]"
                                                    >
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="safetyAddVisible"
                                                    :footer="null"
                                                    @cancel="safetyAddCancel"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="safetyAddImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="safetyAddList"
                                                @preview="safetyPreview"
                                                @change="safetyAddChange"
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
                                >立即添加</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-show="isUpdataSafety">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backUpdataSafety"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-form
                            :form="formUpdataSubmit"
                            @submit="safetyUpdataSubmit"
                        >
                            <a-row class="mx_main">
                                <a-col :span="8">
                                    <a-form-item label="所属食堂">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择所属食堂"
                                            v-decorator="[
                                                'canteen',
                                                {rules: [{ required: true, message: '请选择所属食堂' }]}
                                            ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in canteenShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="巡检点">
                                        <a-input
                                            placeholder="填写巡检点"
                                            style="width:300px;"
                                            v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请填写巡检点' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="安全情况">
                                        <a-radio-group
                                            @change="onChangeSituat"
                                            v-model="mainSafetyUpdataKey"
                                        >
                                            <a-radio
                                                :value="1"
                                                style="margin-right:10px;"
                                            >正常</a-radio>
                                            <a-radio :value="0">异常</a-radio>
                                        </a-radio-group>
                                    </a-form-item>
                                    <a-form-item v-if="isAbnormals">
                                        <textarea
                                            style="resize:none;border-color:#ccc;border-radius: 6px;line-height: 20px;"
                                            cols="76"
                                            rows="5"
                                            v-model="mainSafetyUpdata"
                                            placeholder="请填写异常详情"
                                        ></textarea>
                                    </a-form-item>
                                    <a-form-item label="巡检时间">
                                        <a-date-picker
                                            style="margin-right: 6px;"
                                            placeholder="选择巡检时间"
                                            @change="onChangeDataUpdataSafe"
                                            :value="moment(updataDataSafety, 'YYYY-MM-DD')"
                                        />
                                        <a-time-picker
                                            @change="onChangeTimeUpdataSafe"
                                            :value="moment(updataTimeSafety,'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="巡检人">
                                        <a-input
                                            placeholder="填写巡检人姓名"
                                            style="width:300px;"
                                            v-decorator="[
                                            'person',
                                            {rules: [{ required: true, message: '请填写巡检人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="巡检照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="safetyUpdataList"
                                                    @preview="safetyUpdataPreview"
                                                    @change="safetyUpdataChange"
                                                >
                                                    <div
                                                        v-if="safetyUpdataList.length < 1"
                                                        v-decorator="[
                                                        '巡检照片',
                                                        {rules: [{ required: true, message: '请录入巡检照片' }]}
                                                    ]"
                                                    >
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="safetyUpdataVisible"
                                                    :footer="null"
                                                    @cancel="safetyUpdataCancel"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="safetyUpdataImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="safetyUpdataList"
                                                @preview="safetyUpdataPreview"
                                                @change="safetyUpdataChange"
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
                                >更新保存</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowSafety">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowSafety"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingShowSafety"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <a-row>
                                    <a-col :span="8">
                                        <p>
                                            食&emsp;&emsp;堂：
                                            <span>{{showSafetyList.canteen_str}}</span>
                                        </p>
                                        <p>
                                            巡&nbsp;&nbsp;检&nbsp;&nbsp;点：
                                            <span>{{showSafetyList.title}}</span>
                                        </p>
                                        <p>
                                            安全情况：
                                            <span>{{showSafetyList.happen}}</span>
                                        </p>
                                        <p>
                                            巡检时间：
                                            <span>{{showSafetyList.time_str}}</span>
                                        </p>
                                        <p>
                                            巡&nbsp;&nbsp;检&nbsp;&nbsp;人：
                                            <span>{{showSafetyList.person}}</span>
                                        </p>
                                        <p>
                                            记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                            <span>{{showSafetyList.sponsor_str}}</span>
                                        </p>
                                        <p>
                                            记录时间：
                                            <span>{{showSafetyList.created_at_str}}</span>
                                        </p>
                                        <div class="mx_receipt">
                                            <p>安全巡检小票 <a @click="mxPrintingMeal">（点击打印）</a></p>
                                            <div class="mx_receipt_main">
                                                <p class="mx_receipt_main_header">安全巡检小票</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <p>食&emsp;&emsp;堂：{{showSafetyList.canteen_str}}</p>
                                                <p>巡&nbsp;&nbsp;检&nbsp;&nbsp;点：{{showSafetyList.title}}</p>
                                                <p>安全情况：{{showSafetyList.happen}}</p>
                                                <p>巡检日期：{{moment(showSafetyList.time_str).format("YYYY-MM-DD")}}</p>
                                                <p>巡检时间：{{moment(showSafetyList.time_str).format("HH:mm")}}</p>
                                                <p>巡&nbsp;&nbsp;检&nbsp;&nbsp;人：{{showSafetyList.person}}</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <div style="display: flex;align-items: center;">
                                                    <p>扫描二维码即可查看样详情及图片</p>
                                                    <img
                                                        style="width:54px;height:54px;"
                                                        src="../../../assets/erweima.jpg"
                                                        alt=""
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </a-col>
                                    <a-col :span="16">
                                        <div class="clearfix">
                                            <p>巡检照片</p>
                                            <viewer>
                                                <img
                                                    style="width:100px;height:100px;margin-right:30px;"
                                                    v-for="item in showSafetyList.photos_src"
                                                    :src='item.url'
                                                    alt
                                                    srcset
                                                />
                                            </viewer>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="场地消毒"
                    key="3"
                >
                    <!-- main -->
                    <div v-if="!isAddDisinfect && !isShowDisinfect && !isUpdataDisinfect">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenSiteKey"
                                    style="width:150px;"
                                    @change="selectSiteChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            class="mx_form"
                        >
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="disinfectStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="disinfectStartValue"
                                    placeholder="选择时间"
                                    @openChange="disinfectStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="disinfectEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择时间"
                                    v-model="disinfectEndValue"
                                    :open="endOpenDisinfect"
                                    @openChange="disinfectEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    html-type="submit"
                                    @click="mxInquirySite"
                                >查询</a-button>
                                <a-button @click="mxResetSite">重置</a-button>
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                @click="mxAddDisinfect"
                            >添加记录</a-button>
                            <div class="mx_switch">
                                <span>公示到家长端：</span>
                                <a-switch
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    defaultChecked
                                />
                            </div>
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
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingSite"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="disinfectColumn"
                                :dataSource="disinfectList"
                                bordered
                                :pagination="paginationSite"
                                @change="disinfectTableChange"
                            >
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="photos_src"
                                    slot-scope="text, record,index"
                                >
                                    <viewer>
                                        <img
                                            v-for="item in record.photos_src"
                                            style="width:60px;heigth:60px;margin:0 10px;"
                                            :src="item.url"
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
                                                @click="mxShowDisinfect(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateDisinfect(record.id)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDelDisinfect(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDelDisinfect"
                                                @cancel="mxDisinfectCel"
                                                @ok="mxDelDisinfectsure"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条场地消毒记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddDisinfect">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backAddDisinfect"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">添加记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <a-modal
                            title="确认返回"
                            centered
                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                            v-model="isGoDisinfect"
                            @cancel="mxCancelDisinfect"
                            @ok="mxGoDisinfect"
                            okText="确认"
                            cancelText="取消"
                        >
                            <div class="mx_model">
                                <div class="mx_model_mainDel">
                                    您还未保存所添加记录，是否继续返回
                                </div>
                            </div>
                        </a-modal>
                        <!-- main -->
                        <a-form
                            :form="formAddDisinfect"
                            @submit="disinfectSubmit"
                        >
                            <a-row class="mx_main">
                                <a-col :span="8">
                                    <a-form-item label="所属食堂">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择所属食堂"
                                            v-decorator="[
                                                'canteen',
                                                {rules: [{ required: true, message: '请选择所属食堂' }]}
                                            ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in canteenShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="消毒点">
                                        <a-input
                                            placeholder="填写消毒点"
                                            style="width:300px;"
                                            v-decorator="[
                                            'disinfectSite',
                                            {rules: [{ required: true, message: '请填写消毒点名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="消毒方式">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择消毒方式"
                                            v-decorator="[
                                                'degassing',
                                                {rules: [{ required: true, message: '请选择消毒方式' }]}
                                            ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in degassingMode"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="执行时间">
                                        <a-date-picker
                                            style="margin-right: 6px;"
                                            placeholder="选择执行时间"
                                            @change="onChangeDataDegassing"
                                            :defaultValue="moment(degassingData, 'YYYY-MM-DD')"
                                        />
                                        <a-time-picker
                                            @change="onChangeTimeDegassing"
                                            :defaultValue="moment(degassingTime, 'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="执行人">
                                        <a-input
                                            placeholder="填写执行人姓名"
                                            style="width:300px;"
                                            v-decorator="[
                                            'person',
                                            {rules: [{ required: true, message: '请填写执行人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="消毒照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="disinfectAddList"
                                                    @preview="disinfectPreview"
                                                    @change="disinfectAddChange"
                                                >
                                                    <div
                                                        v-if="disinfectAddList.length < 1"
                                                        v-decorator="[
                                                        '消毒照片',
                                                        {rules: [{ required: true, message: '请录入消毒照片' }]}
                                                    ]"
                                                    >
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="disinfectAddVisible"
                                                    :footer="null"
                                                    @cancel="disinfectAddCancel"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="disinfectAddImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="disinfectAddList"
                                                @preview="disinfectPreview"
                                                @change="disinfectAddChange"
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
                                >立即添加</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-if="isUpdataDisinfect">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backUpdataDisinfect"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingUpdataDisinfect"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-form
                                :form="formUpdataDisinfect"
                                @submit="disinfectUpdataSubmit"
                            >
                                <a-row class="mx_main">
                                    <a-col :span="8">
                                        <a-form-item label="所属食堂">
                                            <a-select
                                                style="width:300px;"
                                                placeholder="选择所属食堂"
                                                v-decorator="[
                                                'canteen',
                                                {initialValue: updataDisinfect.canteen,rules: [{ required: true, message: '请选择所属食堂' }]}
                                            ]"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in canteenShow"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="消毒点">
                                            <a-input
                                                placeholder="填写消毒点"
                                                style="width:300px;"
                                                v-decorator="[
                                            'title',
                                            {initialValue: updataDisinfect.title,rules: [{ required: true, message: '请填写消毒点名称' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="消毒方式">
                                            <a-select
                                                style="width:300px;"
                                                placeholder="选择消毒方式"
                                                v-decorator="[
                                                'degassing',
                                                {initialValue: updataDisinfect.degassing,rules: [{ required: true, message: '请选择消毒方式' }]}
                                            ]"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in degassingMode"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="执行时间">
                                            <a-date-picker
                                                style="margin-right: 6px;"
                                                placeholder="选择执行时间"
                                                @change="mxDegUpdataDateChange"
                                                :value="moment(exeData, 'YYYY-MM-DD')"
                                            />
                                            <a-time-picker
                                                @change="mxDegUpdataTimeChange"
                                                :value="moment(exeTime, 'HH:mm')"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item label="执行人">
                                            <a-input
                                                placeholder="填写执行人姓名"
                                                style="width:300px;"
                                                v-decorator="[
                                            'person',
                                            {initialValue: updataDisinfect.person,rules: [{ required: true, message: '请填写执行人姓名' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="16">
                                        <a-form-item label="消毒照片">
                                            <div>
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="updataDisinfect.disinfectUpdataList"
                                                        @preview="disinfectUpdataPreview"
                                                        @change="disinfectUpdataChange"
                                                    >
                                                        <div
                                                            v-if="updataDisinfect.disinfectUpdataList.length < 1"
                                                            v-decorator="[
                                                        '消毒照片',
                                                        {rules: [{ required: true, message: '请录入消毒照片' }]}
                                                    ]"
                                                        >
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="disinfectUpdataVisible"
                                                        :footer="null"
                                                        @cancel="disinfectUpdataCancel"
                                                    >
                                                        <img
                                                            alt="example"
                                                            style="width: 100%"
                                                            :src="disinfectUpdataImage"
                                                        />
                                                    </a-modal>
                                                </div>
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    :fileList="updataDisinfect.disinfectUpdataList"
                                                    @preview="disinfectUpdataPreview"
                                                    @change="disinfectUpdataChange"
                                                >
                                                    <a-button>
                                                        <a-icon type="upload" />更换图片
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
                                    >更新保存</a-button>
                                </a-form-item>
                            </a-form>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowDisinfect">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowDisinfect"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingShowSute"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <a-row>
                                    <a-col :span="8">
                                        <p>
                                            食&emsp;&emsp;堂：
                                            <span>{{showDisinfectList.canteen_str}}</span>
                                        </p>
                                        <p>
                                            消&nbsp;&nbsp;毒&nbsp;&nbsp;点：
                                            <span>{{showDisinfectList.title}}</span>
                                        </p>
                                        <p>
                                            消毒方式：
                                            <span>{{showDisinfectList.manner_str}}</span>
                                        </p>
                                        <p>
                                            执行时间：
                                            <span>{{showDisinfectList.time_str}}</span>
                                        </p>
                                        <p>
                                            执&nbsp;&nbsp;行&nbsp;&nbsp;人：
                                            <span>{{showDisinfectList.person}}</span>
                                        </p>
                                        <p>
                                            记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                            <span>{{showDisinfectList.sponsor_str}}</span>
                                        </p>
                                        <p>
                                            记录时间：
                                            <span>{{showDisinfectList.created_at_str}}</span>
                                        </p>
                                        <div class="mx_receipt">
                                            <p>场地消毒小票 <a @click="mxPrintingSite">（点击打印）</a></p>
                                            <div class="mx_receipt_main">
                                                <p class="mx_receipt_main_header">场地消毒小票</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <p>食&emsp;&emsp;堂：{{showDisinfectList.canteen_str}}</p>
                                                <p>消&nbsp;&nbsp;毒&nbsp;&nbsp;点：{{showDisinfectList.title}}</p>
                                                <p>消毒方式：{{showDisinfectList.manner_str}}</p>
                                                <p>执行日期：{{moment(showDisinfectList.time_str).format("YYYY-MM-DD")}}</p>
                                                <p>执行时间：{{moment(showDisinfectList.time_str).format("HH:mm")}}</p>
                                                <p>记&nbsp;&nbsp;录&nbsp;&nbsp;人：{{showDisinfectList.sponsor_str}}</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <div style="display: flex;align-items: center;">
                                                    <p>扫描二维码即可查看
                                                        样详情及图片</p>
                                                    <img
                                                        style="width:54px;height:54px;"
                                                        src="../../../assets/erweima.jpg"
                                                        alt=""
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </a-col>
                                    <a-col :span="16">
                                        <div class="clearfix">
                                            <p>消毒照片</p>
                                            <viewer>
                                                <img
                                                    style="width:100px;height:100px;margin-right:30px;"
                                                    v-for="item in showDisinfectList.photos_src"
                                                    :src='item.url'
                                                    alt
                                                    srcset
                                                />
                                            </viewer>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="废弃物处理"
                    key="4"
                >
                    <!-- main -->
                    <div v-if="!isAddDisWaste && !isShowDisWaste && !isUpdataDisWaste">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenWasteKey"
                                    style="width:150px;"
                                    @change="selectWasteChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            class="mx_form"
                        >
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="disWasteStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="disWasteStartValue"
                                    placeholder="选择日期"
                                    @openChange="disWasteStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="disWasteEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择日期"
                                    v-model="disWasteEndValue"
                                    :open="endOpenDisWaste"
                                    @openChange="disWasteEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    html-type="submit"
                                    @click="mxInquiryWaste"
                                >查询</a-button>
                                <a-button @click="mxResetWaste">重置</a-button>
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                @click="mxAddDisWaste"
                            >添加记录</a-button>
                            <div class="mx_switch">
                                <span>公示到家长端：</span>
                                <a-switch
                                    checkedChildren="开"
                                    unCheckedChildren="关"
                                    defaultChecked
                                />
                            </div>
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
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingWaste"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="disWasteColumn"
                                :dataSource="disWasteList"
                                bordered
                                :pagination="paginationWaste"
                                @change="disWasteTableChange"
                            >
                                <template
                                    slot="operation"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        <div>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxShowDisWaste(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateDisWaste(record.id)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDelDisWaste(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDelDisWaste"
                                                @cancel="mxDisWasteCel"
                                                @ok="mxDelDisWastesure"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条场地消毒记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddDisWaste">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backAddDisWaste"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">添加记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <a-modal
                            title="确认返回"
                            centered
                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                            v-model="isGoDisWaste"
                            @cancel="mxCancelDisWaste"
                            @ok="mxGoDisWaste"
                            okText="确认"
                            cancelText="取消"
                        >
                            <div class="mx_model">
                                <div class="mx_model_mainDel">
                                    您还未保存所添加记录，是否继续返回
                                </div>
                            </div>
                        </a-modal>
                        <!-- main -->
                        <a-form
                            :form="formWaste"
                            @submit="disWasteSubmit"
                        >
                            <a-form-item label="所属食堂">
                                <a-select
                                    style="width:300px;"
                                    placeholder="选择所属食堂"
                                    v-decorator="[
                                        'canteen',
                                        {rules: [{ required: true, message: '请选择所属食堂' }]}
                                    ]"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteenShow"
                                        :key="item.id"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="废弃物名称">
                                <a-input
                                    placeholder="填写废弃物名称"
                                    style="width:300px;"
                                    v-decorator="[
                                            'title',
                                            {rules: [{ required: true, message: '请填写废弃物名称' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="重量（kg）">
                                <a-input
                                    placeholder="填写重量"
                                    style="width:300px;"
                                    v-decorator="[
                                            'weight',
                                            {rules: [{ required: true, message: '请填写废弃物重量' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="处理金额（元）">
                                <a-input
                                    placeholder="填写处理金额"
                                    style="width:300px;"
                                    v-decorator="[
                                            'price',
                                            {rules: [{ required: true, message: '请填写处理金额' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="收购单位">
                                <a-input
                                    placeholder="填收购单位名称"
                                    style="width:300px;"
                                    v-decorator="[
                                            'purcha',
                                            {rules: [{ required: true, message: '请填收购单位名称' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="收购人">
                                <a-input
                                    placeholder="填写收购人姓名"
                                    style="width:300px;"
                                    v-decorator="[
                                            'purcha_title',
                                            {rules: [{ required: true, message: '请填写收购人姓名' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="联系电话">
                                <a-input
                                    placeholder="填写收购人联系电话"
                                    style="width:300px;"
                                    v-decorator="[
                                            'purcha_phone',
                                            {rules: [{ required: true, message: '请填写收购人联系电话' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item label="处理时间">
                                <a-date-picker
                                    style="margin-right: 6px;"
                                    placeholder="处理时间"
                                    @change="onChangeAddWasteData"
                                    :defaultValue="moment(addWasteData, 'YYYY-MM-DD')"
                                />
                                <a-time-picker
                                    @change="onChangeAddWasteTime"
                                    :defaultValue="moment(addWasteTime, 'HH:mm')"
                                    format="HH:mm"
                                />
                            </a-form-item>
                            <a-form-item label="食堂执行人">
                                <a-input
                                    placeholder="填写食堂处理人姓名"
                                    style="width:300px;"
                                    v-decorator="[
                                            'person',
                                            {rules: [{ required: true, message: '请填写食堂处理人姓名' }]}
                                        ]"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    type="primary"
                                    html-type="submit"
                                >立即添加</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-if="isUpdataDisWaste">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backUpdataDisWaste"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingUpdataWaste"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-form
                                :form="formUpdataDisWaste"
                                @submit="disWasteUpdataSubmit"
                            >
                                <a-form-item label="所属食堂">
                                    <a-select
                                        style="width:300px;"
                                        placeholder="选择所属食堂"
                                        v-decorator="[
                                    'canteen_id',
                                    {initialValue: updateDisWaste.canteen_id,rules: [{ required: true, message: '请选择所属食堂' }]}
                                ]"
                                    >
                                        <a-select-option
                                            v-for="(item,index) in canteenShow"
                                            :key="item.id"
                                        >{{item.title}}</a-select-option>
                                    </a-select>
                                </a-form-item>
                                <a-form-item label="废弃物名称">
                                    <a-input
                                        placeholder="填写废弃物名称"
                                        style="width:300px;"
                                        v-decorator="[
                                            'title',
                                            {initialValue: updateDisWaste.title,rules: [{ required: true, message: '请填写废弃物名称' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="重量（kg）">
                                    <a-input
                                        placeholder="填写重量"
                                        style="width:300px;"
                                        v-decorator="[
                                            'weight',
                                            {initialValue: updateDisWaste.weight,rules: [{ required: true, message: '请填写废弃物重量' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="处理金额（元）">
                                    <a-input
                                        placeholder="填写处理金额"
                                        style="width:300px;"
                                        v-decorator="[
                                            'price',
                                            {initialValue: updateDisWaste.price,rules: [{ required: true, message: '请填写处理金额' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="收购单位">
                                    <a-input
                                        placeholder="填收购单位名称"
                                        style="width:300px;"
                                        v-decorator="[
                                            'purcha',
                                            {initialValue: updateDisWaste.purcha,rules: [{ required: true, message: '请填收购单位名称' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="收购人">
                                    <a-input
                                        placeholder="填写收购人姓名"
                                        style="width:300px;"
                                        v-decorator="[
                                            'purcha_title',
                                            {initialValue: updateDisWaste.purcha_title,rules: [{ required: true, message: '请填写收购人姓名' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="联系电话">
                                    <a-input
                                        placeholder="填写收购人联系电话"
                                        style="width:300px;"
                                        v-decorator="[
                                            'purcha_phone',
                                            {initialValue: updateDisWaste.purcha_phone,rules: [{ required: true, message: '请填写收购人联系电话' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item label="处理时间">
                                    <a-date-picker
                                        style="margin-right: 6px;"
                                        placeholder="处理时间"
                                        @change="mxWasteUpdataDateChange"
                                        :value="moment(updataDate, 'YYYY-MM-DD')"
                                    />
                                    <a-time-picker
                                        @change="mxWasteUpdataTimeChange"
                                        :value="moment(updataTime, 'HH:mm')"
                                        format="HH:mm"
                                    />
                                </a-form-item>
                                <a-form-item label="食堂执行人">
                                    <a-input
                                        placeholder="填写食堂处理人姓名"
                                        style="width:300px;"
                                        v-decorator="[
                                            'person',
                                            {initialValue: updateDisWaste.person,rules: [{ required: true, message: '请填写食堂处理人姓名' }]}
                                        ]"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        html-type="submit"
                                    >更新保存</a-button>
                                </a-form-item>
                            </a-form>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowDisWaste">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowDisWaste"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingShowWaste"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <p>
                                    食&emsp;&emsp;堂：
                                    <span>{{showDisWasteList.canteen_str}}</span>
                                </p>
                                <p>
                                    废弃物名称：
                                    <span>{{showDisWasteList.title}}</span>
                                </p>
                                <p>
                                    重&emsp;&emsp;量：
                                    <span>{{showDisWasteList.weight}}kg</span>
                                </p>
                                <p>
                                    处理金额：
                                    <span>{{showDisWasteList.price}}元</span>
                                </p>
                                <p>
                                    收购单位：
                                    <span>{{showDisWasteList.purcha}}</span>
                                </p>
                                <p>
                                    收&nbsp;&nbsp;购&nbsp;&nbsp;人：
                                    <span>{{showDisWasteList.purcha_title}}</span>
                                </p>
                                <p>
                                    联系电话：
                                    <span>{{showDisWasteList.purcha_phone}}</span>
                                </p>
                                <p>
                                    处理时间：
                                    <span>{{showDisWasteList.time_str}}</span>
                                </p>
                                <p>
                                    食堂执行人：
                                    <span>{{showDisWasteList.person}}</span>
                                </p>
                                <p>
                                    记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                    <span>{{showDisWasteList.sponsor_str}}</span>
                                </p>
                                <p>
                                    记录时间：
                                    <span>{{showDisWasteList.created_at_str}}</span>
                                </p>
                                <div class="mx_receipt">
                                    <p>废弃物处理小票 <a @click="mxPrintingWaste">（点击打印）</a></p>
                                    <div class="mx_receipt_main">
                                        <p class="mx_receipt_main_header">废弃物处理小票</p>
                                        <img
                                            src="../../../assets/border_bottom.png"
                                            alt=""
                                        >
                                        <p>食&emsp;&emsp;堂：{{showDisWasteList.canteen_str}}</p>
                                        <p>物品名称：{{showDisWasteList.title}}</p>
                                        <p>重&emsp;&emsp;量：{{showDisWasteList.weight}}kg</p>
                                        <p>处理金额：{{showDisWasteList.price}}元</p>
                                        <p>处理日期：{{moment(showDisWasteList.time_str).format("YYYY-MM-DD")}}</p>
                                        <p>处理时间：{{moment(showDisWasteList.time_str).format("HH:mm")}}</p>
                                        <p>执&nbsp;&nbsp;行&nbsp;&nbsp;人：{{showDisWasteList.sponsor_str}}</p>
                                        <img
                                            src="../../../assets/border_bottom.png"
                                            alt=""
                                        >
                                        <div style="display: flex;align-items: center;">
                                            <p>扫描二维码即可查看
                                                样详情及图片</p>
                                            <img
                                                style="width:54px;height:54px;"
                                                src="../../../assets/erweima.jpg"
                                                alt=""
                                            >
                                        </div>
                                    </div>
                                </div>
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
// 健康晨检
const healthyColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "人脸图片",
        dataIndex: "annex_src",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "annex_src" }
    },
    {
        title: "姓名",
        dataIndex: "nickname",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "nickname" }
    },
    {
        title: "职位",
        dataIndex: "position",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "position" }
    },
    {
        title: "出勤日期",
        dataIndex: "meal_date_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "meal_date_str" }
    },
    {
        title: "健康状况",
        dataIndex: "health_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "health_str" }
    },

    {
        title: "晨检时间",
        dataIndex: "meal_time_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "meal_time_str" }
    },
    {
        title: "晨检人",
        dataIndex: "person",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "person" }
    },


    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const healthyList = [];
for (let i = 0; i < 10; i++) {
    var health, canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    if (i < 2) {
        health = "正常"
    } else if (i < 4) {
        health = "咳嗽"
    } else if (i < 6) {
        health = "发热"
    } else if (i < 8) {
        health = "呕吐"
    } else if (i < 9) {
        health = "外伤"
    } else {
        health = "其他"
    }
    var imgList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },


    ]
    healthyList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        annex_src: imgList[i],
        nickname: `阿${i}`,
        position: `食堂主任${i}`,
        meal_date_str: `2019-08-0${i + 1}`,
        health_str: `${health}`,
        meal_time_str: `2019-0${i}-0${i} 1${i}:1${i}`,
        person: `张${i}`,
    });
}
// 健康晨检  编辑
const plainOptions = [
    "正常",
    "咳嗽",
    "发热",
    "呕吐",
    "外伤",
    "其他"
];
const defaultCheckedList = ["正常"];
// 安全巡检
const safetyColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "巡检点",
        dataIndex: "name",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "安全情况",
        dataIndex: "happen",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "happen" }
    },
    {
        title: "巡检时间",
        dataIndex: "time_str",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "time_str" }
    },
    {
        title: "巡检人",
        dataIndex: "person",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "person" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "photos_src" }
    },

    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const safetyList = [];
for (let i = 0; i < 7; i++) {
    var canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    var imgsList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },


    ]
    safetyList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        name: `左转上${i}楼`,
        happen: `正常`,
        time_str: `2019-0${i}-0${i}   1${i}:2${i}`,
        person: `阿${i}`,
        photos_src: imgsList[i],
    });
}
// 场地消毒
const disinfectColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "消毒点",
        dataIndex: "name",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "消毒方式",
        dataIndex: "manner_str",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "manner_str" }
    },
    {
        title: "执行时间",
        dataIndex: "time_str",
        align: "center",
        width: "16%",
        scopedSlots: { customRender: "time_str" }
    },
    {
        title: "执行人",
        dataIndex: "person",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "person" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "13%",
        scopedSlots: { customRender: "photos_src" }
    },

    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const disinfectList = [];
for (let i = 0; i < 7; i++) {
    var canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    var imgsList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },


    ]
    disinfectList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        name: `左转上${i}楼`,
        manner_str: `紫外线消毒灯`,
        time_str: `2019-0${i}-0${i}   1${i}:2${i}`,
        person: `阿${i}`,
        photos_src: imgsList[i],
    });
}
// 废弃物处理
const disWasteColumn = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "废弃物名称",
        dataIndex: "name",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "重量（kg）",
        dataIndex: "weight",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "weight" }
    },
    {
        title: "处理金额（元）",
        dataIndex: "price",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "price" }
    },
    {
        title: "收购单位",
        dataIndex: "purcha",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "purcha" }
    },
    {
        title: "收购人",
        dataIndex: "purcha_title",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "purcha_title" }
    },
    {
        title: "联系电话",
        dataIndex: "purcha_phone",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "purcha_phone" }
    },
    {
        title: "处理时间",
        dataIndex: "time_str",
        align: "center",
        width: "14%",
        scopedSlots: { customRender: "time_str" }
    },
    {
        title: "食堂执行人",
        dataIndex: "person",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "person" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const disWasteList = [];
for (let i = 0; i < 7; i++) {
    var canteen;
    if (i < 2) {
        canteen = "食堂1";
    } else if (i < 4) {
        canteen = "食堂2";
    } else if (i < 5) {
        canteen = "食堂3";
    } else {
        canteen = "食堂4";
    }
    disWasteList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        name: `泔水`,
        weight: `2${i}0`,
        price: `500.${i}`,
        purcha: `重庆市废品处理有限公司`,
        purcha_title: `周二娃`,
        purcha_phone: `15123225886${i}`,
        time_str: `2019-0${i}-0${i}   1${i}:2${i}`,
        person: `阿${i}`,
    });
}
export default {
    data() {
        return {
            activeKey: '1',
            loadingActive: false,
            moment,
            // 健康晨检
            loading: true,
            healthyColumn,
            healthyList,
            selectedRowKeys: [],
            isAllUpdata: false,
            pagination: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            isShowHealthy: false,
            isUpdataHealthy: false,
            attendanceData: '',
            attendanceTime: '',
            otherHealth: false,
            otherHealthAll: false,
            healthId: '',
            attendanceAllTime: '',
            otherMain: '',
            otherAllMain: '',
            // 食堂
            canteen: [],
            canteenShow: [],
            canteenHealthyKey: '全部',
            canteenHealthyId: 0,
            // 健康晨检     日期
            startTime: '',
            endTime: '',
            healthyStartValue: null,
            healthyEndValue: null,
            endOpenHealthy: false,
            // 健康晨检  查看
            loadingShowHealthy: true,
            showList: {},
            isMorningCheck: true,
            // 健康晨检  编辑
            form: this.$form.createForm(this),
            allForm: this.$form.createForm(this),
            // 健康类型
            healthTypeList: [],
            healthyAllId: [],
            // 选中
            healthType: [],
            healthTypeAll: [],

            plainOptions,
            updataList: {},
            // 安全巡检
            loadingSafety: true,
            paginationSafety: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            // 食堂
            canteenSafetyKey: '全部',
            canteenSafetyId: 0,
            isAddSafety: false,
            isGoSafety: false,
            isShowSafety: false,
            isUpdataSafety: false,
            // 添加
            formSafety: this.$form.createForm(this),
            // 编辑
            formUpdataSubmit: this.$form.createForm(this),
            // 安全巡检     日期
            startSafetyTime: '',
            endSafetyTime: '',
            safetyStartValue: null,
            safetyEndValue: null,
            endOpenSafety: false,
            loadingShowSafety: true,
            newDataSafety: moment().format('YYYY-MM-DD'),
            newTimeSafety: moment().format('HH:mm'),
            safetyColumn,
            safetyList,
            isDelSafety: false,
            safetyAddVisible: false,
            safetyAddImage: '',
            safetyAddList: [],
            valueSafety: 1,
            mainSafety: '',
            mainSafetyKey: '',
            safetyImgId: '',
            delSafetyId: '',
            mainSafetyUpdataKey: '',
            mainSafetyUpdata: '',
            safetyUpdataValue: '',
            updataDataSafety: '',
            updataTimeSafety: '',
            isAbnormal: false,
            isAbnormals: false,
            safetyUpdataVisible: false,
            safetyUpdataImage: '',
            safetyUpdataId: '',
            safetyUpdataList: [],
            showSafetyList: {},
            safetyUpdataImgId: '',
            // 场地消毒
            loadingSite: true,
            paginationSite: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            // 食堂
            canteenSiteKey: '全部',
            canteenSiteId: 0,
            // 查看
            loadingShowSute: true,
            isAddDisinfect: false,
            isGoDisinfect: false,
            isShowDisinfect: false,
            isUpdataDisinfect: false,
            // 消毒方式
            degassingMode: [],
            // 添加
            formAddDisinfect: this.$form.createForm(this),
            formUpdataDisinfect: this.$form.createForm(this),
            degassingData: moment().format('YYYY-MM-DD'),
            degassingTime: moment().format('HH:mm'),
            // 场地消毒     日期
            startSiteTime: '',
            endSiteTime: '',
            disinfectStartValue: null,
            disinfectEndValue: null,
            endOpenDisinfect: false,
            disinfectColumn,
            disinfectList,
            isDelDisinfect: false,
            disinfectAddVisible: false,
            disinfectAddImage: '',
            disinfectAddList: [],
            disinfectUpdataVisible: false,
            disinfectUpdataImage: '',
            disinfectUpdataList: [],
            showDisinfectList: {},
            // 删除
            disinfectDelId: "",
            // 修改
            updataDisinfect: {
                canteen: '',
                title: '',
                degassing: '',
                person: '',
                disinfectUpdataList: []
            },
            exeData: '',
            exeTime: '',
            updataDisinfectId: '',
            loadingUpdataDisinfect: true,
            // 废弃物处理
            loadingWaste: true,
            paginationWaste: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.pagination.current} / ${Math.ceil(
                        total / this.pagination.pageSize
                    )} 页` // 显示总数
            },
            // 食堂
            canteenWasteKey: '全部',
            canteenWasteId: 0,
            // 添加
            isAddDisWaste: false,
            isGoDisWaste: false,
            formWaste: this.$form.createForm(this),
            // 查看
            isShowDisWaste: false,
            loadingShowWaste: true,
            // 修改
            formUpdataDisWaste: this.$form.createForm(this),
            loadingUpdataWaste: true,
            isUpdataDisWaste: false,
            updateDisWasteId: "",
            updateDisWaste: {
                canteen_id: '',
                title: '',
                weight: '',
                price: '',
                purcha: '',
                purcha_title: '',
                purcha_phone: '',
                person: '',
            },
            updataDate: '',
            updataTime: '',
            // 删除
            disWasteId: '',
            // 废弃物处理    日期
            disWasteStartValue: null,
            disWasteEndValue: null,
            startWasteTime: '',
            endWasteTime: '',
            endOpenDisWaste: false,
            addWasteData: moment().format('YYYY-MM-DD'),
            addWasteTime: moment().format('HH:mm'),
            disWasteColumn,
            disWasteList,
            isDelDisWaste: false,
            showDisWasteList: {},
        }
    },
    watch: {
        // 健康晨检
        healthyStartValue(val) {
            if (val) {
                this.startTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        healthyEndValue(val) {
            if (val) {
                this.endTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        // 安全巡检
        safetyStartValue(val) {
            if (val) {
                this.startSafetyTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        safetyEndValue(val) {
            if (val) {
                this.endSafetyTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        // 场地消毒
        disinfectStartValue(val) {
            if (val) {
                this.startSiteTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        disinfectEndValue(val) {
            if (val) {
                this.endSiteTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        // 废弃物处理
        disWasteStartValue(val) {
            if (val) {
                this.startWasteTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        disWasteEndValue(val) {
            if (val) {
                this.endWasteTime = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
    },
    created() {
        // 获取健康晨检列表
        this.getHealthyList('', '', '');
        // 获取食堂
        this.getCanteen();
        // 获取安全巡检列表
        this.getSafetyList('', '', '');
        // 获取场地消毒列表
        this.getSiteList('', '', '');
        // 获取消毒方式
        this.getDegassing();
        // 获取废弃物列表
        this.getWasteList('', '', '');
    },
    methods: {
        // 当前选中
        callback(e) {
            this.activeKey = e;
            // this.key = e;
            this.loadingActive = true;
            setTimeout(() => {
                this.loadingActive = false;
            }, 300);
        },
        // 健康晨检
        // 获取健康晨检列表
        getHealthyList(canteen_id, begin_time, end_time) {
            let that = this;
            this.$get("api/school/safety/examine?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        if (!item.annex_src) {
                            item.annex_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.healthyList = res.data.data.data;
                    this.loading = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 日期
        healthyStartDate(startValue) {
            const endValue = this.healthyEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        healthyEndDate(endValue) {
            const startValue = this.healthyStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        healthyStartOpenChange(open) {
            if (!open) {
                this.endOpenHealthy = true;
            }
        },
        healthyEndOpenChange(open) {
            this.endOpenHealthy = open;
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
        // 食堂 下拉选中
        selectHealthyChange(e) {
            this.canteenHealthyKey = e;
            this.canteenHealthyId = this.canteen[e - 1].id

        },
        // 筛选
        mxInquiryHealthy() {
            this.loading = false;
            this.getHealthyList(this.canteenHealthyId, this.startTime, this.endTime);
        },
        // 重置
        mxResetHealthy() {
            this.healthyStartValue = null;
            this.healthyEndValue = null;
            this.startTime = '';
            this.endTime = '';
            this.canteenHealthyKey = 1;
            this.canteenHealthyId = 0;
            this.loading = false;
            this.getHealthyList('', '', '');
        },
        // 健康晨检
        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        // 批量编辑  时间变化
        onChangeAllTime(date, dateString) {
            this.attendanceAllTime = dateString;
        },
        healthyTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 批量编辑
        allUpdataHealthy() {
            this.getHealthType();
            if (this.selectedRowKeys.length <= 0) {
                this.$message.warning("请选择编辑对象");
            } else {
                this.isAllUpdata = true;
                let arrId = [];
                this.selectedRowKeys.forEach(item => {
                    arrId.push(this.healthyList[item - 1].id)
                })
                this.healthyAllId = arrId;
                this.attendanceAllTime = moment().format("HH:mm");
                this.healthTypeAll = [];
                this.allForm.setFieldsValue({
                    inspectionName: '',
                });
            }
        },
        mxAllUpdataCel() {
            this.isAllUpdata = false;
        },
        mxAllUpdata(e) {
            e.preventDefault();
            this.isAllUpdata = false;
            this.allForm.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/examine/1",
                        method: 'PUT',
                        data: {
                            time: this.attendanceAllTime,
                            health_des: this.healthTypeAll.join(','),
                            person: values.inspectionName,
                            scene: 'examine.update.all',
                            ids: this.selectedRowKeys
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success("批量编辑记录成功");
                            this.loading = false;
                            this.getHealthyList('', '', '');
                            this.selectedRowKeys = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        //查看
        mxShowHealthy(id) {
            this.isShowHealthy = true;
            this.loadingShowHealthy = true;
            this.$get("api/school/safety/examine/" + id).then(res => {
                if (res.data.code == 0) {
                    if (!res.data.data.annex_src) {
                        res.data.data.annex_src = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                    }
                    if (res.data.data.health_des == '0') {
                        this.isMorningCheck = false;
                    } else {
                        this.isMorningCheck = true;
                    }
                    this.showList = res.data.data
                    this.loadingShowHealthy = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingHealthy() {
            this.$message.warning('未配置小票打印设备');
        },
        //返回
        backShowHealthy() {
            this.isShowHealthy = false;
            this.loading = false;
            this.getHealthyList('', '', '');
        },
        //编辑
        mxUpdataHealthy(val) {
            this.isUpdataHealthy = true;
            this.updataList = val;
            this.healthId = val.id;
            this.getHealthType();
            this.attendanceData = val.meal_date_str;
            if (val.meal_time_str == '') {
                this.attendanceTime = moment().format("HH:mm");
            } else {
                this.attendanceTime = val.meal_time_str;
            }
            let health_des = val.health_des;
            let typeList = [];
            if (health_des == '0') {
                this.healthType = typeList;
                this.form.setFieldsValue({
                    inspectionName: '',
                });
            } else {
                health_des = health_des.split(',')
                health_des.forEach(item => {
                    item = parseInt(item)
                    if (item == 143) {
                        this.otherHealth = true;
                        this.otherMain = val.health_str;
                    }
                    typeList.push(item)
                });
                this.healthType = typeList;
                this.form.setFieldsValue({
                    inspectionName: val.person,
                });
            }
        },
        // 健康类型选中
        onChangeHealthType(checkedValues) {
            let healthType = [];
            this.otherHealth = false;
            checkedValues.forEach(item => {
                if (item == '138') {
                    healthType = []
                    this.otherHealth = false;
                    return healthType.push(item)
                } else if (item == '143') {
                    healthType = []
                    this.otherHealth = true;
                    return healthType.push(item)
                } else {
                    this.otherHealth = false;
                    if (healthType[0] == '138' || healthType[0] == '143') {
                        healthType = []
                    }
                    healthType.push(item)
                }
            })
            this.healthType = healthType;
        },
        // 编辑  时间变化
        onChangeTimeUpdata(date, dateString) {
            this.attendanceTime = dateString;
        },
        // 获取健康类型
        getHealthType() {
            this.$get("api/common/dictionaries", {}).then(res => {
                if (res.data.code == 0) {
                    this.healthTypeList = res.data.data.health;
                } else {
                    console.log(22)
                }
            })
        },
        // 健康晨检     编辑
        //返回
        backUpdataHealthy() {
            this.isUpdataHealthy = false;
        },
        // 编辑提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/examine/" + this.healthId,
                        method: 'PUT',
                        data: {
                            time: this.attendanceTime,
                            health_des: this.healthType.join(","),
                            person: values.inspectionName,
                            scene: 'examine.update',
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isUpdataHealthy = false;
                            this.$message.success('编辑成功');
                            this.loading = false;
                            this.getHealthyList('', '', '');
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        onChange(e) {
            console.log(e);
        },
        // 显示当前日期
        getCurrentData() {
            return new Date().toLocaleDateString();
        },
        // 显示当前时间
        getCurrentTime() {
            return new Date().toLocaleTimeString();
        },
        // 批量编辑  健康状况选中
        onBoxActive(e) {
            let healthType = [];
            this.otherHealthAll = false;
            e.forEach(item => {
                if (item == '138') {
                    healthType = []
                    this.otherHealthAll = false;
                    return healthType.push(item)
                } else if (item == '143') {
                    healthType = []
                    this.otherHealthAll = true;
                    return healthType.push(item)
                } else {
                    this.otherHealthAll = false;
                    if (healthType[0] == '138' || healthType[0] == '143') {
                        healthType = []
                    }
                    healthType.push(item)
                }
            })
            this.healthTypeAll = healthType;
        },
        // 安全巡检
        // 获取安全巡检列表
        getSafetyList(canteen_id, begin_time, end_time) {
            let that = this;
            this.$get("api/school/safety/patrol?page=" + this.paginationSafety.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.paginationSafety.pageSize = res.data.data.per_page;
                    that.paginationSafety.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.name = item.title;
                        item.photos_src.forEach(items => {
                            if (!items.url) {
                                items.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.safetyList = res.data.data.data;
                    this.loadingSafety = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectSafetyChange(e) {
            this.canteenSafetyKey = e;
            this.canteenSafetyId = this.canteen[e - 1].id
        },
        // 筛选
        mxInquirySafety() {
            this.loadingSafety = true;
            this.getSafetyList(this.canteenSafetyId, this.startSafetyTime, this.endSafetyTime);
        },
        // 重置
        mxResetSafety() {
            this.safetyStartValue = null;
            this.safetyEndValue = null;
            this.startSafetyTime = '';
            this.endSafetyTime = '';
            this.canteenSafetyKey = 1;
            this.canteenSafetyId = 0;
            this.loadingSafety = true;
            this.getSafetyList('', '', '');
        },
        // 安全巡检  添加记录
        mxAddSafety() {
            this.isAddSafety = true;
        },
        // 返回
        backAddSafety() {
            this.isGoSafety = true;
        },
        mxCancelSafety() {
            this.isGoSafety = false;
        },
        mxGoSafety() {
            this.isGoSafety = false;
            this.isAddSafety = false;
            this.safetyAddList = [];
        },
        // 日期
        safetyStartDate(startValue) {
            const endValue = this.safetyEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        safetyEndDate(endValue) {
            const startValue = this.safetyStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        // 添加  日期变化
        onChangeDataMeal(date, dateString) {
            this.newDataSafety = dateString;
        },
        // 添加  时间变化
        onChangeTimeMeal(date, dateString) {
            this.newTimeSafety = dateString;
        },
        safetyStartOpenChange(open) {
            if (!open) {
                this.endOpenSafety = true;
            }
        },
        safetyEndOpenChange(open) {
            this.endOpenSafety = open;
        },
        // 表格 分页
        safetyTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 查看
        mxShowSafety(id) {
            this.isShowSafety = true;
            this.loadingShowSafety = true;
            this.$get("api/school/safety/patrol/" + id).then(res => {
                if (res.data.code == 0) {
                    this.showSafetyList = res.data.data
                    this.loadingShowSafety = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 编辑
        mxUpdateSafety(val) {
            this.isUpdataSafety = true;
            this.updataDataSafety = moment(val.time_str).format('YYYY-MM-DD')
            this.updataTimeSafety = moment(val.time_str).format('HH:mm')
            this.mainSafetyUpdataKey = val.type;
            this.safetyUpdataId = val.id;
            if (val.type == 0) {
                this.isAbnormals = true;
            } else {
                this.isAbnormals = false;
            }

            let imgArr = []
            val.photos_src.forEach((item, i) => {
                let obj = {
                    uid: item.id,
                    name: 'xxx.png',
                    response: {
                        data: {
                            id: parseInt(item.id),
                            url: item.url
                        }
                    },
                    status: 'done',
                    url: item.url
                }
                imgArr.push(obj)
            });
            this.safetyUpdataList = imgArr;

            this.mainSafetyUpdata = val.happen;
            this.formUpdataSubmit.setFieldsValue({
                canteen: val.canteen_id,
                name: val.name,
                person: val.person,
            });
        },
        // 编辑  日期变化
        onChangeDataUpdataSafe(date, dateString) {
            this.updataDataSafety = dateString;
        },
        // 编辑  时间变化
        onChangeTimeUpdataSafe(date, dateString) {
            this.updataTimeSafety = dateString;
        },
        // 删除
        mxDelSafety(id) {
            this.isDelSafety = true;
            this.delSafetyId = id;
        },
        mxSafetyCel() {
            this.isDelSafety = false;
        },
        mxDelSafetysure() {
            this.isDelSafety = false;
            let data = {
                url: "api/school/safety/patrol/" + this.delSafetyId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除成功");
                this.loadingSafety = true;
                this.getSafetyList('', '', '');
            })
        },
        // 安全情况
        onChangeSituation(e) {
            this.mainSafetyKey = e.target.value;
            if (e.target.value == 1) {
                this.isAbnormal = false;
                this.mainSafety = '';
            } else {
                this.isAbnormal = true;
            }
        },
        // 上传
        safetyAddCancel() {
            this.safetyAddVisible = false;
        },
        safetyPreview(file) {
            this.safetyAddImage = file.url || file.thumbUrl;
            this.safetyAddVisible = true;
        },
        safetyAddChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    this.safetyImgId = file.response.data.id;
                }
                return file;
            });

            this.safetyAddList = fileList;
        },
        // 添加
        safetySubmit(e) {
            e.preventDefault();
            this.formSafety.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/patrol",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            title: values.siteName,
                            person: values.person,
                            type: this.valueSafety,
                            happen: this.mainSafety,
                            photos: this.safetyImgId,
                            time: this.newDataSafety + ' ' + this.newTimeSafety,
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isAddSafety = false;
                            this.$message.success('添加记录成功');
                            this.loadingSafety = false;
                            this.getSafetyList('', '', '');
                            this.safetyAddList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 编辑记录 返回
        backUpdataSafety() {
            this.isUpdataSafety = false;
            this.safetyUpdataList = [];
        },
        // 编辑 提交
        safetyUpdataSubmit(e) {
            e.preventDefault();
            this.formUpdataSubmit.validateFields((err, values) => {
                if (!err) {
                    this.isUpdataSafety = false;
                    let imgArr = []
                    this.safetyUpdataList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/patrol/" + this.safetyUpdataId,
                        method: 'put',
                        data: {
                            canteen_id: values.canteen,
                            title: values.name,
                            person: values.person,
                            type: this.mainSafetyUpdataKey,
                            happen: this.mainSafetyUpdata,
                            photos: imgArr.join(","),
                            time: this.updataDataSafety + ' ' + this.updataTimeSafety,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('修改记录成功');
                            this.safetyUpdataList = [];
                            this.loadingSafety = true;
                            this.getSafetyList('', '', '');
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 安全情况
        onChangeSituat(e) {
            this.mainSafetyUpdataKey = e.target.value;
            if (e.target.value == 1) {
                this.isAbnormals = false;
                this.mainSafetyUpdata = '';
            } else {
                this.isAbnormals = true;
            }
        },
        // 编辑上传
        safetyUpdataCancel() {
            this.safetyUpdataVisible = false;
        },
        safetyUpdataPreview(file) {
            this.safetyUpdataImage = file.url || file.thumbUrl;
            this.safetyUpdataVisible = true;
        },
        safetyUpdataChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    this.safetyUpdataImgId = file.response.data.id;
                }
                return file;
            });

            this.safetyUpdataList = fileList;
        },
        // 查看详情
        backShowSafety() {
            this.isShowSafety = false;
        },
        // 小票打印
        mxPrintingMeal() {
            this.$message.warning('未配置小票打印设备');
        },
        // 场地消毒
        getSiteList(canteen_id, begin_time, end_time) {
            let that = this;
            this.$get("api/school/safety/boil?page=" + this.paginationSite.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.paginationSite.pageSize = res.data.data.per_page;
                    that.paginationSite.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.name = item.title;
                        item.photos_src.forEach(items => {
                            if (!items.url) {
                                items.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.disinfectList = res.data.data.data;
                    this.loadingSite = false;
                    console.log(res);

                } else {
                    console.log(22)
                }
            })
        },
        // 获取消毒方式
        getDegassing() {
            this.$get("api/common/dictionaries").then(res => {
                if (res.data.code == 0) {
                    this.degassingMode = res.data.data.boil;
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectSiteChange(e) {
            this.canteenSiteKey = e;
            this.canteenSiteId = this.canteen[e - 1].id
        },
        // 筛选
        mxInquirySite() {
            this.loadingSite = true;
            this.getSiteList(this.canteenSiteId, this.startSiteTime, this.endSiteTime);
        },
        // 重置
        mxResetSite() {
            this.disinfectStartValue = null;
            this.disinfectEndValue = null;
            this.startSiteTime = '';
            this.endSiteTime = '';
            this.canteenSiteKey = 1;
            this.canteenSiteId = 0;
            this.loadingSite = true;
            this.getSiteList('', '', '');
        },
        // 小票打印
        mxPrintingSite() {
            this.$message.warning('未配置小票打印设备');
        },
        // 场地消毒  添加记录
        mxAddDisinfect() {
            this.isAddDisinfect = true;
        },
        // 添加  日期变化
        onChangeDataDegassing(date, dateString) {
            this.degassingData = dateString;
        },
        // 添加  时间变化
        onChangeTimeDegassing(date, dateString) {
            this.degassingTime = dateString;
        },
        // 返回
        backAddDisinfect() {
            this.isGoDisinfect = true;
        },
        mxCancelDisinfect() {
            this.isGoDisinfect = false;
        },
        mxGoDisinfect() {
            this.isGoDisinfect = false;
            this.isAddDisinfect = false;
        },
        // 日期
        disinfectStartDate(startValue) {
            const endValue = this.disinfectEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disinfectEndDate(endValue) {
            const startValue = this.disinfectStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        disinfectStartOpenChange(open) {
            if (!open) {
                this.endOpenDisinfect = true;
            }
        },
        disinfectEndOpenChange(open) {
            this.endOpenDisinfect = open;
        },
        // 表格 分页
        disinfectTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 查看
        mxShowDisinfect(id) {
            this.isShowDisinfect = true;
            this.loadingShowSute = true;
            this.$get("api/school/safety/boil/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.photos_src.forEach(item => {
                        if (!item.url) {
                            item.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.showDisinfectList = res.data.data;
                    this.loadingShowSute = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 编辑
        mxUpdateDisinfect(id) {
            this.isUpdataDisinfect = true;
            this.$get("api/school/safety/boil/" + id).then(res => {
                if (res.data.code == 0) {
                    this.exeData = moment(res.data.data.time_str).format('YYYY-MM-DD')
                    this.exeTime = moment(res.data.data.time_str).format('HH:mm')
                    this.updataDisinfect.canteen = res.data.data.canteen_id;
                    this.updataDisinfect.title = res.data.data.title;
                    this.updataDisinfect.degassing = res.data.data.manner;
                    this.updataDisinfect.person = res.data.data.person;
                    this.updataDisinfectId = res.data.data.id;
                    let imgArr = [];
                    res.data.data.photos_src.forEach(item => {
                        let obj = {
                            uid: item.id,
                            name: 'xxx.png',
                            response: {
                                data: {
                                    id: parseInt(item.id),
                                    url: item.url
                                }
                            },
                            status: 'done',
                            url: item.url
                        }
                        imgArr.push(obj);
                    })
                    this.updataDisinfect.disinfectUpdataList = imgArr;
                    this.loadingUpdataDisinfect = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 日期变化
        mxDegUpdataDateChange(date, dateString) {
            this.exeData = dateString;
        },
        // 时间变化
        mxDegUpdataTimeChange(date, dateString) {
            this.exeTime = dateString;
        },
        // 删除
        mxDelDisinfect(id) {
            this.isDelDisinfect = true;
            this.disinfectDelId = id;
        },
        mxDisinfectCel() {
            this.isDelDisinfect = false;
        },
        mxDelDisinfectsure() {
            this.isDelDisinfect = false;
            let data = {
                url: "api/school/safety/boil/" + this.disinfectDelId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除成功");
                this.loadingSite = true;
                this.getSiteList('', '', '');
            })
        },
        // 上传
        disinfectAddCancel() {
            this.DisinfectAddVisible = false;
        },
        disinfectPreview(file) {
            this.disinfectAddImage = file.url || file.thumbUrl;
            this.disinfectAddVisible = true;
        },
        disinfectAddChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                }
                return file;
            });

            this.disinfectAddList = fileList;
        },
        // 添加提交
        disinfectSubmit(e) {
            e.preventDefault();
            this.formAddDisinfect.validateFields((err, values) => {
                if (!err) {
                    let imgArr = [];
                    this.disinfectAddList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/boil",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            title: values.disinfectSite,
                            manner: values.degassing,
                            person: values.person,
                            photos: imgArr.join(','),
                            time: this.degassingData + ' ' + this.degassingTime,
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isAddDisinfect = false;
                            this.$message.success('添加记录成功');
                            this.loadingSite = true;
                            this.getSiteList('', '', '');
                            this.disinfectAddList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 编辑记录
        backUpdataDisinfect() {
            this.isUpdataDisinfect = false;
            this.updataDisinfect.disinfectUpdataList = [];
        },
        // 编辑  提交
        disinfectUpdataSubmit(e) {
            e.preventDefault();
            this.formUpdataDisinfect.validateFields((err, values) => {
                if (!err) {
                    let imgArr = []
                    this.updataDisinfect.disinfectUpdataList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/boil/" + this.updataDisinfectId,
                        method: 'put',
                        data: {
                            canteen_id: values.canteen,
                            title: values.title,
                            manner: values.degassing,
                            person: values.person,
                            photos: imgArr.join(","),
                            time: this.exeData + ' ' + this.exeTime,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isUpdataDisinfect = false;
                            this.$message.success('修改记录成功');
                            this.updataDisinfect.disinfectUpdataList = [];
                            this.loadingSite = true;
                            this.getSiteList('', '', '');
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 编辑上传
        disinfectUpdataCancel() {
            this.disinfectUpdataVisible = false;
        },
        disinfectUpdataPreview(file) {
            this.disinfectUpdataImage = file.url || file.thumbUrl;
            this.disinfectUpdataVisible = true;
        },
        disinfectUpdataChange(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-1);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.updataDisinfect.disinfectUpdataList = fileList;
        },
        // 查看详情
        backShowDisinfect() {
            this.isShowDisinfect = false;
        },
        // 废弃物处理
        // 获取废弃物列表
        getWasteList(canteen_id, begin_time, end_time) {
            let that = this;
            this.$get("api/school/safety/scrap?page=" + this.paginationWaste.current + "&canteen_id=" + canteen_id + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.paginationWaste.pageSize = res.data.data.per_page;
                    that.paginationWaste.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.name = item.title;
                    });
                    this.disWasteList = res.data.data.data;
                    this.loadingWaste = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂 下拉选中
        selectWasteChange(e) {
            this.canteenWasteKey = e;
            this.canteenWasteId = this.canteen[e - 1].id;
        },
        // 筛选
        mxInquiryWaste() {
            this.loadingWaste = true;
            this.getWasteList(this.canteenWasteId, this.startWasteTime, this.endWasteTime);
        },
        // 重置
        mxResetWaste() {
            this.disWasteStartValue = null;
            this.disWasteEndValue = null;
            this.startWasteTime = '';
            this.endWasteTime = '';
            this.canteenWasteKey = 1;
            this.canteenWasteId = 0;
            this.loadingWaste = true;
            this.getWasteList('', '', '');
        },
        // 废弃物处理  添加记录
        mxAddDisWaste() {
            this.isAddDisWaste = true;
        },
        // 添加  日期变化
        onChangeAddWasteData(date, dateString) {
            this.addWasteData = dateString;
        },
        // 添加  时间变化
        onChangeAddWasteTime(date, dateString) {
            this.addWasteTime = dateString;
        },
        // 返回
        backAddDisWaste() {
            this.isGoDisWaste = true;
        },
        mxCancelDisWaste() {
            this.isGoDisWaste = false;
        },
        mxGoDisWaste() {
            this.isGoDisWaste = false;
            this.isAddDisWaste = false;
        },
        // 日期
        disWasteStartDate(startValue) {
            const endValue = this.disWasteEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disWasteEndDate(endValue) {
            const startValue = this.disWasteStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        disWasteStartOpenChange(open) {
            if (!open) {
                this.endOpenDisWaste = true;
            }
        },
        disWasteEndOpenChange(open) {
            this.endOpenDisWaste = open;
        },
        // 表格 分页
        disWasteTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 查看
        mxShowDisWaste(id) {
            this.isShowDisWaste = true;
            this.loadingShowWaste = true;
            // this.showDisWasteList = val
            this.$get("api/school/safety/scrap/" + id).then(res => {
                if (res.data.code == 0) {
                    // res.data.data.photos_src.forEach(item => {
                    //     if (!item.url) {
                    //         item.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                    //     }
                    // });
                    this.showDisWasteList = res.data.data
                    console.log(res);

                    this.loadingShowWaste = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingWaste() {
            this.$message.warning('未配置小票打印设备');
        },
        // 日期变化
        mxWasteUpdataDateChange(date, dateString) {
            this.updataDate = dateString;
        },
        // 时间变化
        mxWasteUpdataTimeChange(date, dateString) {
            this.updataTime = dateString;
        },
        // 编辑
        mxUpdateDisWaste(id) {
            this.isUpdataDisWaste = true;
            this.$get("api/school/safety/scrap/" + id).then(res => {
                if (res.data.code == 0) {
                    this.updataDate = moment(res.data.data.time_str).format('YYYY-MM-DD');
                    this.updataTime = moment(res.data.data.time_str).format('HH:mm');
                    this.updateDisWaste.canteen_id = res.data.data.canteen_id;
                    this.updateDisWaste.title = res.data.data.title;
                    this.updateDisWaste.weight = res.data.data.weight;
                    this.updateDisWaste.price = res.data.data.price;
                    this.updateDisWaste.purcha = res.data.data.purcha;
                    this.updateDisWaste.purcha_title = res.data.data.purcha_title;
                    this.updateDisWaste.purcha_phone = res.data.data.purcha_phone;
                    this.updateDisWaste.person = res.data.data.person;
                    this.updateDisWasteId = res.data.data.id;
                    this.loadingUpdataWaste = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 删除
        mxDelDisWaste(id) {
            this.isDelDisWaste = true;
            this.disWasteId = id;
        },
        mxDisWasteCel() {
            this.isDelDisWaste = false;
        },
        mxDelDisWastesure() {
            this.isDelDisWaste = false;
            let data = {
                url: "api/school/safety/scrap/" + this.disWasteId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除成功");
                this.loadingWaste = true;
                this.getWasteList('', '', '');
            })
        },
        // 表单提交
        disWasteSubmit(e) {
            e.preventDefault();
            this.formWaste.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/scrap",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            title: values.title,
                            weight: values.weight,
                            price: values.price,
                            purcha: values.purcha,
                            time: this.addWasteData + ' ' + this.addWasteTime,
                            purcha_title: values.purcha_title,
                            purcha_phone: values.purcha_phone,
                            person: values.person,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isAddDisWaste = false;
                            this.$message.success('修改记录成功');
                            this.loadingWaste = true;
                            this.getWasteList('', '', '');
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 编辑记录
        backUpdataDisWaste() {
            this.isUpdataDisWaste = false;
            this.loadingUpdataWaste = true;
        },
        // 编辑提交
        disWasteUpdataSubmit(e) {
            e.preventDefault();
            this.formUpdataDisWaste.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/scrap/" + this.updateDisWasteId,
                        method: 'put',
                        data: {
                            canteen_id: values.canteen_id,
                            title: values.title,
                            weight: values.weight,
                            price: values.price,
                            purcha: values.purcha,
                            time: this.updataDate + ' ' + this.updataTime,
                            purcha_title: values.purcha_title,
                            purcha_phone: values.purcha_phone,
                            person: values.person,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isUpdataDisWaste = false;
                            this.$message.success('修改记录成功');
                            this.loadingWaste = true;
                            this.getWasteList('', '', '');
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 查看详情
        backShowDisWaste() {
            this.isShowDisWaste = false;
        },
    },
}
</script>

<style lang="less">
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
// 小票
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
// 编辑
.mx_updataHealthy {
    width: 472px;
    box-shadow: 0px 0px 4px 0px #ccc;
    padding: 20px 0 20px 30px;
    margin: 20px 10px;
    display: flex;
    align-items: center;
    img {
        width: 82px;
        height: 92px;
        border-radius: 2px;
        margin-right: 30px;
    }
    .mx_updataHealthy_title {
        font-size: 16px;
        font-weight: bold;
    }
}
.ant-form-item-children {
    align-items: center;
    p {
        margin: 14px 14px 14px 0;
    }
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
}
</style>