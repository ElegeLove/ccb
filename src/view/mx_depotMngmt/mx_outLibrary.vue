<template>
    <div id="mx_outLibrary">
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
                    tab="出库列表"
                    key="1"
                >
                    <div v-if="!isRecipe && !isAddFoods && !isMailReval && !isSucceedSub && !isSucceedSubs && !isRetrievalGoods">
                        <div
                            class="mx_canteen"
                            style="display: flex;"
                        >
                            <div style="marginRight:20px;">
                                食堂：
                            </div>
                            <a-radio-group
                                v-model="canteenId"
                                style="width:94%;"
                                @change="onChange"
                            >
                                <a-radio
                                    v-for="(item,index) in canteen"
                                    :value="item.id"
                                >{{item.title}}</a-radio>
                            </a-radio-group>
                        </div>
                        <a-form
                            layout="inline"
                            style="margin:20px 0;"
                        >
                            <a-form-item label="出库用途：">
                                <a-select
                                    :value="deflVal"
                                    @change="mxChangeVal"
                                    style="width: 120px;"
                                >
                                    <a-select-option
                                        v-for="item in outPurposeList"
                                        :value="item.id"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            style="margin:20px 0;display: flex;justify-content: space-between;align-items: center;"
                        >
                            <div>
                                <a-form-item label="使用日期：">
                                    <a-date-picker
                                        :disabled=userTime
                                        :value="moment(userDate,'YYYY-MM-DD')"
                                        format="YYYY-MM-DD"
                                        showTime
                                        @change="onDateChange"
                                    />
                                </a-form-item>
                                <a-form-item style="marginLeft:56px;">
                                    <a-button
                                        style="marginRight:16px;background: #f2f2f2;color:#000;"
                                        @click="mxRecipe"
                                    >食谱生成</a-button>
                                    <a-button
                                        style="background: #f2f2f2;color:#000;"
                                        @click="mxAddFoods"
                                    >添加食材</a-button>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-button style="marginRight:16px;background: #f2f2f2;color:#000;">清空</a-button>
                                    <a-button style="marginRight:16px;background: #f2f2f2;color:#000;">存草稿</a-button>
                                    <a-button
                                        type="primary"
                                        @click="mxOutRetrieval"
                                    >立即出库</a-button>
                                </a-form-item>
                            </div>
                        </a-form>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loading"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="columns"
                                :dataSource="data"
                                bordered
                                :pagination="false"
                                :footer="footer"
                                v-if="data.length>0"
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
                                <div
                                    style="display: flex;justify-content: space-around;"
                                    slot="num"
                                    slot-scope="text, record,index"
                                >
                                    <div style="position: relative;">
                                        <!-- @change="mxInpVal" -->
                                        <a-input
                                            @change="e=>mxInpVal(e,record)"
                                            :data-index="index"
                                            :value='text'
                                            style="width:68px;paddingRight:24px;"
                                        />
                                        <!-- v-model="inputVal" -->
                                        <span style="position: absolute;right:6px;lineHeight:32px;">斤</span>
                                    </div>
                                </div>
                                <template
                                    slot="operation"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        <div>
                                            <a
                                                class="mx_updata mx_color"
                                                @click="mxDel(record.id)"
                                            >移除</a>
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
                                                        是否移除食材？
                                                    </div>
                                                </div>
                                            </a-modal>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                            <!-- 表格 -->
                            <a-table
                                :columns="columnNull"
                                :dataSource="dataNull"
                                bordered
                                :pagination="false"
                                :footer="footerNull"
                                v-else
                            />
                        </a-skeleton>
                    </div>
                    <!-- 食谱生成 -->
                    <div
                        class="isRecipe"
                        v-if="isRecipe"
                    >
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backRecipe"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">食谱生成</a-breadcrumb-item>
                        </a-breadcrumb>
                        <div style="display: flex;justify-content: space-between;align-items: center;margin:26px 0;">
                            <div style="display: flex;align-items: center;">
                                <div style="display: flex;align-items: center;">
                                    日期：<div class="mx_dateList_name">{{nowdata}}&nbsp;&nbsp;{{weeks}}</div>
                                </div>
                                <div class="mx_dateList_right">
                                    <span
                                        class="mx_mouth"
                                        @click="mxPreDay"
                                    >
                                        <a-icon type="left" />上一天</span>
                                    <span
                                        class="mx_thismouth"
                                        @click="mxDay"
                                    >今天</span>
                                    <span
                                        class="mx_mouth"
                                        @click="mxNextDay"
                                    >下一天
                                        <a-icon type="right" /></span>
                                </div>
                            </div>
                            <a-button
                                type="primary"
                                @click="mxPromptlyCreate"
                            >立即生成</a-button>
                        </div>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingRecipes"
                            :paragraph="{rows: 20}"
                        >
                            <a-table
                                :columns="columnMeal"
                                :dataSource="dataMeal"
                                bordered
                                :footer="footerMeal"
                                :pagination="false"
                            >
                                <template
                                    v-for="(col,index) in ['breakfast', 'lunch', 'dinner', 'snack']"
                                    :slot="col"
                                >
                                    <div
                                        :key="index"
                                        style="position:relative"
                                    >
                                        <p>{{titleDate[index]}}</p>
                                        <!-- 1早餐2午餐3晚餐4加餐 -->
                                        <a-radio
                                            :value='index'
                                            :checked="mxcheck == index?true:false"
                                            @click="mxChecked(index)"
                                            style="position: absolute;top:0;right:0"
                                        />
                                    </div>
                                </template>
                                <div
                                    slot="morning"
                                    slot-scope="text, record,index"
                                >
                                    <p v-for="item in text">{{item.title}}</p>
                                </div>
                                <div
                                    slot="noon"
                                    slot-scope="text, record,index"
                                >
                                    <p v-for="item in text">{{item.title}}</p>
                                </div>
                                <div
                                    slot="night"
                                    slot-scope="text, record,index"
                                >
                                    <p v-for="item in text">{{item.title}}</p>
                                </div>
                                <div
                                    slot="add_meals"
                                    slot-scope="text, record,index"
                                >
                                    <p v-for="item in text">{{item.title}}</p>
                                </div>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 添加食材 -->
                    <div v-if="isAddFoods">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backAddFoods"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">添加食材</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- 搜索框 -->
                        <div class="components-input-demo-presuffix">
                            <p class="hmTxt">食材:</p>
                            <a-input
                                placeholder="名称/批次号"
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
                        </div>
                        <div
                            v-if="addFoodList.length>0"
                            class="mx_foodsMain"
                        >
                            <div
                                class="mx_foodsList"
                                v-for="(item,index) in addFoodList"
                            >
                                <div style="display: flex;justify-content: space-between;align-items: center;marginBottom:10px;">
                                    <div>
                                        <span>{{item.storehou_title}}</span>
                                        <span style="marginLeft:10px;">批次号：{{item.batch_num}}</span>
                                    </div>
                                    <div>{{item.supplier_title}}</div>
                                </div>
                                <div style="display: flex;align-items: center;">
                                    <img
                                        style="width:77px;height:77px;marginRight:22px;"
                                        :src="item.material_single_src"
                                        alt=""
                                    >
                                    <div>
                                        <p>{{item.material_title}}</p>
                                        <p style="margin:0;">
                                            <span style="marginRight:40px;">&yen;{{item.order_unit_price}}</span>
                                            <span style="marginRight:40px;">{{item.order_num}}</span>
                                            <span>&yen;{{item.total_price}}</span>
                                        </p>
                                    </div>
                                </div>
                                <p style="marginTop:20px;">预警时间：{{item.yj_str}}</p>
                                <p>入库时间：{{item.record_time_str}}</p>
                                <div style="display: flex;justify-content: space-between;align-items: center;">
                                    <p style="margin:0;">保 质 期：{{item.shelf_life}}</p>
                                    <div>
                                        <!-- v-if="!isOverdue && !isRetrieval" -->
                                        <a-button
                                            v-if="!item.isAdd"
                                            type="primary"
                                            @click="()=>{item.isAdd = !item.isAdd}"
                                        >添加</a-button>
                                        <!-- @click="mxRetrieval" -->
                                        <div
                                            v-if="item.isAdd"
                                            style="display: flex;justify-content: space-between;align-items: center;"
                                        >
                                            <div style="position: relative;">
                                                <a-input
                                                    placeholder="填写实际验收数量"
                                                    style="width:108px; paddingRight:26px;"
                                                    :data-index="index"
                                                    v-model="item.inputVal"
                                                    @input="e=>mxNumVal(e,item.order_num)"
                                                />
                                                <!-- @keyup="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" -->
                                                <!-- @keyup="value=value.replace(/[^\d^\.]+/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.')" -->
                                                <span style="position: absolute;right:7px;lineHeight:32px;">斤</span>
                                            </div>
                                            <a-button
                                                type="primary"
                                                style="marginLeft:10px;"
                                                @click="mxSureReval(item)"
                                            >确认</a-button>
                                            <!-- @click="()=>{item.isAdd = !item.isAdd}" -->
                                        </div>
                                        <!-- <p
                                        v-if="isOverdue"
                                        style="color:red;"
                                    >已过期</p> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            style="width:100%;height:500px;display: flex;justify-content: center;align-items: center;"
                        >
                            <p v-if="isSearch">请搜索您要出库的食材</p>
                            <p v-if="!isSearch">暂未搜索到对应食材，请核对名称后再试</p>
                        </div>
                    </div>
                    <!-- 出库 -->
                    <div v-if="isMailReval">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backMailReval"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">{{mealTime}}出库</a-breadcrumb-item>
                        </a-breadcrumb>
                        <a-form
                            :form="myForm"
                            @submit="secondSubmit"
                        >
                            <a-row class="mx_main_form">
                                <a-col :span="8">
                                    <div v-if="!isMoveLibrary">
                                        <a-form-item
                                            v-if="!isFrmLoss && !isOther"
                                            label="备注信息"
                                        >
                                            <textarea
                                                style="width:340px;height:96px;resize:none;marginRight:100px;lineHeight:20px;"
                                                v-model="remorkInfo"
                                                cols="30"
                                                rows="10"
                                                placeholder="填写备注信息"
                                            ></textarea>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="isFrmLoss"
                                            label="报损原因"
                                        >
                                            <a-select
                                                :value="lossesId"
                                                style="width:300px;"
                                                @change="mxChangeLosses"
                                            >
                                                <a-select-option
                                                    v-for="item in lossesCauseList"
                                                    :value="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="isFrmLoss"
                                            label="情况说明"
                                        >
                                            <textarea
                                                style="width:340px;height:96px;resize:none;marginRight:100px;lineHeight:20px;"
                                                v-model="remorkInfos"
                                                cols="30"
                                                rows="10"
                                                placeholder="填写报损详情说明"
                                            ></textarea>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="isOther"
                                            label="详情说明"
                                        >
                                            <textarea
                                                style="width:340px;height:96px;resize:none;marginRight:100px;lineHeight:20px;"
                                                cols="30"
                                                rows="10"
                                                placeholder="填写详情说明"
                                                v-decorator="[
                                                '详情说明',
                                                {rules: [{ required: true, message: '请填写详情说明' }]}
                                            ]"
                                            ></textarea>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="!isFrmLoss || isOther"
                                            style="marginTop:248px;"
                                        >
                                            <a-button
                                                type="primary"
                                                html-type="submit"
                                            >确认出库</a-button>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="isFrmLoss"
                                            style="marginTop:180px;"
                                        >
                                            <a-button
                                                type="primary"
                                                html-type="submit"
                                            >提交申请</a-button>
                                        </a-form-item>
                                    </div>
                                    <div v-if="isMoveLibrary">
                                        <a-form-item label="移入食堂">
                                            <a-select
                                                :value="moveCanteen"
                                                style="width:300px;"
                                                @change="mxMoveCanteenChange"
                                            >
                                                <a-select-option
                                                    v-for="(item,index) in canteen"
                                                    :value="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="移入仓库">
                                            <a-select
                                                placeholder="选择仓库"
                                                style="width:300px;"
                                                :value='storehouseId'
                                                @change="mxDamageChange"
                                            >
                                                <!-- v-decorator="[
                                                '移入仓库',
                                                {rules: [{ required: true, message: '请选择移入仓库' }]}
                                            ]" -->
                                                <a-select-option
                                                    v-for="item in storehouseList"
                                                    :value="item.id"
                                                >{{item.title}}</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="情况说明">
                                            <textarea
                                                style="width:340px;height:96px;resize:none;marginRight:100px;lineHeight:20px;"
                                                cols="30"
                                                rows="10"
                                                placeholder="填写移库详情说明"
                                                v-model="removeRemork"
                                            ></textarea>
                                        </a-form-item>
                                        <a-form-item style="marginTop:80px;">
                                            <a-button
                                                type="primary"
                                                html-type="submit"
                                            >确认移库</a-button>
                                        </a-form-item>
                                    </div>
                                </a-col>
                                <a-col :span="16">
                                    <a-form-item
                                        v-if="!isFrmLoss || isOther"
                                        label="食材照片"
                                    >
                                        <div>
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
                                    <div v-if="!isMoveLibrary">
                                        <a-form-item
                                            v-if="!isFrmLoss || isOther"
                                            label="出库票据"
                                        >
                                            <div>
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
                                    </div>
                                    <a-form-item
                                        v-if="isFrmLoss"
                                        label="破损食材照片（用于审核）"
                                    >
                                        <div>
                                            <div class="clearfix">
                                                <a-upload
                                                    action="http://bate.ccb.micmio.com/api/common/upload"
                                                    listType="picture-card"
                                                    :fileList="damagedList"
                                                    @preview="damagedPreview"
                                                    @change="damagedChange"
                                                >
                                                    <div v-if="damagedList.length < 2">
                                                        <a-icon type="plus" />
                                                    </div>
                                                </a-upload>
                                                <a-modal
                                                    :visible="damagedVisible"
                                                    :footer="null"
                                                    @cancel="damagedCancel"
                                                >
                                                    <img
                                                        alt="example"
                                                        style="width: 100%"
                                                        :src="damagedImage"
                                                    />
                                                </a-modal>
                                            </div>
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                :fileList="damagedList"
                                                @preview="damagedPreview"
                                                @change="damagedChange"
                                            >
                                                <a-button>
                                                    <a-icon type="upload" />上传图片
                                                </a-button>
                                            </a-upload>
                                        </div>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                    <!-- 退货出库 -->
                    <div v-if="isRetrievalGoods">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backGoods"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">退货出库</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- 表格 -->
                        <a-table
                            :columns="columnReturnGoods"
                            :dataSource="dreturnGoodsList"
                            bordered
                            :pagination="false"
                            style="margin:35px 0 90px 0;"
                        >
                            <!-- <template
                                slot="title"
                                slot-scope="currentPageData"
                                style="background: rgb(245, 245, 245);"
                            >
                                <div>
                                    <p style="margin:0;">张三的猪肉<span style='margin: 0 0 0 20px;font-size:16px;font-weight: bold;'>&yen;{{sumPrice}}</span></p>
                                </div>
                            </template> -->
                            <template
                                slot="footer"
                                slot-scope="currentPageData"
                                style="position: relative;"
                            >
                                <div style="width:100%;height:200px;position: absolute;top:0;left:0;background: #fff;padding:22px;display: flex;align-items: center;">
                                    <div style="marginRight:140px;">

                                        <textarea
                                            style="width:390px;height:100px;resize:none;borderRadius: 5px;"
                                            placeholder="填写退货详情说明"
                                            v-model="backFoodsRemork"
                                            cols="30"
                                            rows="10"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <div class="clearfix">
                                            <a-upload
                                                action="http://bate.ccb.micmio.com/api/common/upload"
                                                listType="picture-card"
                                                :fileList="tabsList"
                                                @preview="tabsPreview"
                                                @change="tabsChange"
                                            >
                                                <div v-if="tabsList.length < 3">
                                                    <a-icon type="plus" />
                                                </div>
                                            </a-upload>
                                            <a-modal
                                                :visible="tabsVisible"
                                                :footer="null"
                                                @cancel="tabsCancel"
                                            >
                                                <img
                                                    alt="example"
                                                    style="width: 100%"
                                                    :src="tabsImage"
                                                />
                                            </a-modal>
                                        </div>
                                        <a-upload
                                            action="http://bate.ccb.micmio.com/api/common/upload"
                                            :fileList="tabsList"
                                            @preview="tabsPreview"
                                            @change="tabsChange"
                                        >
                                            <!-- v-decorator="[
                                                    '验收票据',
                                                    {rules: [{ required: true, message: '请上传至少一张照片' }]}
                                                ]" -->
                                            <a-button>
                                                <a-icon type="upload" />上传图片
                                            </a-button>
                                        </a-upload>
                                    </div>
                                </div>
                                <div style="width:100%;marginTop:200px;">
                                    <p style='text-align: right;margin-bottom: 0;'>总计：<span style='font-size:18px;color:red;'>&yen;{{totalPrice}}</span></p>
                                </div>
                            </template>
                            <div
                                style="display: flex;justify-content: space-around;"
                                slot="material_single_src"
                                slot-scope="text, record,index"
                            >
                                <img
                                    style="width:60px;heigth:60px"
                                    :src="text"
                                >
                            </div>
                        </a-table>
                        <a-button
                            type="primary"
                            @click="mxRetrievalGoods"
                        >确认提交</a-button>
                    </div>
                    <!-- 提交成功 -->
                    <div
                        v-if="isSucceedSub || isSucceedSubs"
                        style="display: flex;justify-content: center;align-items: center;text-align: center;"
                    >
                        <div style="marginTop:100px;">
                            <div>
                                <a-icon
                                    v-if="isSucceedSub"
                                    type="check-circle"
                                    theme="filled"
                                    style="fontSize:50px;backgroundColor: #fff;color:#52c41a;"
                                />
                                <a-icon
                                    v-if="isSucceedSubs"
                                    type="clock-circle"
                                    theme="filled"
                                    style="fontSize:50px;backgroundColor: #fff;color:#52c41a;"
                                />
                            </div>
                            <h2 style="margin:35px 0 16px 0;font-weight: bold;">提交成功</h2>
                            <div v-if="isSucceedSub">
                                <p>您的报损申请已成功提交审核</p>
                                <p style="margin:80px 0 180px 0;font-weight: bold;">待审核通过后库存将自动更改</p>
                            </div>
                            <div v-if="isSucceedSubs">
                                <p>您的退货申请已提交至供应商</p>
                                <p style="margin:80px 0 180px 0;font-weight: bold;">待供应商同意后即完成退货</p>
                            </div>
                            <a-button
                                type="primary"
                                @click="mxBack"
                            >返回</a-button>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane
                    tab="出库记录"
                    key="2"
                    forceRender
                >
                    <!-- main -->
                    <div v-if="!isShowInfo && !isShowFood">
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="食堂：">
                                <a-select
                                    :value="canteenShowInfo"
                                    style="width: 150px"
                                    @change="mxCanteenShow"
                                >
                                    <a-select-option
                                        v-for="item in canteenShow"
                                        :value="item.id"
                                    >{{item.title}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-form>
                        <!-- 搜索框 -->
                        <a-form
                            layout="inline"
                            class="mx_form mx_staff"
                        >
                            <a-form-item label="记录：">
                                <span>
                                    <a-input
                                        type="text"
                                        placeholder="记录单号"
                                        v-model="recordOrder"
                                    />
                                </span>
                            </a-form-item>
                        </a-form>
                        <a-form
                            layout="inline"
                            class="mx_form"
                        >
                            <a-form-item label="用途：">
                                <a-select
                                    :value="purposeId"
                                    style="width: 120px"
                                    @change="(e)=>{purposeId = e;}"
                                >
                                    <a-select-option
                                        v-for="item in outPurposesList"
                                        :value="item.id"
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
                                    @click="mxQuery"
                                >查询</a-button>
                                <a-button @click="mxReset">重置</a-button>
                            </a-form-item>
                            <a-form-item>
                                <div class="mx_operate">
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
                            </a-form-item>
                        </a-form>
                        <!-- 表格 -->
                        <a-skeleton
                            :loading="loadingrecord"
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
                                <template
                                    slot="state_str"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        {{text}}
                                    </div>
                                </template>
                                <template
                                    slot="operation"
                                    slot-scope="text, record, index"
                                >
                                    <div class="editable-row-operations">
                                        <div v-if="record.audit_state == 1">
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxShowMeal(record)"
                                            >去审核</a>
                                        </div>
                                        <div v-else>
                                            <a
                                                class="mx_operation mx_color"
                                                @click="mxShowMeal(record)"
                                            >查看</a>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </a-skeleton>
                    </div>
                    <!-- 查看详情 -->
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
                        <a-skeleton
                            :loading="loadingShowInfo"
                            active
                            :paragraph="{rows: 20}"
                        >
                            <div>
                                <div style="display: flex;justify-content: space-between;align-items: center;">
                                    <div style="width:100%;display: flex;justify-content: space-between;align-items: center;margin:38px 0 18px;padding:0 10px;">
                                        <p style="margin:0;"><span style="marginRight:120px;">{{recordInfo.canteen_title}}</span><span>单号：{{recordInfo.out_odo}}</span></p>
                                        <div v-if="!suditState">
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
                                    </div>
                                    <div
                                        v-if="suditState"
                                        style="display: flex;align-items: center;"
                                    >
                                        <a-button
                                            style="display: flex;align-items: center;marginRight:30px;"
                                            type="primary"
                                            @click="mxAgree('同意')"
                                        >
                                            <a-icon
                                                style="color:green;fontSize:16px;font-weight: bold;"
                                                type="check"
                                            /><span>同意</span>
                                        </a-button>
                                        <a-button
                                            style="display: flex;align-items: center;"
                                            type="primary"
                                            @click="mxAgree('拒绝')"
                                        >
                                            <a-icon
                                                style="color:red;fontSize:16px;font-weight: bold;"
                                                type="close"
                                            /><span>拒绝</span>
                                        </a-button>
                                        <a-modal
                                            :title="auditTitle"
                                            centered
                                            :maskStyle="{'opacity':'0.1','background':'#000','animation':'none'}"
                                            v-model="isAgree"
                                            @ok="mxOkAgree"
                                            @cancel="mxCelAgree"
                                        >
                                            <textarea
                                                cols="30"
                                                rows="10"
                                                style="width:100%;resize:none;paddingLeft:12px;"
                                                :placeholder="placeholder"
                                                v-model="auditCause"
                                            ></textarea>
                                        </a-modal>

                                    </div>
                                </div>
                                <!-- 表格 -->
                                <a-table
                                    :columns="columnShowInfo"
                                    :dataSource="dataShowInfo"
                                    bordered
                                    :pagination="false"
                                >
                                    <div
                                        style="display: flex;justify-content: space-around;"
                                        slot="material_img"
                                        slot-scope="text, record,index"
                                    >
                                        <img
                                            style="width:60px;heigth:60px"
                                            :src="text"
                                        >
                                    </div>
                                    <template
                                        slot="operation"
                                        slot-scope="text, record, index"
                                    >
                                        <div class="editable-row-operations">
                                            <div>
                                                <a
                                                    class="mx_updata mx_color"
                                                    @click="mxShowFood(record.storage_id)"
                                                >查看食材</a>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- <div v-if="isReturnGoods"> -->
                                    <div
                                        slot="footer"
                                        v-if="isReturnGoods"
                                        slot-scope="currentPageData"
                                        style="position: relative;"
                                    >
                                        <!-- <div style="width:100%;height:200px;position: absolute;top:0;left:0;background: #fff;padding:22px;display: flex;align-items: center;">
                                        <div style="marginRight:140px;">

                                            <p>详情说明：<span>{{recordInfo.remark}}</span></p>
                                            <p style="margin:100px 0 0;">拒绝原因：<span>16546494</span></p>
                                        </div>
                                        <div>
                                            <img
                                                style="width:92px;height:92px;borderRadius:5px;marginRight:30px;"
                                                v-for="item in 3"
                                                src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                                alt=""
                                            >
                                        </div>
                                    </div> -->
                                        <div style="width:100%;">
                                            <p style='text-align: right;margin-bottom: 0;'>总计：<span style='font-size:18px;color:#ff3300;'>&yen;{{outTotalPrice}}</span></p>
                                        </div>
                                    </div>
                                    <!-- </div> -->
                                </a-table>
                                <a-row style="marginTop:42px;">
                                    <a-col
                                        :span="8"
                                        style="paddingLeft:10px;"
                                    >
                                        <div>
                                            <p>出库用途：<span>{{recordInfo.out_str}}</span></p>
                                            <p v-if="isRedFrmLoss">报损原因：<span>食材变质</span></p>
                                            <p v-if="moveDepot">移入位置：<span>{{recordInfo.move_canteen_title}}&nbsp;{{recordInfo.move_storehou_title}}</span></p>
                                            <p v-if="isRedFrmLoss || moveDepot || recordInfo.out_style == 103">详情说明：<span>{{recordInfo.remark}}</span></p>
                                            <!-- <p v-if="!isRedFrmLoss && !moveDepot && !isRedFrmLoss">使用日期：<span>{{purpose}}</span></p> -->
                                            <p v-if="!isRedFrmLoss && !moveDepot && !isRedFrmLoss && recordInfo.out_style != 103">备注信息：<span>{{recordInfo.remark}}</span></p>
                                            <p v-if="recordInfo.out_style == 103">退货单单号：<span>{{recordInfo.out_odo}}</span></p>
                                            <p>出&nbsp;&nbsp;库&nbsp;&nbsp;人：<span>{{recordInfo.chu_username}}</span></p>
                                            <p>出库时间：<span>{{recordInfo.updated_at}}</span></p>
                                        </div>
                                        <div
                                            v-if="isRedFrmLoss && !suditState"
                                            style="marginTop:50px;"
                                        >
                                            <p>审核状态：<span v-if="recordInfo.state == 4">同意报损</span><span v-if="recordInfo.state == 5">同意报损</span><span
                                                    v-if="recordInfo.state == 6"
                                                    style="color:#ff6600"
                                                >拒绝报损</span></p>
                                            <p>备&emsp;&emsp;注：<span>{{recordInfo.damage_remark}}</span></p>
                                            <p v-if="!isRetrievalGoods">审&nbsp;&nbsp;核&nbsp;&nbsp;人：<span>{{recordInfo.audit_username}}</span></p>
                                            <p>审核时间：<span>{{moment(recordInfo.handle_time*1000).format('YYYY-MM-DD HH;mm')}}</span></p>
                                        </div>
                                        <div
                                            v-if="recordInfo.out_style == 103 && !suditState"
                                            style="marginTop:50px;"
                                        >
                                            <p>当前状态：<span v-if="recordInfo.state == 1">同意退货</span><span v-if="recordInfo.state == 2">同意退货</span><span
                                                    v-if="recordInfo.state == 3"
                                                    style="color:#ff6600"
                                                >拒绝退货</span></p>
                                            <p>备&emsp;&emsp;注：<span>{{recordInfo.refuse_reason}}</span></p>
                                            <p>审&nbsp;&nbsp;核&nbsp;&nbsp;人：<span>{{recordInfo.audit_username}}</span></p>
                                            <p>审核时间：<span>{{moment(recordInfo.handle_time*1000).format('YYYY-MM-DD HH;mm')}}</span></p>
                                        </div>
                                    </a-col>
                                    <a-col :span="16">
                                        <div>
                                            <p>食材照片</p>
                                            <img
                                                v-for="item in recordInfo.photos_src"
                                                style="width:92px;height:92px;borderRadius: 5px;marginRight:20px;"
                                                :src="item.url"
                                                alt=""
                                            >
                                        </div>
                                        <div
                                            v-if="recordInfo.out_style != 103 && recordInfo.out_style != 102 && recordInfo.out_style != 104"
                                            style="marginTop:32px;"
                                        >
                                            <p>票据照片</p>
                                            <img
                                                v-for="item in recordInfo.bills_src"
                                                style="width:92px;height:92px;borderRadius: 5px;marginRight:20px;"
                                                :src="item.url"
                                                alt=""
                                            >
                                        </div>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-skeleton>
                    </div>
                    <!-- 查看食材 -->
                    <div v-if="isShowFood">
                        <!-- 头部 -->
                        <a-breadcrumb separator=" ">
                            <a-breadcrumb-item>
                                <a-icon
                                    @click="backShowFood"
                                    class="mx_header_icon"
                                    type="arrow-left"
                                />
                            </a-breadcrumb-item>
                            <a-breadcrumb-item class="mx_header_text">查看食材</a-breadcrumb-item>
                        </a-breadcrumb>
                        <!-- main -->
                        <div>
                            <div
                                class="mx_main"
                                style="width:65%;marginBottom:60px;"
                            >
                                <!-- <div> -->
                                <div
                                    class="mx_title"
                                    style="margin:0;"
                                >
                                    <div
                                        v-if="!isOthers"
                                        style="display: flex;justify-content: space-between;align-items: center;"
                                    >
                                        <div style="margin-right:56px;">{{showFoodsInfo.supplier_title}}</div>
                                        <div style="margin-right:56px;">所属订单号：{{showFoodsInfo.order_no}}</div>
                                        <div><span style="margin-right:18px;">{{showFoodsInfo.created_at}}</span></div>
                                    </div>
                                    <div
                                        v-if="isOthers"
                                        style="margin-right:56px;"
                                    >隔壁小卖部</div>
                                </div>
                                <!-- </div> -->
                                <div class="mx_list">
                                    <img
                                        src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                        alt=""
                                    >
                                    <span style="margin-right:56px;">{{showFoodsInfo.material_title}}</span>
                                    <span style="margin-right:56px;">&yen;{{showFoodsInfo.order_unit_price}}</span>
                                    <span style="margin-right:56px;">{{showFoodsInfo.order_num}}</span>
                                    <span style="margin-right:56px;">总价：&yen;{{showFoodsInfo.total_price}}</span>
                                    <span>批次号：{{showFoodsInfo.batch_num}}</span>
                                </div>
                            </div>
                            <a-row style="fontWeigh:bold;color:#000;">
                                <a-col :span="8">
                                    <div>
                                        <p>入库方式：<span>立即入库</span></p>
                                        <p>存放仓库：<span>{{showFoodsInfo.storehou_title}}</span></p>
                                        <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>30天</span></p>
                                        <p>预警时间：<span>{{showFoodsInfo.yj_str}}</span></p>
                                        <p>操&nbsp;&nbsp;作&nbsp;&nbsp;人：<span>{{showFoodsInfo.yj_str}}</span></p>
                                        <p>操作时间：<span>{{showFoodsInfo.yj_str}}</span></p>
                                    </div>
                                    <div
                                        v-if="isOthers"
                                        style="marginTop:30px;"
                                    >
                                        <p>来源方式：<span>自购</span></p>
                                        <p>获&nbsp;&nbsp;取&nbsp;&nbsp;人：<span>王阿航</span></p>
                                        <p>来源方联系方式：<span>1512358963</span></p>
                                        <p>来源方地址：<span>重庆市</span></p>
                                    </div>
                                    <p style="marginTop:30px;">品牌名称：<span>{{showFoodsInfo.cargo_title}}</span></p>
                                    <p>生产厂家：<span>{{showFoodsInfo.factory}}</span></p>
                                    <p>产&emsp;&emsp;地：<span>{{showFoodsInfo.source}}</span></p>
                                    <p>生产日期：<span>{{moment(showFoodsInfo.product_date_str,'YYYY-MM-DD').format('YYYY-MM-DD')}}</span></p>
                                    <p>保&nbsp;&nbsp;质&nbsp;&nbsp;期：<span>{{showFoodsInfo.shelf_life}}天</span></p>
                                    <p>贮存方式：<span>{{showFoodsInfo.storage_method_str}}</span></p>
                                    <p>包装方式：<span>{{showFoodsInfo.pack_str}}</span></p>
                                    <p>净&nbsp;&nbsp;含&nbsp;&nbsp;量：<span>{{showFoodsInfo.net_weight}}</span></p>
                                </a-col>
                                <a-col :span="16">
                                    <div>
                                        <p>食材照片</p>
                                        <img
                                            style="width:92px;height:92px;marginRight:30px;"
                                            v-for="item in 2"
                                            src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                            alt=""
                                        >
                                    </div>
                                    <div style="marginTop:50px;">
                                        <p>票据照片</p>
                                        <img
                                            style="width:92px;height:92px;marginRight:30px;"
                                            v-for="item in 2"
                                            src="http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg"
                                            alt=""
                                        >
                                    </div>
                                </a-col>
                            </a-row>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </a-skeleton>
    </div>
</template>

<script>
import moment from 'moment';
import { deepEqual } from 'assert';

const columnNull = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 9;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;
            }
            return obj;
        },
    },
    {
        title: "图片",
        dataIndex: "images",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "images" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "名称",
        dataIndex: "name",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "name" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "存放仓库",
        dataIndex: "deposit",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "deposit" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "批次号",
        dataIndex: "batchNum",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batchNum" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "单价/单位",
        dataIndex: "unit",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "unit" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "数量",
        dataIndex: "num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "num" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "合计",
        dataIndex: "total",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "total" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" },
        customRender: (value, row, index) => {
            const obj = {
                children: value,
                attrs: {},
            };
            // obj.attrs.rowSpan = 5;
            obj.attrs.colSpan = 0;
            if (index === 0) {
                obj.attrs.rowSpan = 9;
            } else {
                obj.attrs.rowSpan = 0;

            }
            return obj;
        },
    }
];

