import React from 'react'
import Dispatcher from '../data/dispatcher'
import {
    Button,
    Form,
    Input,
    message,
    Spin
} from "antd"
import RecipeActions from "../data/RecipeActions"


const handleUpdate = (e) => {
    const { name: key, value } = e.target
    Dispatcher.dispatch({
        type: RecipeActions.DRAFT_RECIPE_UPDATED,
        data: { key, value}
    })
}

const handleSave = () => {
    Dispatcher.dispatch({
        type: RecipeActions.SAVE_DRAFT_RECIPE,
    })
}

const RecipeForm = ({recipeLO}) => {
    if(!recipeLO.hasValue()) {
      return <Spin />
    }
    
    if(recipeLO.isDone()) {
        message.success('Your recipe has been saved.')
    }
    
    const {TextArea} = Input
    const draft = recipeLO.getValueEnforcing()

    return (
        <Form layout="vertical">
            <Form.Item>
                <Input
                    name="name"
                    placeholder="Recipe Title"
                    value={draft.name}
                    onChange={handleUpdate}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    name="externalUrl"
                    placeholder="External URL"
                    value={draft.externalUrl}
                    onChange={handleUpdate}
                />
            </Form.Item>
            <Form.Item>
                <TextArea
                    name="rawIngredients"
                    placeholder="Add Ingredients List"
                    value={draft.ingredients.map( item => item.raw).join("\n")}
                    onChange={handleUpdate}
                    rows={10}
                />
            </Form.Item>
            <Form.Item>
                <TextArea
                    name="directions"
                    placeholder="Recipe Directions"
                    value={draft.directions}
                    onChange={handleUpdate}
                    rows={10}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    onClick={handleSave}>Save</Button>
            </Form.Item>
        </Form>

    )
}

export default RecipeForm