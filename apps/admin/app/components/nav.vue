<script setup lang="ts">
import { cva } from 'class-variance-authority'

const { logout } = extractStore(useUserStore())

const navGroup = cva('navGroup flex items-center gap-2 rounded-full', {
  variants: {
    color: {
      gray: 'bg-gray-300',
    },
    size: {
      md: 'p-2',
    },
  },
})
</script>

<template>
  <div class="flex h-16 items-center justify-center">
    <div :class="navGroup({ color: 'gray', size: 'md' })">
      <UILink to="/">
        <UIButton size="xs" icon-name="custom:logo" class="[&_svg]:size-5.5!" />
      </UILink>

      <!-- <UILink to="/">
        <UIButton size="xs">test</UIButton>
      </UILink> -->

      <span class="mx-4">Flovism admin</span>

      <UIButton size="xs" icon-name="custom:profil" class="[&_svg]:size-5.5!" @click="logout" />
    </div>
  </div>
</template>
