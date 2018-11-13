import { OrgFileSchema, OrgNodeSchema, OrgTagSchema } from "../models";
import { orgStringToNodes } from "../Transforms/OrgTransforms";

const RNFS = require("react-native-fs");

var Realm = require("realm");

export function connectToDb() {
  return Realm.open({
    schema: [OrgNodeSchema, OrgFileSchema, OrgTagSchema]
  });
}

export function queryOrgDB(object = "OrgNode", ...args) {
  return connectToDb().then(realm => {
    return realm.objects(object);
  });
}

export function getChangedNodes() {
  return [];
}

export function getOrCreateTags(realm, tagsNames) {
  const tags = [];
  tagsNames.forEach(tagName => {
    const results = realm.objects("OrgTag").filtered(`name = "${tagName}"`);
    let tag = null;
    if (results.length === 0) {
      tag = realm.create("OrgTag", {
        name: tagName,
        isContextTag: true
      });
    } else {
      tag = results[0];
    }
    tags.push(tag);
  });
  return tags;
}

export function addOrgFileContentsToDb(filepath) {
  return RNFS.readFile(filepath).then(contents => {
    return connectToDb().then(realm => {
      const nodes = orgStringToNodes(contents);
      realm.write(() => {
        const orgFile = realm.create("OrgFile", {
          path: filepath,
          lastSync: new Date(0),
          hash: "123",
          type: "agenda"
        });

        for (let i = 0; i < nodes.length; i++) {
          // const clone = Object.assign({}, nodes[i])
          const clone = nodes[i];
          delete clone.key; // Delete unnecessary key created by parser
          delete clone.todoStateHistory; // FIXME handle todoStateHistory
          clone.tags = getOrCreateTags(realm, Object.keys(nodes[i].tags));
          clone.id = filepath + i;
          clone.file = orgFile;
          realm.create("OrgNode", clone);
        }
      });
    });
  });
}

export function removeOrgFileContentsFromDb(filepath) {
  return connectToDb().then(realm => {
    // delete file and nodes
    const file = realm.objects("OrgFile").filtered(`path = "${filepath}"`)[0];
    const nodes = realm
      .objects("OrgNode")
      .filtered(`file.path = "${file.path}"`);
    realm.write(() => {
      realm.delete(nodes);
      realm.delete(file);
    });

    // delete orphant tags
    // TODO check if some tags are global, then don't deltete them
    const tags = realm.objects("OrgTag");
    const orphantTags = tags.filter(tag => tag.nodes.length === 0);
    realm.write(() => {
      realm.delete(orphantTags);
    });

    return true;
  });
}
