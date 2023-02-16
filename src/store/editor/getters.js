
export function getTitle (state) {
  let title = ''
  try{
    title = state.json.content.find(f => f.type === 'title').content[0].text
  } catch(e){
    return ''
  }
  return title    

}

export function getJson(state){
  return state.json
}
