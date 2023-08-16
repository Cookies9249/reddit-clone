**Bug Fixes:**

- CreatePostLink component does not work in home page -- functionality is currently only for community pages 
- Add comments for Modals (where recoil state is used)

Transactions:
* CreateCommunityModal.tsx

Batched Writes:
* usePosts.tsx
* Comments.tsx

Neither:






## Batched Writes
    
Intialize: `const batch = writeBatch(firestore)`
Commit: `batch.commit()`

### Using Batched Writes:

Variables:

**Write:**
const dataRef = doc(collection(firestore, collection_name));
const newData: Type = {
    id: dataRef.id,
    ...
};
batch.set(dataRef, newData);

**Update:**
const dataRef = doc(firestore, collection_name, doc_name);
batch.update(dataRef, { field_to_update: new_value });

**Delete:**
const dataRef = doc(firestore, collection_name, doc_name);
batch.delete(dataRef);