import { ref, isRef, watch, onMounted, onUnmounted } from "vue";

export const SCROLL_LOCK_CLASS = "no-scroll";

export function useLockScroll(selectorElements, lockedClass) {
  const elements = wrap(selectorElements);

  if (!lockedClass || !isString(lockedClass)) {
    lockedClass = SCROLL_LOCK_CLASS;
  }

  const locked = ref(false);

  watch(
    locked,
    (l) => {
      if (lockedClass) {
        if (!elements.value) return;
        elements.value.classList.toggle(lockedClass, l);
      }
    },
    {
      immediate: true,
    }
  );

  const lock = () => (locked.value = true);
  const unlock = () => (locked.value = false);
  const remove = () => {
    if (elements.value) {
      elements.value.classList.remove(lockedClass);
    }
  };

  if (isString(selectorElements)) {
    onMounted(
      () => (elements.value = document.querySelector(selectorElements))
    );
  }

  onUnmounted(() => remove());

  return {
    isScrollLocked: locked,

    lockScroll: lock,
    unlockScroll: unlock,
    clearLockScroll: remove,
  };
}

// helpers
function wrap(o) {
  return isRef(o) ? o : ref(o);
}
const isString = (val) => typeof val === "string";