const dataNull = [];
for (let i = 0; i < 10; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
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
    var sumNum = 100;
    dataNull.push({
        key: i.toString(),
        orderNum: `快去添加出库食材吧`,
        images: imgList[i],
        name: `Edrward ${i}`,
        deposit: `仓库${deposit}`,
        batchNum: `265365${i}`,
        unit: `￥15.00/斤`,
        total: `${sumNum}`,
    });
}

const columns = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" }
    },
    {
        title: "图片",
        dataIndex: "material_single_src",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_single_src" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "存放仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "num" }
    },
    {
        title: "合计",
        dataIndex: "num_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "num_price" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const data = [];
for (let i = 0; i < 10; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
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
    var sumNum = 100;
    data.push({
        key: i.toString(),
        orderNum: `${i + 1}`,
        material_single_src: imgList[i],
        material_title: `Edrward ${i}`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        order_unit_price: `￥15.00/斤`,
        num_price: `${sumNum}`,
    });
}


const columnMeal = [
    {
        slots: { title: 'breakfast' },
        dataIndex: "morning",
        align: "center",
        width: "25%",
        scopedSlots: { customRender: "morning" },

    },
    {
        slots: { title: 'lunch' },
        dataIndex: "noon",
        align: "center",
        width: "25%",
        scopedSlots: { customRender: "noon" }
    },
    {
        slots: { title: 'dinner' },
        dataIndex: "night",
        align: "center",
        width: "25%",
        scopedSlots: { customRender: "night" }
    },
    {
        slots: { title: 'snack' },
        dataIndex: "add_meals",
        align: "center",
        width: "25%",
        scopedSlots: { customRender: "add_meals" }
    },

];

const dataMeal = [{
    morning: [
        {
            "id": 45,
            "title": "番茄鸡蛋",
            "food_id": 1,
            "recipe_id": 21,
            "serial_num": "RECIPE-Q7EDL-2019091283540",
            "state": 0,
            "week": 1,
            "meal_times": 1,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "未审核"
        }
    ],
    noon: [
        {
            "id": 47,
            "title": "小葱拌豆腐",
            "food_id": 2,
            "recipe_id": 21,
            "serial_num": "RECIPE-Z9P6F-2019091230522",
            "state": 0,
            "week": 1,
            "meal_times": 2,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "未审核"
        },
    ],
    night: [
        {
            "id": 50,
            "title": "鱼香肉丝",
            "food_id": 4,
            "recipe_id": 21,
            "serial_num": "RECIPE-99SW7-2019091253118",
            "state": 0,
            "week": 2,
            "meal_times": 3,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "未审核"
        },
        {
            "id": 52,
            "title": "鱼香肉丝",
            "food_id": 4,
            "recipe_id": 21,
            "serial_num": "RECIPE-6RCND-2019091291222",
            "state": 0,
            "week": 2,
            "meal_times": 3,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "13983725804"
        },
    ],
    add_meals: [
        {
            "id": 63,
            "title": "番茄鸡蛋",
            "food_id": 1,
            "recipe_id": 21,
            "serial_num": "RECIPE-F5PWW-2019091262164",
            "state": 0,
            "week": 4,
            "meal_times": 1,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "13983725804"
        },
        {
            "id": 52,
            "title": "鱼香肉丝",
            "food_id": 4,
            "recipe_id": 21,
            "serial_num": "RECIPE-6RCND-2019091291222",
            "state": 0,
            "week": 2,
            "meal_times": 3,
            "cycle": "2019090920190915",
            "use_time": 1568563200,
            "created_at": "2019-08-25 18:17:07",
            "dietitian": "小于于",
            "producer": "于洋",
            "auditor_nickname": "13983725804"
        }
    ],
    key: 1,
    dietitian: "小于于",
    producer: "于洋",
    auditor_nickname: "13983725804"
}];

const columnReturnGoods = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" }
    },
    {
        title: "图片",
        dataIndex: "material_single_src",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_single_src" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "存放仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "num" }
    },
    {
        title: "合计",
        dataIndex: "num_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "num_price" }
    },
];

