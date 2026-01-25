<template>
  <div>
    <h1 v-gsap.animateText.slow class="text-red-500">
      {{ $t('hellWorld') }}
    </h1>

    <div class="just m-6 flex items-center justify-center gap-4">
      <UIButton color="red" size="lg" :has-icon="true" icon-name="custom:plus">Primary</UIButton>
      <UIButton color="red" size="md" :has-icon="true" icon-name="custom:plus">Primary</UIButton>
      <UIButton color="red" size="sm" :has-icon="true" icon-name="custom:plus">Primary</UIButton>
    </div>
  </div>
</template>
