<template>
    <div id="mxAddWarehouse">
        <!-- 头部 -->
        <a-breadcrumb separator=" ">
            <a-breadcrumb-item>
                <a-icon
                    @click="goback"
                    class="mx_header_icon"
                    type="arrow-left"
                />
            </a-breadcrumb-item>
            <a-breadcrumb-item class="mx_header_text">新建仓库</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- main -->
        <a-form
            :form="form"
            @submit="handleSubmit"
        >
            <a-form-item label="所属食堂">
                <a-select
                    placeholder="所属食堂选择"
                    style="width:300px;"
                    v-decorator="[
                        'canteenId',
                        {rules: [{ required: true, message: '请选择员工所属食堂' }]}
                    ]"
                >
                    <a-select-option
                        v-for="item in canteen"
                        :value="item.id"
                    >{{item.title}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="名称">
                <a-input
                    placeholder="填写仓库名称"
                    style="width:300px;"
                    v-decorator="[
                'warehouseName',
                {rules: [{ required: true, message: '请填写仓库名称' }]}
                ]"
                />
            </a-form-item>
            <a-form-item label="地址">
                <a-input
                    placeholder="填写仓库详细地址"
                    style="width:300px;"
                    v-decorator="[
                'address',
                {rules: [{ required: true, message: '请填写仓库详细地址' }]}
                ]"
                />
            </a-form-item>
            <a-form-item label="管理员">
                <a-input
                    placeholder="填写管理员姓名"
                    style="width:300px;"
                    v-decorator="[
                'administrators',
                {rules: [{ required: true, message: '请填写管理员姓名' }]}
                ]"
                />
            </a-form-item>
            <a-form-item label="联系电话">
                <a-input
                    placeholder="填写管理员联系电话"
                    style="width:300px;"
                    v-decorator="[
                'telephone',
                {rules: [{ required: true, message: '请填写管理员联系电话' }]}
                ]"
                />
            </a-form-item>
            <a-form-item label="储存类别">
                <a-checkbox-group v-decorator="[
                        'storageClass',
                        {rules: [{ required: true, message: '请选择仓库贮存类别' }]}
                    ]">

                    <a-checkbox
                        v-for="item in storeClass"
                        :value="item.id"
                    >{{item.title}}</a-checkbox>
                </a-checkbox-group>
            </a-form-item>

            <a-form-item>
                <a-button
                    type="primary"
                    html-type="submit"
                >立即新建</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
const plainOptions = [{ id: 1, label: "肉禽蛋类", value: "肉禽蛋类" }, { id: 2, label: "蔬菜素食", value: "蔬菜素食" }, { id: 3, label: "粮油干杂", value: "粮油干杂" }, { id: 4, label: "水果饮品", value: "水果饮品" }, { id: 5, label: "其他", value: "其他" }];
export default {
    data() {
        return {
            form: this.$form.createForm(this),
            plainOptions,
            storeClass: [],
            canteen: [],
            checkedList: [],
        };
    },
    mounted() {
        this.getCanteen();
        this.getStoreClass();
    },
    methods: {
        goback() {
            window.history.back(-1);
        },
        // 提交
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                // console.log("error", err);
                // console.log("Received values of form: ", values);
                if (!err) {
                    let data = {
                        url: "api/school/store",
                        method: 'post',
                        data: {
                            canteen_id: values.canteenId,
                            title: values.warehouseName,
                            lead: values.administrators,
                            lead_phone: values.telephone,
                            greats: values.storageClass.join(","),
                            location: values.address,
                        },
                    };
                    this.$apiAxiox(data).then((res) => {
                        this.$message.success("新建仓库成功");
                        this.$router.push({
                            path: "/mxWarehouseMngmt"
                        });
                    })
                }
            });
        },
        // 获取食堂
        getCanteen() {
            this.$get("api/school/canteen", {}).then(res => {
                if (res.data.code == 0) {
                    this.canteen = res.data.data
                } else {
                    console.log(22)
                }
            })
        },
        // 获取储存分类
        getStoreClass() {
            this.$get("api/common/dictionaries").then(res => {
                if (res.data.code == 0) {
                    this.storeClass = res.data.data.food
                    console.log(this.storeClass);

                } else {
                    console.log(22)
                }
            })
        },
    }
};
</script>

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
.mx_main {
    margin-top: 40px;
    .mx_outschool {
        margin-top: 240px;
    }
}
</style>