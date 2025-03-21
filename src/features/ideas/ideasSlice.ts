import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Idea {
    id: number,
    title: string,
    description: string,
}

interface WrittenText {
    ideaId: number,
    title: string,
    content: string,
    time: number,
    counter: number

}


interface IdeasState {
    ideas: Idea[],
    selectedIdea: Idea | null,
    savedTexts: WrittenText[]
}

const initialState: IdeasState = {
    ideas: [],
    selectedIdea: null,
    savedTexts: []
}

const ideasSlice = createSlice({
    name: 'ideas',
    initialState,
    reducers: {
        setIdeas: (state, action: PayloadAction<Idea[]>) => {
            state.ideas = action.payload;
        },
        addIdea: (state, action: PayloadAction<Idea>) => {
            state.ideas.push(action.payload);
        },
        saveText: (state, action: PayloadAction<WrittenText>) => {
            state.savedTexts.push(action.payload);
        },
        selectIdea: (state, action: PayloadAction<Idea>) => {
            state.selectedIdea = action.payload;
        },
        deleteText: (state, action: PayloadAction<number>) => {
            state.savedTexts.splice(action.payload, 1);
        }
    }
})

export const { setIdeas, addIdea, saveText, selectIdea, deleteText } = ideasSlice.actions;
export default ideasSlice.reducer;