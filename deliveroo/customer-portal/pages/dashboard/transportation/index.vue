<template>
  <TransportationRequestsListing />
</template>

<script setup lang="ts">
import TransportationRequestsListing from '~/features/transportation-requests-listing/TransportationRequestsListing.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
