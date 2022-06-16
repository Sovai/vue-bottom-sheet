<template>
  <div class="fixed inset-0" :class="[getWrapperClass, wrapperIndex]">
    <TransitionRoot
      :show="overlayState === 1"
      enter="transition-opacity ease-in duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity ease-out duration-300"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div :class="getOverlayStyle" @click="onOutsideClick" />
    </TransitionRoot>

    <div
      ref="sheetRef"
      class="relative bg-red backdrop-blur-sheet text-white rounded-t-[35px] z-[1002]"
      id="sheet-card"
    >
      <template v-if="renderSheet">
        <div ref="headerWrapperRef">
          <div class="pointer-events-none">
            <slot name="headerImage" />
            <div
              class="bg-white-2 h-4 w-45 rounded mx-auto cursor-pointer absolute top-12 left-1/2 -translate-x-1/2"
            />
          </div>
          <slot name="header">
            <div
              id="sheetHeader"
              :class="headerCls"
              class="flex w-full justify-between align-center sticky top-0 pt-16 pb-10"
            >
              <div class="text-lg">
                <div v-if="title" class="text-18 font-semibold">
                  {{ title }}
                </div>
              </div>
              <div v-if="showCloseButton" class="cursor-pointer">
                <svg
                  @click="setClose()"
                 xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>
           
              </div>
            </div>
          </slot>
        </div>
        <div
          ref="sheetContentRef"
          id="sheet-content"
          :class="[contentCls, getContentOverflow]"
          :style="getContentHeight"
          class="relative w-full"
        >
          <slot></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { debounce } from "@/helpers/util";
import { useDrag } from "@vueuse/gesture";
import { TransitionRoot } from "@headlessui/vue";
import { useMotionProperties, useMotionTransitions } from "@vueuse/motion";
import {
  nextTick,
  watch,
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { useLockScroll } from "@/helpers/lockScroll";
import {
  elHasScrollY,
  elScrolledBottom,
  elScrolledTop,
} from "@/helpers/element";

defineExpose({
  calculateHeight,
  setOpen,
  setClose,
});
const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  sheetClass: {
    type: String,
    default: null,
  },
  headerCls: {
    type: [String, Object],
    default: null,
  },
  contentCls: {
    type: [String, Object],
    default: null,
  },
  closeOnClickOutside: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 300,
  },
});
const emit = defineEmits(["onClickOutside", "onClose"]);

const sheetRef = ref();
const sheetContentRef = ref();
const headerWrapperRef = ref();

let headerWrapperHeight = ref(0);
let renderSheet = ref(true);
let sheetHeight = ref(0);
let state = ref();
let isDragging = ref(false)
let overlayState = ref(0);
let axisY = ref(0);
let wrapperIndex = ref("z-[1000]");
let windowHeight = ref(0);

const getContentHeight = computed(() => {
  const offsetHeight = (windowHeight.value / 100) * 5; // 5% of window height
  let height = windowHeight.value - (headerWrapperHeight.value + offsetHeight);

  return { "max-height": `${height}px` };
});

const { motionProperties } = useMotionProperties(sheetRef);
const { push } = useMotionTransitions(motionProperties);

const keyFrame = {
  type: "keyframe",
  ease: "linear",
  duration: 0,
  delay: 0,
};

const getOverlayStyle = computed(() => {
  return {
    block: true,
    fixed: true,
    "inset-0": true,
    "bg-overlay": true,
    "z-[1000]": true,
    "cursor-pointer": props.closeOnClickOutside,
  };
});

const getWrapperClass = computed(() => {
  return {
    "opacity-1": state.value === "open",
    "-z-40 opacity-0": state.value !== "open",
  };
});

const getContentOverflow = computed(() =>
  isDragging.value ? "overflow-y-hidden" : "overflow-y-auto"
);

function dragHandler(ctx) {
  // console.log("ctx: ", ctx);
  const { dragging } = ctx;
  if (dragging) {
    handleDrag(ctx);
  } else {
    handleDragEnd(ctx);
  }
}
function calculateHeight() {
  nextTick(() => {
    setTimeout(() => {
      sheetHeight.value = sheetRef.value?.clientHeight;
      windowHeight.value = window.innerHeight;
      headerWrapperHeight.value = headerWrapperRef.value?.clientHeight;

      // set sheet to hidden
      axisY.value = windowHeight.value;
      push("y", axisY.value, motionProperties, keyFrame);
    }, 100);
  });
}