const dreturnGoodsList = [];
for (let i = 0; i < 5; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
    }
    var imgList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
    ]
    var sumNum = 100;
    dreturnGoodsList.push({
        key: i.toString(),
        orderNum: `${i + 1}`,
        material_single_src: imgList[i],
        material_title: `Edrward ${i}`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        order_unit_price: `￥15.00/斤`,
        num: `200/斤`,
        num_price: `${sumNum}`,
    });
}

const column = [
    {
        title: "食堂",
        dataIndex: "canteen",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "canteen" }
    },
    {
        title: "单号",
        dataIndex: "out_odo",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "out_odo" }
    },
    {
        title: "种类数量",
        dataIndex: "kinds",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "kinds" }
    },
    {
        title: "总价",
        dataIndex: "total_price",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "total_price" }
    },
    {
        title: "出库用途",
        dataIndex: "out_style_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "out_style_str" }
    },
    {
        title: "当前状态",
        dataIndex: "state_str",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "state_str" }
    },
    {
        title: "出库人",
        dataIndex: "username",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "username" }
    },
    {
        title: "出库时间",
        dataIndex: "updated_at",
        align: "center",
        width: "15%",
        scopedSlots: { customRender: "updated_at" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];
const MealRecordList = [];
for (let i = 0; i < 10; i++) {
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
    if (i < 1) {
        mealTimesm = "早餐"
    } else if (i < 2) {
        mealTimesm = "中餐"
    } else if (i < 3) {
        mealTimesm = "晚餐"

    } else if (i < 4) {
        mealTimesm = "加餐"
    } else if (i < 5) {
        mealTimesm = "报损"
    } else if (i < 6) {
        mealTimesm = "移库"
    } else if (i < 7) {
        mealTimesm = "退货"
    } else {
        mealTimesm = "其他"
    }
    MealRecordList.push({
        key: i.toString(),
        canteen: `${canteen}`,
        out_odo: `215968998798${i}`,
        kinds: `1${i}`,
        total_price: `￥5000.${i}0`,
        out_style_str: `${mealTimesm}`,
        username: `阿${i}`,
        datupdated_atetime: `2019-0${i}-0${i}    1${i}:2${i}`,
    });
}

const columnShowInfo = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" }
    },
    {
        title: "图片",
        dataIndex: "material_img",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_img" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "存放仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "number",
        align: "center",
        width: "12%",
        scopedSlots: { customRender: "number" }
    },
    {
        title: "合计",
        dataIndex: "total_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "total_price" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    }
];

