import {
    Button,
    Icon,
} from "antd";
import { Container } from "flux/utils";
import React from "react";
import RecipeStore from "../data/RecipeStore";
import TaskStore from "../data/TaskStore";

const AddToList = Container.createFunctional(
    ({
         listLO,
         onClick,
         isSending,
     }) => {
        if (! listLO.hasValue()) return null;
        const list = listLO.getValueEnforcing();
        return <Button
            shape="round"
            size="small"
            onClick={() => onClick(list.id)}
            disabled={isSending}
        >
            Add to &quot;{list.name}&quot;
            <Icon type={isSending ? "loading" : "arrow-right"} />
        </Button>;
    },
    () => [
        TaskStore,
        RecipeStore,
    ],
    (prevState, props) => {
        const sendState = RecipeStore.getSendState();
        return {
            onClick: props.onClick,
            listLO: TaskStore.getActiveListLO(),
            isSending: sendState != null && !sendState.isDone(),
        };
    },
    {withProps: true},
);

export default AddToList;