const onWindowResize = () => {
  debounce(calculateHeight, 300);

  if (state.value === "open") {
    setOpen();
  }
};

function handleDrag(ctx) {
  if (ctx.tap || !allowDrag(ctx)) return;
  isDragging.value = true

  const {
    movement: [, y],
  } = ctx;

  const setY = axisY.value + y;

  // prevent drag over height
  if (y < 0) return;
  push("y", setY, motionProperties, keyFrame);
}

function handleDragEnd(ctx) {
  if (ctx.tap || !allowDrag(ctx)) return;
  isDragging.value = false

  const {
    swipe: [, sy],
    movement: [, y],
  } = ctx;

  // swipe down
  if (sy > 0) {
    setClose();
    return;
  }
  //   swipe up
  else if (sy < 0) {
    setOpen();
    return;
  }

  axisY.value = axisY.value + y;

  // Handle Drag
  // drag stop position > 1/2 of the sheet => set to Open

  if (windowHeight.value - axisY.value > windowHeight.value / 3) {
    setOpen();
    return;
  } else {
    setClose();
    return;
  }
}

function allowDrag(ctx) {
  const {
    swipe: [, sy],
    movement: [, y],
  } = ctx;

  const dragTarget = ctx?.event?.srcElement;
  const isDragUp = y < 0 || sy < 0;
  const targetIsContent = dragTarget.closest("#sheet-content");
  // if drag target is scrollable content
  if (elHasScrollY(sheetContentRef.value) && targetIsContent) {
    // if swipe/drag up and content is scrolled to the bottom, allow drag
    if (isDragUp && elScrolledBottom(sheetContentRef.value)) return true;
    // if swipe/drag up and content is scrolled to the bottom, allow drag
    else if (!isDragUp && elScrolledTop(sheetContentRef.value)) return true;
    // has scroll but not scrolled to top or bottom, don't allow drag
    else return false;
  }
  return true;
}
async function setOpen() {
  // show the actual sheet content (it is destroyed when sheet close)
  renderSheet.value = true;
  isDragging.value = false

  // make sure everything's loaded
  await nextTick();

  // await 10ms for renderSheet to appear before accessing DOM
  setTimeout(() => {
    // lock the body scroll
    const { lockScroll } = useLockScroll(document.querySelector("html body"));
    lockScroll();

    // trigger open sheet animation
    sheetHeight.value = sheetRef.value.clientHeight;
    windowHeight.value = window.innerHeight;
    axisY.value = windowHeight.value - sheetHeight.value;
    push("y", axisY.value, motionProperties, {
      ...keyFrame,
      duration: props.duration,
    });

    // update state for wrapper style (opacity, z-index)
    state.value = "open";

    // set overlay transition to true
    overlayState.value = 1;
  }, 10);
}
async function setClose(option = { clickOutside: false }) {
  // emit to parent when user click on overlay
  if (option.clickOutside) emit("onClickOutside", true);

  // unlock the body scroll
  await nextTick();
  const { unlockScroll } = useLockScroll(document.querySelector("html body"));
  unlockScroll();

  // trigger close sheet animation
  axisY.value = windowHeight.value;
  push("y", axisY.value, motionProperties, {
    ...keyFrame,
    duration: props.duration,
  });

  // delay 300ms to prevent fixed wrapper hide before animation ends
  overlayState.value = 0;
  setTimeout(() => {
    state.value = "close";
    emit("onClose", true);

    // destroy sheet contend from DOM
    renderSheet.value = false;
  }, props.duration);
}

function onOutsideClick() {
  if (!props.closeOnClickOutside) return;
  setClose({ clickOutside: true });
}

watch(
  () => state.value,
  (val) => {
    setTimeout(() => {
      wrapperIndex.value = val === "open" ? "z-[1001]" : "-z-40";
    }, 75);
  }
);

onMounted(() => {
  calculateHeight();

  window.addEventListener("resize", onWindowResize);
});

useDrag(dragHandler, {
  domTarget: sheetRef,
  filterTaps: true,
  // preventWindowScrollY: true,
  useTouch: true,
});

onBeforeUnmount(async () => {
  await nextTick();
  const { clearLockScroll } = useLockScroll(
    document.querySelector("html body")
  );

  clearLockScroll();
  window.removeEventListener("resize", onWindowResize);
});
</script>

<style lang="scss" scoped>
#sheet-card {
  max-height: 95%;
}
#sheet-content {
  max-height: 100vh;
}
</style>