const dataShowInfo = [];
for (let i = 0; i < 2; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
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
    dataShowInfo.push({
        key: i.toString(),
        orderNum: `${i + 1}`,
        material_img: imgList[i],
        material_title: `包包白`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        order_unit_price: `￥15.00/斤`,
        number: `200斤`,
        total_price: `￥500.00`,
    });
}

const columnBackGoods = [
    {
        title: "序号",
        dataIndex: "orderNum",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "orderNum" }
    },
    {
        title: "图片",
        dataIndex: "material_img",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "material_img" }
    },
    {
        title: "名称",
        dataIndex: "material_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "material_title" }
    },
    {
        title: "存放仓库",
        dataIndex: "storehou_title",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "storehou_title" }
    },
    {
        title: "批次号",
        dataIndex: "batch_num",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "batch_num" }
    },
    {
        title: "单价/单位",
        dataIndex: "order_unit_price",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "order_unit_price" }
    },
    {
        title: "数量",
        dataIndex: "number",
        align: "center",
        width: "10%",
        scopedSlots: { customRender: "number" }
    },
    {
        title: "合计",
        dataIndex: "total_price",
        align: "center",
        width: "8%",
        scopedSlots: { customRender: "total_price" }
    },
    {
        title: "操作按钮",
        dataIndex: "operation",
        align: "center",
        scopedSlots: { customRender: "operation" }
    },
];

