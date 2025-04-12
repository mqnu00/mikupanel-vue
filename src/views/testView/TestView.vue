<template>
    <h1>test</h1>
</template>
<script lang="ts">
import { TestClient } from './TestClient';

export default defineComponent({
    name: "TestView",
    setup() {
        const testClient = ref<TestClient>(new TestClient());
        onMounted(async () => {
            console.log(await testClient.value.DoRequest())
        })
    }
})
</script>