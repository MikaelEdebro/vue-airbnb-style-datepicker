<template>
  <div class="form-group input" :class="classes" :style="{minWidth: minWidth}">
    <div class="click-area">
      <label class="floating-label" :for="id">{{ label }}</label>
      <input
        :type="type"
        :value="value"
        :placeholder="placeholder"
        :id="id"
        :name="name"
        :maxlength="maxLength"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :readonly="readonly"
        @keyup.enter="enterCallback"
        @input="$emit('input', $event.target.value)"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    id: { type: String, default: () => '234234' },
    name: { type: String, default: () => '2342342' },
    value: { type: String },
    label: { type: String },
    placeholder: { type: String },
    type: { type: String, default: 'text' },
    minWidth: { type: String },
    maxLength: { type: Number },
    enterCallback: { type: Function, default: () => {} },
    autocomplete: { type: String },
    disabled: { type: Boolean },
    readonly: { type: Boolean }
  }
}
</script>
