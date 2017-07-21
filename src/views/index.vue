<style scoped>
    .wrapper{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: left;
    }
</style>
<template>
    <div class="wrapper">
        <v-header></v-header>
        <v-sidebar></v-sidebar>
        <v-content></v-content>
        <v-footer></v-footer>
    </div>
</template>

<script>
    import vHeader from './common/header.vue';
    import vSidebar from './common/sidebar.vue';
    import vContent from './common/content.vue';
    import vFooter from './common/footer.vue';
    export default {
        data() {
            return {
                theme: 'dark'
            }
        },
        components:{
            vHeader, vSidebar, vContent, vFooter
        }
    }
</script>
