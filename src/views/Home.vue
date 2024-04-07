<template>
  <div class="home-page">
    <section>
      <div class="area" ref="area1Ref">
        <span>原文</span>
        <el-input
          style="width: 500px"
          v-model="inputVal"
          :rows="10"
          size="large"
          type="textarea"
          placeholder="待格式化文本"
          resize="none"
        ></el-input>
        <span class="textCount">字数：{{ inputVal.length }}</span>
      </div>
      <div class="area area-opts">
        <div class="area-opts-item">
          <span
            >格式化选项<el-icon><Bicycle /></el-icon
          ></span>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="checkedOpts"
            @change="handleCheckedOptsChange"
          >
            <el-checkbox
              v-for="opt in opts"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
              >{{ opt.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="area-opts-item">
          <span style="text-align: center"
            >功能区<el-icon><Guide /></el-icon
          ></span>
          <el-row>
            <el-col :span="3" style="text-align: left"> 氨基酸： </el-col>
            <el-col :span="21" style="text-align: left">
              <el-button type="success" round @click="tranformText"
                >三个字母转一个字母</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="area" ref="area2Ref">
        <span>格式化文本</span>
        <el-input
          style="width: 500px"
          v-model="formatVal"
          :rows="10"
          size="large"
          type="textarea"
          placeholder="输出结果"
          resize="none"
        ></el-input>
        <span class="textCount">字数：{{ formatVal.length }}</span>
      </div>
    </section>
    <section style="flex-direction: column" ref="area3Ref">
      <span>功能操作结果</span>
      <el-input
        style="width: 500px"
        v-model="resVal"
        :rows="10"
        size="large"
        type="textarea"
        placeholder="输出结果"
        resize="none"
      ></el-input>
      <span class="textCount">字数：{{ resVal.length }}</span>
    </section>
  </div>
  <Teleport to="body">
    <canvas id="arrowCanvas" ref="canvasRef"></canvas>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { threeToOne } from "@/utils/index";
import { ElMessage } from "element-plus";

const inputVal = ref<string>("");
const canvasRef = ref();
const area1Ref = ref();
const area2Ref = ref();
const area3Ref = ref();
const checkAll = ref<boolean>(false);
const isIndeterminate = ref(true);
const checkedOpts = ref<string[]>([]);
const opts = [
  {
    label: "过滤数字",
    value: "0",
  },
  {
    label: "过滤空格/换行",
    value: "1",
  },
  {
    label: "过滤非字母",
    value: "2",
  },
  {
    label: "全小写",
    value: "3",
  },
  {
    label: "全大写",
    value: "4",
  },
];

const handleCheckAllChange = (val: boolean) => {
  checkedOpts.value = val ? opts.map((v) => v.value) : [];
  isIndeterminate.value = false;
};
const handleCheckedOptsChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === opts.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < opts.length;
};

const formatFuncMap: Record<string, (v: string) => string> = {
  "0": (val: string) => val.replace(/\d/g, ""),
  "1": (val: string) => val.replace(/\s|\n/g, ""),
  "2": (val: string) => val.replace(/\W/g, ""),
  "3": (val: string) => val.toLowerCase(),
  "4": (val: string) => val.toUpperCase(),
};
const formatVal = computed(() => {
  let res = inputVal.value;
  checkedOpts.value.forEach((v) => {
    res = formatFuncMap[v](res);
  });
  return res;
});
const resVal = ref("");

// 三个转一个字母
const tranformText = () => {
  try {
    resVal.value = threeToOne(formatVal.value);
    ElMessage.success("转换成功！🤩");
  } catch (error: unknown) {
    ElMessage({
      type: "error",
      duration: 3000,
      message: ((error as string) || "转换失败") + "😫",
    });
  }
};
type ElCenter = {
  x: number;
  y: number;
};
const renderArrow = (cvs: HTMLCanvasElement, sourceCenter: ElCenter, targetCenter: ElCenter,  curveUp = true) => {
  const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;


  let controlX = (sourceCenter.x + targetCenter.x) / 2;
  if (!curveUp){
    controlX = controlX +  + 400;
  }
  const controlY = curveUp ? sourceCenter.y - 400 : sourceCenter.y + 600;
  // ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.beginPath();
  ctx.moveTo(sourceCenter.x, sourceCenter.y);
  ctx.quadraticCurveTo(controlX, controlY, targetCenter.x, targetCenter.y);
  ctx.strokeStyle = "rgba(87, 156, 52, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.save();
};
function startDraw(cvs: HTMLCanvasElement) {
  const sourceCenter1 = {
    x: area1Ref.value.offsetLeft + area1Ref.value.offsetWidth,
    y: area1Ref.value.offsetTop + area1Ref.value.offsetHeight / 2
  };
  const targetCenter1 = {
    x: area2Ref.value.offsetLeft,
    y: area2Ref.value.offsetTop + area2Ref.value.offsetHeight / 2
  };
  renderArrow(cvs, sourceCenter1 ,targetCenter1);
  const sourceCenter2 = {
    x: area2Ref.value.offsetLeft + area2Ref.value.offsetWidth / 2,
    y: area2Ref.value.offsetTop + area2Ref.value.offsetHeight / 2
  };
  const targetCenter2 = {
    x: area3Ref.value.offsetLeft + area3Ref.value.offsetWidth / 2,
    y: area3Ref.value.offsetTop + area3Ref.value.offsetHeight / 2
  };
  renderArrow(cvs, sourceCenter2,targetCenter2, false);
};

onMounted(() => {
  const cvs = canvasRef.value;
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  startDraw(cvs);
});

</script>

<style lang="less" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  > section {
    display: flex;
    gap: 16px 16px;
    justify-content: center;
    align-items: center;
    .area {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex-wrap: wrap;
      > span {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .textCount {
        color: #333;
      }
      &-opts {
        &-item {
          display: flex;
          flex-direction: column;
          > span {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .el-checkbox {
            --el-checkbox-font-size: 18px;
            --el-checkbox-input-height: 18px;
            --el-checkbox-input-width: 18px;
            ::v-deep(
                .el-checkbox__input.is-indeterminate .el-checkbox__inner:before
              ) {
              top: 7px;
            }
            ::v-deep(.el-checkbox__inner:after) {
              top: 3px;
              left: 6px;
            }
          }
          .el-checkbox-group {
            display: flex;
            flex-wrap: wrap;
          }
        }
      }
    }
  }
  .el-button {
    box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
      rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px,
        rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #d6d6e7 0 -3px 0 inset;
      transform: translateY(-1px);
    }
  }
}
#arrowCanvas {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
