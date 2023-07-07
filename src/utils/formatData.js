export function formatCollectionData(documents){
    return documents?.docs?.map((doc)=>({...doc.data(),slug:doc.id}))   
}