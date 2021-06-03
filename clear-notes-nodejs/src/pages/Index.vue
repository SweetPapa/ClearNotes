<template>
  <q-page
    @mouseenter="windowMouseEnter(true)"
    @mouseleave="windowMouseEnter(false)"
    :style="{
      opacity: windowOpacity,
      'border-color': sWindowBorderColor,
      'border-style': sWindowBorderStyle
    }"
  >
    <div class="" :style="{ '-webkit-app-region': sWindowDragSetting }">
      <!-- Menu Bar -- Which is Draggable -->
      <q-bar dark>
        <q-btn dense flat round icon="lens" size="8.5px" color="red" @click="changeWindow('close')" />
        <q-btn dense flat round icon="lens" size="8.5px" color="yellow" @click="changeWindow('min')" />
        <q-btn dense flat round icon="lens" size="8.5px" color="green" @click="changeWindow('max')"/>
        <div class="col text-center text-weight-bold q-pr-xl titleText">
          {{ noteTitle }}
        </div>
        <q-btn dense flat rount icon="settings" @click="openSettingsPane()"/>
      </q-bar>

      <!-- Title Input Field -->
      <q-input
        filled
        v-model="noteTitle"
        label="Document Title"
        bg-color="black"
        label-color="white"
        dark
        :style="{ '-webkit-app-region': 'no-drag' }"
      />

      <!-- Text Editor -->
      <q-editor
        v-model="editorText"
        class="textEditor"
        min-height="80vh"
        :style="{ opacity: windowOpacity, '-webkit-app-region': 'no-drag' }"
        @mouseleave="windowMouseEnter(false)"
      />
    </div>
  </q-page>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "PageIndex",
  data: function() {
    return {
      editorText: "",
      noteTitle: "",
      newText: "",
      newTitle: "",
      oldText: "",
      oldTitle: "",
      tags: [],
      autoSave: null,
      windowOpacity: 0.8,
      lowOpacity: 0.9,
      highOpacity: 0.9,
      sWindowDragSetting: "drag",
      sWindowBorderColor: "orange",
      sWindowBorderStyle: "none"
    };
  },
  // watch: {
  //   editorText: function(oldText, newText) {
  //     this.newText = newText;
  //     this.oldText = oldText;
  //   },
  //   noteTitle: function(oldTitle, newTitle) {
  //     this.newTitle = newTitle;
  //     this.oldTitle = oldTitle;
  //   }
  // },
  methods: {
    saveDataToFile() {
      ipcRenderer.send("saveToDisk", {
        title: this.noteTitle,
        body: this.editorText,
        tags: this.tags
      });
    },
    loadNotes() {
      ipcRenderer.send("loadNotes");
    },
    changeWindow(sWindowCommand){
      ipcRenderer.send("windowAction", sWindowCommand)
    },
    openSettingsPane(){
      ipcRenderer.send("openSettingsWindow")
    },
    windowMouseEnter(bWindowEntered) {
      if (bWindowEntered == true) {
        this.windowOpacity = this.highOpacity;
        this.sWindowBorderStyle = "dotted";
      } else {
        this.windowOpacity = this.lowOpacity;
        this.sWindowBorderStyle = "none";
      }
    }
  },
  beforeDestroy() {
    // Stop the AutoSaver
    if (this.autoSave) {
      console.log("Clearing Auto Save");
      clearInterval(this.autoSave);
    }

    // Save one last time to get the data as it is
    this.saveDataToFile();
  },
  beforeMount() {
    this.autoSave = setInterval(() => {
      this.saveDataToFile();
    }, 5000);

    ipcRenderer.on("jsonNotes", (event, jData) => {
      console.log("Loaded Data");
      console.log(jData);

      this.noteTitle = jData.title;
      this.editorText = jData.body;
      this.newText = jData.body;
      this.newTitle = jData.body;
    });

    this.loadNotes();
  }
};
</script>

<style lang="scss" scoped>
.textEditor {
  color: white;
  background: black;
}

.NOdraggable {
  -webkit-app-region: no-drag;
}
.titleText {
  color: white;
}
</style>