const backGoodsList = [];
for (let i = 0; i < 5; i++) {
    var deposit;
    if (i % 2 == 0) {
        deposit = 1;
    } else {
        deposit = 2;
    }
    var imgList = [
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" },
        { pic: "http://pic46.nipic.com/20140815/2531170_172548240000_2.jpg" },
        { pic: "http://pic41.nipic.com/20140508/18609517_112216473140_2.jpg" },
        { pic: "http://pic51.nipic.com/file/20141025/8649940_220505558734_2.jpg" },
        { pic: "http://h.hiphotos.baidu.com/lvpics/w=600/sign=5dc3621e19d5ad6eaaf967eab1c939a3/0b55b319ebc4b745cc71eecccdfc1e178b821506.jpg" }
    ]
    var sumNum = 100;
    backGoodsList.push({
        key: i.toString(),
        orderNum: `${i + 1}`,
        material_img: imgList[i],
        material_title: `Edrward ${i}`,
        storehou_title: `仓库${deposit}`,
        batch_num: `265365${i}`,
        order_unit_price: `￥15.00/斤`,
        number: `200/斤`,
        total_price: `${sumNum}`,
    });
}

export default {
    data() {
        return {
            activeKey: '1',
            loadingActive: false,
            loading: true,
            value: 1,
            moment,
            // 食堂
            canteen: [],
            canteenId: '',
            canteenShow: [],
            mxClassVal: '',
            // 出库用途
            outPurposeList: [],
            deflVal: '',
            distinguish: '',
            userDate: undefined,
            userTime: false,
            // activeVal: '',
            // 判断tab数据是否为空
            isDataNull: false,
            // table null
            columnNull,
            dataNull,
            // table
            data,
            columns,
            totalPrice: '',
            sumPrice: '100',
            sumNum: '200',
            footer: (currentPageData) => {
                return (
                    <div>
                        <p style='text-align: right;margin-bottom: 0;'>总计：<span style='font-size:18px;color:red;'>&yen;{this.totalPrice}</span></p>
                    </div>
                );
            },
            sumPriceNull: '0.00',
            footerNull: (currentPageData) => {
                return (
                    <div>
                        <p style='text-align: right;margin-bottom: 0;'>总计：<span style='font-size:18px;color:red;'>&yen;{this.sumPriceNull}</span></p>
                    </div>
                );
            },
            isDel: false,
            outId: '',
            // 生成食谱
            isRecipe: false,
            m: 0,
            data,
            nowdata: '',
            weeks: '',
            timeDate: '',
            columnMeal,
            loadingRecipes: true,
            dataMeal,
            footerMeal: (currentPageData) => {
                return (
                    <div style='display: flex;align-items: center;'>
                        <div style='margin:0 100px 0 50px;'>营养师：<span>{this.dataMeal[0].dietitian}</span></div>
                        <div style='margin:0 100px 0 50px;'>制谱人：<span>{this.dataMeal[0].producer}</span></div>
                        <div style='margin:0 100px 0 50px;'>审核人：<span>{this.dataMeal[0].auditor_nickname}</span></div>
                    </div>
                );
            },
            titleDate: ['早餐', '午餐', '晚餐', '加餐'],
            mxcheck: '-1',
            checkMealTimes: '',
            mealTime: '',
            // 添加食材
            addFoodList: [],
            addFoodNum: '',
            isAddFoods: false,
            isResult: false,
            isSearch: true,
            isRetrieval: false,
            // 早餐出库
            scene: "",
            remorkInfo: "",
            remorkInfos: "",
            isMailReval: false,
            previewVisible: false,
            previewImage: "",
            fileList: [],
            previewVisibles: false,
            previewImages: "",
            sedList: [],
            myForm: this.$form.createForm(this),
            // 报损出库
            isFrmLoss: false,
            damagedVisible: false,
            damagedImage: "",
            damagedList: [],
            isSucceedSub: false,
            // 退货出库
            isSucceedSubs: false,
            isRetrievalGoods: false,
            columnReturnGoods,
            dreturnGoodsList,
            tabsVisible: false,
            backFoodsRemork: "",
            tabsImage: "",
            tabsList: [],
            // 其它出库
            isOther: false,
            // 移库
            isMoveLibrary: false,
            removeRemork: '',
            moveCanteen: '',
            storehouseList: [],  //仓库列表
            storehouseId: '',
            // 出库记录
            loadingrecord: true,
            canteenShowInfo: 0,
            recordOrder: '',
            purposeId: -1,
            outPurposesList: [], //用途
            // 日期
            startRecord: "",
            endRecord: "",
            startValue: null,
            endValue: null,
            endOpen: false,
            MealRecordList,
            column,
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
            // 查看详情
            loadingShowInfo: true,
            isShowInfo: false,
            columnShowInfo,
            dataShowInfo,
            recordInfo: {},
            outTotalPrice: '',
            // 审核
            isAgree: false,
            auditState: '',
            auditTitle: '',
            placeholder: '',
            auditCause: '',
            dataShowInfoId: '',
            // 出库用途
            purpose: '',
            suditState: false,
            // 报损
            isRedFrmLoss: false,
            lossesCauseList: [],
            lossesId: '',
            // 移库
            moveDepot: false,
            // 退货
            columnBackGoods,
            backGoodsList,
            isReturnGoods: false,
            // 查看食材
            showFoodsInfo: {},
            isShowFood: false,
            isOthers: false,
            showList: {},
        }
    },
    created() {
        this.userDate = moment().format("YYYY-MM-DD");
        // 获取食堂
        this.getCanteen();
        // 获取出库用途
        this.getOutPurpose();
        // 获取仓库记录
        this.getOutRecordList('', '', '', '', '');
    },
    mounted() {
    },
    watch: {
        startValue(val) {
            if (val) {
                this.startRecord = moment(val._d).format("YYYY-MM-DD");
            }
            console.log("startValue", val);
        },
        endValue(val) {
            if (val) {
                this.endRecord = moment(val._d).format("YYYY-MM-DD");
            }
            console.log("endValue", val);
        },
    },
    methods: {
        callback(e) {
            this.activeKey = e;
            this.loadingActive = true;
            if (e == '1') {
                // 获取食堂
                this.getCanteen();
                // 获取出库用途
                this.getOutPurpose();
            } else {
                this.loadingRecord = true;
                this.getOutRecordList('', '', '', '', '');
            }
        },
        // 出库列表
        getOutList(canteenId) {
            this.$get("api/school/outrecipe/cachelist?canteen_id=" + canteenId).then(res => {
                if (res.data.code == 0) {
                    let totalPrice = 0;
                    if (res.data.data.length > 0) {
                        res.data.data.forEach((item, index) => {
                            totalPrice = parseFloat(totalPrice) + parseFloat(item.num_price);
                            item.orderNum = index + 1;
                            item.key = item.id;
                        });
                    }
                    this.data = res.data.data;
                    this.loadingActive = false;
                    this.loading = false;
                    this.totalPrice = totalPrice;
                } else {
                    console.log(22)
                }
            })
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteenShow = res.data.data;
                    let data = {
                        id: 0,
                        title: '全部'
                    }
                    this.canteenShow.splice(0, 0, data);
                    let arr = [];
                    this.canteenShow.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item);
                        }
                    });
                    this.canteen = arr;
                    if (this.$route.query.canteen_id) {
                        this.canteenId = this.$route.query.canteen_id;
                    } else {
                        this.canteenId = this.canteen[0].id;
                    }
                    this.getOutList(this.canteenId);
                } else {
                    console.log(22)
                }
            })
        },
        // 获取出库用途
        getOutPurpose() {
            this.$get("api/school/outselectstyle", {}).then(res => {
                if (res.data.code == 0) {
                    this.outPurposeList = res.data.data;
                    this.deflVal = res.data.data[0].id;
                    this.distinguish = res.data.data[0].pid;

                    this.outPurposesList = res.data.data;
                    let data = {
                        id: -1,
                        title: '全部'
                    }
                    this.outPurposesList.splice(0, 0, data);
                    let arr = [];
                    this.outPurposesList.forEach((item, i) => {
                        if (i != 0) {
                            arr.push(item);
                        }
                    });
                    this.outPurposeList = arr;
                    this.deflVal = this.outPurposeList[0].id;
                    this.distinguish = this.outPurposeList[0].pid;
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂
        onChange(e) {
            this.canteenId = e.target.value;
            this.loading = true;
            this.getOutList(e.target.value);
        },
        // 使用日期 变化
        onDateChange(date, dateString) {
            this.userDate = dateString;
        },
        // 监听表中input的变化
        mxInpVal(e, val) {
            val.num = e.target.value;
            let data = {
                url: "api/school/outrecipe/updatelist",
                method: 'post',
                data: {
                    num: e.target.value,
                    id: val.id
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    val = res.data.data;
                    this.data[e.target.dataset.index].num_price = res.data.data.num_price;
                    let totalPrice = 0;
                    this.data.forEach((item, index) => {
                        totalPrice = parseFloat(totalPrice) + parseFloat(item.num_price);
                        item.orderNum = index + 1;
                        item.key = item.id;
                    });
                    this.totalPrice = totalPrice;
                } else {
                    this.$message.success(res.data.msg);
                }
            })
        },
        // 删除
        mxDel(id) {
            this.isDel = true;
            this.outId = id;
        },
        mxCancel() {
            this.isDel = false;
        },
        mxDelete() {
            this.isDel = false;
            let data = {
                url: "api/school/outstorerecord/" + this.outId,
                method: 'delete',
                data: {},
            };
            this.$apiAxiox(data).then((res) => {
                this.$message.success("移除食材成功");
                this.loading = true;
                this.getOutList(this.canteenId);
            })

        },
        // 生成食谱
        mxRecipe() {
            this.m = 0;
            this.dateWeek(this.m);
            this.isRecipe = true;
            this.loadingRecipes = true;
            this.getRecipesList(this.canteenId, this.nowdata);
        },
        // 获取食谱列表
        getRecipesList(canteenId, nowdata) {
            this.$get("api/school/outrecipe/recipe?canteen_id=" + canteenId + '&time=' + nowdata, {}).then(res => {
                if (res.data.code == 0) {
                    res.data.data.key = 1;
                    let dataArr = [];
                    dataArr.push(res.data.data);
                    this.dataMeal = dataArr;
                    this.loadingRecipes = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 出库用途切换
        mxChangeVal(e) {
            this.deflVal = e;
            this.outPurposeList.forEach(item => {
                if (item.id == e) {
                    this.distinguish = item.pid;
                }
            })
            if (this.distinguish == '101') {
                this.userTime = false;
            } else {
                this.userTime = true;
            }
        },
        // 返回
        backRecipe() {
            this.mxcheck = '-1';
            this.checkMealTimes = '';
            this.m = 0;
            this.dateWeek(this.m)
            this.isRecipe = false;
            this.loadingRecipes = true;
            this.getRecipesList(this.canteenId, this.nowdata);
        },
        mxPreDay() {
            this.m++;
            this.dateWeek(this.m)
        },
        mxDay() {
            this.m = 0;
            this.dateWeek(this.m)
        },
        mxNextDay() {
            this.m--;
            this.dateWeek(this.m)
        },
        // 获取当前的时间和星期
        dateWeek(m) {
            let date = moment().subtract(m, "days")
            this.nowdata = moment(date).format('YYYY年MM月DD日')
            let num = moment(date).format('d');
            if (num == 1) {
                this.weeks = "星期一"
            } else if (num == 2) {
                this.weeks = "星期二"
            } else if (num == 3) {
                this.weeks = "星期三"
            } else if (num == 4) {
                this.weeks = "星期四"
            } else if (num == 5) {
                this.weeks = "星期五"
            } else if (num == 6) {
                this.weeks = "星期六"
            } else {
                this.weeks = "星期天"
            }
            this.timeDate = moment(this.nowdata, 'YYYY-MM-DD').format('x') / 1000;
            this.loadingRecipes = true;
            this.getRecipesList(this.canteenId, this.timeDate);
        },
        // 选中
        mxChecked(i) {
            this.mxcheck = i;
            this.checkMealTimes = i + 1;
        },
        // 立即生成
        mxPromptlyCreate() {
            if (this.checkMealTimes != '') {
                this.$get("api/school/outrecipe/preparation?meals=" + this.checkMealTimes + '&time=' + this.timeDate + "&canteen_id=" + this.canteenId).then(res => {
                    if (res.data.code == 0) {
                        // this.$message.success('食谱生成成功');
                        console.log(res);
                        this.mxcheck = '-1';
                        this.checkMealTimes = '';
                        this.m = 0;
                        this.dateWeek(this.m)
                        this.$message.warning(res.data.msg);
                        this.isRecipe = false;
                        // this.loadingRecipes = true;
                        // this.getRecipesList(this.canteenId, this.nowdata);
                        this.loading = true;
                        this.getOutList(this.canteenId);
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            } else {
                this.$message.warning('请选择生成餐次');
            }
        },
        // 立即出库
        mxOutRetrieval() {
            this.outPurposeList.forEach(item => {
                if (item.id == this.deflVal) {
                    this.mealTime = item.title;
                    this.scene = item.scene;
                }
            })
            if (this.deflVal == "96") { this.mealTime = '早餐'; this.isMailReval = true; }
            else if (this.deflVal == "97") { this.mealTime = '午餐'; this.isMailReval = true; }
            else if (this.deflVal == "98") { this.mealTime = '晚餐'; this.isMailReval = true; }
            else if (this.deflVal == "99") { this.mealTime = '加餐'; this.isMailReval = true; }
            else if (this.deflVal == "102") { this.mealTime = '报损'; this.isMailReval = true; this.isFrmLoss = true; this.getLossesCause(); }
            else if (this.deflVal == "0") { this.mealTime = '其他'; this.isMailReval = true; this.isOther = true; }
            else if (this.deflVal == "103") { this.isRetrievalGoods = true; this.dreturnGoodsList = this.data; }
            else { this.mealTime = '移库'; this.isMailReval = true; this.isMoveLibrary = true; this.moveCanteen = this.canteen[0].id; this.getStorehouseList(this.canteen[0].id); }
        },
        // 添加食材
        mxAddFoods() {
            this.isAddFoods = true;
        },
        // 搜索
        mxSeach() {
            this.isResult = true;
            if (this.mxClassVal == '') {
                this.isSearch = true;
            }
            this.$get("api/school/searchmaterial?keyword=" + this.mxClassVal + '&canteen_id=' + this.canteenId).then(res => {
                if (res.data.code == 0) {
                    if (res.data.data.length <= 0) {
                        this.isResult = false;
                        this.isSearch = false;
                    }
                    res.data.data.forEach(item => {
                        item.isAdd = false;
                        item.inputVal = '';
                    })
                    this.addFoodList = res.data.data;
                } else {
                    console.log(22)
                }
            })
        },
        emitEmpty() {
            this.$refs.userNameInput.focus()
            this.mxClassVal = ''
        },
        // 获取报损原因
        getLossesCause() {
            this.$get("api/school/damagestyle").then(res => {
                if (res.data.code == 0) {
                    this.lossesCauseList = res.data.data;
                    this.lossesId = res.data.data[0].id;
                } else {
                    console.log(22)
                }
            })
        },
        // 返回
        backAddFoods() {
            this.isAddFoods = false;
            this.addFoodList = [];
        },
        // 出库
        mxRetrieval(e) {
            // this.isRetrieval = true;
            console.log(e)
        },
        // 确定添加
        mxSureReval(val) {
            if (this.addFoodNum == '') {
                this.$message.warning('请填写出库数量');
            } else {
                val.isAdd = !val.isAdd;
                this.$get("api/school/outfirtstep?num=" + this.addFoodNum + '&id=' + val.id, {}).then(res => {
                    if (res.data.code == 0) {
                        this.isAddFoods = false;
                        val.inputVal = '';
                        this.$message.success('添加食材成功');
                        this.addFoodList = [];
                        this.loading = true;
                        this.getOutList(this.canteenId);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            }
        },
        // 数量
        mxNumVal(e, val) {
            if (e.target.value > parseFloat(val)) {
                this.addFoodNum = parseFloat(val);
                e.target.value = parseFloat(val);
            } else {
                this.addFoodNum = e.target.value;
            }
            this.addFoodList[e.target.dataset.index].inputVal = this.addFoodNum;
        },
        // 出库 返回
        backMailReval() {
            this.isMoveLibrary = false;
            this.isOther = false;
            this.isFrmLoss = false;
            this.isMailReval = false;
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
        // 出库票据上传
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
        // 表单提交
        secondSubmit(e) {
            e.preventDefault();
            this.myForm.validateFields((err, values) => {
                if (!err) {
                    let imgArr = [];
                    let imgArr1 = [];
                    let imgArr2 = [];
                    if (this.fileList.length > 0) {
                        this.fileList.forEach(e => {
                            imgArr.push(e.response.data.id);
                        })
                    }
                    if (this.sedList.length > 0) {
                        this.sedList.forEach(e => {
                            imgArr1.push(e.response.data.id);
                        })
                    }
                    if (this.damagedList.length > 0) {
                        this.damagedList.forEach(e => {
                            imgArr2.push(e.response.data.id);
                        })
                    }
                    let batch_ids = [];
                    this.data.forEach(item => {
                        batch_ids.push(item.id);
                    })
                    if (this.deflVal == 102) {
                        this.requestOut(this.scene, this.deflVal, this.canteenId, this.userDate, batch_ids, this.remorkInfos, imgArr2, imgArr1, '', '', this.lossesId);
                    } else if (this.deflVal == 104) {
                        this.requestOut(this.scene, this.deflVal, this.canteenId, this.userDate, batch_ids, this.removeRemork, imgArr, imgArr1, this.moveCanteen, this.storehouseId, '');
                    } else {
                        this.requestOut(this.scene, this.deflVal, this.canteenId, this.userDate, batch_ids, this.remorkInfo, imgArr, imgArr1, '', '', '');
                    }
                }
            });

        },
        // 出库请求
        requestOut(scene, deflVal, canteenId, userDate, batch_ids, remark, photo, bill, moveCanteenId, storehou_id, damage_reason) {
            let data = {
                url: "api/school/outstorerecord",
                method: 'post',
                data: {
                    scene: scene,          //场景值
                    style: deflVal,        //类型值
                    canteen_id: canteenId, //食堂id
                    use_time: userDate,    //使用时间
                    batch_ids: batch_ids.join(','), //出库列表中id
                    remark: remark,       //备注
                    photo: photo.join(','),        //食材图片
                    bill: bill.join(','),         //票据图片
                    move_to_canteen_id: moveCanteenId, //移动到的食堂id
                    storehou_id: storehou_id,         //移动到的仓库id
                    damage_reason: damage_reason,        //报损原因
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.remorkInfo = '';
                    this.removeRemork = '';
                    this.fileList = [];
                    this.sedList = [];
                    this.damagedList = [];
                    this.storehouseId = '';
                    if (this.deflVal == 102) {
                        this.remorkInfos = '';
                        this.lossesId = this.lossesCauseList[0].id;
                        this.isMailReval = false;
                        this.isSucceedSub = true;
                    }
                    if (this.deflVal == 103) {
                        this.backFoodsRemork = '';
                        this.tabsList = [];
                        this.isRetrievalGoods = false;
                        this.isSucceedSubs = true;
                    }

                    this.deflVal = this.outPurposeList[0].id;
                    this.distinguish = this.outPurposeList[0].pid;
                    this.userTime = false;
                    this.isMoveLibrary = false;
                    this.isOther = false;
                    this.isFrmLoss = false;
                    this.isMailReval = false;
                    this.loading = true;
                    this.getOutList(this.canteenId);
                    this.$message.success(this.mealTime + '出库成功');
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        // 报损出库
        // 返回
        backFrmLoss() {
            this.isFrmLoss = false;
        },
        // 破损食材照片上传（用于审核）
        damagedCancel() {
            this.damagedVisible = false;
        },
        damagedPreview(file) {
            this.damagedImage = file.url || file.thumbUrl;
            this.damagedVisible = true;
        },
        damagedChange(info) {
            let damagedList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            damagedList = damagedList.slice(-2);

            // 2. 从响应读取并显示文件链接
            damagedList = damagedList.map(file => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.damagedList = damagedList;
        },
        // 报损原因
        mxChangeLosses(e) {
            this.lossesId = e;
        },
        // 获取仓库列表
        getStorehouseList(canteen_id) {
            this.$get("api/scale/storehouse?canteen_id=" + canteen_id).then(res => {
                if (res.data.code == 0) {
                    this.storehouseList = res.data.data;
                } else {
                    console.log(22)
                }
            })
        },
        // 移入食堂
        mxMoveCanteenChange(e) {
            this.moveCanteen = e;
            this.getStorehouseList(e);
        },
        // 仓库选中
        mxDamageChange(e) {
            this.storehouseId = e;
        },
        // 退货出库
        backGoods() {
            this.isRetrievalGoods = false;
        },
        // 照片上传
        tabsCancel() {
            this.tabsVisible = false;
        },
        tabsPreview(file) {
            this.tabsImage = file.url || file.thumbUrl;
            this.tabsVisible = true;
        },
        tabsChange(info) {
            let tabsList = [...info.fileList];

            // 1.限制上传的文件数
            // 只显示最近上载的3个文件，旧文件将替换为新文件
            tabsList = tabsList.slice(-3);

            // 2. 从响应读取并显示文件链接
            tabsList = tabsList.map(file => {
                if (file.response) {
                    // 组件将file.url显示为链接
                    file.url = file.response.data.url;
                }
                return file;
            });

            this.tabsList = tabsList;
        },
        // 确认提交
        mxRetrievalGoods() {
            let batch_ids = [];
            this.dreturnGoodsList.forEach(item => {
                batch_ids.push(item.id);
            })
            let imgArr = [];
            if (this.tabsList.length > 0) {
                this.fileList.forEach(e => {
                    imgArr.push(e.response.data.id);
                })
            }
            this.requestOut(this.scene, this.deflVal, this.canteenId, this.userDate, batch_ids, this.backFoodsRemork, imgArr, [], '', '', '');
        },
        // 提交成功页返回
        mxBack() {
            // 退货出库
            if (this.isSucceedSubs == true) {
                this.isSucceedSubs = false;
                this.loading = true;
                this.getOutList(this.canteenId);
            }
            // 报损出库
            if (this.isSucceedSub == true) {
                this.isSucceedSub = false;
                this.loading = true;
                this.getOutList(this.canteenId);
            }
        },
        // 出库记录
        // 出库记录列表
        getOutRecordList(out_style, canteen_id, keyword, begin, end) {
            let that = this;
            this.$get("api/school/outstorerecord?page=" + this.pagination.current + "&out_style=" + out_style + '&canteen_id=' + canteen_id + '&keyword=' + keyword + '&begin=' + begin + '&end=' + end).then(res => {
                if (res.data.code == 0) {
                    that.pagination.pageSize = res.data.data.per_page;
                    that.pagination.total = res.data.data.total;
                    res.data.data.data.forEach((item, index) => {
                        item.canteen = item.title;
                        item.key = item.id;
                    });
                    this.MealRecordList = res.data.data.data;
                    this.loadingActive = false;
                    this.loadingrecord = false;
                } else {
                    console.log(22)
                }
            })
        },
        // 食堂变化
        mxCanteenShow(e) {
            this.canteenShowInfo = e;
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
        // 查询
        mxQuery() {
            let canteenId, purposesId;
            if (this.canteenShowInfo == 0) {
                canteenId = '';
            } else {
                canteenId = this.canteenShowInfo;
            }
            if (this.purposeId == -1) {
                purposesId = '';
            } else {
                purposesId = this.purposeId;
            }
            let start, end;
            start = moment(this.startRecord).format('x') / 1000;
            end = moment(this.endRecord).format('x') / 1000;
            this.loadingrecord = true;
            this.getOutRecordList(purposesId, canteenId, this.recordOrder, start, end);
        },
        // 重置
        mxReset() {
            this.canteenShowInfo = 0;
            this.purposeId = -1;
            this.recordOrder = '';
            this.startRecord = '';
            this.endRecord = '';
            this.startValue = null;
            this.endValue = null;
            let canteenId, purposesId;
            if (this.canteenShowInfo == 0) {
                canteenId = '';
            } else {
                canteenId = this.canteenShowInfo;
            }
            if (this.purposeId == -1) {
                purposesId = '';
            } else {
                purposesId = this.purposeId;
            }
            this.loadingrecord = true;
            this.getOutRecordList(purposesId, canteenId, this.recordOrder, this.startRecord, this.endRecord);
        },
        // 列表
        handleTableChange(pagination, filters, sorter) {
            this.pagination.pageSize = pagination.pageSize;
            this.pagination.current = pagination.current;
            this.loadingrecord = true;
            let canteenId, purposesId;
            if (this.canteenShowInfo == 0) {
                canteenId = '';
            } else {
                canteenId = this.canteenShowInfo;
            }
            if (this.purposeId == -1) {
                purposesId = '';
            } else {
                purposesId = this.purposeId;
            }
            this.getOutRecordList(purposesId, canteenId, this.recordOrder, this.startRecord, this.endRecord);
        },
        // 查看
        mxShowMeal(val) {
            this.purpose = val.purpose
            this.showList = val;
            this.loadingShowInfo = true;
            if (val.audit_state == 1) {
                this.suditState = true;
            } else {
                this.suditState = false;
            }
            this.isShowInfo = true;
            this.$get("api/school/outstorerecord/" + val.id).then(res => {
                if (res.data.code == 0) {
                    let totalPrice = 0;
                    res.data.data.batch.forEach((item, index) => {
                        item.orderNum = index + 1;
                        item.key = index + 1;
                        totalPrice = parseFloat(totalPrice) + parseFloat(item.total_price);
                    });
                    this.outTotalPrice = totalPrice;
                    this.recordInfo = res.data.data;
                    this.dataShowInfoId = res.data.data.id;
                    this.dataShowInfo = res.data.data.batch;
                    this.loadingShowInfo = false;
                } else {
                    console.log(22)
                }
            })

            // 报损
            if (val.out_style == "102") {
                this.isRedFrmLoss = true;
            }
            // 移库
            if (val.out_style == "104") {
                this.moveDepot = true;
            }
            // 退货
            if (val.out_style == "103") {
                this.isReturnGoods = true;
            }
        },
        // 返回
        backShowInfo() {
            this.isShowInfo = false;
            this.isRedFrmLoss = false;
            this.moveDepot = false;
            this.isReturnGoods = false;
        },
        // 查看食材
        mxShowFood(id) {
            this.$router.push({
                path: "/mxFoodsInfo",
                query: {
                    id: id,
                    val: this.showList
                }
            });
            // this.$get("api/school/foods/" + id).then(res => {
            //     if (res.data.code == 0) {
            //         console.log(res);
            //         this.showFoodsInfo = res.data.data;
            //         // res.data.data.key = 1;
            //         // let dataArr = [];
            //         // dataArr.push(res.data.data);
            //         // this.dataMeal = dataArr;
            //         // this.loadingRecipes = false;
            //     } else {
            //         console.log(22)
            //     }
            // })

            // if (this.purpose == "其他") {
            //     this.isOthers = true;
            // } else {
            //     this.isOthers = false;
            // }
            // this.isShowInfo = false;
            // this.isShowFood = true;
        },
        // 返回
        backShowFood() {
            this.isShowInfo = true;
            this.isShowFood = false;
        },
        // 同意
        mxAgree(val) {
            this.isAgree = true;
            if (val == '拒绝') {
                this.auditState = '2';
                this.auditTitle = '拒绝原因';
                this.placeholder = '请仔细检查报损食材';
            } else {
                this.auditState = '1';
                this.auditTitle = '审核备注';
                this.placeholder = '快及时处理吧';
            }
        },
        mxOkAgree() {
            this.isAgree = false;
            let data = {
                url: "api/school/outstorerecord/" + this.dataShowInfoId,
                method: 'put',
                data: {
                    remark: this.auditCause,
                    state: this.auditState
                },
            };
            this.$apiAxiox(data).then((res) => {
                if (res.data.code == 0) {
                    this.auditState = '';
                    this.auditCause = '';
                    this.$message.success('库存报损审核成功');
                    this.isShowInfo = false;
                    let canteenId, purposesId;
                    if (this.canteenShowInfo == 0) {
                        canteenId = '';
                    } else {
                        canteenId = this.canteenShowInfo;
                    }
                    if (this.purposeId == -1) {
                        purposesId = '';
                    } else {
                        purposesId = this.purposeId;
                    }
                    this.loadingrecord = true;
                    this.getOutRecordList(purposesId, canteenId, this.recordOrder, this.startRecord, this.endRecord);
                } else {
                    this.$message.warning(res.data.msg);
                }
            })
        },
        mxCelAgree() {
            this.isAgree = false;
            this.auditCause = '';
        },
    }
}
</script>
<style>
#mx_outLibrary .isRecipe .ant-table-row.ant-table-row-level-0:hover {
    background: transparent;
}
#mx_outLibrary
    .isRecipe
    .ant-table-thead
    > tr.ant-table-row-hover:not(.ant-table-expanded-row)
    > td,
.ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
.ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: transparent;
}
</style>
<style lang="less" scoped>
.mx_header_icon,
.mx_header_text {
    font-size: 20px;
    font-weight: bold;
    color: #000;
}
.mx_header_icon {
    cursor: pointer;
}
.mx_dateList_right {
    display: flex;
    align-items: center;
    font-weight: bold;

    .mx_mouth {
        padding: 4px 10px;
        cursor: pointer;
    }
    .mx_mouth:hover {
        color: #02bb72;
    }
    .mx_thismouth {
        cursor: pointer;
        padding: 4px 10px;
        margin: 0 20px;
        background: #02bb72;
        color: #fff;
    }
}
.mx_dateList_name {
    font-weight: 500;
    padding: 6px 20px;
    margin-right: 20px;
    border: 1px solid #d9d9d9;
    background: #f2f2f2;
    border-radius: 4px;
}
.mx_form {
    margin: 30px 0;
    display: flex;
    align-items: center;
}
.mx_btnbg {
    margin: 0 10px;
}
.mx_foodsMain {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.mx_foodsList {
    width: 414px;
    // height: 260px;
    margin: 10px 40px 40px 10px;
    padding: 18px;
    box-shadow: 0px 0px 8px 0px #e2e2e2;
}
.clearfix {
    min-width: 150px;
    min-height: 112px;
}
.clearfix span {
    display: flex;
}
.mx_main_form {
    margin-top: 30px;
}
.ant-table-title {
    background: #fafafa;
}
.mx_divide {
    line-height: 30px;
    padding: 0 10px;
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
.mx_btns {
    background: #eee;
    padding: 4px 10px;
    margin-left: 80px;
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
</style>