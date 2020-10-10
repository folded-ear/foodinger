import { ListItemText } from "@material-ui/core";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Dispatcher from "../../data/dispatcher";
import PantryItemActions from "../../data/PantryItemActions";
import ShoppingActions from "../../data/ShoppingActions";
import TaskStatus from "../../data/TaskStatus";
import { clientOrDatabaseIdType } from "../../util/ClientId";
import LoadingIconButton from "../common/LoadingIconButton";
import OxfordList from "../common/OxfordList";
import Quantity from "../common/Quantity";
import CollapseIconButton from "../plan/CollapseIconButton";
import DontChangeStatusButton from "../plan/DontChangeStatusButton";
import Item from "../plan/Item";
import StatusIconButton from "../plan/StatusIconButton";
import withItemStyles from "../plan/withItemStyles";
import {
    itemPropTypes,
    tuplePropTypes,
} from "./types";

class IngredientItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.onSetStatus = this.onSetStatus.bind(this);
        this.onUndoSetStatus = this.onUndoSetStatus.bind(this);
        this.onToggleExpanded = this.onToggleExpanded.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
    }

    onSetStatus(status, e) {
        if (e) e.stopPropagation();
        const {
            item: {
                id,
                itemIds,
            },
        } = this.props;
        Dispatcher.dispatch({
            type: ShoppingActions.SET_INGREDIENT_STATUS,
            id,
            itemIds,
            status,
        });
    }

    onUndoSetStatus(e) {
        if (e) e.stopPropagation();
        const {
            item: {
                id,
                itemIds,
            },
        } = this.props;
        Dispatcher.dispatch({
            type: ShoppingActions.UNDO_SET_INGREDIENT_STATUS,
            id,
            itemIds,
        });
    }

    onToggleExpanded(e) {
        if (e) e.stopPropagation();
        Dispatcher.dispatch({
            type: ShoppingActions.TOGGLE_EXPANDED,
            id: this.props.item.id,
        });
    }

    onClick(e) {
        const {
            item,
        } = this.props;
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) return;
        Dispatcher.dispatch({
            type: ShoppingActions.FOCUS,
            id: item.id,
            itemType: "ingredient",
        });
    }

    onDragDrop(id, targetId, v) {
        Dispatcher.dispatch({
            type: PantryItemActions.ORDER_FOR_STORE,
            id,
            targetId,
            after: v !== "above",
        });
    }

    render() {
        const {
            item,
            active,
            classes,
        } = this.props;
        const {
            expanded,
            pending,
            deleting,
            acquiring,
        } = item;
        let addonBefore = [
            <CollapseIconButton
                key="collapse"
                expanded={expanded}
                onClick={this.onToggleExpanded}
            />
        ];
        if (pending) {
            addonBefore.push(
                <LoadingIconButton
                    key="acquire"
                    size="small"
                />);
        } else {
            addonBefore.push(
                <StatusIconButton
                    key="acquire"
                    current={TaskStatus.NEEDED}
                    next={TaskStatus.ACQUIRED}
                    onClick={e => this.onSetStatus(TaskStatus.ACQUIRED, e)}
                />);
        }
        const addonAfter = deleting || acquiring
            ? <DontChangeStatusButton
                key="delete"
                next={deleting ? TaskStatus.DELETED : TaskStatus.ACQUIRED}
                onClick={e => this.onUndoSetStatus(e)}
            />
            : null;
        return <Item
            prefix={addonBefore}
            suffix={addonAfter}
            selected={active}
            onClick={this.onClick}
            className={classnames({
                [classes.acquiring]: acquiring,
                [classes.deleting]: deleting,
            })}
            dragId={item.id}
            onDragDrop={this.onDragDrop}
        >
            <ListItemText>
                {item.name}
                <OxfordList
                    prefix=" ("
                    suffix=")"
                >
                    {item.quantities.map(q =>
                        <Quantity
                            key={q.uomId || "count"}
                            quantity={q.quantity}
                            units={q.units}
                        />)
                    }
                </OxfordList>
            </ListItemText>
        </Item>;
    }

}

IngredientItem.propTypes = {
    ...tuplePropTypes,
    item: PropTypes.shape({
        ...itemPropTypes,
        expanded: PropTypes.bool.isRequired,
        itemIds: PropTypes.arrayOf(clientOrDatabaseIdType).isRequired,
        quantities: PropTypes.arrayOf(
            PropTypes.shape({
                quantity: PropTypes.number.isRequired,
                uomId: PropTypes.number, // missing means "count"
            })).isRequired,
    }).isRequired,
};

export default withItemStyles(IngredientItem);