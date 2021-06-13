<template>
  <q-page
    @mouseenter="windowMouseEnter(true)"
    @mouseleave="windowMouseEnter(false)"
    :style="{
      opacity: windowOpacity,
      'border-color': sWindowBorderColor,
      'border-style': sWindowBorderStyle,
    }"
    class="daPage"
  >
    <div style="overflow: hidden" class="scrollable-element">
      <!-- Menu Bar -- Which is Draggable -->
      <q-bar class="appMenuBar" dark>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          @click="changeWindow('close')"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="changeWindow('min')"
        />
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="changeWindow('max')"
        />
        <div
          class="col text-center q-pr-xl titleText"
          :style="{ '-webkit-app-region': sWindowDragSetting }"
        >
          Clear Notes | <b>{{ noteTitle }}</b>
        </div>
      </q-bar>

      <div class="row justify-end content-end q-pr-md settingBar">
        <q-toggle dark v-model="bShowExapandedMenus" :label="sToolBarTitle" />
        <q-btn
          dense
          flat
          rount
          dark
          icon="settings"
          @click="openSettingsPane()"
          label="Settings"
          class="q-pr-md q-pl-md"
        />
      </div>

      <!-- Title Input Field -->
      <q-input
        filled
        v-model="noteTitle"
        v-if="bShowExapandedMenus == true"
        label="Document Title"
        bg-color="black"
        label-color="white"
        dark
      />

      <!-- Text Editor -->
      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        :style="{ height: iHeight + 'px', opacity: windowOpacity }"
      >
        <q-editor
          v-if="bShowExapandedMenus == true"
          v-model="editorText"
          class="textEditor"
          :style="{
            opacity: windowOpacity,
            '-webkit-app-region': 'no-drag',
            'min-height': iHeight + 'px',
          }"
          @mouseleave="windowMouseEnter(false)"
          :toolbar="[
            [
              {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify'],
              },
            ],
            [
              'bold',
              'italic',
              'strike',
              'underline',
              'subscript',
              'superscript',
            ],
            ['token', 'hr', 'link'],
            [
              {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7',
                ],
              },

              {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana',
                ],
              },
            ],
            [
              'quote',
              'unordered',
              'ordered',
              'outdent',
              'indent',
              'removeFormat',
            ],
            ['undo', 'redo'],
            ['viewsource'],
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana',
          }"
        />
        <q-editor
          v-else
          v-model="editorText"
          :toolbar="[]"
          class="textEditor"
          :style="{
            opacity: windowOpacity,
            'min-height': iHeight + 'px',
          }"
          @mouseleave="windowMouseEnter(false)"
        />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import { ipcRenderer } from "electron";
const electron = require("electron");
const remote = electron.remote;

export default {
  name: "PageIndex",
  updated() {
    // Redraw the Screen
  },
  data: function () {
    return {
      editorText: "",
      noteTitle: "",
      newText: "",
      newTitle: "",
      oldText: "",
      oldTitle: "",
      tags: [],
      autoSave: null,
      windowOpacity: 0.95,
      lowOpacity: 0.9,
      highOpacity: 0.95,
      iHeight: 100,
      sWindowDragSetting: "drag",
      sWindowBorderColor: "orange",
      sWindowBorderStyle: "none",
      bShowExapandedMenus: false,
      bShowBordersOnHover: false,
      sToolBarTitle: "Compact",
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },

      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2,
      },
    };
  },
  watch: {
    editorText: function (oldText, newText) {
      this.newText = newText;
      this.oldText = oldText;
    },
    noteTitle: function (oldTitle, newTitle) {
      this.newTitle = newTitle;
      this.oldTitle = oldTitle;
    },
    bShowExapandedMenus(b, a) {
      this.adjustSize()
    },
  },
  methods: {
    saveDataToFile() {
      ipcRenderer.send("saveToDisk", {
        title: this.noteTitle,
        body: this.editorText,
        tags: this.tags,
      });
    },
     adjustSize(){
      let iCompSize;
      if (this.bShowExapandedMenus == true) {
        iCompSize = 131;
      } else {
        iCompSize = 75;
      }
      let windowData = remote
        .getCurrentWindow()
        .webContents.getOwnerBrowserWindow()
        .getBounds();
      if (windowData) {
        this.iHeight = windowData.height - iCompSize;
      }
    },
    loadNotes() {
      ipcRenderer.send("loadNotes");
    },
    changeWindow(sWindowCommand) {
      ipcRenderer.send("windowAction", sWindowCommand);
    },
    openSettingsPane() {
      ipcRenderer.send("openSettingsWindow");
    },
    windowMouseEnter(bWindowEntered) {
      if (bWindowEntered == true) {
        this.windowOpacity = this.highOpacity;
        if (this.bShowBordersOnHover == true) {
          this.sWindowBorderStyle = "dotted";
        }
      } else {
        this.windowOpacity = this.lowOpacity;
        this.sWindowBorderStyle = "none";
      }
    },
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

    // Set the inital size and etc
    this.adjustSize();

    // Set the size ongoing
    window.addEventListener("resize", () => {
      this.adjustSize();
    });

    // Setup AutoSave for the Document
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
  },
};
</script>

<style lang="scss" scoped>
.textEditor {
  color: white;
  background: black;
}

.settingBar {
  background: rgba(209, 209, 209, 0.659);
  max-height: 50px;
}

.NOdraggable {
  -webkit-app-region: no-drag;
}
.titleText {
  color: white;
}
.toolBarColor {
  background: rgb(191, 231, 238);
}
.appMenuBar {
  background: rgba(128, 128, 128, 0.8);
  max-height: 50px;
}

.daPage {
  overflow: hidden;
  height: 100vh;
}
.q-editor {
  scrollbar-width: thin;
}

.hideOverflow {
  overflow: hidden;
}
</style>
