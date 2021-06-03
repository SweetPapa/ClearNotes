<template>
  <q-page>
    <div class="q-pa-md" style="">
      <q-list bordered padding>
        <q-item-label header>Window Settings</q-item-label>
        <q-separator spaced />

        <q-item>
          <q-item-section>
            <q-item-label>Window Active Opacity</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="deep-orange" name="brightness_medium" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="windowActiveOpacity"
              :min="0"
              :max="1"
              label
              color="deep-orange"
              :step="0.1"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Window Inactive Opacity</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="grey" name="brightness_medium" />
          </q-item-section>
          <q-item-section>
            <q-slider
              v-model="windowInactiveOpactiy"
              :min="0"
              :max="1"
              label
              color="grey"
              :step="0.1"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Settings",
  created() {},
  data() {
    return {
      windowActiveOpacity: 0.9,
      windowInactiveOpactiy: 0.7
    };
  },
  props: {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
