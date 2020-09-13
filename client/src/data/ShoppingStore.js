import { ReduceStore } from "flux/utils";
import PropTypes from "prop-types";
import { toggleDistinct } from "../util/arrayAsSet";
import { clientOrDatabaseIdType } from "../util/ClientId";
import typedStore from "../util/typedStore";
import Dispatcher from "./dispatcher";
import PlanStore from "./PlanStore";
import ShoppingActions from "./ShoppingActions";

class ShoppingStore extends ReduceStore {

    getInitialState() {
        return {
            selectedPlanIds: [], // Array<ID>
        };
    }

    reduce(state, action) {
        if (state.selectedPlanIds.length === 0) {
            this.__dispatcher.waitFor([
                PlanStore.getDispatchToken(),
            ]);
            if (PlanStore.hasChanged()) {
                const lo = PlanStore.getActivePlanLO();
                if (lo.hasValue()) {
                    state = {
                        ...state,
                        selectedPlanIds: [lo.getValueEnforcing().id],
                    };
                }
            }
        }
        switch (action.type) {
            case ShoppingActions.TOGGLE_PLAN: {
                return {
                    ...state,
                    selectedPlanIds: toggleDistinct(state.selectedPlanIds, action.id),
                };
            }

            default:
                return state;
        }
    }

    getAllPlans() {
        const lo = PlanStore.getPlans();
        if (!lo.hasValue()) return lo;
        const s = this.getState();
        return lo.map(plans =>
            plans.map(p => ({
                ...p,
                selected: s.selectedPlanIds.includes(p.id),
            })));
    }

}

ShoppingStore.stateTypes = {
    selectedPlanIds: PropTypes.arrayOf(clientOrDatabaseIdType).isRequired,
};

export default typedStore(new ShoppingStore(Dispatcher));
