<template>
    <el-menu class="sidebar" default-active="/" background-color="#304156" text-color="#bfcbd9"
        active-text-color="#409EFF" collapse-transition="true" mode="vertical" router>
        <!-- 概览 -->
        <el-menu-item index="/">
            <el-icon style="vertical-align: middle">
                <House />
            </el-icon>
            <span>概览</span>
        </el-menu-item>

        <!-- 应用商店 -->
        <el-menu-item index="/app-store">
            <el-icon style="vertical-align: middle">
                <Shop />
            </el-icon>
            <span>应用商店</span>
        </el-menu-item>

        <!-- 终端 -->
        <el-menu-item index="/terminal">
            <el-icon style="vertical-align: middle">
                <Shop />
            </el-icon>
            <span>终端</span>
        </el-menu-item>

        <!-- 网站 -->
        <el-sub-menu index="3">
            <template #title>
                <el-icon style="vertical-align: middle">
                    <Grid />
                </el-icon>
                <span>网站</span>
            </template>
            <el-menu-item index="/website/option1">选项 1</el-menu-item>
            <el-menu-item index="/website/option2">选项 2</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { House, Grid } from '@element-plus/icons-vue';

export default defineComponent({
    name: 'SideBar',
    components: {
        House,
        Grid,
    }
});
</script>

<style scoped>

.el-menu {
    border-radius: 4px;
        background-color: rgba(0, 94, 235, 0.1);
        margin: 6px 0;
        height: 46px;
        box-shadow: 0px 0px 4px rgba(0, 94, 235, 0.1);
        box-sizing: border-box;
}
/* .sidebar {
    height: 100vh;
    width: 220px;
    background-color: #001529;
    color: white;
} */

.el-icon {
    font-size: 16px;
    /* 控制图标大小 */
    margin-right: 10px;
    /* 图标和文字间距 */
}

.el-menu-item {
    border-radius: 4px;
    background-color: rgba(0, 94, 235, 0.1);
    margin: 6px 0;
    height: 46px;
    box-shadow: 0px 0px 4px rgba(0, 94, 235, 0.1);
    box-sizing: border-box;
}

.el-menu-item.is-active>.el-icon {
    color: #409EFF;
    /* 选中状态的
  图标颜色 */
}

/* Active menu item style */
.el-menu-item.is-active {
    background-color: rgba(64, 158, 255, 0.2);
    /* Light blue background */
    /* border-left: 4px solid #409EFF; */
    /* Blue left border */
    color: #409EFF;
    /* Text color */
    font-weight: bold;
}

.el-menu-item.is-active::before {
    position: absolute;
    border-radius: 4px;
    left: 12px;
    width: 4px;
    height: 14px;
    content: '';
    background: rgba(64, 158, 255, 0.2);
}
</style>
