<script setup>
// 定義 props 和 emits
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  status: {
    type: String,
    default: "",
  },
  feedback: {
    type: String,
    default: "Please provide a valid input.",
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Choose...",
  },
  wrapperClass: {
    type: String,
    default: "",
  },
  labelClass: {
    type: String,
    default: "",
  },
  inputClass: {
    type: String,
    default: "",
  },
});

// 使用 defineModel 定義雙向綁定的值
const modelValue = defineModel("modelValue", {
  type: [String, Boolean],
  default: "",
});

// 輸入事件處理函式
const onInput = (event) => {
  modelValue.value =
    event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
};
</script>

<template>
  <div :class="wrapperClass">
    <label
      :class="labelClass"
      v-if="type !== 'checkbox'"
      :for="id"
      class="form-label"
      >{{ label }}</label
    >
    <input
      v-if="['email', 'text', 'password', 'tel'].includes(type)"
      :type="type"
      class="form-control"
      :id="id"
      :placeholder="placeholder"
      :class="[inputClass, status]"
      v-model="modelValue"
      @input="onInput"
    />
    <select
      v-if="type === 'select'"
      class="form-select"
      :id="id"
      :class="status"
      v-model="modelValue"
      @change="onInput"
    >
      <option v-if="false" selected disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <div v-if="feedback" class="valid-feedback">{{ feedback }}</div>
    <div class="invalid-feedback">{{ feedback }}</div>
    <div v-if="type === 'checkbox'" class="form-check">
      <input
        v-if="type === 'checkbox'"
        class="form-check-input"
        type="checkbox"
        :id="id"
        :class="status"
        v-model="modelValue"
        @change="onInput"
      />
      <label :for="id" class="form-check-label">{{ label }}</label>
      <div v-if="feedback" class="valid-feedback">{{ feedback }}</div>
      <div class="invalid-feedback">{{ feedback }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);
.invalid-feedback {
  color: rgb(255, 101, 101);
}
input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}
</style>
