class Screenplay {
  // fields
  name = "";
  scenes = [];

  // TODO use indexeddb to store previous info and restore using constructor
  constructor() {
    this.name = "";
    this.scenes = [];
  }

  setName(name) {
    this.name = name;
  }

  addScene(scene) {
    this.scenes.push(scene); // add in place
  }

  insertSceneAtIndex(scene, index) {
    this.scenes.splice(index, 0, scene); // splice modifies array in place
  }

  deleteSceneAtIndex(index) {
    this.scenes.splice(index, 1); // splice modifies array in place
  }

  clear() {
    this.scenes = [];
  }
}

class Scene {
  name = "";
  grammars = [];

  // TODO use indexeddb to store previous info and restore using constructor
  constructor(name, grammars) {
    this.name = "";
    if (grammars == null) {
      this.grammars = [new Grammar("", "and")];
    }
  }

  addGrammar(name, operator) {
    let grammar = new Grammar(name, operator);
    this.grammars.push(grammar);
  }

  removeGrammar(name) {
    let removeIndex = this.grammars.findIndex((g) => g.name == name);
    if (removeIndex == -1) return;
    this.grammars.splice(removeIndex, 1);
  }

  clear() {
    this.grammars = [];
  }

  // TODO think about tostring impl
  toString() {
    return `Scene: grammars ${this.grammars.length}`;
  }
}

// class SceneGrammar {

//   constructor(scene) {
//     this.scenename = scenename;
//   }
// }

class Grammar {
  // fields
  operatorName = "and";
  name = "";

  constructor(name, operatorName) {
    this.name = name;
    this.operatorName = operatorName || "and";
  }
}
