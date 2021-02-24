<template>
    <div id="mxMealRecord">
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
                    tab="陪餐记录"
                    key="1"
                >
                    <!-- main -->
                    <div v-if="!isShow && !isAddRecord && !isUpdateRecord">
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
                            <!-- 搜索框 -->
                            <div class="components-input-demo-presuffix">
                                <p class="hmTxt">员工:</p>
                                <a-input
                                    placeholder="姓名/职位"
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
                            </div>
                            <a-form-item label="餐次：">
                                <a-select
                                    :value="mealTimesKey"
                                    style="width:150px;"
                                    @change="mealTimesChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in mealTimes"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
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
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                @click="mxAddRecord"
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
                            :loading="loading"
                            active
                            :title='false'
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
                                                @click="mxShowMeal(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateMeal(record)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDel(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDel"
                                                @cancel="mxCancel"
                                                @ok="mxDelete"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条陪餐记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShow">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goback"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <a-row>
                                    <a-col :span="8">
                                        <p>
                                            食&emsp;&emsp;堂：
                                            <span>{{showMealList.canteen_str}}</span>
                                        </p>
                                        <p>
                                            日&emsp;&emsp;期：
                                            <span>{{showMealList.meal_date_str}}</span>
                                        </p>
                                        <p>
                                            餐&emsp;&emsp;次：
                                            <span>{{showMealList.meal_str}}</span>
                                        </p>
                                        <p>
                                            陪&nbsp;&nbsp;餐&nbsp;&nbsp;人：
                                            <span>{{showMealList.cater_nickname}}</span>
                                        </p>
                                        <p>
                                            职&emsp;&emsp;位：
                                            <span>{{showMealList.cater_position}}</span>
                                        </p>
                                        <p>
                                            陪餐时间：
                                            <span>{{showMealList.meal_time_str}}</span>
                                        </p>
                                        <p>
                                            餐后评价：
                                            <span>{{showMealList.appraisal}}</span>
                                        </p>
                                        <p class="mx_IDCard">
                                            记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                            <span>{{showMealList.sponsor_str}}</span>
                                        </p>
                                        <p>
                                            记录时间：
                                            <span>{{showMealList.created_at_str}}</span>
                                        </p>
                                        <div class="mx_receipt">
                                            <p>陪餐记录小票 <a @click="mxPrintingMeal">（点击打印）</a></p>
                                            <div class="mx_receipt_main">
                                                <p class="mx_receipt_main_header">陪餐记录小票</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <p>食&emsp;&emsp;堂：{{showMealList.canteen_str}}</p>
                                                <p>日期/餐次：{{moment(showMealList.meal_date_str).format("MM-DD")}}&emsp;{{showMealList.meal_str}}</p>
                                                <p>陪&nbsp;&nbsp;餐&nbsp;&nbsp;人：{{showMealList.cater_nickname}}</p>
                                                <p>职&emsp;&emsp;位：{{showMealList.cater_position}}</p>
                                                <p>陪餐时间：{{showMealList.meal_time_str}}</p>
                                                <p>餐后评价：{{showMealList.appraisal}}</p>
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
                                        <div>
                                            <p>陪餐照片</p>
                                            <div>
                                                <viewer>
                                                    <img
                                                        style="width:100px;height:100px;margin-right:30px;"
                                                        v-for="item in showMealList.photos_src"
                                                        :src=item.url
                                                        alt
                                                        srcset
                                                    />
                                                </viewer>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddRecord">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goRecord"
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
                            v-model="isGoBack"
                            @cancel="mxCancelBack"
                            @ok="mxGoback"
                            okText="确认"
                            cancelText="取消"
                        >
                            <div class="mx_model">
                                <div class="mx_model_mainDel">
                                    您还未保存所添加记录，是否继续返回
                                </div>
                            </div>
                        </a-modal>
                        <a-skeleton
                            :loading="loadingAddShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-form
                                :form="form"
                                @submit="handleAddSubmit"
                            >
                                <a-row class="mx_main">
                                    <a-col :span="8">
                                        <a-form-item label="所属食堂">
                                            <a-select
                                                style="width:150px;"
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
                                        <a-form-item label="日期">
                                            <a-date-picker
                                                placeholder="选择时间"
                                                @change="onChangeDataMeal"
                                                :defaultValue="moment(newData, 'YYYY-MM-DD')"
                                            />
                                        </a-form-item>
                                        <a-form-item label="餐次：">
                                            <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                                            <a-select
                                                :value="mealTimesAddKey"
                                                style="width:150px;"
                                                @change="mealTimesAddChange"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in mealTimeShow"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                            <!-- </a-form-item> -->
                                        </a-form-item>
                                        <a-form-item label="陪餐人">
                                            <a-input
                                                placeholder="填写陪餐人姓名"
                                                style="width:300px;"
                                                v-decorator="[
                                        'cater_nickname',
                                        {rules: [{ required: true, message: '请填写陪餐人姓名' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="职位">
                                            <a-input
                                                placeholder="填写陪餐人职位"
                                                style="width:300px;"
                                                v-decorator="[
                                        'cater_position',
                                        {rules: [{ required: true, message: '请填写陪餐人职位' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="陪餐时间">
                                            <a-time-picker
                                                :defaultValue="moment(newDataTime, 'HH:mm')"
                                                @change="onChangeTimeMeal"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item label="餐后评价">
                                            <a-textarea
                                                placeholder="填写餐后评价"
                                                :rows="4"
                                                v-decorator="[
                                                'appraisal',
                                                {rules: [{ required: true, message: '请填写餐后评价' }]}
                                            ]"
                                                style="resize:none;"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="16">
                                        <a-form-item label="陪餐照片">
                                            <div v-decorator="[
                                                            '陪餐照片',
                                                            {rules: [{ required: fileList.length<=0?true:false, message: '请上传至少一张陪餐照片' }]}
                                                        ]">
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="fileList"
                                                        @preview="handlePreview"
                                                        @change="handleChange"
                                                    >
                                                        <div v-if="fileList.length < 3">
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="previewVisible"
                                                        :footer="null"
                                                        @cancel="handleCancel"
                                                        style="display:flex"
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
                                                    <!-- v-decorator="[
                                                    '陪餐照片',
                                                    {rules: [{ required: true, message: '请上传至少一张陪餐照片' }]}
                                                ]" -->
                                                    <a-button icon='upload'>
                                                        上传图片
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
                        </a-skeleton>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-show="isUpdateRecord">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goUpRecord"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-form
                            :form="myformMeal"
                            @submit="handleUpdata"
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
                                    <a-form-item label="日期">
                                        <!-- :defaultValue="moment(getCurrentData(), 'YYYY-MM-DD')" -->
                                        <a-date-picker
                                            placeholder="选择时间"
                                            @change="onChangeUpdataDataMeal"
                                            :value="moment(updataData, 'YYYY-MM-DD')"
                                        />
                                    </a-form-item>
                                    <a-form-item label="餐次">
                                        <!-- <a-form-item v-bind="formItemLayout" label="Select" has-feedback> -->
                                        <!-- :defaultValue="defValue" -->
                                        <a-select
                                            style="width:150px;"
                                            v-decorator="[
                                            'mealTimesm',
                                            {rules: [{ required: true, message: '请选择餐次' }]}
                                        ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in mealTimeShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                        <!-- </a-form-item> -->
                                    </a-form-item>
                                    <a-form-item label="陪餐人">
                                        <a-input
                                            placeholder="填写陪餐人姓名"
                                            style="width:300px;"
                                            v-decorator="[
                                        'accompanier',
                                        {rules: [{ required: true, message: '请填写陪餐人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="职位">
                                        <a-input
                                            placeholder="填写陪餐人职位"
                                            style="width:300px;"
                                            v-decorator="[
                                        'positionman',
                                        {rules: [{ required: true, message: '请填写陪餐人职位' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="陪餐时间">
                                        <!-- :defaultValue="moment('12:23', 'HH:mm')"
                                        format="HH:mm" -->
                                        <!-- :defaultValue="moment(getCurrentTime(), 'HH:mm')"
                                        format="HH:mm" -->
                                        <a-time-picker
                                            :value="moment(updataDataTime, 'HH:mm')"
                                            format="HH:mm"
                                            @change="onChangeUpdataTimeMeal"
                                        />
                                    </a-form-item>
                                    <a-form-item label="餐后评价">
                                        <a-textarea
                                            placeholder="填写餐后评价"
                                            style="resize:none;"
                                            :rows="4"
                                            v-decorator="[
                                        'appraise',
                                        {rules: [{ required: true, message: '请填写餐后评价' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="陪餐照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="imgsLists"
                                                    @preview="handlePreviews"
                                                    @change="handleChanges"
                                                >
                                                    <div v-if="imgsLists.length < 3">
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="previewVisibles"
                                                    :footer="null"
                                                    @cancel="handleCancels"
                                                    style="display:flex"
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
                                                :fileList="imgsLists"
                                                @preview="handlePreviews"
                                                @change="handleChanges"
                                            >
                                                <a-button icon='upload'>
                                                    上传图片
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
                </a-tab-pane>
                <a-tab-pane
                    tab="留样记录"
                    key="2"
                    forceRender
                >
                    <!-- main -->
                    <div v-if="!isShowSample && !isAddSample && !isUpdateSample">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenSampleKey"
                                    style="width:150px;"
                                    @change="selectSampleChange"
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
                            <a-form-item label="餐次：">
                                <a-select
                                    :value="mealTimesSampleKey"
                                    style="width:150px;"
                                    @change="mealTimesSampleChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in mealTimes"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="日期：">
                                <a-date-picker
                                    :disabledDate="sampleStartDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    v-model="sampleStartValue"
                                    placeholder="选择日期"
                                    @openChange="sampleStartOpenChange"
                                />
                                <div class="mx_divide">—</div>
                                <a-date-picker
                                    :disabledDate="sampleEndDate"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="选择日期"
                                    v-model="sampleEndValue"
                                    :open="endOpenSample"
                                    @openChange="sampleEndOpenChange"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    class="mx_btnbg"
                                    type="primary"
                                    html-type="submit"
                                    @click="mxInquirySample"
                                >查询</a-button>
                                <a-button @click="mxResetSample">重置</a-button>
                            </a-form-item>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                @click="mxAddSample"
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
                            :loading="loadingSample"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="columnlist"
                                :dataSource="SampleRecordList"
                                bordered
                                :pagination="paginationSample"
                                @change="handleTableChangeSample"
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
                                                @click="mxShowSample(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateSample(record)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDelSample(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDelSample"
                                                @cancel="mxCancels"
                                                @ok="mxDeletes"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条陪餐记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowSample">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="gobackSample"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingSampleShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <a-row>
                                    <a-col :span="8">
                                        <p>
                                            食&emsp;&emsp;堂：
                                            <span>{{showSampleList.canteen_str}}</span>
                                        </p>
                                        <p>
                                            日&emsp;&emsp;期：
                                            <span>{{showSampleList.meal_date_str}}</span>
                                        </p>
                                        <p>
                                            餐&emsp;&emsp;次：
                                            <span>{{showSampleList.meal_str}}</span>
                                        </p>
                                        <p>
                                            样品名称：
                                            <span>{{showSampleList.sample_food}}</span>
                                        </p>
                                        <p>
                                            重&emsp;&emsp;量：
                                            <span>{{showSampleList.weight}}g</span>
                                        </p>
                                        <p>
                                            留样时间：
                                            <span>{{showSampleList.meal_time_str}}</span>
                                        </p>
                                        <p>
                                            样品有效截止：
                                            <span>{{showSampleList.expire_str}}</span>
                                        </p>
                                        <p>
                                            留&nbsp;&nbsp;样&nbsp;&nbsp;人：
                                            <span>{{showSampleList.sample_holder}}</span>
                                        </p>
                                        <p class="mx_IDCard">
                                            记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                            <span>{{showSampleList.sponsor_str}}</span>
                                        </p>
                                        <p>
                                            记录时间：
                                            <span>{{showSampleList.created_at_str}}</span>
                                        </p>
                                        <div class="mx_receipt">
                                            <p>留样记录小票<a @click="mxPrintingSample">（点击打印）</a></p>
                                            <div class="mx_receipt_main">
                                                <p class="mx_receipt_main_header">陪餐记录小票</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <p>食&emsp;&emsp;堂：{{showSampleList.canteen_str}}</p>
                                                <p>日期/餐次：{{moment(showSampleList.meal_date_str).format("MM-DD")}}&emsp;{{showSampleList.meal_str}}</p>
                                                <p>样品名称：{{showSampleList.sample_food}}</p>
                                                <p>留样数量：{{showSampleList.weight}}</p>
                                                <p>留样时间：{{showSampleList.meal_time_str}}</p>
                                                <p>有效截止：{{showSampleList.expire_str}}</p>
                                                <p>留&nbsp;&nbsp;样&nbsp;&nbsp;人：{{showSampleList.sample_holder}}</p>
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
                                        <div>
                                            <p>留样照片</p>
                                            <!-- <div> -->
                                            <viewer>
                                                <img
                                                    style="width:100px;height:100px;margin-right:30px;"
                                                    v-for="item in showSampleList.photos_src"
                                                    :src=item.url
                                                    alt
                                                    srcset
                                                />
                                            </viewer>
                                            <!-- </div> -->
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddSample">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goSample"
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
                            v-model="isGoSample"
                            @cancel="mxCancelSample"
                            @ok="mxGoSample"
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
                        <a-skeleton
                            :loading="loadingAddSampleShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-form
                                :form="formSample"
                                @submit="sampleAddSubmit"
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
                                        <a-form-item label="日期">
                                            <a-date-picker
                                                @change="onchangeDataSample"
                                                placeholder="选择时间"
                                                :defaultValue="moment(dataSample, 'YYYY-MM-DD')"
                                            />
                                        </a-form-item>
                                        <a-form-item label="餐次：">
                                            <a-select
                                                :value="mealTimesAddSampleKey"
                                                style="width:150px;"
                                                @change="mealTimesAddSample"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in mealTimeShow"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="样品名称">
                                            <a-input
                                                placeholder="填写样品名称"
                                                style="width:300px;"
                                                v-decorator="[
                                        'sample_food',
                                        {rules: [{ required: true, message: '请填写样品名称' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="重量（g）">
                                            <a-input
                                                placeholder="填写重量"
                                                style="width:300px;"
                                                v-decorator="[
                                        'weight',
                                        {rules: [{ required: true, message: '请填写样品重量' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="留样时间">
                                            <a-time-picker
                                                @change="onchangeTimeSample"
                                                :defaultValue="moment(timeSample, 'HH:mm')"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item label="样品有效截止时间">
                                            <a-date-picker
                                                style="margin-right: 6px;"
                                                @change="onchangeDataStopSample"
                                                placeholder="选择时间"
                                                :defaultValue="moment(dataStopSample, 'YYYY-MM-DD')"
                                            />
                                            <a-time-picker
                                                @change="onchangeTimeStopSample"
                                                :defaultValue="moment(timeStopSample, 'HH:mm')"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item label="留样人">
                                            <a-input
                                                placeholder="填写留样人"
                                                style="width:300px;"
                                                v-decorator="[
                                        'sample_holder',
                                        {rules: [{ required: true, message: '请填写留样人姓名' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="16">
                                        <a-form-item label="样品照片">
                                            <div v-decorator="[
                                                    '样品照片',
                                                    {rules: [{ required: true, message: '请上传样品照片' }]}
                                                    ]">
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="sampleList"
                                                        @preview="handleSample"
                                                        @change="handleChangeSample"
                                                    >
                                                        <div v-if="sampleList.length < 3">
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="sampleVisible"
                                                        :footer="null"
                                                        @cancel="handleCancelSample"
                                                        style="display:flex"
                                                    >
                                                        <img
                                                            alt="example"
                                                            style="width: 100%"
                                                            :src="sampleImage"
                                                        />
                                                    </a-modal>
                                                </div>
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    :fileList="sampleList"
                                                    @preview="handleSample"
                                                    @change="handleChangeSample"
                                                >
                                                    <a-button icon='upload'>
                                                        上传图片
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
                        </a-skeleton>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-show="isUpdateSample">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goUpSample"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-form
                            :form="formSampleUpdata"
                            @submit="sampleUpdataSubmit"
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
                                    <a-form-item label="日期">
                                        <a-date-picker
                                            placeholder="选择时间"
                                            @change="onChangeDataSampleUpdata"
                                            :value="moment(dataSampleUpdata, 'YYYY-MM-DD')"
                                        />
                                    </a-form-item>
                                    <a-form-item label="餐次：">
                                        <a-select
                                            style="width:150px;"
                                            placeholder="选择餐次"
                                            v-decorator="[
                                            'meal',
                                            {rules: [{ required: true, message: '请选择餐次' }]}
                                        ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in mealTimeShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                        <!-- </a-form-item> -->
                                    </a-form-item>
                                    <a-form-item label="样品名称">
                                        <a-input
                                            placeholder="填写样品名称"
                                            style="width:300px;"
                                            v-decorator="[
                                        'sample_food',
                                        {rules: [{ required: true, message: '请填写样品名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="重量（g）">
                                        <a-input
                                            placeholder="填写重量"
                                            style="width:300px;"
                                            v-decorator="[
                                        'weight',
                                        {rules: [{ required: true, message: '请填写样品重量' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="留样时间">
                                        <!-- :defaultValue="moment('12:23', 'HH:mm')"
                                        format="HH:mm" -->
                                        <a-time-picker
                                            @change="onChangeTimeSampleUpdata"
                                            :value="moment(timeSampleUpdata, 'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="样品有效截止时间">
                                        <a-date-picker
                                            style="margin-right: 6px;"
                                            placeholder="选择时间"
                                            @change="onChangeStopDataSampleUpdata"
                                            :value="moment(dataSampleStopUpdata, 'YYYY-MM-DD')"
                                        />
                                        <a-time-picker
                                            @change="onChangeStopTimeSampleUpdata"
                                            :value="moment(timeSampleStopUpdata, 'HH:mm')"
                                            format="HH:mm"
                                        />
                                    </a-form-item>
                                    <a-form-item label="留样人">
                                        <a-input
                                            placeholder="填写留样人"
                                            style="width:300px;"
                                            v-decorator="[
                                        'sample_holder',
                                        {rules: [{ required: true, message: '请填写留样人姓名' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item label="样品照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="sampleUpdataList"
                                                    @preview="handleUpdataSample"
                                                    @change="handleChangeUpdataSample"
                                                >
                                                    <div v-if="sampleUpdataList.length < 3">
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="sampleUpdataVisible"
                                                    :footer="null"
                                                    @cancel="handleCancelUpdataSample"
                                                    style="display:flex"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="sampleUpdataImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="sampleUpdataList"
                                                @preview="handleUpdataSample"
                                                @change="handleChangeUpdataSample"
                                            >
                                                <a-button icon='upload'>
                                                    上传图片
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
                </a-tab-pane>
                <a-tab-pane
                    tab="餐具消毒记录"
                    key="3"
                >
                    <!-- main  v-if="!isShowDist && !isAddRecord && !isUpdateRecord"-->
                    <div v-if="!isShowDist && !isAddDist && !isUpdateDist">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                            :form='distForm'
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenDistKey"
                                    style="width:150px;"
                                    @change="selectDistChange"
                                >
                                    <a-select-option
                                        v-for="(item,index) in canteen"
                                        :key="index+1"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>

                            <div style="marginTop:20px;">
                                <a-form-item label="餐次：">
                                    <a-select
                                        :value="mealTimesDistKey"
                                        style="width:150px;"
                                        @change="mealTimesDistChange"
                                    >
                                        <a-select-option
                                            v-for="(item,index) in mealTimes"
                                            :key="index+1"
                                        >{{item.title}}</a-select-option>
                                    </a-select>
                                    <!-- </a-form-item> -->
                                </a-form-item>
                                <a-form-item label="日期：">
                                    <a-date-picker
                                        :disabledDate="disinfectStartDate"
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="选择日期"
                                        v-model="disinfectStartValue"
                                        @openChange="disinfectStartOpenChange"
                                    />
                                    <!-- v-decorator="['rpicker']" -->
                                    <div class="mx_divide">—</div>
                                    <a-date-picker
                                        :disabledDate="disinfectEndDate"
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="选择日期"
                                        v-model="disinfectEndValue"
                                        :open="endOpenDisinfect"
                                        @openChange="disinfectEndOpenChange"
                                    />
                                    <!-- v-decorator="['mxrpickers']" -->
                                </a-form-item>
                                <a-form-item>
                                    <a-button
                                        class="mx_btnbg"
                                        type="primary"
                                        html-type="submit"
                                        @click="mxInquiryDist"
                                    >查询</a-button>
                                    <a-button @click="mxDistReset">重置</a-button>
                                </a-form-item>
                            </div>
                        </a-form>
                        <div class="mx_operate">
                            <a-button
                                type="primary"
                                icon="form"
                                mxAddRecord
                                @click="mxAddDist"
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
                            <span class="mx_btns">
                                <span class="mx_outPoeration">
                                    小票打印机配置
                                </span>
                            </span>
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingDist"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="columnDisinfect"
                                :dataSource="disinfectList"
                                bordered
                                :pagination="paginationDist"
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
                                                @click="mxShowDist(record.id)"
                                            >查看</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxUpdateDist(record)"
                                            >编辑</a>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxDelDist(record.id)"
                                            >删除</a>
                                            <a-modal
                                                title="删除确认"
                                                centered
                                                :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                                v-model="isDelDist"
                                                @cancel="mxCancelDist"
                                                @ok="mxDelSureDist"
                                                okText="确认"
                                                cancelText="取消"
                                            >
                                                <div class="mx_model">
                                                    <div class="mx_model_mainDel">
                                                        是否确定删除该条餐具消毒记录？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
                    <div v-if="isShowDist">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="gobackDist"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看详情</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-skeleton
                            :loading="loadingDistShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <div class="mx_main">
                                <a-row>
                                    <a-col :span="8">
                                        <p>
                                            食&emsp;&emsp;堂：
                                            <span>{{showDistList.canteen_str}}</span>
                                        </p>
                                        <p>
                                            日&emsp;&emsp;期：
                                            <span>{{showDistList.exe_date_str}}</span>
                                        </p>
                                        <p>
                                            餐&emsp;&emsp;次：
                                            <span>{{showDistList.meal_str}}</span>
                                        </p>
                                        <p>
                                            餐具名称：
                                            <span>{{showDistList.title}}</span>
                                        </p>
                                        <p>
                                            消毒方式：
                                            <span>{{showDistList.manner_str}}</span>
                                        </p>
                                        <p>
                                            执行时间：
                                            <span>{{showDistList.exe_time_str}}</span>
                                        </p>
                                        <p>
                                            执&nbsp;&nbsp;行&nbsp;&nbsp;人：
                                            <span>{{showDistList.person}}</span>
                                        </p>
                                        <p class="mx_IDCard">
                                            记&nbsp;&nbsp;录&nbsp;&nbsp;人：
                                            <span>{{showDistList.sponsor_str}}</span>
                                        </p>
                                        <p>
                                            记录时间：
                                            <span>{{showDistList.created_at_str}}</span>
                                        </p>
                                        <div class="mx_receipt">
                                            <p>餐具消毒小票<a @click="mxPrintingDist">（点击打印）</a></p>
                                            <div class="mx_receipt_main">
                                                <p class="mx_receipt_main_header">餐具消毒小票</p>
                                                <img
                                                    src="../../../assets/border_bottom.png"
                                                    alt=""
                                                >
                                                <p>食&emsp;&emsp;堂：{{showDistList.canteen_str}}</p>
                                                <p>日期/餐次：{{moment(showDistList.exe_date_str).format("MM-DD")}}&emsp;{{showDistList.meal_str}}</p>
                                                <p>餐具名称：{{showDistList.title}}</p>
                                                <p>消毒方式：{{showDistList.manner_str}}</p>
                                                <p>执行时间：{{showDistList.exe_time_str}}</p>
                                                <p>执&nbsp;&nbsp;行&nbsp;&nbsp;人：{{showDistList.person}}</p>
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
                                        <div>
                                            <p>消毒照片</p>
                                            <div>
                                                <viewer>
                                                    <img
                                                        style="width:100px;height:100px;margin-right:30px;"
                                                        v-for="item in showDistList.photos_src"
                                                        :src="item.url"
                                                        alt
                                                        srcset
                                                    />
                                                </viewer>
                                            </div>
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 添加记录 -->
                    <div v-if="isAddDist">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goDist"
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
                            v-model="isGoDist"
                            @cancel="mxCancelAddDist"
                            @ok="mxOkAddDist"
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
                        <a-skeleton
                            :loading="loadingAddDistShow"
                            active
                            :title='false'
                            :paragraph="{rows: 20}"
                        >
                            <a-form
                                :form="form"
                                @submit="handleAddDist"
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
                                        <a-form-item label="日期">
                                            <a-date-picker
                                                placeholder="选择时间"
                                                :defaultValue="moment(newDataDist, 'YYYY-MM-DD')"
                                                @change="onchangeDataDist"
                                            />
                                        </a-form-item>
                                        <a-form-item label="餐次：">
                                            <a-select
                                                :value="mealTimesAddDistKey"
                                                style="width:150px;"
                                                @change="mealTimesAddDist"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in mealTimeShow"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="餐具名称">
                                            <a-input
                                                placeholder="填写样品名称"
                                                style="width:300px;"
                                                v-decorator="[
                                        'name',
                                        {rules: [{ required: true, message: '请填写餐具名称' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                        <a-form-item label="消毒方式">
                                            <a-select
                                                style="width:300px;"
                                                placeholder="选择消毒方式"
                                                v-decorator="[
                                            'disinfectMode',
                                            {rules: [{ required: true, message: '请选择消毒方式' }]}
                                        ]"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in disinfectMode"
                                                    :key="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="执行时间">
                                            <a-time-picker
                                                @change="onchangeTimeDist"
                                                :defaultValue="moment(newTimeDist, 'HH:mm')"
                                                format="HH:mm"
                                            />
                                        </a-form-item>
                                        <a-form-item label="执行人">
                                            <a-input
                                                placeholder="填写执行人姓名"
                                                style="width:300px;"
                                                v-decorator="[
                                        'runName',
                                        {rules: [{ required: true, message: '请填写执行人姓名' }]}
                                        ]"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="16">
                                        <a-form-item label="样品照片">
                                            <div v-decorator="[
                                                    '样品照片',
                                                    {rules: [{ required: true, message: '请上传样品照片' }]}
                                                    ]">
                                                <div class="clearfix">
                                                    <a-upload
                                                        action="http://bate.ccb.micmio.com/api/common/upload"
                                                        listType="picture-card"
                                                        :fileList="distListAdd"
                                                        @preview="handleAddDistpreview"
                                                        @change="handleChangeAddDist"
                                                    >
                                                        <div v-if="distListAdd.length < 3">
                                                            <a-icon type="plus" />
                                                        </div>
                                                    </a-upload>
                                                    <a-modal
                                                        :visible="distVisibleAdd"
                                                        :footer="null"
                                                        @cancel="handleCancelAddDist"
                                                        style="display:flex"
                                                    >
                                                        <img
                                                            alt="example"
                                                            style="width: 100%"
                                                            :src="distImageAdd"
                                                        />
                                                    </a-modal>
                                                </div>
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    :fileList="distListAdd"
                                                    @preview="handleAddDist"
                                                    @change="handleChangeAddDist"
                                                >
                                                    <a-button icon='upload'>
                                                        上传图片
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
                        </a-skeleton>
                    </div>
                    <!-- 编辑记录 -->
                    <div v-show="isUpdateDist">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="goUpdataDist"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">编辑记录</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <a-form
                            :form="distUpdataForm"
                            @submit="handleUpdataDist"
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
                                    <a-form-item label="日期">
                                        <a-date-picker
                                            style="width:300px;"
                                            placeholder="选择时间"
                                            :value="moment(dataDistDataUpdata, 'YYYY-MM-DD')"
                                            format="YYYY-MM-DD"
                                            @change="onChangedataDistDataUpdata"
                                        />
                                    </a-form-item>
                                    <a-form-item label="餐次：">
                                        <a-select
                                            style="width:150px;"
                                            placeholder="选择餐次"
                                            v-decorator="[
                                            'meal',
                                            {rules: [{ required: true, message: '请选择餐次' }]}
                                        ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in mealTimeShow"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                        <!-- </a-form-item> -->
                                    </a-form-item>
                                    <a-form-item label="餐具名称">
                                        <a-input
                                            placeholder="填写样品名称"
                                            style="width:300px;"
                                            v-decorator="[
                                        'name',
                                        {rules: [{ required: true, message: '请填写餐具名称' }]}
                                        ]"
                                        />
                                    </a-form-item>
                                    <a-form-item label="消毒方式">
                                        <a-select
                                            style="width:300px;"
                                            placeholder="选择消毒方式"
                                            v-decorator="[
                                            'disinfectMode',
                                            {rules: [{ required: true, message: '请选择消毒方式' }]}
                                        ]"
                                        >
                                            <a-select-option
                                                v-for="(item,index) in disinfectMode"
                                                :key="item.id"
                                            >{{item.title}}</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item label="执行时间">
                                        <a-time-picker
                                            style="width:300px;"
                                            :value="moment(dataDistTimeUpdata, 'HH:mm')"
                                            format="HH:mm"
                                            @change="onChangedataDistTimeUpdata"
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
                                    <a-form-item label="样品照片">
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="distList"
                                                    @preview="handleDist"
                                                    @change="handleChangeDist"
                                                >
                                                    <div v-if="distList.length < 3">
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="distVisible"
                                                    :footer="null"
                                                    @cancel="handleCancelDist"
                                                    style="display:flex"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="distImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="distList"
                                                @preview="handleDist"
                                                @change="handleChangeDist"
                                            >
                                                <a-button icon='upload'>
                                                    上传图片
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
        dataIndex: "canteen_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "日期",
        dataIndex: "meal_date_str",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "meal_date_str" }
    },
    {
        title: "餐次",
        dataIndex: "meal_str",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "meal_str" }
    },
    {
        title: "陪餐人",
        dataIndex: "cater_nickname",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "cater_nickname" }
    },
    {
        title: "职位",
        dataIndex: "cater_position",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "cater_position" }
    },
    {
        title: "陪餐时间",
        dataIndex: "meal_time_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "meal_time_str" }
    },
    {
        title: "餐后评价",
        dataIndex: "appraisal",
        align: "center",
        width: "18%",
        scopedSlots: { customRender: "appraisal" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "20%",
        scopedSlots: { customRender: "photos_src" }
        // render:(record) => {
        //           return <img src={record.images} alt="" style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
        //   }
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
    var mealTimesm, canteen;
    if (i < 2) {
        canteen = "食堂1";
        mealTimesm = "早餐"
    } else if (i < 4) {
        canteen = "食堂2";
        mealTimesm = "中餐"
    } else if (i < 5) {
        canteen = "食堂3";
        mealTimesm = "晚餐"
    } else {
        canteen = "食堂4";
        mealTimesm = "加餐"
    }
    var imgList = [
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg" },
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" }
        ],
        [
            { pic: "http://pic40.nipic.com/20140424/12259251_002036722178_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic31.nipic.com/20130801/11604791_100539834000_2.jpg" }
        ],
        [
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ]

    ]
    MealRecordList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        meal_date_str: `2019-0${i}-0${i}`,
        meal_str: `${mealTimesm}`,
        cater_nickname: `阿${i}`,
        cater_position: `食堂主任${i}`,
        meal_time_str: `1${i}:1${i}`,
        appraisal: `饭菜香浓可口，延年益寿`,
        photos_src: imgList[i],
    });
}
// 留样记录
const columnlist = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "日期",
        dataIndex: "meal_date_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "meal_date_str" }
    },
    {
        title: "餐次",
        dataIndex: "meal_str",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "meal_str" }
    },
    {
        title: "样品名称",
        dataIndex: "sample_food",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "sample_food" }
    },
    {
        title: "重量（g）",
        dataIndex: "weight",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "weight" }
    },
    {
        title: "留样时间",
        dataIndex: "meal_time_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "meal_time_str" }
    },
    {
        title: "样品有效截止",
        dataIndex: "expire_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "expire_str" }
    },
    {
        title: "留样人",
        dataIndex: "sample_holder",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "sample_holder" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "18%",
        scopedSlots: { customRender: "photos_src" }
        // render:(record) => {
        //           return <img src={record.images} alt="" style={{width:'50px',height:'50px',borderRadius:'50%'}}/>
        //   }
    },

    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const SampleRecordList = [];
for (let i = 0; i < 7; i++) {
    var mealTimesm, canteen;
    if (i < 2) {
        canteen = "食堂1";
        mealTimesm = "早餐"
    } else if (i < 4) {
        canteen = "食堂2";
        mealTimesm = "中餐"
    } else if (i < 5) {
        canteen = "食堂3";
        mealTimesm = "晚餐"
    } else {
        canteen = "食堂4";
        mealTimesm = "加餐"
    }
    var imgsList = [
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        ],
        [
            { pic: "http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg" },
        ],
        [
            { pic: "http://pic40.nipic.com/20140424/12259251_002036722178_2.jpg" },
        ],
        [
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        ],
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ]

    ]
    SampleRecordList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        meal_date_str: `2019-0${i}-0${i}`,
        meal_str: `${mealTimesm}`,
        sample_food: `番茄炒蛋`,
        weight: `20${i}`,
        meal_time_str: `1${i}:1${i}`,
        expire_str: `0${i}:0${i}  1${i}:1${i}`,
        sample_holder: `阿${i}`,
        photos_src: imgsList[i],
    });
}
// 餐具消毒记录
const columnDisinfect = [
    {
        title: "食堂",
        dataIndex: "canteen_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen_str" }
    },
    {
        title: "日期",
        dataIndex: "exe_date_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "exe_date_str" }
    },
    {
        title: "餐次",
        dataIndex: "meal_str",
        align: "center",
        width: "6%",
        scopedSlots: { customRender: "meal_str" }
    },
    {
        title: "餐具名称",
        dataIndex: "name",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "name" }
    },
    {
        title: "消毒方式",
        dataIndex: "manner_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "manner_str" }
    },
    {
        title: "执行时间",
        dataIndex: "exe_time_str",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "exe_time_str" }
    },
    {
        title: "执行人",
        dataIndex: "person",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "person" }
    },
    {
        title: "照片",
        dataIndex: "photos_src",
        align: "center",
        width: "18%",
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
    var mealTimesm, canteen;
    if (i < 2) {
        canteen = "食堂1";
        mealTimesm = "早餐"
    } else if (i < 4) {
        canteen = "食堂2";
        mealTimesm = "中餐"
    } else if (i < 5) {
        canteen = "食堂3";
        mealTimesm = "晚餐"
    } else {
        canteen = "食堂4";
        mealTimesm = "加餐"
    }
    var imgList = [
        [
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg" },
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" }
        ],
        [
            { pic: "http://pic40.nipic.com/20140424/12259251_002036722178_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic31.nipic.com/20130801/11604791_100539834000_2.jpg" }
        ],
        [
            { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ],
        [
            { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
            { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
            { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
        ]

    ]
    disinfectList.push({
        key: i.toString(),
        canteen_str: `${canteen}`,
        exe_date_str: `2019-0${i}-0${i}`,
        meal_str: `${mealTimesm}`,
        name: `餐盘、筷子、勺子${i}`,
        manner_str: `消毒柜${i}`,
        exe_time_str: `1${i}:1${i}`,
        person: `阿${i}`,
        photos_src: imgList[i],
    });
}
export default {
    data() {
        return {
            activeKey: '1',
            loadingActive: false,
            loading: true,
            loadingShow: true,
            loadingAddShow: true,
            MealRecordList,
            SampleRecordList,
            disinfectList,
            column,
            columnlist,
            columnDisinfect,
            startValue: null,
            endValue: null,
            endOpen: false,
            canteen: [],
            canteenShow: [],
            canteenKey: '全部',
            canteenId: 0,
            mxClassVal: '',
            mealId: '',
            mealTimes: [],
            mealTimeShow: [],
            mealTimesKey: '全部',
            mealTimesId: 0,
            mealTimesAddKey: '',
            mealTimesAddId: 0,
            addShow: {},
            newData: '',
            newDataTime: '',
            fileImg: [],
            updataDataTime: '',
            updataData: '',
            updataId: '',
            startTimeMeal: '',
            endTimeMeal: '',
            form: this.$form.createForm(this),
            myform: this.$form.createForm(this),
            myformMeal: this.$form.createForm(this),
            // 留样记录
            loadingSample: true,
            loadingSampleShow: true,
            loadingAddSampleShow: true,
            sampleId: '',
            formSample: this.$form.createForm(this),
            formSampleUpdata: this.$form.createForm(this),
            imgSampleListsImg: [],
            updateSampleId: '',
            // 编辑 照片上传
            sampleUpdataList: [],
            sampleUpdataVisible: false,
            sampleUpdataImage: "",
            // 食堂
            canteenSampleKey: '全部',
            canteenSampleId: 0,
            // 餐次
            mealTimesSampleKey: '全部',
            mealTimesSampleId: 0,
            // 日期
            startSampleTimeMeal: '',
            endSampleTimeMeal: '',
            // 添加记录  餐次
            mealTimesAddSampleKey: '',
            // 添加记录 日期
            dataSample: '',
            timeSample: '',
            // 添加记录 截止日期
            dataStopSample: '',
            timeStopSample: '',
            // 添加记录 照片上传
            sampleImg: [],
            // 编辑记录 截止日期
            dataSampleUpdata: '',
            timeSampleUpdata: '',
            dataSampleStopUpdata: '',
            timeSampleStopUpdata: '',
            sampleStartValue: null,
            sampleEndValue: null,
            endOpenSample: false,
            // 餐具消毒记录
            disinfectStartValue: null,
            disinfectEndValue: null,
            endOpenDisinfect: false,
            isGoBack: false,
            isDelDist: false,
            isShowDist: false,
            isAddDist: false,
            isGoDist: false,
            distList: [],
            showDistList: {},
            distImage: "",
            distVisible: false,
            loadingDist: true,
            loadingDistShow: true,
            loadingAddDistShow: true,
            distForm: this.$form.createForm(this),
            distUpdataForm: this.$form.createForm(this),
            distListAdd: [],
            distListId: "",
            newDataDist: "",
            newTimeDist: "",
            distImageAdd: "",
            distVisibleAdd: false,
            distUpdataId: "",
            // 食堂
            canteenDistKey: '全部',
            canteenDistId: 0,
            // 餐次
            mealTimesDistKey: '全部',
            mealTimesDistId: 0,
            // 日期
            startDistTimeMeal: '',
            endDistTimeMeal: '',
            // 添加
            // 添加记录  消毒方式
            disinfectMode: [],
            mealTimesAddDistKey: '',
            // 图片上传
            distImg: [],
            // 编辑
            isUpdateDist: false,
            // 编辑记录 日期
            dataDistDataUpdata: '',
            dataDistTimeUpdata: '',
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
            paginationSample: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.paginationSample.current} / ${Math.ceil(
                        total / this.paginationSample.pageSize
                    )} 页` // 显示总数
            },
            paginationDist: {
                pageSize: 15, // 默认每页显示数量
                current: 1, //显示当前页数
                total: 0,
                showSizeChanger: false, // 显示可改变每页数量
                showQuickJumper: true, //显示跳转到输入的那一页
                showTotal: total =>
                    `共 ${total} 条记录 第 ${this.paginationDist.current} / ${Math.ceil(
                        total / this.paginationDist.pageSize
                    )} 页` // 显示总数
            },
            isDel: false,
            isShow: false,   //查看详情状态
            isAddRecord: false,   //添加记录状态
            isUpdateRecord: false,   //编辑记录状态
            showMealList: {},
            showMealId: "",
            isDelSample: false,
            isShowSample: false,   //查看详情状态
            isAddSample: false,   //添加记录状态
            isUpdateSample: false,   //编辑记录状态
            showSampleList: {},
            previewVisible: false,
            previewImage: "",
            previewVisibles: false,
            previewImages: "",
            fileList: [],
            imgsLists: [],
            uploading: false,
            moment,
            defValue: '',
            updataList: '',
            isGoSample: false,    //添加记录 返回状态
            sampleList: [],
            sampleVisible: false,
            sampleImage: "",
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
        sampleStartValue(val) {
            if (val) {
                this.startSampleTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        sampleEndValue(val) {
            if (val) {
                this.endSampleTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        disinfectStartValue(val) {
            if (val) {
                this.startDistTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        },
        disinfectEndValue(val) {
            if (val) {
                this.endDistTimeMeal = moment(val._d).format("YYYY-MM-DD  HH:mm:ss")
            }
        }
    },
    mounted() {
        // 获取食堂
        this.getCanteen();
        // 获取餐次
        this.getMealTimes();
        // 陪餐记录列表
        this.getMealRecord('', '', '', '', '');
        // 留样记录列表
        this.getSampleList('', '', '', '');
        // 餐具消毒记录
        this.getDistList('', '', '', '');
    },
    methods: {
        callback(e) {
            this.activeKey = e;
            // this.key = e;
            this.loadingActive = true;
            setTimeout(() => {
                this.loadingActive = false;
            }, 300);
        },
        // 日期
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
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
        },
        // 陪餐记录筛选查询
        inquiryData() {
            this.loading = true;
            this.getMealRecord(this.canteenId, this.mealTimesId, this.startTimeMeal, this.endTimeMeal, this.mxClassVal);
        },
        // 重置
        inquiryMealReset() {
            this.startValue = null;
            this.endValue = null;
            this.canteenKey = 1;
            this.mealTimesKey = 1;
            this.canteenId = 0;
            this.mealTimesId = 0;
            this.mxClassVal = '';
            this.loading = true;
            this.getMealRecord('', '', '', '', '');
        },
        // 添加记录
        handleAddSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/cater",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            meal: this.mealTimesAddKey,
                            meal_time: this.newData + ' ' + this.newDataTime,
                            cater_nickname: values.cater_nickname,
                            cater_position: values.cater_position,
                            appraisal: values.appraisal,
                            photos: this.fileImg.join(","),
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('添加记录成功');
                            this.loading = true;
                            this.getMealRecord('', '', '', '', '');
                            this.isAddRecord = false;
                            this.fileList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 编辑记录
        handleUpdata(e) {
            e.preventDefault();
            this.myformMeal.validateFields((err, values) => {
                if (!err) {
                    let imgArr = []
                    this.imgsLists.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/cater/" + this.updataId,
                        method: 'put',
                        data: {
                            canteen_id: values.canteen,
                            meal: values.mealTimesm,
                            meal_time: this.updataData + " " + this.updataDataTime,
                            cater_nickname: values.accompanier,
                            cater_position: values.positionman,
                            appraisal: values.appraise,
                            photos: imgArr.join(',')
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('修改成功');
                            this.loading = true;
                            this.getMealRecord('', '', '', '', '');
                            this.isUpdateRecord = false;
                            this.imgsLists = [];
                        } else {
                            console.log(22)
                        }
                    })
                }
            });
        },
        // 添加 上传
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
            fileList = fileList.slice(-3);
            let imgArr = [];
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    imgArr.push(file.response.data.id)
                }
                return file;
            });
            this.fileImg = imgArr;
            this.fileList = fileList;
        },
        // 修改上传
        handleCancels() {
            this.previewVisibles = false;
        },
        handlePreviews(file) {
            this.previewImages = file.url || file.thumbUrl;
            this.previewVisibles = true;
        },
        handleChanges(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });
            this.imgsLists = fileList;
        },
        // 陪餐记录
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
        selectChange(e) {
            this.canteenKey = e;
            this.canteenId = this.canteen[e - 1].id;
        },
        // 搜索框
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 添加  日期变化
        onChangeDataMeal(date, dateString) {
            this.newData = dateString;

        },
        // 添加  时间变化
        onChangeTimeMeal(date, dateString) {
            this.newDataTime = dateString;
        },
        // 修改  日期变化
        onChangeUpdataDataMeal(date, dateString) {
            this.updataData = dateString;
        },
        // 修改  时间变化
        onChangeUpdataTimeMeal(date, dateString) {
            this.updataDataTime = dateString;
        },
        // 获取餐次
        getMealTimes() {
            this.$get("api/common/dictionaries").then(res => {
                if (res.data.code == 0) {
                    this.mealTimes = res.data.data.eat
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.mealTimes.splice(0, 0, data)
                    let arr = []
                    this.mealTimes.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item)
                        }
                    });
                    this.mealTimeShow = arr
                } else {
                    console.log(22)
                }
            })
        },
        // 餐次 下拉选中
        mealTimesChange(e) {
            this.mealTimesKey = e;
            this.mealTimesId = this.mealTimes[e - 1].id;
        },
        // 添加 餐次 下拉选中
        mealTimesAddChange(e) {
            this.mealTimesAddKey = e;
        },
        // 获取添加显示
        getAddShow() {
            this.$get("api/school/safety/cater/create", {}).then(res => {
                if (res.data.code == 0) {
                    // this.addShow = res.data.data
                    this.mealTimesAddKey = res.data.data.meal
                    this.newData = res.data.data.meal_date_str
                    this.newDataTime = res.data.data.meal_time_str
                    this.loadingAddShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取陪餐记录列表
        getMealRecord(canteen_id, meal, begin_time, end_time, keyword) {
            let that = this;
            // this.$get("api/school/attend?time=" + time).then(res => {canteen_id=食堂ID&meal=餐次id&begin_time=开始日期&end_time=结束日期&keyword=搜索关键词，员工，职位
            this.$get("api/school/safety/cater?page=" + this.pagination.current + "&canteen_id=" + canteen_id + "&meal=" + meal + "&begin_time=" + begin_time + "&end_time=" + end_time + "&keyword=" + keyword).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.photos_src.forEach(itemclider => {
                            if (!itemclider.url) {
                                itemclider.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.MealRecordList = res.data.data.data;
                    this.loading = false;

                } else {
                    console.log(22)
                }
            })
        },
        // 添加记录
        mxAddRecord() {
            this.isAddRecord = true
            this.loadingAddShow = true
            this.getAddShow();
        },
        // 查看
        mxShowMeal(id) {
            this.isShow = true
            this.loadingShow = true;
            this.showMealId = id;
            this.$get("api/school/safety/cater/" + id).then(res => {
                if (res.data.code == 0) {
                    this.showMealList = res.data.data
                    this.loadingShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingMeal() {
            this.$message.warning('未配置小票打印设备');
        },
        // 编辑
        mxUpdateMeal(val) {
            this.updataId = val.id
            this.isUpdateRecord = true
            this.updataList = val
            this.myformMeal.setFieldsValue({
                canteen: val.canteen_id,
                accompanier: val.cater_nickname,
                appraise: val.appraisal,
                mealTimesm: val.meal,
                positionman: val.cater_position,
            });
            this.updataData = val.meal_date_str;
            // this.imgsLists = val.photos_src;
            this.updataDataTime = val.meal_time_str;
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
            this.imgsLists = imgArr;
        },
        // 删除
        mxDel(id) {
            this.isDel = true;
            this.mealId = id;
        },
        mxCancel() {
            this.isDel = false;
        },
        mxDelete() {
            this.isDel = false;
            let data = {
                url: "api/school/safety/cater/" + this.mealId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.isOffDuty = false;
                this.$message.success("删除记录成功");
                this.loading = true;
                this.getMealRecord('', '', '', '', '');
            })

        },
        // 返回
        goback() {
            this.isShow = false
        },
        mxCancelBack() {
            this.isGoBack = false;
        },
        mxGoback() {
            this.isGoBack = false;
            this.isAddRecord = false;
            this.fileList = [];
        },
        goRecord() {
            this.isGoBack = true;
        },
        goUpRecord() {
            this.isUpdateRecord = false;
            this.imgsLists = [];
        },
        // 留样记录
        // 列表
        handleTableChangeSample(pagination, filters, sorter) {
            this.paginationSample.pageSize = pagination.pageSize;
            this.paginationSample.current = pagination.current;
            this.getSampleList('', '', '', '');
        },
        // 获取留样记录列表
        getSampleList(canteen_id, meal, begin_time, end_time) {
            var that = this;
            // this.$get("api/school/attend?time=" + time).then(res => {canteen_id=食堂ID&meal=餐次id&begin_time=开始日期&end_time=结束日期&keyword=搜索关键词，员工，职位
            this.$get("api/school/safety/sample?page=" + this.paginationSample.current + "&canteen_id=" + canteen_id + "&meal=" + meal + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.paginationSample.pageSize = res.data.data.per_page;
                    that.paginationSample.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.photos_src.forEach(itemclider => {
                            if (!itemclider.url) {
                                itemclider.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.SampleRecordList = res.data.data.data;
                    this.loadingSample = false;

                } else {
                    console.log(22)
                }
            })
        },
        // 筛选
        mxInquirySample() {
            this.loadingSample = true;
            this.getSampleList(this.canteenSampleId, this.mealTimesSampleId, this.startSampleTimeMeal, this.endSampleTimeMeal);
        },
        // 重置
        mxResetSample() {
            this.sampleStartValue = null;
            this.sampleEndValue = null;
            this.startSampleTimeMeal = '';
            this.endSampleTimeMeal = '';
            this.canteenSampleKey = 1;
            this.mealTimesSampleKey = 1;
            this.canteenSampleId = 0;
            this.mealTimesSampleId = 0;
            this.loadingSample = true;
            this.getSampleList('', '', '', '');
        },
        // 食堂 下拉选中
        selectSampleChange(e) {
            this.canteenSampleKey = e;
            this.canteenSampleId = this.canteen[e - 1].id
        },
        // 餐次 下拉选中
        mealTimesSampleChange(e) {
            this.mealTimesSampleKey = e;
            this.mealTimesSampleId = this.mealTimes[e - 1].id
        },
        // 选择日期
        sampleStartDate(startValue) {
            const endValue = this.sampleEndValue;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        sampleEndDate(endValue) {
            const startValue = this.sampleStartValue;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        sampleStartOpenChange(open) {
            if (!open) {
                this.endOpenSample = true;
            }
        },
        sampleEndOpenChange(open) {
            this.endOpenSample = open;
        },
        // 添加记录
        mxAddSample() {
            this.isAddSample = true;
            this.loadingAddSampleShow = true;
            this.getSampleAddShow();
        },
        // 获取添加显示
        getSampleAddShow() {
            this.$get("api/school/safety/sample/create", {}).then(res => {
                if (res.data.code == 0) {
                    this.dataSample = res.data.data.meal_date_str;
                    this.timeSample = res.data.data.meal_time_str;
                    this.dataStopSample = res.data.data.expire_date_str;
                    this.timeStopSample = res.data.data.expire_time_str;
                    this.mealTimesAddSampleKey = res.data.data.meal;
                    this.loadingAddSampleShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 日期变化
        onchangeDataSample(dates, dateStrings) {
            this.dataSample = dateStrings;
        },
        onchangeTimeSample(dates, dateStrings) {
            this.timeSample = dateStrings;
        },
        onchangeDataStopSample(dates, dateStrings) {
            this.dataStopSample = dateStrings;
        },
        onchangeTimeStopSample(dates, dateStrings) {
            this.timeStopSample = dateStrings;
        },
        // 添加 餐次 下拉选中
        mealTimesAddSample(e) {
            this.mealTimesAddSampleKey = e;
        },
        // 添加记录提交
        sampleAddSubmit(e) {
            e.preventDefault();
            this.formSample.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/sample",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            meal: this.mealTimesAddSampleKey,
                            meal_time: this.dataSample + ' ' + this.timeSample,
                            expire_time: this.dataStopSample + ' ' + this.timeStopSample,
                            sample_holder: values.sample_holder,
                            sample_food: values.sample_food,
                            weight: values.weight,
                            photos: this.sampleImg.join(","),
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('添加记录成功');
                            this.isAddSample = false;
                            this.loadingSample = true;
                            this.getSampleList('', '', '', '');
                            this.sampleList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 查看
        mxShowSample(id) {
            this.isShowSample = true;
            this.loadingSampleShow = true;
            this.$get("api/school/safety/sample/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.photos_src.forEach(item => {
                        if (!item.url) {
                            item.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.showSampleList = res.data.data
                    this.loadingSampleShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingSample() {
            this.$message.warning('未配置小票打印设备');
        },
        // 编辑
        mxUpdateSample(val) {
            console.log(val);

            this.isUpdateSample = true
            this.dataSampleUpdata = val.meal_date_str;
            this.timeSampleUpdata = val.meal_time_str;
            this.dataSampleStopUpdata = val.expire_str;
            this.timeSampleStopUpdata = val.expire_str;
            this.updateSampleId = val.id;
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
            this.sampleUpdataList = imgArr;
            this.formSampleUpdata.setFieldsValue({
                canteen: val.canteen_id,
                meal: val.meal,
                sample_holder: val.sample_holder,
                weight: val.weight,
                sample_food: val.sample_food,
            });
        },
        // 修好记录提交
        sampleUpdataSubmit(e) {
            e.preventDefault();
            this.formSampleUpdata.validateFields((err, values) => {
                if (!err) {
                    let imgArr = []
                    this.sampleUpdataList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let dataSampleStopUpdata = moment(this.dataSampleStopUpdata).format('YYYY-MM-DD')
                    let timeSampleStopUpdata;
                    if (this.timeSampleStopUpdata.length > 5) {
                        timeSampleStopUpdata = moment(this.timeSampleStopUpdata).format('HH:mm')
                    } else {
                        timeSampleStopUpdata = this.timeSampleStopUpdata;
                    }

                    let data = {
                        url: "api/school/safety/sample/" + this.updateSampleId,
                        method: 'PUT',
                        data: {
                            canteen_id: values.canteen,
                            meal: values.meal,
                            meal_time: this.dataSampleUpdata + ' ' + this.timeSampleUpdata,
                            expire_time: dataSampleStopUpdata + ' ' + timeSampleStopUpdata,
                            sample_holder: values.sample_holder,
                            sample_food: values.sample_food,
                            weight: values.weight,
                            photos: imgArr.join(","),
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isUpdateSample = false;
                            this.$message.success('修改记录成功');
                            this.loadingSample = true;
                            this.getSampleList('', '', '', '');
                            this.sampleUpdataList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 删除
        mxDelSample(id) {
            this.isDelSample = true;
            this.sampleId = id;
        },
        mxCancels() {
            this.isDelSample = false;
        },
        mxDeletes() {
            this.isDelSample = false;
            let data = {
                url: "api/school/safety/sample/" + this.sampleId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除记录成功");
                this.loadingSample = true;
                this.getSampleList('', '', '', '');
            })
        },
        // 返回
        gobackSample() {
            this.isShowSample = false
        },
        goSample() {
            this.isGoSample = true
        },
        mxCancelSample() {
            this.isGoSample = false
        },
        mxGoSample() {
            this.isGoSample = false
            this.isAddSample = false
        },
        // 添加 上传
        handleCancelSample() {
            this.sampleVisible = false;
        },
        handleSample(file) {
            this.sampleImage = file.url || file.thumbUrl;
            this.sampleVisible = true;
        },
        handleChangeSample(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);
            let imgArr = [];
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    imgArr.push(file.response.data.id)
                }
                return file;
            });
            this.sampleImg = imgArr;

            this.sampleList = fileList;
        },
        // 编辑  日期变化
        onChangeDataSampleUpdata(date, dateString) {
            this.dataSampleUpdata = dateString;
        },
        // 编辑  时间变化
        onChangeTimeSampleUpdata(date, dateString) {
            this.timeSampleUpdata = dateString;
        },
        // 编辑  截止日期变化
        onChangeStopDataSampleUpdata(date, dateString) {
            this.dataSampleStopUpdata = dateString;
        },
        // 编辑  时间变化
        onChangedataDistTimeUpdata(date, dateString) {
            this.dataDistTimeUpdata = dateString;
        },
        // 编辑  截止日期变化
        onChangedataDistDataUpdata(date, dateString) {
            this.dataDistDataUpdata = dateString;
        },
        // 编辑  截止时间变化
        onChangeStopTimeSampleUpdata(date, dateString) {
            this.timeSampleStopUpdata = dateString;
        },
        // 编辑 上传
        handleCancelUpdataSample() {
            this.sampleUpdataVisible = false;
        },
        handleUpdataSample(file) {
            this.sampleUpdataImage = file.url || file.thumbUrl;
            this.sampleUpdataVisible = true;
        },
        handleChangeUpdataSample(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);
            let imgArr = [];
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                    imgArr.push(file.response.data.id)
                }
                return file;
            });
            this.sampleUpdataList = fileList;
        },
        // 返回
        goUpSample() {
            this.isUpdateSample = false;
            this.sampleUpdataList = [];
        },
        // 编辑  时间
        onChangeTime(value, dateString) {
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
        },
        onOkTime(value) {
            console.log('onOk: ', value);
        },
        // 显示当前日期
        getCurrentData() {
            return new Date().toLocaleDateString();
        },
        // 显示当前时间
        getCurrentTime() {
            return new Date().toLocaleTimeString();
        },
        // 餐具消毒记录
        // 食堂 下拉选中
        selectDistChange(e) {
            this.canteenDistKey = e;
            this.canteenDistId = this.canteen[e - 1].id;
        },
        // 餐次 下拉选中
        mealTimesDistChange(e) {
            this.mealTimesDistKey = e;
            this.mealTimesDistId = this.mealTimes[e - 1].id;
        },
        // 获取餐具消毒记录列表
        getDistList(canteen_id, meal, begin_time, end_time) {
            var that = this;
            // this.$get("api/school/attend?time=" + time).then(res => {canteen_id=食堂ID&meal=餐次id&begin_time=开始日期&end_time=结束日期&keyword=搜索关键词，员工，职位
            this.$get("api/school/safety/disinfec?page=" + this.paginationDist.current + "&canteen_id=" + canteen_id + "&meal=" + meal + "&begin_time=" + begin_time + "&end_time=" + end_time).then(res => {
                if (res.data.code == 0) {
                    that.paginationDist.pageSize = res.data.data.per_page;
                    that.paginationDist.total = res.data.data.total;
                    res.data.data.data.forEach(item => {
                        item.key = item.id;
                        item.name = item.title;
                        item.photos_src.forEach(itemclider => {
                            if (!itemclider.url) {
                                itemclider.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                            }
                        })
                    });
                    this.disinfectList = res.data.data.data
                    this.loadingDist = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 筛选
        mxInquiryDist() {
            this.loadingDist = true;
            this.getDistList(this.canteenDistId, this.mealTimesDistId, this.startDistTimeMeal, this.endDistTimeMeal);
        },
        // 重置
        mxDistReset() {
            this.disinfectStartValue = null;
            this.disinfectEndValue = null;
            this.startDistTimeMeal = '';
            this.endDistTimeMeal = '';
            this.canteenDistKey = 1;
            this.mealTimesDistKey = 1;
            this.canteenDistId = 0;
            this.mealTimesDistId = 0;
            this.loadingDist = true;
            this.getDistList('', '', '', '');
        },
        // 日期变化
        onchangeDataDist(dates, dateStrings) {
            this.newDataDist = dateStrings;
        },
        onchangeTimeDist(dates, dateStrings) {
            this.newTimeDist = dateStrings;
        },
        // 选择日期
        disinfectStartDate(startValue) {
            const endValue = this.disinfectEndDate;
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
        // 列表
        disinfectTableChange(pagination, filters, sorter) {
            this.paginationDist.pageSize = pagination.pageSize;
            this.paginationDist.current = pagination.current;
        },
        // 删除
        mxDelDist(id) {
            this.isDelDist = true;
            this.distListId = id;
        },
        mxCancelDist() {
            this.isDelDist = false;
        },
        mxDelSureDist() {
            this.isDelDist = false;
            let data = {
                url: "api/school/safety/disinfec/" + this.distListId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("删除记录成功");
                this.loadingDist = true;
                this.getDistList('', '', '', '');
            })
        },
        // 查看
        mxShowDist(id) {
            this.isShowDist = true
            this.loadingDistShow = true;
            this.$get("api/school/safety/disinfec/" + id).then(res => {
                if (res.data.code == 0) {
                    res.data.data.photos_src.forEach(item => {
                        if (!item.url) {
                            item.url = "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                        }
                    });
                    this.showDistList = res.data.data
                    this.loadingDistShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 小票打印
        mxPrintingDist() {
            this.$message.warning('未配置小票打印设备');
        },
        // 返回
        gobackDist() {
            this.isShowDist = false
        },
        // 获取消毒方式
        getDisinfectMode() {
            this.$get("api/common/dictionaries").then(res => {
                if (res.data.code == 0) {
                    this.disinfectMode = res.data.data.manner;
                } else {
                    console.log(22)
                }
            })
        },
        // 添加记录
        mxAddDist() {
            this.isAddDist = true;
            this.getDisinfectMode();
            this.loadingAddDistShow = true;
            this.getDistAddShow();
        },
        // 获取添加显示
        getDistAddShow() {
            this.$get("api/school/safety/disinfec/create", {}).then(res => {
                if (res.data.code == 0) {
                    this.newDataDist = res.data.data.exe_time_date;
                    this.newTimeDist = res.data.data.exe_time_str;
                    // this.dataStopSample = res.data.data.expire_date_str;
                    // this.timeStopSample = res.data.data.expire_time_str;
                    this.mealTimesAddDistKey = res.data.data.meal;
                    this.loadingAddDistShow = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 餐次 下拉选中
        mealTimesAddDist(e) {
            this.mealTimesAddDistKey = e;
        },
        // 添加记录提交
        handleAddDist(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let data = {
                        url: "api/school/safety/disinfec",
                        method: 'post',
                        data: {
                            canteen_id: values.canteen,
                            meal: this.mealTimesAddDistKey,
                            manner: values.disinfectMode,
                            time: this.newDataDist,
                            exe_time: this.newDataDist + ' ' + this.newTimeDist,
                            title: values.name,
                            person: values.runName,
                            photos: this.distImg.join(","),
                        },

                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success('添加记录成功');
                            this.isAddDist = false;
                            this.distListAdd = [];
                            this.loadingDist = true;
                            this.getDistList('', '', '', '');
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 返回
        goDist() {
            this.isGoDist = true
        },
        mxCancelAddDist() {
            this.isGoDist = false;
        },
        mxOkAddDist() {
            this.isGoDist = false;
            this.isAddDist = false
        },
        // 上传
        handleCancelAddDist() {
            this.distVisibleAdd = false;
        },
        handleAddDistpreview(file) {
            this.distImageAdd = file.url || file.thumbUrl;
            this.distVisibleAdd = true;
        },
        handleChangeAddDist(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);

            let imgArr = [];
            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.url;
                    imgArr.push(file.response.data.id)
                }
                return file;
            });
            this.distImg = imgArr;
            this.distListAdd = fileList;
        },
        // 编辑 上传
        handleCancelDist() {
            this.distVisible = false;
        },
        handleDist(file) {
            this.distImage = file.url || file.thumbUrl;
            this.distVisible = true;
        },
        handleChangeDist(info) {
            let fileList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            fileList = fileList.slice(-3);

            // 2. 从响应读取并显示文件链接
            fileList = fileList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.distList = fileList;
        },
        // 编辑
        mxUpdateDist(val) {
            this.getDisinfectMode();
            this.isUpdateDist = true;
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
            this.distList = imgArr;
            this.distUpdataId = val.id;
            this.dataDistDataUpdata = val.exe_date_str;
            this.dataDistTimeUpdata = val.exe_time_str;
            this.distUpdataForm.setFieldsValue({
                canteen: val.canteen_id,
                meal: val.meal,
                person: val.person,
                disinfectMode: val.manner,
                name: val.name,
            });
        },
        handleUpdataDist(e) {
            e.preventDefault();
            this.distUpdataForm.validateFields((err, values) => {
                if (!err) {
                    let imgArr = []
                    this.distList.forEach(item => {
                        imgArr.push(item.response.data.id)
                    })
                    let data = {
                        url: "api/school/safety/disinfec/" + this.distUpdataId,
                        method: 'PUT',
                        data: {
                            canteen_id: values.canteen,
                            meal: values.meal,
                            manner: values.disinfectMode,
                            exe_time: this.dataDistDataUpdata + ' ' + this.dataDistTimeUpdata,
                            title: values.name,
                            person: values.person,
                            photos: imgArr.join(","),
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        if (res.data.code == 0) {
                            this.isUpdateDist = false;
                            this.$message.success('修改记录成功');
                            this.loadingDist = true;
                            this.getDistList('', '', '', '');
                            this.distList = [];
                        } else {
                            this.$message.success(res.data.msg);
                        }
                    })
                }
            });
        },
        // 返回
        goUpdataDist() {
            this.isUpdateDist = false
        }

    },
}
</script>

<style lang="less" scoped>
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
.clearfix {
    display: flex;
}
</style>
