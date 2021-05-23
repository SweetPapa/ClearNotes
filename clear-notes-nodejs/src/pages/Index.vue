<template>
  <q-page >
  <div>
    <q-input filled v-model="noteTitle" label="Title" class="q-pt-md"/>
    <q-editor v-model="editorText" class="textEditor transparent" min-height="80vh" :content-style="{ opacity: 1 }"/>
    <!-- <q-editor v-model="editorText" class="textEditor transparent" min-height="80vh"/> -->

  </div>
  </q-page>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'PageIndex',
  data: function (){
    return {
      editorText: "",
      noteTitle: "",
      newText:"",
      newTitle: "",
      oldText: "",
      oldTitle: "",
      tags: [],
      autoSave: null
    }
  },
  watch:{
    editorText: function (oldText, newText){
      this.newText = newText
      this.oldText = oldText
    },
    noteTitle: function(oldTitle, newTitle){
      this.newTitle = newTitle
      this.oldTitle = oldTitle
    }
  },
  methods: {
    saveDataToFile(){
      ipcRenderer.send('saveToDisk', {
        title: this.noteTitle,
        body: this.editorText,
        tags: this.tags
      })
    },
    loadNotes(){
      ipcRenderer.send("loadNotes")
    }
  },
  beforeDestroy(){
    
    // Stop the AutoSaver
    if (this.autoSave){
      console.log("Clearing Auto Save")
      clearInterval(this.autoSave)
    }
    
    // Save one last time to get the data as it is
    this.saveDataToFile()
  },
  beforeMount(){
    this.autoSave = setInterval(()=>{
      this.saveDataToFile()
    }, 5000)

    ipcRenderer.on('jsonNotes', (event, jData) => {
      console.log("Loaded Data") 
      console.log(jData)

      this.noteTitle = jData.title
      this.editorText = jData.body
      this.newText = jData.body
      this.newTitle = jData.body
    })

    this.loadNotes()
  }
  
}
</script>

<style lang="scss" scoped>
 .textEditor {
   color: white;
 }
</style>